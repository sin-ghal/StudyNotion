const Section = require("../models/Section")
const Course = require("../models/course");
const subSection = require("../models/subSection");

exports.createSection = async (req, res) => {
    try {

        const { sectionName, courseId } = req.body

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const newSection = await Section.create({sectionName})
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}
        )
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })


    return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            data:updatedCourse
        })
    }catch(e){
        return res.status(500).json({
            message: "unable to create course",
            success: false
        })
    }
}

exports.updateSection = async (req, res) => {
    try {

        const { sectionName, sectionId } = req.body

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
       const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName:sectionName},
            {new:true}
        )
        .populate("subSection")

    return res.status(200).json({
            success:true,
            message:"Section updated Successfully",
            data:updatedSection
        })
    }catch(e){
        return res.status(500).json({
            message: "unable to create course",
            success: false
        })
    }
}

//delete section
exports.deleteSection = async (req,res)=>{
    try{
        //get id - sending id in params
        const {sectionId,courseId} = req.params

        await Section.findByIdAndDelete(sectionId)

        await Course.findByIdAndUpdate(courseId,
            {
                $pull:{
                    courseContent:sectionId
                }
            },
            {new:true}
        )
        .populate({path:"courseContent",
            populate:{path : "subSection"}
        }
        )
        
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully",
        })

    }catch(e){
        return res.status(500).json({
            message: "unable to delete",
            success: false
        })
    }
}
