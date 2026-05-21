import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PDFDocument } from 'pdf-lib';
import PptxGenJS from 'pptxgenjs';

mkdirSync(join(process.cwd(), 'public', 'exports', 'pdf'), { recursive: true });
mkdirSync(join(process.cwd(), 'public', 'exports', 'ppt'), { recursive: true });
mkdirSync(join(process.cwd(), 'public', 'thumbnails'), { recursive: true });

const dataPath = join(process.cwd(), 'data', 'presentations.json');
const presentations = JSON.parse(readFileSync(dataPath, 'utf-8')) as Array<{
  slug: string;
  title: string;
  htmlPath: string;
  format?: 'slides' | 'document';
}>;

async function generateExports() {
  const browser = await chromium.launch();

  for (const presentation of presentations) {
    const htmlFile = join(process.cwd(), 'public', presentation.htmlPath);
    const pdfOut = join(process.cwd(), 'public', 'exports', 'pdf', `${presentation.slug}.pdf`);
    const pptOut = join(process.cwd(), 'public', 'exports', 'ppt', `${presentation.slug}.pptx`);

    if (existsSync(pdfOut) && existsSync(pptOut)) {
      console.log(`Skipping ${presentation.slug} (cached)`);
      continue;
    }

    console.log(`Processing: ${presentation.slug} (${presentation.format ?? 'slides'})`);
    const page = await browser.newPage();

    if (presentation.format === 'document') {
      await page.setViewportSize({ width: 1240, height: 1754 });
      await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      if (!existsSync(pdfOut)) {
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        writeFileSync(pdfOut, pdfBuffer);
        console.log(`  → PDF (A4) saved`);
      }

      await page.close();
      continue;
    }

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(`file://${htmlFile}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });

    const totalSlides: number = await page.evaluate(() => {
      return document.querySelectorAll('.slide-container').length;
    });

    console.log(`  ${totalSlides} slides`);

    const screenshots: Buffer[] = [];
    for (let i = 0; i < totalSlides; i++) {
      await page.evaluate((index: number) => {
        const slides = document.querySelectorAll('.slide-container');
        slides.forEach((s, idx) => {
          (s as HTMLElement).style.opacity = idx === index ? '1' : '0';
          (s as HTMLElement).style.visibility = idx === index ? 'visible' : 'hidden';
          (s as HTMLElement).classList.toggle('active', idx === index);
        });
      }, i);
      await page.waitForTimeout(150);
      screenshots.push(await page.screenshot({ type: 'png' }));
    }

    await page.close();

    if (!existsSync(pdfOut)) {
      const pdfDoc = await PDFDocument.create();
      for (const shot of screenshots) {
        const img = await pdfDoc.embedPng(shot);
        const pg = pdfDoc.addPage([1280, 720]);
        pg.drawImage(img, { x: 0, y: 0, width: 1280, height: 720 });
      }
      writeFileSync(pdfOut, await pdfDoc.save());
      console.log(`  → PDF saved`);
    }

    if (!existsSync(pptOut)) {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.title = presentation.title;
      pptx.author = 'Maximiliano Rodríguez';
      for (const shot of screenshots) {
        const slide = pptx.addSlide();
        slide.addImage({
          data: `data:image/png;base64,${shot.toString('base64')}`,
          x: 0, y: 0, w: '100%', h: '100%',
        });
      }
      writeFileSync(pptOut, (await pptx.write({ outputType: 'nodebuffer' })) as Buffer);
      console.log(`  → PPTX saved`);
    }
  }

  await browser.close();
  console.log('Done.');
}

generateExports().catch((err) => {
  console.error(err);
  process.exit(1);
});
