import 'expect-puppeteer';
import { setDefaultOptions } from 'expect-puppeteer';
import puppeteer, { Page, Browser } from 'puppeteer';
import {
  confirmDialog,
  generateRandomString,
  openModal,
  pageSetup,
  puppeteerConfig,
  saveModal,
  saveStory,
} from '../helpers';

setDefaultOptions({ timeout: 0 });

describe('Stories deleting', () => {
  let browser: Browser;
  let page: Page;

  const storyName = generateRandomString();
  const storyDesc = generateRandomString();
  const storyTags = [...Array(3)].map(() => {
    return generateRandomString();
  });

  const saveSomeStory = async () => {
    await saveModal(page);
    const modal = await expect(page).toMatchElement(
      '#story-save',
    );
    expect(modal).not.toBeNull();
    await saveStory(page, storyName, storyDesc, storyTags);
  };

  const testOnStoryDeletion = async () => {
    // page.on('dialog', (dialog) => {
    //   dialog.accept();
    // });
    await expect(page).toClick('i.fa-minus');
    await confirmDialog(page);

    await expect(page).not.toMatch(storyName);
  };

  beforeEach(async () => {
    browser = await puppeteer.launch(puppeteerConfig);
    page = await browser.newPage();
    await pageSetup(page);

    await saveSomeStory();
  }, 50000);

  test('Stories can be deleted from open modal', async () => {
    await openModal(page);

    await testOnStoryDeletion();
  }, 100000);

  test('Stories can be deleted from splash screen', async () => {
    await expect(page).toClick('span', {
      text: 'DataStory',
    });

    await testOnStoryDeletion();
  }, 10000);

  afterEach(async () => {
    await page.close();
    await browser.close();
  });
});
