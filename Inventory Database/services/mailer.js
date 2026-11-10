const nodemailer=require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{user: process.env.EMAIL_USER, pass:process.env.EMAIL_PASS},
})

async function sendExpiryAlert(items) {
    const list=items
     .map(i =>` • ${i.productName} (Batch: ${i.batchNo}) - expiry: ${new Date(i.expiryDate).toDateString()}`)
    .join('\n');

  await transporter.sendMail({
    from: `"Smart Inventory" <${process.env.EMAIL_USER}>`,
    to: process.env.ALERT_TO,
    subject: `⚠️ ${items.length} product expiring soon`,
    text:` Admin, This product is expire in 3 days:\n\n${list}\n\nPlease clear stock in discount!`,
  });
}

async function sendOtpMail(to,otp){
  await transporter.sendMail({
    from:`"Smart Inventory"<${process.env.EMAIL_USER}>`,
    to:to,
    subject:'Aapka Otp',
    text:`Aapka OTP ${otp} hai.Ye 5 min mai expire hojayega.Kisi ko mat btana`
  })
}

module.exports = { sendExpiryAlert,sendOtpMail};
