
async function sendMail(to, subject, text) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Smart Inventory', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}

async function sendExpiryAlert(items, recipients, tips = {}) {
  const list = items
    .map(i => {
      const t = (tips[i.productName] || []).map(x => `   - ${x}`).join('\n');
      return `• ${i.productName} (Batch: ${i.batchNo}) - expiry: ${new Date(i.expiryDate).toDateString()}${t ? '\n  Business tips:\n' + t : ''}`;
    })
    .join('\n\n');

  for (const email of recipients) {
    await sendMail(
      email,
      `⚠️ ${items.length} product expiring soon`,
      `Hello,\n\nYe products jaldi expire ho rahe hain:\n\n${list}\n\nPlease clear stock in discount!`
    );
  }
}

async function sendOtpMail(to, otp) {
  await sendMail(to, 'Aapka Otp', `Aapka OTP ${otp} hai. Ye 5 min mai expire hojayega. Kisi ko mat btana`);
}

module.exports = { sendExpiryAlert, sendOtpMail };