# Email Notification Setup Guide

This guide will help you set up email notifications for order confirmations in your FreshFlow application.

## Overview

After a successful payment/order placement, the system automatically sends a professional order confirmation email to the customer's registered email address with:

- Order details (Order ID, date, total amount)
- Complete list of ordered items
- Delivery address
- Next steps information

## Prerequisites

- Gmail account (or any other SMTP email service)
- Node.js and npm installed
- Nodemailer package (already installed)

## Setup Instructions

### Step 1: Configure Gmail for App Passwords

If you're using Gmail, you need to create an **App Password** (not your regular Gmail password):

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled
4. Under "Signing in to Google," select **App Passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** - Enter "FreshFlow Backend"
7. Click **Generate**
8. Copy the 16-character password (without spaces)

### Step 2: Update Environment Variables

1. Open the `.env` file in your backend directory:
   ```
   e:\Sem 6\Conceltancy\Code\Sample\backend\.env
   ```

2. Add the following email configuration:
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password-here
   ```

   **Example:**
   ```env
   EMAIL_USER=freshflow.orders@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

3. Save the file

### Step 3: Restart Backend Server

After updating the `.env` file, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## Testing Email Configuration

### Option 1: Test via Browser Console

After placing an order, check the browser console. You should see:
```
Sending order confirmation email...
✅ Order confirmation email sent successfully
```

### Option 2: Test via Backend Logs

Check your backend terminal for:
```
========== EMAIL NOTIFICATION REQUEST ==========
Sending order confirmation to: customer@email.com
✅ Order confirmation email sent successfully: <message-id>
================================================
```

## Using Other Email Services

If you don't want to use Gmail, you can configure other email services:

### Outlook/Hotmail
```javascript
// In emailService.js
service: 'hotmail'
```

### Yahoo Mail
```javascript
// In emailService.js
service: 'yahoo'
```

### Custom SMTP Server
```javascript
// In emailService.js, replace createTransporter() with:
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: 'smtp.yourdomain.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};
```

## Email Template Customization

The email template is located in `backend/emailService.js`. You can customize:

- **Email subject**: Line 228
- **Company name**: Search for "FreshFlow" and replace
- **Email styling**: Modify the HTML in the `htmlContent` variable
- **Footer text**: Bottom section of the HTML template

## Troubleshooting

### ❌ Error: "Invalid login credentials"
- **Solution**: Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google account

### ❌ Error: "Username and Password not accepted"
- **Solution**: Check that EMAIL_USER and EMAIL_PASSWORD are correctly set in .env
- Ensure there are no extra spaces in the credentials

### ❌ Email not received
- **Check spam folder**
- Verify the customer email address is valid
- Check backend logs for error messages
- Ensure your Gmail account has not hit daily sending limits (500 emails/day for free accounts)

### ❌ Error: "ECONNREFUSED"
- **Solution**: Check your internet connection
- Verify firewall is not blocking SMTP port (587 or 465)

## Email Flow Diagram

```
Customer Places Order
        ↓
Order Saved to Database
        ↓
Stock Reduced
        ↓
Email Notification Triggered
        ↓
Nodemailer Sends Email via SMTP
        ↓
Customer Receives Confirmation Email
```

## Production Considerations

### For Production Use:

1. **Use a Dedicated Email Account**
   - Create a dedicated email like `noreply@yourcompany.com`
   - Don't use personal Gmail accounts

2. **Consider Email Services**
   - For high-volume emails, consider services like:
     - SendGrid (free tier: 100 emails/day)
     - Mailgun (free tier: 5,000 emails/month)
     - Amazon SES (very cost-effective)

3. **Email Delivery Monitoring**
   - Monitor bounce rates
   - Track email delivery success
   - Set up email delivery webhooks

4. **Security Best Practices**
   - Never commit `.env` file to version control
   - Use environment variables in production hosting
   - Rotate email passwords regularly

## Additional Features (Future Enhancements)

You can extend the email functionality to send:

- Order shipped notifications
- Delivery confirmation emails
- Order cancellation confirmations
- Payment receipts
- Password reset emails
- Welcome emails for new users

## Support

If you encounter issues:

1. Check backend console logs
2. Verify all environment variables are set
3. Test with a simple email first
4. Check Gmail security settings

---

**Note**: Email sending is non-blocking, meaning if the email fails to send, the order will still be placed successfully. This ensures a smooth customer experience even if there are temporary email service issues.
