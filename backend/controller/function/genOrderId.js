export const generateOrderId = (phoneNumber) => {
  // ดึงวันที่ปัจจุบันในรูปแบบ YYYYMMDD
  const phoneStr = String(phoneNumber);

  // ดึงวันที่ปัจจุบันในรูปแบบ YYYYMMDD
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  // ดึง 3 ตัวเลขหลังสุดจากเบอร์โทร
  const phonePart = phoneStr.slice(-3);

  // สร้างเลขสุ่ม 4 หลัก
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  // รวมรหัสทั้งหมด
  const orderId = `${formattedDate}-${phonePart}-${randomNumber}`;
  return orderId;
}
