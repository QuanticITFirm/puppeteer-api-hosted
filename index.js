import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Debug ping route
app.get("/", (req, res) => {
  res.send("✅ Puppeteer Proxy is working!");
});

// Main keyword scraping logic
app.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).send("❌ Invalid URL.");
  }

  try {
    console.log(`🌐 Launching browser for URL: ${url}`);
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const html = await page.content();
    await browser.close();
    console.log("✅ HTML successfully fetched.");

    res.send(html);
  } catch (error) {
    console.error("❌ Puppeteer error:", error);
    res.status(500).send("❌ Server error while fetching the page.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer API running at http://localhost:${PORT}`);
});
