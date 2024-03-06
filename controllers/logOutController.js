const User = require("../model/User");

const handleLogOut = async (req, res) => {
  
    //On logout delete the refresh token in the back end
    //and delete the access token that is in-memory in the front end(Client Side).
    const cookie = req.cookies;
    if (!cookie?.jwt) {
        return res.sendStatus(204); //No content to send back req sucessfull.
    }
    console.log(cookie.jwt);
    //is the refresh token in db
    const refreshToken = cookie.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'});
        return res.sendStatus(204); // we did not find the same refresh token in the db
    }

    //delete the refresh token from the db
    foundUser.refreshToken = "";
    result = await foundUser.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'});
    res.sendStatus(204);
};

module.exports = { handleLogOut };
