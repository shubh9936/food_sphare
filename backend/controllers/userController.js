import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
      const user = await userModel.findOne({email});

      if(!user){
        return  res.json({success:false,message:"User Doesn't exist "})
      }
      const isMatch = await  bcrypt.compare(password,user.password)
      if(!isMatch){
         return res.json({success:false,message:"Invalid credentials"})
      }
      //if password is matching then genrate a tocken
      const token = createToken(user._id);
      res.json({success:true,token})

    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
    }

}


//create token
const createToken=(id)=>{
   return jwt.sign({id},process.env.JWT_SECRET)

}
 


const registerUser = async(req,res) =>{
       //destructure the input
       const{name,password,email} = req.body;
       try {
        //checking is user already exist
         const exists = await userModel.findOne({email});
         if(exists){
            return res.json({success:false,message:"User already exist"})

         }

         //validating email format & strong password
         if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
         }
         if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
         }

         //hasing user password(encrpt the user password to save in database)
         const salt = await bcrypt.genSalt(10);//(we put number between 5-15,as number increases our password will be more strong encryptes)
         const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
                name: name,
                email: email,
                password:hashedPassword,
        
               })
              const user =  await newUser.save();//to save in database
              const token = createToken(user._id)
              res.json({success:true , token})
        
       } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error"})
        
       }

}

export {loginUser,registerUser}  //exporting an object
