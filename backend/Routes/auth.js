const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path if necessary


//Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ success:false,msg: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("Hashed Password:", hashedPassword);

      user = new User({
          name,
          email,
          phone,
          password
      });

      await user.save();

      const payload = {
          user: {
              id: user.id
          }
      };

      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
              if (err) throw err;
              res.json({ success:true,token });
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});



// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      console.log("Login request received for email:", email);

      let user = await User.findOne({ email });
      if (!user) {
          console.log("User not found");
          return res.status(400).json({ msg: 'Invalid Credentials' });
      }
      console.log("User found:", user);

      console.log("Plain Password:", password);
      console.log("Hashed Password:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password Match Result:", isMatch);
      if (!isMatch) {
          console.log("Password mismatch");
          return res.status(400).json({ msg: 'Invalid Credentials' });
      }
      console.log("Password matched");

      const payload = {
          user: {
              id: user.id
          }
      };

      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
              if (err) {
                  console.log("JWT sign error:", err);
                  throw err;
              }
              res.json({ success:true,token });
          }
      );
  } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).send('Server error');
  }
});



//Update Location
router.post('/update-location', async (req, res) => {
    const { userId, coordinates } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.location.coordinates = coordinates;
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
