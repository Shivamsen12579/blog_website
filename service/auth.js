const jwt = require("jsonwebtoken");
const secret = "Shivam@123"
function createTokenForUser(user){
    const payload ={
        _id: user._id,
        email: user.email,
        profile: user.profile_image,
        role: user.role

    }
    const token = jwt.sign(payload ,secret);
    return token;
}

function VerifyUser(token){
    const payload = jwt.verify(token , secret);
    return payload;
}

module.exports = {
    createTokenForUser ,
    VerifyUser
}