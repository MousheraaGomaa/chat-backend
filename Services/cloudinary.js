import { v2 as cloudinary } from 'cloudinary';
 
 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.CLOUDINARYAPIKEY, 
    api_secret: process.env.CLOUDINARYAPISECRET 
});

async function upload() {

   
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           './public/assets/logo.png', {
               folder:'users/auth',
               fetch_format:'auto',
               quality:'auto',
            //    crop:"auto",
            //    gravity:'auto',
            //    width:500,
            //    height:500

           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
}
function cloudinaryUpload( fileBuffer, type ,path ){
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({
            resource_type: type,
            folder: `${path}/${type}s`,
            fetch_format: 'auto',
            quality: 'auto'
        },(err,result)=>{
            if(err)
                return reject(`Upload Error: ${err.message}`)
            resolve(result)
        }).end(fileBuffer);
    });
   
}

export default cloudinaryUpload;
export { upload }