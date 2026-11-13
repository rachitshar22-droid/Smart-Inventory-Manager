const { generateWithRetry } = require('../controller/aiController');

// Gemini fail hua toh category ke hisaab se ye tips jayenge
const FALLBACK_TIPS = {
  medicine: [
    'Counter pe sabse aage rakho, aate hi customer ko dikhe',
    '30% discount pe combo banao (jaise Dolo + ORS + Vitamin C)',
    'Billing ke time customer ko bolo: "Ye le jao effective hai, 30% off hai"',
  ],
  grocery: [
    'Counter ke paas "Jaldi Khatam" board lagake aage rakho',
    '30% discount pe combo banao (jaise biscuit + chips + juice)',
    '2 ke saath 1 free ya family pack offer chala do',
  ],
  cosmetics: [
    'Counter pe aage rakho, aate-jaate customer ki nazar pade',
    '30% discount pe combo banao (jaise face wash + cream + lip balm)',
    'Gift pack bana ke bechdo, combo me jaldi nikalta hai',
  ],
  default: [
    'Counter pe sabse aage rakho',
    '30% discount pe combo banao',
    'Doosre fast-moving product ke saath bundle kar do',
  ],
};

function getFallbackTips(category) {
  const c = String(category || '').toLowerCase();
  if (c.includes('medic')) return FALLBACK_TIPS.medicine;
  if (c.includes('groc')) return FALLBACK_TIPS.grocery;
  if (c.includes('cosmet')) return FALLBACK_TIPS.cosmetics;
  return FALLBACK_TIPS.default;
}

async function getBusinessTips(items) {
  let aiTips = {};

  try {
    const names = items
      .map(i => `${i.productName} (${i.category}, qty ${i.quantity})`)
      .join('\n');

    const prompt = `You are a retail advisor for a small Indian store.
These products expire soon. For EACH product give 2-3 short practical tips
to sell stock fast (counter placement, combo offer, small discount idea).
Each tip under 15 words.
Return ONLY valid JSON like: {"Product Name": ["tip1", "tip2"]}
Use the exact product names given. No markdown, no extra text.
Products:
${names}`;

    const result = await generateWithRetry([{ text: prompt }]);

    const clean = result.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    aiTips = JSON.parse(clean);
  } catch (err) {
    console.error('Gemini fail, fallback tips use ho rahe hain:', err.message);
  }

  // Jis product ke AI tips nahi mile, uska category wala fallback laga do
  const finalTips = {};
  for (const item of items) {
    const ai = aiTips[item.productName];
    finalTips[item.productName] =
      Array.isArray(ai) && ai.length > 0 ? ai : getFallbackTips(item.category);
  }
  return finalTips;
}

module.exports = { getBusinessTips };