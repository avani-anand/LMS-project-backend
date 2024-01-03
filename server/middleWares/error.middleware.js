const errorMiddleware= (err,req,res,next)=>{

    // niche bta rhe h ki agar "user.controller.js" se status code na aae to kya kre aur message na aae to kya kre
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "something went wrong"


    return res.status(err.statusCode).json({
        success:false,
        message:err.message,   //yha err m jo msg vejga "user.controller.js" "error.utils.js" ko vhi msg yha lg jaega
        stack:err.stack       //yha bta rhe h ki "error.utils.js" jo h vha se stack trace se error milega vhi print kr do
    })
}

export default errorMiddleware