import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

const deleteParams = (oldPicture) => ({
  Bucket: bucketName, // ชื่อ Bucket
  Key: oldPicture,    // ชื่อไฟล์ที่ต้องการลบ
});

export const handleDelete = async (oldPicture) => {
  try {
    const params = deleteParams(oldPicture);
    await s3.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted ${oldPicture} from S3`);
  } catch (error) {
    console.error(`Error deleting ${oldPicture} from S3:`, error);
    throw error; 
  }
};