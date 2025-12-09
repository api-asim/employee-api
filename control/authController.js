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


const generateResetToken = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found with this email." });
        }
        
        const shortLivedToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

        res.status(200).json({ 
            success: true, 
            message: "Reset link generated successfully.",
            token: shortLivedToken 
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

const simpleResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, error: "Reset token is missing." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found or token is invalid." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully. You can log in now." });
        
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid or expired reset token.", error: err.message });
    }
}

export { login , verify , generateResetToken , simpleResetPassword};