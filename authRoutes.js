import { auth, db } from './firebaseConfig.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sign Up - Create new user account
 */
export async function signUp(email, password, displayName) {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        if (displayName) {
            await updateProfile(user, { displayName });
        }

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName || '',
            role: 'user', // default role
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isActive: true
        });

        return {
            success: true,
            message: 'User created successfully',
            user: {
                uid: user.uid,
                email: user.email,
                displayName: displayName || '',
                role: 'user'
            }
        };
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Sign In - Login existing user
 */
export async function signIn(email, password) {
    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        let userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'user'
        };

        if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };

            // Update last login time
            await setDoc(userDocRef, {
                ...userDoc.data(),
                lastLogin: serverTimestamp()
            }, { merge: true });
        } else {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                role: 'user',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isActive: true
            });
        }

        return {
            success: true,
            message: 'Login successful',
            user: userData
        };
    } catch (error) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
}

/**
 * Sign Out - Logout user
 */
export async function signOutUser() {
    try {
        await signOut(auth);
        return {
            success: true,
            message: 'Signed out successfully'
        };
    } catch (error) {
        console.error('Sign out error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(uid) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return {
                success: true,
                user: userDoc.data()
            };
        } else {
            return {
                success: false,
                error: 'User not found'
            };
        }
    } catch (error) {
        console.error('Get user data error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
