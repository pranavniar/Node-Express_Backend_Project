const User = require('../model/User');
const jwt = require("jsonwebtoken");


const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  if(!cookie?.jwt){
    return res.sendStatus(401);
  }
  console.log(cookie.jwt);
  const refreshToken = cookie.jwt;
  const foundUser = await User.findOne({refreshToken}).exec();
  if (!foundUser) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, 
    process.env.REFRESH_TOKEN_SECRET, 
    (err, decoded) => {
        if (err || decoded.username !== foundUser.username) {
            return res.sendStatus(403);
        }
        const roles = Object.values(foundUser.roles);
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
        res.status(200).json({ accessToken });
    });
};

module.exports = { handleRefreshToken };
