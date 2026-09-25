import { expect, test } from '@playwright/test';
import { placeOnClearGround } from '../src/place-on-clear-ground';

test('it starts a new plan with a FOB and its supply cost', async ({ page }) => {
  await page.goto('/fob');

  await expect(page.getByRole('row', { name: /Total supplies/u })).toContainText('30');
});

test('it places a picked piece and adds its cost to the stage', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Hesco Wall/u }).click();

  await placeOnClearGround(page);

  await expect(page.getByRole('button', { name: /Stage 1/u })).toContainText('+91');
});

test('it keeps the plan on the device across a reload', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('textbox', { name: 'Plan name' }).fill('North ridge');
  await page.getByRole('button', { name: /Gate/u }).click();

  await placeOnClearGround(page);

  await expect(page.getByText('Saved on this device')).toBeVisible();

  await page.reload();

  await expect(page.getByRole('textbox', { name: 'Plan name' })).toHaveValue('North ridge');
  await expect(page.getByRole('row', { name: /Gate/u })).toBeVisible();
});

test('it opens a copied share link as a copy of the plan', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  await page.goto('/fob');
  await page.getByRole('button', { name: /^Bunker 4/u }).click();

  await placeOnClearGround(page);

  await page.getByRole('button', { name: 'Share link' }).click();

  await expect(page.getByText('Share link copied')).toBeVisible();

  const link = await page.evaluate(() => navigator.clipboard.readText());
  const fresh = await browser.newPage();

  await fresh.goto(link);

  await expect(fresh.getByRole('textbox', { name: 'Plan name' })).toHaveValue('Shared plan');
  await expect(fresh.getByRole('row', { name: /^Bunker/u })).toBeVisible();
  await expect(fresh).toHaveURL(/\/fob$/u);

  await context.close();
});

test('it undoes a placement', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Door/u }).click();

  await placeOnClearGround(page);

  await expect(page.getByRole('row', { name: /Door/u })).toBeVisible();

  await page.keyboard.press('Control+z');

  await expect(page.getByRole('row', { name: /Door/u })).toBeHidden();
});
