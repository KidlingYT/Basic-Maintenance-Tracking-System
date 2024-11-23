import test from "@playwright/test";
import { expect } from "@playwright/test";

test('Should create new equipment with valid data', async ({ page }) => {
  await page.goto('/equipment');
  await page.click('div[id="new_equipment_form"]');
  await page.fill('input[name="name"]', 'New Equipment');
  await page.fill('input[name="location"]', 'Warehouse');
  await page.selectOption('select[name="department"]', 'Machining');
  await page.fill('input[name="model"]', 'Model-X');
  await page.fill('input[name="serialNumber"]', '12345XYZ');
  await page.fill('input[name="installDate"]', '2024-01-01');
  await page.selectOption('select[name="status"]', 'Operational');
  
  await page.click('button[type="submit"]');
  
  const successMessage = await page.locator('.success-message');
  await expect(successMessage).toHaveText('Equipment successfully created!');
});

test('Should show validation errors for invalid equipment data', async ({ page }) => {
  await page.goto('/equipment');
  await page.click('div[id="new_equipment_form"]');
  await page.fill('input[name="name"]', '');
  await page.fill('input[name="location"]', '');
  await page.selectOption('select[name="department"]', 'Machining');
  await page.fill('input[name="model"]', '');
  await page.fill('input[name="serialNumber"]', '');
  await page.fill('input[name="installDate"]', '2025-01-01');
  await page.selectOption('select[name="status"]', 'Down');
  await page.click('button[type="submit"]');
  const nameErrorMessage = await page.locator('.name-error');
  const locationErrorMessage = await page.locator('.location-error');
  const modelErrorMessage = await page.locator('.model-error');
  const serialNumberErrorMessage = await page.locator('.serialNumber-error');
  const installDateErrorMessage = await page.locator('.installDate-error');
  await expect(nameErrorMessage).toHaveText('Name must be at least 3 characters');
  await expect(locationErrorMessage).toHaveText('Location is required');
  await expect(modelErrorMessage).toHaveText('Model is required');
  await expect(serialNumberErrorMessage).toHaveText('Invalid');
  await expect(installDateErrorMessage).toHaveText('Date must be in the past');
});

test('change equipment status', async ({ page }) => {
  await page.goto('http://localhost:3000/equipment');

  const firstRow = await page.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible();

  const editButton = firstRow.locator('button:has-text("Edit")');
  await editButton.click();

  const statusDropdown = firstRow.locator('select');
  await statusDropdown.selectOption({ label: 'Down' });

  const saveButton = firstRow.locator('button:has-text("Save")');
  await saveButton.click();

  await expect(statusDropdown).toHaveValue('Down');
});


test('Should filter equipment table', async ({ page }) => {
  await page.goto('/equipment');

  await page.waitForSelector('table tbody tr');

  const initialRowCount = await page.locator('table tbody tr').count();
  expect(initialRowCount).toBeGreaterThan(0);

  await page.selectOption('select', { label: 'Machining' });
  await page.waitForTimeout(500);

  const machiningRowCount = await page.locator('table tbody tr').count();
  expect(machiningRowCount).toBeLessThanOrEqual(initialRowCount);

  await page.selectOption('select:nth-of-type(2)', { label: 'Operational' });
  await page.waitForTimeout(500);

  const operationalRowCount = await page.locator('table tbody tr').count();
  expect(operationalRowCount).toBeLessThanOrEqual(machiningRowCount);

  const searchTerm = 'ABC123';
  await page.fill('input[type="text"]', searchTerm);
  await page.waitForTimeout(500);

  const searchFilteredRowCount = await page.locator('table tbody tr').count();
  expect(searchFilteredRowCount).toBeLessThanOrEqual(operationalRowCount);

  const departmentOptions = await page.locator('select').nth(0).locator('option').allInnerTexts();
  expect(departmentOptions).toContain('All Departments');
  await page.selectOption('select', { label: 'All Departments' });

  const statusOptions = await page.locator('select:nth-of-type(2)').locator('option').allInnerTexts();
  expect(statusOptions).toContain('All Statuses');
  await page.selectOption('select:nth-of-type(2)', { label: 'All Statuses' });

  await page.fill('input[type="text"]', '');
  await page.waitForTimeout(500);

  const resetRowCount = await page.locator('table tbody tr').count();
  expect(resetRowCount).toEqual(initialRowCount);
}); 