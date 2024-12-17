import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// สร้าง S3 Client
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

// Multer Storage สำหรับ S3
const storage = multerS3({
  s3: s3,
  bucket: bucketName,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    // ใช้ชื่อไฟล์เดิมแบบ UTF-8 และเพิ่ม timestamp
    const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); //latin1 (หรือ ISO/IEC 8859-1) เป็นชื่อที่ใช้อธิบายการเข้ารหัสข้อความที่ใช้ 8 บิต 
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);

    cb(null, `image/payment/${baseName}_${Date.now()}${ext}`);
  },
});

const storageMulter = multer.diskStorage({
  filename: function (req, file, cb) {
      // แปลงชื่อไฟล์ให้อยู่ในรูปแบบ UTF-8
      const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8'); //latin1 (หรือ ISO/IEC 8859-1) เป็นชื่อที่ใช้อธิบายการเข้ารหัสข้อความที่ใช้ 8 บิต 
      
      // ตรวจสอบและเพิ่ม extension ของไฟล์
      const ext = path.extname(fileName);
      const baseName = path.basename(fileName, ext);
      
      cb(null, `${baseName}_${Date.now()}${ext}`); // ป้องกันชื่อไฟล์ซ้ำโดยเพิ่ม timestamp
  }
});

// กำหนดฟังก์ชันอัปโหลดพร้อมตัวกรอง
const upload = multer({
  storage,
  storageMulter,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1 * 1024 * 1024, // จำกัดขนาดไฟล์ 1MB
  },
});

// Middleware สำหรับอัปโหลดไฟล์เดียว
const uploadSingle = upload.single('file');

export { uploadSingle };
