import { sendOrderConfirmationEmail } from './emailService.js';

// Test email data
const testOrder = {
    customerEmail: 'info.iyarkaivalari@gmail.com',
    customerName: 'Test User',
    orderId: 'TEST123' + Date.now(),
    items: [
        {
            name: 'Test Product',
            quantity: 1,
            price: 100,
            selectedSize: '500g'
        }
    ],
    totalAmount: 100,
    shippingAddress: {
        fullName: 'Test User',
        email: 'info.iyarkaivalari@gmail.com',
        phone: '9876543210',
        address: 'Test Address Line',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
    },
    orderDate: new Date().toISOString()
};

console.log('🧪 Testing email configuration...');
console.log('Sending test email to:', testOrder.customerEmail);

const result = await sendOrderConfirmationEmail(testOrder);

if (result.success) {
    console.log('✅ SUCCESS! Email sent:', result.messageId);
    console.log('Check your inbox at:', testOrder.customerEmail);
} else {
    console.log('❌ FAILED:', result.error);
}

process.exit(0);
