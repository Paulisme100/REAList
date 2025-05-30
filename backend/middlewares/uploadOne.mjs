import multer from "multer";

const storage = multer.diskStorage({
    destination: "uploads/agency-logos/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadOne = multer({storage})

export default uploadOne