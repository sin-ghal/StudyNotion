const mongoose = require("mongoose");
const nodemailer = require("../utils/mailSender")

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

async function sendverificationemail(email,otp){
    try{
        const mailResponse = await mailSender(email,)

    }catch(e){
        console.log("error occured while sending email",e)
        throw error
    }
}

module.exports=mongoose.model("OTP",OTPSchema)