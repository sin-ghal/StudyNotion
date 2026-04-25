const Category = require("../models/category")

//create categorys
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const categoryDetails = await Category.create({
            name,
            description
        })
        console.log(categoryDetails)

        return res.status(200).json({
            success: true,
            message: "Categorys created Successfully"
        })

    } catch (e) {
        return res.status(500).json({
            message: e.message,
            success: false
        })
    }
}

//get all categorys
exports.getAllCategorys = async (req, res) => {
    try {
        const allCategorys = await Category.find({})

        if (allCategorys.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No categorys found",
                data: allCategorys
            });
        }

        console.log("All categorys ->", allCategorys)

        return res.status(200).json(({
            success: true,
            message: "All categorys returned successfully"
        }))
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            success: false
        })
    }
}

//get details for particular category
exports.particularCategoryDetails = async (req, res) => {
    try {
        const { categoryId } = req.body

        const existingCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                select: "courseName"
            })

        if (!existingCategory) {
            return res.status(400).json({
                success: false,
                message: `Could not find category`,
            })
        }

        //get courses with different id also
        const diffCategories = await Category.find({ _id: { $ne: categoryId } }).populate({
            path: "courses",
            select: "courseName"

        })

//get top 10 selling courses

        return res.status(200).json(({
            success: true,
            message: "courses are returned for particular category",
            data: {
                existingCategory: existingCategory,
                diffCategories: diffCategories
            }
        }))
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            success: false
        })
    }
}
//done