import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Puppeteer Proxy is Running!");
});

app.get("/api/puppeteer", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send({ error: "Missing URL parameter" });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
    const content = await page.content();
    await browser.close();
    res.send(content);
  } catch (err) {
    console.error("Puppeteer error:", err);
    res.status(500).send({ error: "Failed to fetch page" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});