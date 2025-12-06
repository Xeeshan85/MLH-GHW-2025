import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.send("Mini Integrator is live 🚀");
});

// Helper: send message to Slack
async function sendToSlack(text, blocks = null) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) throw new Error("Missing SLACK_WEBHOOK_URL in .env");
  const payload = blocks ? { text, blocks } : { text };
  return axios.post(url, payload);
}

// Optional filter example (skip noisy events)
function shouldSkip(payload) {
  // Example business rule: skip if score present and < 50
  if (payload.score && Number(payload.score) < 50) return "score<50";
  return null;
}

// Webhook endpoint (The heart of the PROCESS node in the simulator)
app.post("/webhook", async (req, res) => {
  const payload = req.body || {};
  const name = payload.name ?? "Unknown User";
  const pretty = JSON.stringify(payload, null, 2);

  // Log every event (simple persistent log)
  try {
    fs.appendFileSync("webhook.log", JSON.stringify({ ts: Date.now(), payload }) + "\n");
  } catch (e) {
    console.warn("Log write failed:", e.message);
  }

  // Filters (The conditional logic visualized in the simulator)
  const skipReason = shouldSkip(payload);
  if (skipReason) {
    return res.json({ ok: true, skipped: skipReason });
  }

  // Default plain-text message
  const textMessage = `🚀 New submission from ${name}\n\n${pretty}`;
  try {
    // Send as plain text first (The ACTION node)
    await sendToSlack(textMessage);

    // Bonus: Pretty Slack Block message
    if (process.env.USE_SLACK_BLOCKS === "true") {
      const blocks = [
        { type: "header", text: { type: "plain_text", text: "New Submission 🚀" } },
        { type: "section", text: { type: "mrkdwn", text: `*Name:* ${name}` } },
        { type: "section", text: { type: "mrkdwn", text: "```" + pretty + "```" } }
      ];
      await sendToSlack(`New submission from ${name}`, blocks);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Slack post failed:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Mini Integrator running on http://localhost:${PORT}`);
});