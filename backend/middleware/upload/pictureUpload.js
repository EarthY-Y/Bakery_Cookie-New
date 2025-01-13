import multer from 'multer';
import path from 'path'; // ใช้สำหรับจัดการ extension ของไฟล์

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'picture'); // กำหนดโฟลเดอร์ปลายทาง
    },
    filename: function (req, file, cb) {
        // แปลงชื่อไฟล์ให้อยู่ในรูปแบบ UTF-8
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); //latin1 (หรือ ISO/IEC 8859-1) เป็นชื่อที่ใช้อธิบายการเข้ารหัสข้อความที่ใช้ 8 บิต 
        
        // ตรวจสอบและเพิ่ม extension ของไฟล์
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        
        cb(null, `${baseName}_${Date.now()}${ext}`); // ป้องกันชื่อไฟล์ซ้ำโดยเพิ่ม timestamp
    }
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        // ตรวจสอบประเภทไฟล์
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // จำกัดขนาดไฟล์ 5MB
    }
});

const uploadSingle = upload.single('file');

export { uploadSingle };
