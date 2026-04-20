const { uploadToCloudinary } = require("../utils/uploadToCloudinary")

const Tag = require("../models/tags")
const User = require("../models/user")
const Course = require("../models/course")

exports.createCourse = async (req,res) =>{
    //data fetch 
    try{
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

    //if image url is not fetched from cloudinary
    if (!responseFromCloudinary?.secure_url) {
  throw new Error("Thumbnail upload failed");
}
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

    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      req.user.id,
     {
      $push : {
      courses:newCourse._id
      }
    },
    {new:true}
  )

  //update tag schema
  await Tag.findByIdAndUpdate(
    tagDetails._id,
    {
      $push:{
        courses:newCourse._id
      }
    }
  )
  
    
    return res.status(200).json({
    success: true,
    message: "Course created successfully",
    data: newCourse
})
}catch(e) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
}

//get All courses

exports.getAllCourses = async (req,res)=>{
  try{
    //fetch all courses
    const allCourses = await Course.find({})
    .populate("instructor")
    .populate("tag")

    //check if courses are not found
    if (!allCourses.length) {
  return res.status(404).json({
    success: false,
    message: "No courses found",
  });
}
  //return response
    return res.status(200).json({
    success: true,
    message: "All courses are returned successfully",
    data: allCourses
    })
}catch(e) {
    return res.status(500).json({
      success: false,
      message: "Failed to get all course",
    });
  }
}