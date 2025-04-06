import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = {
  avatar: ["image/jpeg", "image/png", "image/gif"],
  message: [
    "image/jpeg",
    "image/png",
    "image/gif", // Images
    "video/mp4",
    "video/quicktime",
    "video/x-matroska", // Videos
    "audio/mpeg",
    "audio/wav",
    "audio/ogg", // Audio
  ],
};

function fileFilter(uploadType) {
  return (req, file, cb) => {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (!allowedMimeTypes[uploadType].includes(file.mimetype))
      cb(new Error("File type not supported"), false);
    else cb(null, true);
  };
}

const multerUpload = (uploadType, feildName, fieldSize="2M") => {
    return multer({
        storage,
        fileFilter: fileFilter(uploadType),
        fieldSize
    }).single(feildName);
      
}
const multerUploadMessage = multerUpload('message','content');
const multerUploadAvatar = multerUpload('avatar','avatar');
export  {
    multerUploadMessage,
    multerUploadAvatar
}
