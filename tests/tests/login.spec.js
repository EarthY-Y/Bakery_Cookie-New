import { test, expect } from '@playwright/test';

test.describe('Username/Password Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('login success should redirect to /home', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie');
    await page.fill('input[placeholder="รหัสผ่าน"]', '1234');
    console.log('✅ filled username and password');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    console.log('✅ clicked login button');

    await page.waitForURL('http://localhost:5173/home');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('login failed should show error popup', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie');
    await page.fill('input[placeholder="รหัสผ่าน"]', '123');
    console.log('✅ filled username and password');
    await page.click('button:has-text("เข้าสู่ระบบ")');
    console.log('✅ clicked login button');

    const errorPopup = page.locator('.modal-body');
    await expect(errorPopup).toContainText('เข้าสู่ระบบล้มเหลว');
  });
});