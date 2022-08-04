import * as puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';
import { YoutubeMetadata } from './YoutubeMetadata';

export class YoutubeMetadataParser {
  static async parse(url: string): Promise<YoutubeMetadata | null> {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    await page.goto(url);

    try {
      await page.waitForXPath('//ytd-video-description-music-section-renderer', { timeout: 5000 });

      const artistElement = (
        await page.$x('//ytd-video-description-music-section-renderer//ytd-info-row-renderer[2]//yt-formatted-string')
      )[0];
      const artist: string | null = await page.evaluate((element) => element.textContent, artistElement);
      if (!artist) throw Error('artist not found');

      const titleElement = (
        await page.$x('//ytd-video-description-music-section-renderer//ytd-info-row-renderer[1]//yt-formatted-string')
      )[0];
      const title: string | null = await page.evaluate((element) => element.textContent, titleElement);
      if (!title) throw Error('title not found');

      return { artist, title };
    } catch {
      return null;
    } finally {
      await browser.close();
    }
  }
}
