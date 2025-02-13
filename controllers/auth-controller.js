const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const checkUser = await User.findOne({ $or: [{ email }, { username }] });
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User registration failed!"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully!"
        });

    } catch (err) {
        console.error("Error in registerUser:", err.message);
        res.status(500).json({
            success: false,
            message: "Server Error!"
        });
    }
};
const loginUser = async (req,res)=>{
    try{
        const {username, password} = req.body;
        const cheskUser = await User.findOne({username});
        if(!cheskUser){
            return res.status(400).json({
                success : false,
                message: "User not found!"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, cheskUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message: "Invalid credentials!"
            })
        }
        const accessToken = jwt.sign({
            userId : cheskUser._id,
            username : cheskUser.username,
            role : cheskUser.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : '1d'
        })
        res.status(200).json({
            success : true,
            message: "User logged in successfully!!!",
            accessToken
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            success : false,
            message: "Server Error (controller)!"
        });
    }
}

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;
        const {oldPassword,newPassword} = req.body;
        const currentUser = await User.findById(userId);
        if(!currentUser){
            return res.status(400).json({
                success : false,
                message : "User not found in our DataBase!!!"
            });
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid Old Password,Please Enter the correct password!!!!"
            })
        }
        if(oldPassword === newPassword){
            return res.status(400).json({
                success : false,
                message : "Old password and new password should not be same!!!"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt);
        currentUser.password = newHashedPassword;
        await currentUser.save();
        res.status(200).json({
            success : true,
            message : "Password changed successfully!!!"
        })
    }catch(err){
        console.log("Error at changing the Passwors",err);
        res.status(500).json({
            success : false,
            message : "Server Error at changing the Password!!!"
        })
    }
}

module.exports = {loginUser, registerUser, changePassword};