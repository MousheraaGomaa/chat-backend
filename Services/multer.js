import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    // 'image/jpeg', 'image/png', 'image/gif', // Images
    'video/mp4', 'video/quicktime', 'video/x-matroska', // Videos
    'audio/mpeg', 'audio/wav', 'audio/ogg' // Audio
]

function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (!allowedMimeTypes.includes(file.mimetype))
        cb(new Error('File type not supported'), false);
    else
        cb(null, true);
}

const multerUpload = multer({ storage, fileFilter, fieldSize:'2M'}).single('message');


export default multerUpload;