FROM nikolaik/python-nodejs:python3.10-nodejs20

WORKDIR /app

# Copy and install Python dependencies
COPY scraper/requirements.txt ./scraper/
RUN pip install -r ./scraper/requirements.txt

# Copy and install Node dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy source code
COPY scraper/ ./scraper/
COPY backend/ ./backend/

WORKDIR /app/backend
EXPOSE 5000

CMD ["npm", "start"]
