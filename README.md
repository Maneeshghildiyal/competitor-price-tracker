# 🚀 Competitor Price Tracking System

## 📌 Overview

This project is a full-stack **data engineering pipeline** designed to help businesses monitor and analyze competitor pricing trends. It collects product data from an e-commerce source, processes and stores it, and delivers actionable insights through an API and interactive dashboard.

The system simulates a real-world B2B use case where companies rely on **timely, structured, and reliable market data** to make pricing decisions.

---

## ⚡ Quick Start

Run the entire system using Docker:

```bash
docker-compose up --build
```

Then open:

```
http://localhost:5173
```

---

## 🎯 Problem Statement

Businesses often lack access to structured competitor pricing data. Without this, they struggle to:

* Benchmark their product prices
* Identify pricing trends
* Adjust strategies dynamically

This project addresses that gap by building an **automated pipeline** that continuously collects, cleans, and delivers pricing data in a usable format.

---

## 💼 Business Impact

* Enables businesses to monitor competitor pricing
* Helps identify pricing trends over time
* Supports data-driven pricing strategies
* Provides structured market intelligence

---

## 🏗️ System Architecture

```text
Scraper → Data Cleaning → MongoDB → Backend API → Frontend Dashboard
                          ↓
                    ML Predictor (Optional)
```

---

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

* Scrapes product data from a public e-commerce source (`books.toscrape.com`)
* Extracts: name, price, rating, availability, URL
* Handles pagination and HTTP failures

> ⚠️ **Note:** A sandbox dataset (`books.toscrape.com`) is used for reliable demonstration and to avoid CAPTCHA restrictions. The system is designed to be easily extended to real-world platforms.

---

### 2. Data Cleaning & Storage

* Converts prices to numeric format (removes currency symbols)
* Handles missing/inconsistent data
* Stores cleaned data in MongoDB
* Ensures **idempotency** using upsert operations
* Maintains historical price arrays for trend analysis

---

### 3. Automation

* Uses `node-cron` to schedule pipeline execution (e.g., daily)
* Automatically runs scraper and ML predictor
* Logs execution status and failures

---

### 4. Backend API

RESTful API built using Node.js and Express:

* `GET /api/products` → Fetch products (supports filters like search & rating)
* `GET /api/products/:id` → Product details
* `GET /api/trends` → Aggregated market insights

Features:

* Structured JSON responses
* Error handling
* Scalable design

---

### 5. Frontend Dashboard

A dynamic React application that provides:

* Product listings with a premium dark UI
* Interactive price charts (Recharts)
* Search and filtering capabilities

UI highlights:

* Responsive and data-driven
* Clean and modern design
* Business-ready dashboard experience

---

### 6. ML Component (Bonus)

A lightweight ML model estimates short-term price trends.

* Model: Linear Regression
* Purpose: Identify potential price movement
* Limitation: Works on limited historical data

> Due to limited historical data, current trends are based on minimal observations. The system improves as more data is collected over time.

---

## 🚀 Deployment

### Option 1: Docker (Recommended)

```bash
git clone <repo-url>
cd project
docker-compose up --build
```

Services:

* MongoDB → `27017`
* Backend → `5001`
* Frontend → `5173`

---

### Option 2: Local Setup

#### Prerequisites:

* Node.js
* Python 3.10+
* MongoDB

#### Steps:

```bash
# Scraper
cd scraper
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

# Backend
cd ../backend
npm install
npm start

# Frontend
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

* Used a **sandbox dataset** for reliability and faster development
* Chose **MongoDB** for flexible schema and time-series storage
* Implemented **simple ML model** due to limited data availability
* Prioritized **end-to-end pipeline completeness over complexity**
* Designed modular architecture for easy scalability

---

## 📈 Future Enhancements

* Integrate real-world e-commerce APIs
* Add real-time alerts for price drops
* Improve ML models (ARIMA, LSTM)
* Add user authentication and multi-tenant support

---

## 🧠 Key Takeaways

This project demonstrates:

* End-to-end data pipeline design
* Real-world problem solving
* Automation and reliability
* Business-focused data engineering

---

## 📬 Conclusion

The Competitor Price Tracking System showcases how raw web data can be transformed into meaningful business insights through a structured, automated, and scalable pipeline.

---
