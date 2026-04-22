import os
import logging
from pymongo import MongoClient
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv(dotenv_path='../backend/.env')

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/price_tracker")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
products_collection = db["products"]

def predict_future_price():
    logging.info("Starting ML price prediction...")
    products = products_collection.find({})
    
    updated_count = 0
    for product in products:
        history = product.get("price_history", [])
        
        # Need at least 2 data points for linear regression
        if len(history) < 2:
            continue
            
        # Convert history to DataFrame
        df = pd.DataFrame(history)
        
        # We need to simulate time progression for regression
        # For a real app, you would use timestamps. For this demo, we'll use sequence index.
        # Alternatively, convert timestamp to an ordinal value.
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['time_index'] = df['timestamp'].map(pd.Timestamp.toordinal)
        
        X = df[['time_index']].values
        y = df['price'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict price for the next day
        last_date = df['timestamp'].max()
        next_day = last_date + pd.Timedelta(days=1)
        next_day_ordinal = next_day.toordinal()
        
        predicted_price = model.predict([[next_day_ordinal]])[0]
        
        # Ensure predicted price doesn't drop below 0 due to simple regression
        predicted_price = max(0.01, round(predicted_price, 2))
        
        # Update document with prediction
        products_collection.update_one(
            {"_id": product["_id"]},
            {"$set": {"predicted_price": predicted_price}}
        )
        updated_count += 1
        
    logging.info(f"ML prediction completed. Updated {updated_count} products.")

if __name__ == "__main__":
    predict_future_price()
