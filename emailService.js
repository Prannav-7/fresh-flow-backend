import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send order confirmation email to customer
 * @param {Object} orderDetails - Order details including email, name, orderId, items, etc.
 */
export const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
        const transporter = createTransporter();

        const {
            customerEmail,
            customerName,
            orderId,
            items,
            totalAmount,
            shippingAddress,
            orderDate
        } = orderDetails;

        // Format order date
        const formattedDate = new Date(orderDate).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
        });

        // Create items list HTML
        const itemsHTML = items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong>
                    ${item.selectedSize ? `<br><span style="color: #22c55e; font-size: 0.9em;">${item.selectedSize}</span>` : ''}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ₹${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        // Email HTML content
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                    ✅ Order Placed Successfully!
                </h1>
            </td>
        </tr>
        
        <!-- Body -->
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
                    Dear <strong>${customerName}</strong>,
                </p>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px;">
                    Thank you for your order! We're excited to confirm that your order has been successfully placed and is being processed.
                </p>
                
                <!-- Order Details Box -->
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h2 style="color: #22c55e; margin: 0 0 15px; font-size: 18px;">
                        📦 Order Details
                    </h2>
                    <table width="100%" style="font-size: 14px;">
                        <tr>
                            <td style="padding: 5px 0; color: #666;">Order ID:</td>
                            <td style="padding: 5px 0; text-align: right; color: #333;">
                                <strong>${orderId}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #666;">Order Date:</td>
                            <td style="padding: 5px 0; text-align: right; color: #333;">
                                ${formattedDate}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; color: #666;">Total Amount:</td>
                            <td style="padding: 5px 0; text-align: right; color: #22c55e;">
                                <strong style="font-size: 18px;">₹${totalAmount.toFixed(2)}</strong>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Order Items -->
                <h2 style="color: #333; margin: 30px 0 15px; font-size: 18px;">
                    🛒 Order Items
                </h2>
                <table width="100%" style="border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #f9fafb;">
                            <th style="padding: 10px; text-align: left; color: #666;">Item</th>
                            <th style="padding: 10px; text-align: center; color: #666;">Qty</th>
                            <th style="padding: 10px; text-align: right; color: #666;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                
                <!-- Shipping Address -->
                <h2 style="color: #333; margin: 30px 0 15px; font-size: 18px;">
                    📍 Delivery Address
                </h2>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; font-size: 14px; color: #666; line-height: 1.8;">
                    <strong style="color: #333;">${shippingAddress.fullName}</strong><br>
                    ${shippingAddress.address}<br>
                    ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br>
                    📞 ${shippingAddress.phone}<br>
                    ✉️ ${shippingAddress.email}
                </div>
                
                <!-- Next Steps -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                    <h3 style="color: #92400e; margin: 0 0 10px; font-size: 16px;">
                        📋 What's Next?
                    </h3>
                    <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>We'll process your order within 24 hours</li>
                        <li>You'll receive a shipping notification once dispatched</li>
                        <li>Track your order anytime using your Order ID</li>
                    </ul>
                </div>
                
                <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 20px 0 0;">
                    If you have any questions about your order, feel free to contact us at any time.
                </p>
                
                <p style="font-size: 14px; color: #666; margin: 30px 0 0;">
                    Best regards,<br>
                    <strong style="color: #22c55e;">FreshFlow Team</strong>
                </p>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #999; margin: 0 0 10px;">
                    This is an automated email. Please do not reply to this message.
                </p>
                <p style="font-size: 12px; color: #999; margin: 0;">
                    © ${new Date().getFullYear()} FreshFlow. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // Plain text version for email clients that don't support HTML
        const textContent = `
Order Confirmation - FreshFlow

Dear ${customerName},

Thank you for your order! We're excited to confirm that your order has been successfully placed and is being processed.

ORDER DETAILS
-------------
Order ID: ${orderId}
Order Date: ${formattedDate}
Total Amount: ₹${totalAmount.toFixed(2)}

ORDER ITEMS
-----------
${items.map(item => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}

DELIVERY ADDRESS
----------------
${shippingAddress.fullName}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
Phone: ${shippingAddress.phone}
Email: ${shippingAddress.email}

WHAT'S NEXT?
------------
- We'll process your order within 24 hours
- You'll receive a shipping notification once dispatched
- Track your order anytime using your Order ID

If you have any questions about your order, feel free to contact us at any time.

Best regards,
FreshFlow Team

---
This is an automated email. Please do not reply to this message.
© ${new Date().getFullYear()} FreshFlow. All rights reserved.
        `;

        // Setup email data
        const mailOptions = {
            from: {
                name: 'FreshFlow',
                address: process.env.EMAIL_USER
            },
            to: customerEmail,
            subject: `Order Confirmation - Your Order #${orderId} has been placed!`,
            text: textContent,
            html: htmlContent
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Order confirmation email sent successfully:', info.messageId);
        return {
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully'
        };

    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Test email configuration
 */
export const testEmailConfiguration = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
        console.error('❌ Email configuration error:', error);
        return { success: false, error: error.message };
    }
};
