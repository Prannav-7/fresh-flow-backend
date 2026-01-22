import express from 'express';
import cors from 'cors';
import { db, auth, storage } from './firebaseConfig.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running with Firebase!' });
});

// Example Firebase Firestore route - Get all documents from a collection
app.get('/api/data/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const { getDocs, collection: firestoreCollection } = await import('firebase/firestore');

        const querySnapshot = await getDocs(firestoreCollection(db, collection));
        const data = [];

        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Example Firebase Firestore route - Add document to a collection
app.post('/api/data/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const data = req.body;
        const { addDoc, collection: firestoreCollection } = await import('firebase/firestore');

        const docRef = await addDoc(firestoreCollection(db, collection), data);

        res.json({
            success: true,
            message: 'Document added successfully',
            id: docRef.id
        });
    } catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

import { signUp, signIn, signOutUser, getUserData } from './authRoutes.js';

// Sign Up - Create new user
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await signUp(email, password, displayName);

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sign In - Login user
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await signIn(email, password);

        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sign Out - Logout user
app.post('/api/auth/signout', async (req, res) => {
    try {
        const result = await signOutUser();
        res.json(result);
    } catch (error) {
        console.error('Signout error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get User Data
app.get('/api/auth/user/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await getUserData(uid);

        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔥 Firebase connected successfully!`);
});
