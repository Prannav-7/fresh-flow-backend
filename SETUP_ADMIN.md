# 🔐 Setting Up Admin Privileges for Password Reset

To allow backend password resets (without needing the user's old password), you must provide Firebase Admin credentials.

### Step 1: Generate Private Key
1. Go to **Firebase Console** -> **Project Settings**.
2. Click on **Service accounts** tab.
3. Click **"Generate new private key"**.
4. Save the JSON file securely (do NOT commit this file).

### Step 2: Update `.env` File
Open `backend/.env` and add the following lines using values from the JSON file:

```env
# Admin SDK Configuration (Required for Password Resets)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD... (copy the entire key including newlines)"
```

**Note:** The private key must be enclosed in quotes if it contains newlines, or copied exactly as a single line string.

### Step 3: Restart Backend
Restart your backend server to load the new environment variables:
```bash
npm start
```
