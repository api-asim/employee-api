import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({success:false , error:"Invalid email or password" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(404).json({ message: "Wrong password" });
        }
        
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({success: true , message: "Login successful", token , user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        } });
    }
    catch(err){
        res.status(500).json({success: false , message: "Server error", error: err.message });
        console.error("Error during login process:", err);
    }
}

const verify = (req , res)=>{
    return res.status(200).json({success:true , user: req.user});
}
export { login , verify};