import { test , expect } from '@playwright/test';

test.describe('User/password Login cart', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
    });

    // เทสต์ที่ 1 Login เข้าสู่ระบบกดเลือกสินค้าลงตะกร้าจ่ายชำระเงิน เกิน 250
    test('login add Product', async ({ page }) => {
        await page.click('text=เข้าสู่ระบบ'); // ให้คลิ๊กไปที่เข้าสู่ระบบ
        console.log('✅ clicked login button');
        await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie');
        await page.fill('input[placeholder="รหัสผ่าน"]', '1234');
        console.log('✅ filled username and password'); 
        await page.click('button[type="submit"]');
        console.log('✅ clicked login button');

        // หน้า home
        await page.waitForURL(/\/home$/); // regex reguralar expreesion 
        await expect(page).toHaveURL(/\/home$/);

        await page.click('text=คุกกี้ช็อคโกแลตชิพ');
        
        // หน้า สินค้า
        // คลิกปุ่ม + 24 ครั้ง
        for (let i = 0; i < 23; i++) {
        await page.click('h2.bi.bi-patch-plus-fill');
        }
        console.log('✅ clicked plus button 23 times');

        await page.click('text=เพิ่มไปยังตะกร้า');
        await page.click('a[href^="/cart/"]');

        // หน้าตะกร้า
        await page.waitForURL(/\/cart\/.*/);
        await expect(page).toHaveURL(/\/cart\/.*/);
        await page.click('button.btn.btn-success.btn-lg');

        const errorPopup = page.locator('.modal-title');
        await expect(errorPopup).toContainText('เงื่อนไขการสั่งซื้อ');

        await page.click('.modal.show button.btn.btn-danger', { force: true });

        // หน้าตรวจสอบรายการ
        await page.waitForURL(/\/orders\/.*/); // รอหน้านี้ โหลดให้เสร็จก่อน

        await page.click('button.btn.btn-primary.btn-lg'); // คลิ๊กไปที่ปุ่ม ไปหน้าชำระเงิน

        // หน้าชำระเงิน
        await page.waitForURL(/\/payment\/.*/);
        await expect(page).toHaveURL(/\/payment\/.*/); // ตรวจสอบว่า URL นี้ จริง
    });

});