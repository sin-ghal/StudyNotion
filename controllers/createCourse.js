const { uploadToCloudinary } = require("../utils/uploadToCloudinary")

const Tag = require("../models/tags")
const User = require("../models/user")
const Course = require("../models/course")

exports.createCourse = async (req,res) =>{
    //data fetch 
    const {
        courseName, 
        courseDescription,
        whatYouWillLearn,
        price,
        tag
    } = req.body

    //fetch thumbnail
    const thumbnail = req.files.thumbnailImage

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }

    //get instructors details //already present in req.user.id
    // const userId = req.user.id
    // const instructorDetails = await User.findById(userId)

    // if(!instructorDetails){
    //     return res.status(400).json({
    //     success: false,
    //     message: "Instructor details are necessary",
    //   })
    // }

    const tagDetails = await Tag.findOne({name : tag})
    if(!tagDetails){
        return res.status(400).json({
        success: false,
        message: "Tag details not found",
      })
    }

    //upload to cloudinary
    const responseFromCloudinary = await uploadToCloudinary(thumbnail,process.env.FOLDER_NAME)

    //create entry to db
    const newCourse = await Course.create({
        courseName, 
        courseDescription,
        whatYouWillLearn,
        price,
        tag:tagDetails._id,
        instructor:req.user.id,
        thumbnail:responseFromCloudinary.secure_url
    })
    
    
    return res.status(200).json({
    success: true,
    message: "Course created successfully",
    data: newCourse
})
}