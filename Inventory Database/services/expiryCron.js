const cron = require('node-cron');
const mainInventory = require('../models/Inventory');
const User = require('../models/User');
const { sendExpiryAlert } = require('./mailer');
const { getBusinessTips } = require('./aiTips');

cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Expiry cron shuru hua');

    const limit = new Date();
    limit.setDate(limit.getDate() + 30);

    const expiringItems = await mainInventory.find({
      expiryDate: { $lte: limit },
      alertSent: false,
    });

    if (expiringItems.length === 0) {
      console.log('Koi item expire nahi ho raha');
      return;
    }

    const byTenant = {};
    for (const item of expiringItems) {
      (byTenant[item.tenantId] ||= []).push(item);
    }

    for (const [tenantId, items] of Object.entries(byTenant)) {
      try {
        const users = await User.find({ tenantId }, 'email');
        const recipients = users.map(u => u.email);
        if (recipients.length === 0) continue;

        const tips = await getBusinessTips(items);
        await sendExpiryAlert(items, recipients, tips);

        await mainInventory.updateMany(
          { _id: { $in: items.map(i => i._id) } },
          { $set: { alertSent: true } }
        );
        console.log(`Tenant ${tenantId}: ${items.length} items ka alert gaya`);
      } catch (err) {
        console.error(`Tenant ${tenantId} me error:`, err.message);
      }
    }
  } catch (error) {
    console.error('Cron mein error:', error);
  }
}, { timezone: 'Asia/Kolkata' });