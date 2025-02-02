export const generateOrderId = async (phoneNumber, countOrder) => {
  const phoneStr = String(phoneNumber);

  // ดึงวันที่ปัจจุบันในรูปแบบ YYYYMMDD
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  // ดึง 3 ตัวเลขหลังสุดจากเบอร์โทร
  const phonePart = phoneStr.slice(-3);

  // นำ countOrder มา format ให้เป็น 4 หลัก
  const orderCount = String(countOrder).padStart(4, '0');

  // รวมรหัสทั้งหมด
  const orderId = `${formattedDate}-${phonePart}-${orderCount}`;
  return orderId;
};
