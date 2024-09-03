const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, 'eCommerce', { expiresIn: '1h' });
};

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({success:true,message:"Signup successful!"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.status(200).json({ success:true,JWTtoken:token,user:user,message:"Login Successful!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
