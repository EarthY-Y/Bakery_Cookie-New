// ฟังก์ชัน copyToClipboard ที่ส่งคืน Promise
export const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        resolve(true); // เมื่อคัดลอกสำเร็จ
      })
      .catch((err) => {
        reject(false); // เมื่อเกิดข้อผิดพลาด
      });
  });
}