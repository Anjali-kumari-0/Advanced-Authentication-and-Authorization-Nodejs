const User = require("../model/userModel");
const express = require("express")
const app= express();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser())
const JWT_SECRET_KEY = "Anjali@123"
async function login(req, res, next) {
    const body = req.body;
    if (!body || !body.email || !body.password) {
        return res.status(400).json({ msg: "Something is wrong with your data" });
    }

    try {
        const foundUser = await User.findOne({ email: body.email });
        const isPass = bcrypt.compareSync(body.password, foundUser.user)
        if (!foundUser) {    // || foundUser.password !== body.password) {
            return res.status(400).json({ msg: "Invalid email" });
        } else if (isPass) {
            return res.status(400).json({ msg: "wrong password" })

        } else {
            const token = jwt.sign({ id: foundUser._id }, JWT_SECRET_KEY, {
                expiresIn: "1hr"
            })
            if(req.cookies[`${foundUser._id}`]){
                req.cookies[`${foundUser._id}`]=""
            }
            res.cookie(String(foundUser._id), token, {
                path:'/',
                expires:new Date(Date.now()+1000 *30),
                httpOnly:true,
                sameSite:'lax'
            });
            return res.status(200).json({ msg: "Login successful", data: foundUser, token: token });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Error during login", error: error.message });
    }
}

async function register(req, res, next) {
    const body = req.body;
    if (!body || !body.email || !body.password) {
        return res.status(400).json({ msg: "Something is wrong with your data" });
    }
    const user = await user.findOne({ email: body.email });
    if (user) {
        return res.status(400).json({ msg: "user allready presents1 please try to login" })
    }

    try {
        const hashPass = bcrypt.hashSync(body.password);
        const createUser = await User.create({
            email: body.email,
            password: hashPass
        });
        return res.status(200).json({ msg: "User created", data: createUser });
    } catch (error) {
        return res.status(500).json({ msg: "Failed to create user", error: error.message });
    }
}
async function verifyToken(req, res, next) {
    const cookie= req.headers.cookies;
    const token= cookie.split("=")[1];
    // const headers = req.headers[`authorization`]
    // const token = headers.split(" ")[1];
    if (!token) {
       return res.status(404).json({ msg: "no token found" })
    }
    jwt.verify(string(token), JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status().json({ msg: "Invalid token" })
        }
         req.id=user.id;
    });
    next();
};
async function getUser(req, res, next) {
    const userId= req.id;
    let user;
    try{
        user=await User.findById(userId)
        if(!user){
            return res.status(400).json({msg:"user not found"})
        }
        return res.status(200).json({msg:"fetched", data:user})
    }catch(err){
        return res.status(500).json({msg:"somthing went wrong", data:err})
    }

}
async function logout(req, res, next) {
    const cookie= req.headers.cookies;
    const prevToken= cookie.split("=")[1];
    if(!prevToken){
        return res.status(400).json({msg:"countdnt found token"})

    }
    jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, User)=>{
        if(err){
            return res.status(403).json({msg:'unthuorized',data:err})
        }
        res.clearCookie(`${User.id}`);
        req.cookies[`${User.id}`]="";
        return res.status(200).json({msg:"sucesfully logout"})
    })

}
async function refreshToken(req, res, next) {
    const cookie= req.headers.cookies;
    const prevToken= cookie.split("=")[1];
    if(!prevToken){
        return res.status(400).json({msg:"countdnt found token"})

    }
    jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, User)=>{
        if(err){
            return res.status(403).json({msg:'unthuorized',data:err})
        }
        res.clearCookie(`${User.id}`);
        req.cookies[`${User.id}`]="";
        const token = jwt.sign({id:User.id}, JWT_SECRET_KEY,{
            expiresIn:'30s'
        })
        res.cookie(String(User.id), token, {
            path:'/',
            expires:new Date(Date.now()+1000 *30),
            httpOnly:true,
            sameSite:'lax'
        });
        req.id=User.id;
        next();
    })


}
module.exports = {
    login,
    register,
    verifyToken,
    refreshToken,
    getUser,
    logout
};
