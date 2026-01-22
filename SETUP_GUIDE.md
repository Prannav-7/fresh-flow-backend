# Firebase Firestore Setup Guide

## Step-by-Step Setup Process

### 1. ✅ Create Firestore Database (You're here!)

In the Firebase Console:
1. Database ID: `(default)`
2. Location: `nam5 (United States)`
3. Start mode: **"Start in test mode"** (for development)
4. Click **"Enable"**

### 2. Create Your First Collections

After the database is created, you'll see the Firestore interface. Create these collections:

#### Collection 1: `users`
1. Click **"Start collection"**
2. Collection ID: `users`
3. Add first document:
   - Document ID: Auto-ID or `user1`
   - Fields:
     ```
     name: "John Doe" (string)
     email: "john@example.com" (string)
     role: "admin" (string)
     createdAt: [Current timestamp]
     ```

#### Collection 2: `products`
1. Click **"Start collection"**
2. Collection ID: `products`
3. Add first document:
   - Document ID: Auto-ID
   - Fields:
     ```
     name: "Sample Product" (string)
     price: 99.99 (number)
     description: "This is a test product" (string)
     inStock: true (boolean)
     createdAt: [Current timestamp]
     ```

#### Collection 3: `orders`
1. Click **"Start collection"**
2. Collection ID: `orders`
3. Add first document:
   - Document ID: Auto-ID
   - Fields:
     ```
     userId: "user1" (string)
     productId: "product-id-here" (string)
     quantity: 2 (number)
     status: "pending" (string)
     createdAt: [Current timestamp]
     ```

### 3. Test Your Backend Connection

Once collections are created, test your API:

#### Test 1: Get All Users
```bash
# In a new terminal
curl http://localhost:5000/api/data/users
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": "user1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  ]
}
```

#### Test 2: Add a New User
```bash
curl -X POST http://localhost:5000/api/data/users \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Jane Smith\", \"email\": \"jane@example.com\", \"role\": \"user\"}"
```

Expected response:
```json
{
  "success": true,
  "message": "Document added successfully",
  "id": "generated-document-id"
}
```

### 4. Set Up Firebase Security Rules

⚠️ **IMPORTANT**: Test mode expires in 30 days. Set up proper security rules:

#### Firestore Rules (for development)
Go to **Firestore Database → Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // For complete open access (DEVELOPMENT ONLY)
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

#### Storage Rules (if using Firebase Storage)
Go to **Storage → Rules** tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Connect Your Frontend

Now that your backend is ready, connect your frontend:

#### Option 1: Using Fetch API
```javascript
// In your frontend code
const API_URL = 'http://localhost:5000/api/data';

// Get all users
async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  const result = await response.json();
  console.log(result.data);
}

// Add a new user
async function addUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const result = await response.json();
  console.log(result);
}
```

#### Option 2: Using Axios
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/data';

// Get all users
const getUsers = async () => {
  const { data } = await axios.get(`${API_URL}/users`);
  return data.data;
};

// Add a new user
const addUser = async (userData) => {
  const { data } = await axios.post(`${API_URL}/users`, userData);
  return data;
};
```

### 6. Set Up Environment Variables (Security)

Create `.env` file in backend folder:

```env
PORT=5000
FIREBASE_API_KEY=AIzaSyAiDhHCPEO4DwuP7z1tc0YKIHvxCGYlYqs
FIREBASE_AUTH_DOMAIN=fleshflow-bbe34.firebaseapp.com
FIREBASE_PROJECT_ID=fleshflow-bbe34
FIREBASE_STORAGE_BUCKET=fleshflow-bbe34.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=960756777432
FIREBASE_APP_ID=1:960756777432:web:5717b721aa41b82a4272ad
FIREBASE_MEASUREMENT_ID=G-36WV4XBDSL
```

Update `firebaseConfig.js` to use environment variables:

```javascript
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
```

### 7. Enable CORS for Frontend

If your frontend is on a different port (e.g., `http://localhost:3000`), update CORS in `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

## ✅ Checklist

- [ ] Firestore database created in Firebase Console
- [ ] Test mode enabled
- [ ] Collections created (`users`, `products`, `orders`)
- [ ] Test documents added to collections
- [ ] Backend API tested with curl/browser
- [ ] Frontend connected to backend
- [ ] Environment variables configured
- [ ] CORS configured for frontend
- [ ] Security rules set up

## 🚀 You're Ready!

Your Firebase backend is now fully operational and ready for development!

## 📞 Need Help?

- Check the [Firebase Console](https://console.firebase.google.com/project/fleshflow-bbe34)
- Review `firebaseOperations.js` for more CRUD examples
- Test endpoints at `http://localhost:5000`
