 const cron=require('node-cron')
const mainInventory=require('../models/Inventory')
const {sendExpiryAlert}=require('../services/mailer')

cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Expiry cron shuru hua');

    const limit = new Date();
    limit.setDate(limit.getDate() + 3);

    // DB hi filter karega
    const expiringItems = await mainInventory.find({
      expiryDate: { $lte: limit },
      alertSent: false,
    });

    if (expiringItems.length === 0) {
      console.log('Koi item expire nahi ho raha');
      return;
    }

    await sendExpiryAlert(expiringItems); // mail fail hua to neeche wali lines nahi chalengi

    await mainInventory.updateMany(
      { _id: { $in: expiringItems.map(i => i._id) } },
      { $set: { alertSent: true } }
    );

    console.log(`${expiringItems.length} items ka alert chala gaya`);
  } catch (error) {
    console.error('Cron mein error:', error);
  }
}, { timezone: 'Asia/Kolkata' });

