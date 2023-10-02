const User = require('../models/user');
const { sendActivationEmail } = require('./emailcontroller');
const crypto = require('crypto');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const SECRET_KEY="forgetresetpassword"
const sendPasswordResetEmail=require('../sendPasswordResetEmail')

const createuser = async (req, res) => {
    try {
      const { fname, lname, email, password, cpassword } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
     
      if (password !== cpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
   
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const activationToken = crypto.randomBytes(32).toString('hex');
  
      const newUser = new User({
        fname,
        lname,
        email,
        password: hashedPassword, 
        activationToken,
      });
  
      await newUser.save();
  
      const activationLink = `http://localhost:3003/activate?token=${activationToken}`;
  
      await sendActivationEmail(email, activationLink);
  
      res.status(201).json({ message: 'User registered successfully. Check your email to activate your account.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  




const activateAccount = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ activationToken: token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid activation token' });
    }

    user.isActive = true;
    user.activationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Error activating account' });
  }
};

const loginuser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(422).json({ message: 'Invalid Credentials' });
      }
  
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account not activated' });
      }
  
      const matchpassword = await bcrypt.compare(password, user.password);
  
      if (!matchpassword) {
        return res.status(422).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        {
          userId: user._id,
          fname: user.fname,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: '1hr' }
      );
  
      res.json(token);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const userprofile=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId,'fname email')
        res.json(user)
    }catch(error){
        console.error('error fetching user profile',error)
        res.status(500).json({message:"internal server error"})

    }

}

const forgetpassword=async(req,res)=>{
   

    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
     
      const resetToken = jwt.sign({ email }, "forgetresetpassword", { expiresIn: '1h' });
    
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
      await user.save();

  
      
      sendPasswordResetEmail(email, resetToken);
  
      res.json(resetToken);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

  
}


const resetpassword = async (req, res) => {
    // Add this route to reset the password using the token
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Generate a salt and hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      // Clear the reset token and expiry
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    createuser,
    activateAccount,
    loginuser,
    userprofile,
    forgetpassword,
    resetpassword,
  };
  
module.exports = { createuser,activateAccount ,loginuser,userprofile,forgetpassword,resetpassword};



