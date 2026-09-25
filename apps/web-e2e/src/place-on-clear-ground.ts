import type { Page } from '@playwright/test';

// clicks the planner 80 px east of the canvas centre: the centre sits on a new plan's FOB, and
// this spot is clear ground inside its square
export async function placeOnClearGround(page: Page): Promise<void> {
  const canvas = page.locator('[data-testid="planner-canvas"][data-ready="true"]');

  await canvas.waitFor();
  await page.evaluate(waitForTwoFrames);

  const box = await canvas.boundingBox();

  if (box === null) {
    throw new Error('the planner canvas has no box');
  }

  const x = box.x + box.width / 2 + 80;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.click(x, y);
}

// runs in the page: one frame for the scene to draw and size itself, one for its pointer events
function waitForTwoFrames(): Promise<void> {
  // oxlint-disable-next-line promise/avoid-new -- requestAnimationFrame has no promise form
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
