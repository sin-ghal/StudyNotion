const cloudinary = require("cloudinary")

exports.uploadToCloudinary= async (file,folder,height,quality)=>{
    
    try{
        const options = {
        folder,
        resource_type:"auto"
    }
    if(height) options.height = height
    if(quality) options.quality = quality

    return cloudinary.uploader.upload(file.tempFilePath,options)
}catch(e){
    console.error(e)
    throw e
}
}
