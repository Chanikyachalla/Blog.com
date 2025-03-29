
const {createTokenForUser,
    validateToken,}  = require("../services/auth");


function checkForAuthentication(cookieName) {
    return(req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
           return  next();
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
             return next();
            
    }catch(error){
        console.log(error);
        return next();
    }
       
      return  next(); 
    
};
}

module.exports ={
    checkForAuthentication
}