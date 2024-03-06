const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, password} = req.body;
    if(!user || !password){
        return res.status(400).json({"message":'User and password are required'});
    }
    const duplicate = await User.findOne({username:user}).exec();

    if(duplicate) return res.status(409).json({"message":'User already exists'});
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
          username: user,
          password: hashedPassword,
        });
        console.log(result);
        res.status(201).json({"message":`User ${user} created successfully`});
    }catch(err){
        console.log(err);
        res.status(500).json({"message":err.message});
    }

};

//we put this within an object so that we can pull the 
//whole controller into wherever we import it
module.exports = {handleNewUser};