export function formatDate(isoString) {
    const date = new Date(isoString);
  
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() เริ่มต้นที่ 0
    const year = date.getFullYear();
  
    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateThai(buddhistDateString) {
    // แปลงวันที่จากรูปแบบ "13/07/2567 15:42:23+07:00"
    const [datePart, timePart] = buddhistDateString.split(' ');
    const [day, month, buddhistYear] = datePart.split('/').map(Number);
    const [time, timezone] = timePart.split('+');
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // แปลงพุทธศักราชเป็นคริสต์ศักราช
    const year = buddhistYear - 543;

    // สร้างวัตถุ Date โดยใช้ข้อมูลที่ปรับ
    const date = new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, seconds));

    // ปรับเวลาให้ตรงกับ Timezone (+07:00)
    date.setHours(date.getHours());

    // ดึงข้อมูลส่วนต่างๆ ของวันที่
    const formattedDay = String(date.getDate()).padStart(2, '0');
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() เริ่มต้นที่ 0
    const formattedYear = date.getFullYear();

    const formattedHours = String(date.getHours()).padStart(2, '0');
    const formattedMinutes = String(date.getMinutes()).padStart(2, '0');
    const formattedSeconds = String(date.getSeconds()).padStart(2, '0');

    // ส่งคืนวันที่ในรูปแบบ dd/MM/yyyy HH:mm:ss
    return `${formattedDay}/${formattedMonth}/${formattedYear} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
