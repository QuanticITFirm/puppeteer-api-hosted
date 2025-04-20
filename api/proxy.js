const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "Missing ?url parameter" });
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const html = await page.content();
    await browser.close();
    res.status(200).send(html);
  } catch (error) {
    res.status(500).json({ error: "Puppeteer failed", details: error.message });
  }
};