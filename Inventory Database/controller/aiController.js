const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODELS = ["gemini-3.8-flash", "gemini-flash-latest","gemini-flash-lite-latest"];

// Gemini 15 second mein jawab na de to error de do, hang mat hone do
const withTimeout = (promise, ms = 15000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(Object.assign(new Error("Gemini timeout"), { code: "TIMEOUT" })),
        ms
      )
    ),
  ]);

async function generateWithRetry(contents) {
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await withTimeout(
          ai.models.generateContent({
            model,
            contents,
            config: { responseMimeType: "application/json" },
          })
        );
        return result;
      } catch (err) {
        console.log(`[${model}] attempt ${attempt} failed:`, err.code || err.status, err.message?.slice(0, 80));
        if (err.code === "TIMEOUT") break; // is model ko chhodo, agle pe jao
        if (err.status !== 503 && err.status !== 429) throw err;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw new Error("All models busy");
}

const scanProductImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Bhai, photo kahan hai?" });
    }

    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `Analyze this product packaging/invoice image. Extract the following details:
1. Product Name
2. Batch Number (if any)
3. Expiry Date (If only month and year are printed (like EXP 03/2026 or MAR 2026), return the last day of that month as yyyy-mm-dd.)

Return ONLY a strict, valid JSON object with exactly these keys: "productName", "batchNo", "expiryDate".
If you cannot find a value, leave it as an empty string "".
Do NOT wrap the output in markdown, do NOT add any conversational text.`;

    const result = await generateWithRetry([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: base64Data } },
    ]);

    const cleanJsonString = result.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanJsonString);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("AI Scan Crash Error:", error);
    res.status(500).json({ error: "AI backend mein phat gaya!" });
  }
};

module.exports = { scanProductImage };