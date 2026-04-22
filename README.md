# 🚀 Competitor Price Tracking System

## 📌 Overview

This project is a full-stack **data engineering pipeline** designed to help businesses monitor and analyze competitor pricing trends. It collects product data from an e-commerce source, processes and stores it, and delivers actionable insights through an API and interactive dashboard.

The system is built to simulate a real-world B2B use case where companies need **timely, structured, and reliable market data** to make pricing decisions.

---

## 🎯 Problem Statement

Businesses often lack access to structured competitor pricing data. Without this, they cannot:
* Benchmark their product prices
* Detect pricing trends
* Adjust strategies dynamically

This project solves that problem by building an **automated data pipeline** that continuously collects, processes, and presents pricing data in a usable format.

---

## 🏗️ System Architecture

```text
Scraper → Data Cleaning → MongoDB → Backend API → Frontend Dashboard
                          ↓
                    ML Predictor (Optional)
```

## ⚙️ Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Scraper         | Python (BeautifulSoup, Requests) |
| Data Processing | Pandas                           |
| Database        | MongoDB                          |
| Backend API     | Node.js + Express                |
| Frontend        | React (Vite) + Vanilla CSS       |
| Scheduler       | node-cron                        |
| ML (Optional)   | scikit-learn (Linear Regression) |

---

## 🔄 Pipeline Breakdown

### 1. Data Scraping
- Scrapes product data from a public e-commerce source (`books.toscrape.com`).
- Extracts: name, price, rating, availability, URL.
- Handles pagination and HTTP failures.
> ⚠️ **Note**: A sandbox site (`books.toscrape.com`) is used for reliability and to avoid Captcha/bot protection issues during demonstration. The architecture is modular and can be extended to real-world platforms.

### 2. Data Cleaning & Storage
- Removes currency symbols and converts prices to numeric format.
- Stores cleaned data in MongoDB.
- Ensures **idempotency** to prevent duplicates using upsert logic.
- Maintains a historical array of prices for trend analysis.

### 3. Automation
- Uses `node-cron` in the Node.js backend to execute the Python scraper and ML predictor scripts periodically (e.g., daily at midnight).
- Logs execution status and errors.

### 4. Backend API
RESTful API built using Node.js and Express:
- `GET /api/products` → List all products with optional filters (`search`, `minRating`).
- `GET /api/products/:id` → Product details.
- `GET /api/trends` → Aggregated market trend data.

### 5. Frontend Dashboard
A dynamic, beautiful React SPA that displays:
- Product listings with premium dark-mode styling and glassmorphism.
- Interactive price trend charts (using Recharts).
- Data-driven rendering based on API data.

### 6. ML Component (Bonus)
A lightweight Machine Learning model is used to estimate short-term price trends.
- **Model**: Linear Regression (`scikit-learn`).
- **Purpose**: Identify potential price movement based on historical data.
- **Limitation**: Works on limited historical data; it is a simple enhancement to demonstrate how intelligence can be added to a data pipeline.

---

## 🚀 Deployment

### Option 1: Docker (Recommended)

Ensure Docker and Docker Compose are installed.

```bash
# Clone repository
git clone <repo-url>
cd project

# Build and start all services
docker-compose up --build
```
This will start MongoDB (Port 27017), Backend server (Port 5000), and Frontend app (Port 5173).

Visit the dashboard at: `http://localhost:5173`

### Option 2: Local Setup

#### Prerequisites:
- Node.js
- Python 3.10+
- MongoDB (running locally on default port 27017)

#### Steps:

```bash
# Setup scraper
cd scraper
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

# Setup backend
cd ../backend
npm install
# Create .env file with MONGO_URI and PORT
npm start

# Setup frontend
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/price_tracker
PORT=5001
```

---

## ⚖️ Trade-offs & Decisions
- Used a **sandbox site** (`books.toscrape.com`) to ensure reliability and avoid scraping restrictions that complex platforms like Amazon enforce.
- Chose **MongoDB** for flexible schema handling, allowing easy storage of price history arrays without complex joins.
- Implemented **simple ML (Linear Regression)** due to limited data availability.
- Used **Vanilla CSS** instead of Tailwind to provide a more tailored, premium UI design.
- Prioritized **pipeline completeness over complexity**.

---

## 📈 Future Enhancements
- Integrate real-world e-commerce APIs.
- Add alert system for price drops.
- Improve ML model with more historical data (e.g. ARIMA, LSTMs).
- Add user authentication for business users.
