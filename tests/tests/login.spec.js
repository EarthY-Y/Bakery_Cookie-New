import { test, expect } from '@playwright/test';

test.describe('Username/Password Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('login success should redirect to /home', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'supanat');
    await page.fill('input[placeholder="รหัสผ่าน"]', '1234');
    console.log('✅ filled username and password');
    await page.click('button[type="submit"]');
    console.log('✅ clicked login button');

    await page.waitForURL(/\/home$/); // ✅ เช็คแบบ flexible
    await expect(page).toHaveURL(/\/home$/);
  });

  test('login failed user not Found', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie');
    await page.fill('input[placeholder="รหัสผ่าน"]', '1234');
    console.log('✅ filled username and password');
    await page.click('button[type="submit"]');
    console.log('✅ clicked login button');

    const errorPopup = page.locator('.modal-body');
    await expect(errorPopup).toContainText('User not found');
  });

  test('login failed worng password', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'supanat');
    await page.fill('input[placeholder="รหัสผ่าน"]', '123');
    console.log('✅ filled username and password');
    await page.click('button[type="submit"]');
    console.log('✅ clicked login button');

    const errorPopup = page.locator('.modal-body');
    await expect(errorPopup).toContainText('Wrong Password');
  });
});