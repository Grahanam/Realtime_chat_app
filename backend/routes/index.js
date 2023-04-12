var express = require('express');
var router = express.Router();
var bcrypt=require('bcrypt')
const jwt = require("jsonwebtoken");
const userModel=require('../models/usermodel')
const roomModel=require('../models/roomodel')
const auth=require("../auth")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('express api route')
});

//SignUp Endpoint
router.post("/register",(request,response)=>{
  const {username,password}=request.body
  userModel.findOne({username:username})
  .then((existingUser)=>{
    if(existingUser){
      response.status(400).send({message:"Username already exists"});
    }
    else{
      bcrypt.hash(password,10)
      .then((hashedPassword)=>{
        const user=new userModel({
          username:request.body.username,
          password:hashedPassword,
        })
        user.save()
        .then((result)=>{
          response.status(201).send({
          message:"User Created Successfully",
          result,
          })
        })
        .catch((error)=>{
          response.status(500).send({
          message:"Error creating user",
          error,
          })
        })
      })
    .catch((e)=>{
        response.status(500).send({
        message:"Password was not hashed successfully",
        e,
        })
      })
    }
  })
  .catch((error) => {
    response.status(500).send({
      message: "Error finding user",
      error
    });
  });
});


//Login Endpoint
router.post("/login",(request,response)=>{
  const {username,password}=request.body
  userModel.findOne({username:username})
  .then((User)=>{
    bcrypt.compare(password,User.password)
    .then((passwordCheck)=>{
      
      if(!passwordCheck){
        return response.status(400).send({
          message:"Passwords does not match"
        })
      }

      const token=jwt.sign(
        {
          userId:User._id,
          userUsername:User.username,
        },
      "RANDOM-TOKEN",
      {expiresIn:"24h"}
      );
      response.status(200).send({
        message:"Login Successful",
        username:User.username,
        token,
      })
    })
    .catch((err)=>{
      response.status(400).send({
        message:"Passwords does not match this err",
        err,
      })

    })

  })
  .catch((err)=>{
    response.status(404).send({
      message:"Username not found",
      err,
    });
  })
})

router.get("/free",(request,response)=>{
  response.json({message:"You are free to access"})
})
router.get("/auth-endpoint",auth,(request,response)=>{
  response.json({message:"End point is authenticated"})
})

router.post("/saveroom",async(request,response)=>{
  try{
    let {username,name,password}=request.body;
    console.log(request.body)
    const user=await userModel.findOne({username})
    if(!user){
      return response.status(400).json({error:'User not Found'})
    }
    const findroom=await roomModel.findOne({name:name})
    if(findroom){
      return response.status(400).json({error:'Room name already taken!'})
    }
    const count=await roomModel.countDocuments({username:username})
    if(count>=5){
      return response.status(400).json({error:'Maximum number of rooms exceeded'})
    }
    const hashedpassword=await bcrypt.hash(password,10)
    console.log(hashedpassword)
    password=hashedpassword
    const room=await roomModel.create({username,name,password});
    response.status(200).json(room)
  }catch(err){
    response.status(500).json({error:err.message})
  }
})

router.get("/room/:username",async(request,response)=>{
  try{
    const {username}=request.params

    const rooms=await roomModel.find({username})

    if(rooms.length===0){
      return response.status(200).json([])
    }
    response.status(200).json(rooms)
  }catch(err){
    response.status(500).json({error:err.message})
  }
})


router.post("/enterroom", async (request, response) => {
  try {
    const { username, name, password } = request.body;
    console.log(request.body)
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return response.status(404).send({
        message: "Username not found",
        err,
      });
    }
    const room = await roomModel.findOne({ name: name });
    if (!room) {
      return response.status(400).send({
        message: "Room does not exist.",
        err,
      });
    }
    const passwordCheck = await bcrypt.compare(password, room.password);
    if (!passwordCheck) {
      return response.status(400).send({
        message: "Room Passwords does not match1",
      });
    }
    response.status(200).send({
      message: "Room entered Successfully",
    });
  } catch (err) {
    response.status(400).send({
      message: "Room passwords does not match2",
      err,
    });
  }
});


module.exports = router;
