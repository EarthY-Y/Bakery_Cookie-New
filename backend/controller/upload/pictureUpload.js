import multer from 'multer'

// const upload = multer({dest: 'picture/'})
// const upload = multer({dest: 'picture/'})
const storage = multer.diskStorage({
    destination: function (req, file, cb) { //cb ย่อมาจาก callback เพราะ multer ไม่มี promise ทำให้ใช้ async/await ไม่ได้
        cb(null, 'picture') //กำหนด picture ได้เลยเพราะว่า ทำงานผ่าน root เลยไม่ต้องกำหนด path 
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}` //file.originalname ชื่อไฟล์ที่อัปเข้ามารวมถึงนามสกุลไฟล์ด้วย
      cb(null, fileName)
    }
  })
  
const upload = multer({
  storage //ชื่อ key กับ value เหมือนกันเลยทำเเบบนี้ได้
})

const uploadSingle = upload.single('up');

export { uploadSingle };