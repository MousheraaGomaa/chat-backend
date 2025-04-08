import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import "dotenv/config";
import AppErorr from "../Utils/app_error.js";

// Configuration;
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDINARYAPISECRET,
  secure: true,
});

function cloudinaryUpload(fileBuffer, type, path) {
  const options = {
          resource_type: type,
          type: "authenticated",
          //access_control: [{ access_type: "token" }],
          folder: path,
          fetch_format: "auto",
          quality: "auto",
        }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
       options,
        (err, result) => {
          if (err) {
            if (err.message.includes("File size too large")){
              return reject(new AppErorr("Upload Error: File size too large. Please compress the file.", 413))
            }
            return reject(new AppErorr(`Upload Error: ${err.message}`, err.http_code));
          }
          resolve(result);
        }
      )
      .end(fileBuffer);

  });
}

// url with limited time to access file.
const generateSignedUrl = (publicId, resourceType) => {
  const signedUrl = cloudinary.url( publicId, {
    sign_url: true,
    resource_type: resourceType, // Use "video" even for audio files
    type: "authenticated", // Required for access-controlled files
    expires_at: Math.floor(Date.now() / 1000) + 5// Expire in 1 hour 60*60
  });
  return signedUrl;
};

export { cloudinaryUpload, generateSignedUrl };
