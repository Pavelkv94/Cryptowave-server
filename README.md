# Cryptowave 🌊

Cryptowave is a comprehensive cryptocurrency platform that provides real-time crypto market data, news, and analytics.

## 🚀 Features

- Real-time cryptocurrency market data and price tracking
- Latest crypto news aggregation from multiple sources
- User authentication and authorization system
- Email notification system
- Telegram bot integration
- External APIs integration for comprehensive market data

## 🛠️ Technologies

### Backend
- Node.js
- MongoDB (Database)
- JWT (JSON Web Tokens) for authentication
- Nodemailer for email services

### External APIs
- NewsAPI - For crypto news aggregation
- CoinGecko API - For exchanges data
- CoinDesk API - For market data and analytics

### Integration
- Telegram Bot API
- SMTP integration for email services

## 💻 Environment Setup

The project requires the following environment variables:

DB_NAME - MongoDB database name
DB_URL - MongoDB connection URL
PORT - Server port
ADMIN - Admin credentials
JWT_ACCESS_SECRET - JWT access token secret
JWT_REFRESH_SECRET - JWT refresh token secret
SMTP_HOST - SMTP server host
SMTP_PORT - SMTP server port
SMTP_USER - SMTP user email
SMTP_PASSWORD - SMTP password
CLIENT_URL - Frontend application URL
EXTERNAL_NEWSAPI_KEY - NewsAPI key
EXTERNAL_EXCHANGES_APIKEY - CoinGecko API key
EXTERNAL_COINDESK_APIKEY - CoinDesk API key
BOT_TOKEN - Telegram bot token

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   git clone https://github.com/PavelKazlov/cryptowave.git
   cd cryptowave

2. Install dependencies:
   npm install
   # or
   yarn install

3. Create a `.env` file in the root directory and add the required environment variables (see Environment Setup section)

4. Start the development server:
   npm run dev
   # or
   yarn dev

5. Build for production:
   npm run build
   # or
   yarn build

## 📚 API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/refresh - Refresh access token

### Crypto Data Endpoints

- GET /api/crypto/prices - Get current crypto prices
- GET /api/crypto/news - Get latest crypto news
- GET /api/crypto/exchanges - Get exchange information

### User Endpoints

- GET /api/user/profile - Get user profile
- PUT /api/user/profile - Update user profile
- POST /api/user/watchlist - Manage user watchlist

## 🔒 Security

- JWT-based authentication
- Password hashing using bcrypt
- Rate limiting for API endpoints
- CORS protection
- XSS protection
- Environment variables for sensitive data

## 🧪 Testing

Run unit tests:
npm run test

Run e2e tests:
npm run test:e2e

Run test coverage:
npm run test:coverage

## 📱 Frontend

The frontend application is built with React and is hosted on Netlify:
https://cryptowave-pavel-kazlou.netlify.app

### Frontend Tech Stack

- React.js
- Redux Toolkit for state management
- Tailwind CSS for styling
- Axios for API requests
- Chart.js for crypto charts
- React Router for navigation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Pavel Kazlou

Website: pavelkazlov.com
GitHub: @PavelKazlov
LinkedIn: Pavel Kazlou

## 🐛 Bug Reporting

Feel free to open an issue if you find any bugs: https://github.com/PavelKazlov/cryptowave/issues

## 🌟 Show your support

Give a ⭐️ if this project helped you!

## 📊 Project Status

Current Version: 1.0.0
Status: Active Development

## 📈 Future Improvements

- Add more cryptocurrency pairs
- Implement real-time price alerts
- Add portfolio tracking features
- Enhance mobile responsiveness
- Add more payment gateways
- Implement social trading features

---
Built with ❤️ by Pavel Kazlou © 2024