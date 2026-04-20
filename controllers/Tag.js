const Tag = require("../models/tags")

//create tags
exports.createTag = async(req,res)=>{
    try{
        const {name,description} = req.body

        if(!name || !description){
            return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
        }

       const tagDetails =  await Tag.create({
            name,
            description
        })
        console.log(tagDetails)

        return res.status(200).json({
            success:true,
            message:"Tags created Successfully"
        })
         
    }catch(e){
        return res.status(500).json({
            message: e.message,
            success: false
        })
    }
}

//get all tags
exports.getAllTags = async(req,res)=>{
    try{
        const allTags = await Tag.find({})

if (!allTags.length) {
  return res.status(404).json({
    success: false,
    message: "No tags found",
    data:allTags
  });
}

        console.log("All tags ->",allTags)

        return res.status(200).json(({
            success:true,
            message:"All tags returned successfully"
        }))
    }catch(e){
        return res.status(500).json({
            message: e.message,
            success: false
        })
    }
}