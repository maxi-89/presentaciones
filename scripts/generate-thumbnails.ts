import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

mkdirSync(join(process.cwd(), 'public', 'thumbnails'), { recursive: true });

const dataPath = join(process.cwd(), 'data', 'presentations.json');
const presentations = JSON.parse(readFileSync(dataPath, 'utf-8')) as Array<{
  slug: string;
  htmlPath: string;
  thumbnailPath?: string;
}>;

async function generateThumbnails() {
  const browser = await chromium.launch();

  for (const presentation of presentations) {
    const htmlFile = join(process.cwd(), 'public', presentation.htmlPath);
    const outPath = join(process.cwd(), 'public', 'thumbnails', `${presentation.slug}.png`);
    const url = `file://${htmlFile}`;

    console.log(`Generating thumbnail for: ${presentation.slug}`);

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1500);

    // Pause CSS animations so the screenshot captures a clean first frame
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }' });
    await page.waitForTimeout(500);

    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();

    console.log(`  → saved to ${outPath}`);
  }

  await browser.close();
  console.log('Done.');
}

generateThumbnails().catch((err) => {
  console.error(err);
  process.exit(1);
});
