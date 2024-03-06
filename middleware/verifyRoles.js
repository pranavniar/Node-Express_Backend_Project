const verifyRoles = (...allowedRoles) => {
    return (req,res,next) => {
        if(!req?.roles) {
            return res.sendStatus(401);
        }
        const rolesList = [...allowedRoles];
        const userRoles = req.roles;
        const result = userRoles.map(u => rolesList.includes(u)).find(r => r === true);
        if(!result) {
            return res.sendStatus(401);
        }
        next(); 
    }
}

module.exports = verifyRoles;