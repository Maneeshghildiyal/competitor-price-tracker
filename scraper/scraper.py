import requests
from bs4 import BeautifulSoup
import re
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv(dotenv_path='../backend/.env')

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/price_tracker")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
products_collection = db["products"]

BASE_URL = "http://books.toscrape.com/catalogue/page-{}.html"
MAX_PAGES = 5  # Limit pages for demonstration purposes

def clean_price(price_str):
    """Remove currency symbol and convert to float."""
    try:
        cleaned = re.sub(r'[^\d.]', '', price_str)
        return float(cleaned)
    except ValueError:
        return None

def extract_rating(class_list):
    """Convert star rating class to integer."""
    ratings = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
    for class_name in class_list:
        if class_name in ratings:
            return ratings[class_name]
    return 0

def scrape_page(page_num):
    """Scrape a single page and return list of products."""
    url = BASE_URL.format(page_num)
    logging.info(f"Scraping page {page_num}: {url}")
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"Failed to fetch {url}: {e}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    books = soup.find_all('article', class_='product_pod')
    
    products = []
    for book in books:
        try:
            title = book.h3.a['title']
            price_str = book.find('p', class_='price_color').text
            price = clean_price(price_str)
            rating_classes = book.find('p', class_='star-rating')['class']
            rating = extract_rating(rating_classes)
            availability = book.find('p', class_='instock availability').text.strip()
            link = "http://books.toscrape.com/catalogue/" + book.h3.a['href']

            products.append({
                "name": title,
                "current_price": price,
                "rating": rating,
                "availability": availability,
                "url": link,
                "domain": "books.toscrape.com"
            })
        except Exception as e:
            logging.error(f"Error parsing a product on page {page_num}: {e}")
            
    return products

def store_product(product_data):
    """Store or update product in MongoDB to ensure idempotency."""
    now = datetime.utcnow()
    price_entry = {
        "price": product_data["current_price"],
        "timestamp": now
    }
    
    # Upsert logic
    # Find by URL (assuming URL is unique for a product)
    filter_query = {"url": product_data["url"]}
    
    # Update document
    update_query = {
        "$set": {
            "name": product_data["name"],
            "current_price": product_data["current_price"],
            "rating": product_data["rating"],
            "availability": product_data["availability"],
            "domain": product_data["domain"],
            "last_updated": now
        },
        "$push": {
            "price_history": price_entry
        }
    }
    
    try:
        products_collection.update_one(filter_query, update_query, upsert=True)
    except Exception as e:
        logging.error(f"Failed to insert/update {product_data['name']}: {e}")

def run_scraper():
    logging.info("Starting scraper...")
    total_scraped = 0
    for page in range(1, MAX_PAGES + 1):
        products = scrape_page(page)
        for product in products:
            store_product(product)
            total_scraped += 1
        time.sleep(1) # Polite scraping
        
    logging.info(f"Scraper finished. Total products processed: {total_scraped}")

if __name__ == "__main__":
    run_scraper()
