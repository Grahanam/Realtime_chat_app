const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide Username"],
        unique:[true,"Username Exist"]
    },
    password:{
        type:String,
        required:[true,"Please provide Password!"],
        unique:false,
    },
})

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
