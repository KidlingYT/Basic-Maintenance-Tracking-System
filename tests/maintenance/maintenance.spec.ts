import test from "@playwright/test";
import { expect } from "@playwright/test";


test('Should create new maintenance record', async ({ page }) => {
    await page.goto('/maintenance');
    await page.click('div[id="new_maintenance_record_form"]');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('input[name="description"]', 'Fixed the conveyor belt issue.');
    await page.fill('input[name="hoursSpent"]', '2');
    await page.selectOption('select[name="priority"]', 'High');
    await page.selectOption('select[name="completionStatus"]', 'Complete');
    await page.selectOption('select[name="type"]', 'Repair');
    await page.fill('input[name="date"]', '2024-01-01');

    await page.click('button[type="submit"]');
  
    const successMessage = page.locator('.success-message');
    await expect(successMessage).toHaveText('Maintenance record successfully created!');
});
test('Should validate maintenance hours (reject negative/over 24)', async ({ page }) => {
    
    await page.goto('/maintenance');
    await page.click('div[id="new_maintenance_record_form"]');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('input[name="description"]', 'Fixed the conveyor belt issue.');
    await page.fill('input[name="hoursSpent"]', '-1');
    await page.selectOption('select[name="priority"]', 'High');
    await page.selectOption('select[name="completionStatus"]', 'Complete');
    await page.selectOption('select[name="type"]', 'Repair');
    await page.fill('input[name="date"]', '2024-01-01');

    await page.click('button[type="submit"]');

    const hoursSpentErrorMessage = page.locator('.hoursSpent-error');
    await expect(hoursSpentErrorMessage).toHaveText('Hours spent must be positive');

    await page.fill('input[name="hoursSpent"]', '25');
    await page.click('button[type="submit"]');

    await expect(hoursSpentErrorMessage).toHaveText("Hours must be 24 or less");
});   
test('Should filter records by date range', async ({ page }) => {
    await page.goto('/maintenance');

    const startDateInput = page.locator('input[type="date"]:first-of-type');
    const endDateInput = page.locator('input[type="date"]:nth-of-type(2)');

    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    
    await startDateInput.fill(startDate);
    await endDateInput.fill(endDate);

    await page.waitForSelector('table tbody tr');

    const rows = await page.locator('table tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const dateCell = rows.locator(`td:nth-child(3)`).nth(i);
      const dateText = await dateCell.textContent();

      if (dateText) {
        const formattedDateText = dateText.trim();
        const rowDate = new Date(formattedDateText).getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        if (isNaN(rowDate)) {
          continue;
        }

        expect(rowDate).toBeGreaterThanOrEqual(start);
        expect(rowDate).toBeLessThanOrEqual(end);
      }
    }
});
test('Maintenance Table - Equipment Name column exists and has data', async ({ page }) => {
    await page.goto('/maintenance');
  
    const table = await page.locator('table');
    const equipmentNameHeader = await table.locator('th:text("Equipment Name")');
    await expect(equipmentNameHeader).toBeVisible();
  
    const rows = await table.locator('tbody tr');
    for (let i = 0; i < await rows.count(); i++) {
      const equipmentNameCell = rows.nth(i).locator('td', { hasText: 'Equipment Name' });
      await expect(equipmentNameCell).not.toBeEmpty();
    }
  
    const equipmentNameCells = await table.locator('td:has-text("Unknown")');
    await expect(equipmentNameCells).toHaveCount(0);
});