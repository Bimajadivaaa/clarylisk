import responseError from '../error/responseError.js'

export const errorMiddleware=async(err,req,res,next)=>{
    if(!err){
        next();
        return;
    }
    if(err instanceof responseError){
        res.status(err.status).json({
            error: err.message
        }).end();
    }else{
        res.status(500).json({
            error:err.message
    }).end();
}
}