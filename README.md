# FreshFlow Backend

Backend server for FreshFlow application with Firebase integration.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder (optional - credentials are currently in firebaseConfig.js):
```env
PORT=5000
```

### 3. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Firebase Services

The backend includes the following Firebase services:

- **Firestore Database** (`db`) - NoSQL cloud database
- **Authentication** (`auth`) - User authentication
- **Storage** (`storage`) - File storage
- **Analytics** (`analytics`) - User analytics

## API Endpoints

### Health Check
- **GET** `/` - Check if server is running

### Firestore Operations
- **GET** `/api/data/:collection` - Get all documents from a collection
  - Example: `GET /api/data/users`
  
- **POST** `/api/data/:collection` - Add a document to a collection
  - Example: `POST /api/data/users`
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`

## Project Structure

```
backend/
├── firebaseConfig.js   # Firebase initialization and configuration
├── server.js          # Express server with API routes
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (create this)
├── .env.example      # Environment variables template
└── .gitignore        # Git ignore rules
```

## Important Security Note

⚠️ **Your Firebase credentials are currently exposed in the code.** For production:

1. Move credentials to environment variables
2. Update `firebaseConfig.js` to use `process.env` variables
3. Never commit `.env` file to version control
4. Regenerate your Firebase API keys from the Firebase Console

## Next Steps

1. Create Firestore collections in your Firebase Console
2. Set up Firebase Authentication methods
3. Configure Storage bucket rules
4. Add custom API routes in `server.js`
