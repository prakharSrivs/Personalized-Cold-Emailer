import jwt from "jsonwebtoken";

export async function authenticate_jwt(req, res, next){
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token,process.env.SECRET,(err,user)=>{
            if(err) return res.status(403).json({message:"Wrong Auth token"});
            req.username=user.username;
            req.user_id=user.user_id;
            req.isAuthenticated = true
            next();
        })
    }
    else return res.sendStatus(401);
}