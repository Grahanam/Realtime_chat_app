const mongoose=require('mongoose')
const User=require('./usermodel')

const RoomSchema=new mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.String,
        ref:'User',
        required:[true,"Please provide Username"]
        
    },
    name:{
        type:String,
        required:[true,"Please provide Name"],
        unique:[true,"Room Exist"]
    },
    password:{
        type:String,
        required:[true,"Please provide Password!"],
        unique:false,
    },
})

RoomSchema.path('username').validate(async function(value) {
    const count = await mongoose.models.Rooms.countDocuments({ username: value });
    return count < 5;
  }, 'Maximum number of rooms exceeded');

RoomSchema.virtual('user',{
    ref:'User',
    localField:'username',
    foreignField:'username',
    justOne:false,
})

module.exports = mongoose.model.Rooms || mongoose.model("Rooms", RoomSchema);