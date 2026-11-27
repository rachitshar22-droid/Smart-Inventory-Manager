const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:'smtp-relay.brevo.com',
  port:2525,
  secure:false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS},
  connectionTimeout:10000,
  greetingTimeout:10000,
  socketTimeout:150000,
});

async function sendExpiryAlert(items, recipients, tips = {}) {
  const list = items
    .map(i => {
      const t = (tips[i.productName] || []).map(x => `   - ${x}`).join('\n');
      return `• ${i.productName} (Batch: ${i.batchNo}) - expiry: ${new Date(i.expiryDate).toDateString()}${t ? '\n  Business tips:\n' + t : ''}`;
    })
    .join('\n\n');

  // har user ko alag mail, taaki kisi ko dusre ki email na dikhe
  for (const email of recipients) {
    await transporter.sendMail({
      from: `"Smart Inventory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `⚠️ ${items.length} product expiring soon`,
      text: `Hello,\n\nYe products jaldi expire ho rahe hain:\n\n${list}\n\nPlease clear stock in discount!`,
    });
  }
}

async function sendOtpMail(to, otp) {
  await transporter.sendMail({
    from: `"Smart Inventory" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Aapka Otp',
    text: `Aapka OTP ${otp} hai. Ye 5 min mai expire hojayega. Kisi ko mat btana`,
  });
}

module.exports = { sendExpiryAlert, sendOtpMail };