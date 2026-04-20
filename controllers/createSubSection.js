const subSection = require("../models/subSection")
const {uploadToCloudinary} = require("../utils/uploadToCloudinary")
const Section = require("../models/Section")

exports.createSubSection = async (req,res)=>{
    try{
        //fetch the data
        const {title,timeDuration,description,sectionId} = req.body

        //fetch the video
        const videofile = req.files.video

        //validation
        if(!title || !timeDuration || !description || !videofile){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

    //upload video to cloudinary
    const cloudinaryInfo = await uploadToCloudinary(videofile,process.env.FOLDER_NAME)

    const newSubSection = await subSection.create({
        title,
        timeDuration,
        description,
        videoUrl:cloudinaryInfo.secure_url
    })
    
    const updatedSection = await Section.findByIdAndUpdate(sectionId,
        {
            $push:{
                subSection:newSubSection._id
            }
        },
        {new:true}
).populate({path : "subSection"})

//return response
 return res.status(200).json({
            success:true,
            message:"subSection created Successfully",
            data:updatedSection
        })

}catch(e){
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
}
}

//update subsection

//delete subsection