import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter.' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const content = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch page." });
  }
}
