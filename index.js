import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ping check
app.get("/", (req, res) => {
  res.send("✅ Puppeteer is alive!");
});

app.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).send("❌ Invalid URL.");
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
        "--no-first-run"
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const html = await page.content();
    await browser.close();

    res.send(html);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Server error while fetching the page.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer server running on http://localhost:${PORT}`);
});
