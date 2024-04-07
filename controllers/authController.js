const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: "User and password are required" });
  }
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }
  try {
    if (await bcrypt.compare(password, foundUser.password)) {
      const roles = Object.values(foundUser.roles).filter(Boolean);
      // Create the access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "60s" }
      );

      // Create the refresh token
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Save the refresh token with current user in the database to create a logout route
      //that invalidates the refresh token when the user logs out
      foundUser.refreshToken = refreshToken;
      result = await foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken, roles });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
