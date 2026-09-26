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

test('it opens a copied short share link as a copy of the plan', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();

  await page.goto('/fob');
  await page.getByRole('button', { name: /^Bunker 4/u }).click();

  await placeOnClearGround(page);

  await page.getByRole('button', { name: 'Share link' }).click();

  await expect(page.getByText('Share link copied')).toBeVisible();

  const link = await page.evaluate(() => navigator.clipboard.readText());

  expect(link).toMatch(/\/p\/[\w-]{8}$/u);

  const fresh = await browser.newPage();

  await fresh.goto(link);

  await expect(fresh.getByRole('textbox', { name: 'Plan name' })).toHaveValue('Shared plan');
  await expect(fresh.getByRole('row', { name: /^Bunker/u })).toBeVisible();
  await expect(fresh).toHaveURL(/\/fob$/u);

  await context.close();
});

test('it answers an unknown short share link with a 404', async ({ request }) => {
  const response = await request.get('/p/AbCd1234', { maxRedirects: 0 });

  expect(response.status()).toBe(404);
});

test('it undoes a placement', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Door/u }).click();

  await placeOnClearGround(page);

  await expect(page.getByRole('row', { name: /Door/u })).toBeVisible();

  await page.keyboard.press('Control+z');

  await expect(page.getByRole('row', { name: /Door/u })).toBeHidden();
});

test('it stops placing on a right click', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Door/u }).click();

  await placeOnClearGround(page);

  await page.mouse.down({ button: 'right' });
  await page.mouse.up({ button: 'right' });

  await expect(page.getByText('stop placing')).toBeHidden();
  await expect(page.getByText('duplicate')).toBeVisible();
});

test('it duplicates the selected piece onto the cursor', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Door/u }).click();

  await placeOnClearGround(page);

  const box = await page.getByTestId('planner-canvas').boundingBox();

  const x = (box?.x ?? 0) + (box?.width ?? 0) / 2 + 80;
  const y = (box?.y ?? 0) + (box?.height ?? 0) / 2;

  await page.keyboard.press('Escape');
  await page.mouse.click(x, y);
  await page.keyboard.press('d');
  await page.mouse.move(x + 60, y);
  await page.mouse.click(x + 60, y);

  await expect(page.getByRole('row', { name: /Door/u })).toContainText('×2');
});

test('it paints a copy of the picked piece along a drag', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Hesco Block \(Small\)/u }).click();

  await placeOnClearGround(page);

  const box = await page.getByTestId('planner-canvas').boundingBox();

  const x = (box?.x ?? 0) + (box?.width ?? 0) / 2 + 120;
  const y = (box?.y ?? 0) + (box?.height ?? 0) / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 60, y, { steps: 10 });
  await page.mouse.up();

  await expect(page.getByRole('row', { name: /Hesco Block \(Small\)/u })).toContainText(
    /×(?:[3-9]|\d{2})/u,
  );
});

test('it pastes a copied group wherever it is clicked', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Door/u }).click();

  await placeOnClearGround(page);

  const box = await page.getByTestId('planner-canvas').boundingBox();

  const x = (box?.x ?? 0) + (box?.width ?? 0) / 2 - 200;
  const y = (box?.y ?? 0) + (box?.height ?? 0) / 2 + 150;

  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Control+c');
  await page.keyboard.press('Control+v');
  await page.mouse.move(x, y);
  await page.mouse.click(x, y);

  await expect(page.getByRole('row', { name: /Door/u })).toContainText('×2');
  await expect(page.getByRole('row', { name: /Forward Operating Base/u })).toContainText('×2');
});

test('it lifts the piece being placed with Ctrl and the wheel', async ({ page }) => {
  await page.goto('/fob');
  await page.getByRole('button', { name: /Hesco Block \(Small\)/u }).click();

  const box = await page.getByTestId('planner-canvas').boundingBox();

  await page.mouse.move((box?.x ?? 0) + 200, (box?.y ?? 0) + 200);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -200);
  await page.keyboard.up('Control');

  await expect(page.getByText('(+1.5 m)')).toBeVisible();
});
