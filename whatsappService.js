import fetch from 'node-fetch';

/**
 * Send WhatsApp notification to admin
 * @param {Object} product - Product details for the alert
 */
export const sendLowStockWhatsApp = async (product) => {
    try {
        const adminPhone = '8838686407';
        const message = `*⚠️ LOW STOCK ALERT*\n\n` +
            `*Product:* ${product.name}\n` +
            `*Size:* ${product.size || 'N/A'}\n` +
            `*Current Stock:* ${product.stock} ${product.unit || 'units'}\n\n` +
            `Please restock as soon as possible.`;

        console.log(`📱 [WhatsApp Ready] Alert for ${product.name} to ${adminPhone}`);

        // Note: For actual delivery, connect to an API here.
        // Since node-fetch is already in your package.json, we use it.

        /*
        const response = await fetch(`https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: process.env.ULTRAMSG_TOKEN,
                to: adminPhone,
                body: message
            })
        });
        const data = await response.json();
        return data;
        */

        console.log('--- WHATSAPP MESSAGE CONTENT ---');
        console.log(message);
        console.log('--------------------------------');

        return { success: true, message: 'WhatsApp alert logged' };
    } catch (error) {
        console.error('❌ Error in WhatsApp service:', error);
        return { success: false, error: error.message };
    }
};
