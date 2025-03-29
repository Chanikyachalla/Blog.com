const JWT = require("jsonwebtoken");

const secret = "Chanu@2525";

function  createTokenForUser(user) {
   
   const payload = {
      name:user.fullName,
      _id: user._id,
      email: user.email,
      profileImageURL: user.profileImageURL,
      role: user.role,
   };
   const token = JWT.sign(payload, secret);
 return token;

}


function validateToken(token) {
    try{
        const payload = JWT.verify(token,secret);
        return payload;
    }catch(error){
        console.log(error);
        return null;
    }
   
}

module.exports= {
    createTokenForUser,
    validateToken,

};