import { test, expect } from '@playwright/test'; // test: ใช้สำหรับเขียน test case | expect: ใช้สำหรับตรวจสอบผลลัพธ์ว่าตรงกับที่เราคาดหวังหรือไม่ (assertions)

test.describe('Username/Password Login', () => { // test.describe(...) = สร้าง กลุ่มของเทสต์ ที่เกี่ยวข้องกัน (เช่น กลุ่ม “ทดสอบระบบ Login”)
  test.beforeEach(async ({ page }) => { // test.beforeEach(...) = คำสั่งนี้จะรัน ก่อนทุกเทสต์ ในกลุ่มนี้
    await page.goto('http://localhost:5173/login'); // page.goto(...) = สั่งเปิดหน้าเว็บ /login
  }); // แปลว่า: ก่อนจะเริ่มเทสต์แต่ละอัน ให้เปิดหน้า login ก่อนเสมอ

  // เทสต์ที่ 1 ล็อกอินสำเร็จ (เข้าสู่ระบบได้)
  test('login success should redirect to /home', async ({ page }) => { // async ({ page }) => {} = ฟังก์ชันที่ทำงานบนเบราว์เซอร์จำลอง (page เหมือนเป็นหน้าจอเว็บ)
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie'); // สั่ง “พิมพ์คำว่า cookie” ลงในช่องกรอกที่มี placeholder="ชื่อผู้ใช้"
    await page.fill('input[placeholder="รหัสผ่าน"]', '1234'); // พิมพ์ 1234 ลงในช่องกรอกรหัสผ่าน
    console.log('✅ filled username and password'); // แค่แสดงข้อความใน terminal (บอกว่าเรากรอกข้อมูลแล้ว)
    await page.click('button[type="submit"]'); // คลิกปุ่ม login
    console.log('✅ clicked login button'); // แสดงข้อความใน terminal อีกว่า “กดปุ่มแล้ว”

    await page.waitForURL(/\/home$/); // ✅ เช็คแบบ flexible | รอจนหน้าเว็บเปลี่ยน URL ไปเป็น /home (ใช้ regex /\/home$/ เพื่อเช็คเฉพาะตอนจบด้วย /home)
    await expect(page).toHaveURL(/\/home$/); // ตรวจสอบว่า URL ตอนนี้ต้องเป็น /home จริง
  });

  // เทสต์ที่ 2 ชื่อผู้ใช้ผิด (User not found)
  test('login failed user not Found', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'supanat1'); // ใส่ username ผิด (supanat1) → ระบบไม่ควรให้ผ่าน
    await page.fill('input[placeholder="รหัสผ่าน"]', '1234');
    console.log('✅ filled username and password');
    await page.click('button[type="submit"]');
    console.log('✅ clicked login button'); // กรอกและคลิก login ตามเดิม

    const errorPopup = page.locator('.modal-body'); // page.locator() คือ “หาตำแหน่งขององค์ประกอบ” บนหน้าเว็บ | .modal-body คือคลาสของกล่องข้อความที่เด้งขึ้นมา (เช่น alert หรือ popup)
    await expect(errorPopup).toContainText('User not found'); // ตรวจสอบว่าใน popup มีข้อความว่า “User not found”
  });

  // เทสต์ที่ 3: พิมพ์รหัสผิด (Wrong Password)
  test('login failed wrong password', async ({ page }) => { 
    await page.fill('input[placeholder="ชื่อผู้ใช้"]', 'cookie');
    await page.fill('input[placeholder="รหัสผ่าน"]', '123'); // ใช้ชื่อผู้ใช้ที่ถูก (cookie) แต่พิมพ์รหัสผ่านผิด (123 แทน 1234)
    console.log('✅ filled username and password');
    await page.click('button[type="submit"]');
    console.log('✅ clicked login button');

    const errorPopup = page.locator('.modal-body');
    await expect(errorPopup).toContainText('Wrong Password'); // ตรวจสอบว่าใน popup มีข้อความว่า “Wrong Password”
  });
});