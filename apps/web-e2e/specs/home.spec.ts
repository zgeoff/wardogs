import { expect, test } from '@playwright/test';

test('it links from the home page to the FOB planner', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /FOB planner/u }).click();

  await expect(page).toHaveURL(/\/fob$/u);
  await expect(page.getByRole('navigation', { name: 'Pieces' })).toBeVisible();
});

test('it reports healthy on /health', async ({ request }) => {
  const response = await request.get('/health');
  const body: unknown = await response.json();

  expect(body).toMatchObject({ ok: true });
});

test('it answers an unknown path with the not-found page', async ({ page }) => {
  const response = await page.goto('/nowhere');

  expect(response?.status()).toBe(404);

  await expect(page.getByRole('heading', { name: 'Off the map' })).toBeVisible();
});
