import multer from "multer";
import path from "path";
import fs from "fs";
// config storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // ตรวจสอบว่าโฟลเดอร์ 'uploads/' มีอยู่หรือไม่ ถ้าไม่มีให้สร้าง
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true จะสร้าง parent directories ถ้ายังไม่มี
    }
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.filename + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported, Please upload image file"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit 5 mbs
  },
});
