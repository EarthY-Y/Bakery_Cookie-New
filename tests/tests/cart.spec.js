import { test , expect } from '@playwright/test';

// test.describe('User/password', () => {
//   test.beforeEach
// });

test('add item to cart and check error popup', async ({ page }) => { // บรรทัดนี้เริ่มเขียน “กรณีทดสอบ” (test case) | async ({ page }) => {...}: เป็นฟังก์ชันที่ทำงานแบบ async (รองรับการรอโหลดเว็บ) และรับตัวแปร page ที่ใช้ควบคุมหน้าจอเว็บ
  await page.goto('http://localhost:5173/home');

  await page.goto('http://localhost:5173/list/category/product/คุกกี้'); // เปิดหน้า รายการสินค้าในหมวดหมู่คุกกี้ แก้!!
  console.log('✅ เปิดหน้าสินค้าแล้ว');

  await page.goto('http://localhost:5173/Cookie&New/a8eefdb5-7474-4526-a71b-0c9332cbdb89'); // เปิดหน้า รายละเอียดสินค้าชิ้นหนึ่ง (เช่น คุกกี้รหัสนั้น)
  console.log('✅ เปิดหน้ารายละเอียดสินค้า');

  // รอปุ่มโหลดก่อนคลิก
  await page.waitForSelector('button.btn-success'); // รอจนกว่า ปุ่ม “เพิ่มไปยังตะกร้า” (ที่มีคลาส btn-success) จะ โหลดขึ้นมาในหน้า | เพื่อป้องกันการคลิกก่อนเว็บโหลดเสร็จ
  await page.click('button.btn-success'); // คลิกปุ่ม เพิ่มสินค้าไปยังตะกร้า
  console.log('✅ กดปุ่มเพิ่มไปยังตะกร้า');

  // ตรวจข้อความ error popup
  const errorPopup = page.locator('.modal-body'); // สร้างตัวแปร errorPopup เพื่อเลือก (จับ) กล่องข้อความ popup ที่ขึ้น | locator คือคำสั่งของ Playwright ที่เอาไว้หาสิ่งในหน้าเว็บ (เช่น ปุ่ม, กล่อง, ข้อความ ฯลฯ)
  await expect(errorPopup).toContainText('กรุณาสมัครบัญชีเเละเช้าสู่ระบบก่อนสั่งซื้อสินค้า'); // ตรวจสอบว่า ใน popup มีข้อความนี้จริง ไหม
});