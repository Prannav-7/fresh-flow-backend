# 🔥 Firebase Backend - Quick Start Guide

## ✅ What's Been Set Up

Your Firebase backend is now fully configured and running! Here's what's been created:

### Files Created:
1. **`firebaseConfig.js`** - Firebase initialization with Firestore, Auth, and Storage
2. **`server.js`** - Express server with sample API routes
3. **`firebaseOperations.js`** - Reusable Firebase operation functions
4. **`package.json`** - Updated with all necessary dependencies
5. **`.env.example`** - Template for environment variables
6. **`.gitignore`** - Protects sensitive files
7. **`README.md`** - Complete documentation

## 🚀 Server Status

✅ **Server is RUNNING on http://localhost:5000**
✅ **Firebase is CONNECTED**

## 📝 Available API Endpoints

### Test Endpoint
```
GET http://localhost:5000/
Response: { "message": "Backend server is running with Firebase!" }
```

### Firestore Endpoints
```
GET  http://localhost:5000/api/data/:collection
POST http://localhost:5000/api/data/:collection
```

## 🎯 Next Steps

### 1. Create Collections in Firebase Console
Go to [Firebase Console](https://console.firebase.google.com/project/fleshflow-bbe34/firestore) and create your collections:
- `users`
- `products`
- `orders`
- etc.

### 2. Test the API
```bash
# Test GET request
curl http://localhost:5000/

# Test GET all from a collection
curl http://localhost:5000/api/data/users

# Test POST to add a document
curl -X POST http://localhost:5000/api/data/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### 3. Use Firebase Operations in Your Routes

```javascript
import { getAllDocuments, addDocument } from './firebaseOperations.js';

app.get('/api/users', async (req, res) => {
  const result = await getAllDocuments('users');
  res.json(result);
});

app.post('/api/users', async (req, res) => {
  const result = await addDocument('users', req.body);
  res.json(result);
});
```

### 4. Connect Your Frontend

In your frontend code, make API calls to:
```javascript
// Fetch data
const response = await fetch('http://localhost:5000/api/data/users');
const data = await response.json();

// Add data
const response = await fetch('http://localhost:5000/api/data/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com' })
});
```

## ⚠️ Important Security Notes

### 1. **API Keys are Currently Exposed**
Your Firebase credentials are visible in `firebaseConfig.js`. For production:

1. Create a `.env` file:
```env
FIREBASE_API_KEY=AIzaSyAiDhHCPEO4DwuP7z1tc0YKIHvxCGYlYqs
FIREBASE_AUTH_DOMAIN=fleshflow-bbe34.firebaseapp.com
FIREBASE_PROJECT_ID=fleshflow-bbe34
# ... etc
```

2. Update `firebaseConfig.js` to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

3. Add `dotenv` import at the top of `server.js`:
```javascript
import 'dotenv/config';
```

### 2. **Regenerate API Keys**
Since your keys are now in this chat, consider regenerating them from the [Firebase Console](https://console.firebase.google.com/project/fleshflow-bbe34/settings/general)

### 3. **Set Firebase Security Rules**
Configure Firestore and Storage security rules in Firebase Console

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## 🛠️ Commands

```bash
# Start server
npm start

# Development mode (auto-restart on changes)
npm run dev

# Install dependencies
npm install
```

## 📞 Testing Your Setup

Visit these URLs in your browser:
- http://localhost:5000 - Health check
- http://localhost:5000/api/data/users - Get all users (once you create the collection)
