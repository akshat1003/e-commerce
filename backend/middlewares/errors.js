const ErrorHandler = require('../utils/ErrorHandler');




module.exports = (err,req,res,next) => {
    err.statusCode=err.statusCode||500;
    if(process.env.NODE_ENV==='DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage:err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV==='PRODUCTION'){
        let error={...err}
        error.message=err.message

  
        //wrong mongoose object id error
        if(err.name==='Error'){
            const message=`Resource not found. Invalid: ${err.path}`
            error=new ErrorHandler(message,400);
        }
    
        //handling mongoose validation errors
        if(err.name==="ValidationError")
        {
            const message=Object.values(err.errors).map(value=>value.message)
                error=new ErrorHandler(message,400);
        }
        // handling mongoose duplivate error
        if(err.code===11000)
        {
            const message= `Duplicate ${Object.keys(err.keyValue)} entered`
            error=new ErrorHandler(message,400);
        }

        //handling wrong jwt errors
        if(err.name==="JsonWebTokenError")
        {
            const message='JSON Web Token is invalid. Try Again'
                error=new ErrorHandler(message,400);
        }
        if(err.name==="TokenExpiredError")
        {
            const message='JSON Web Token is invalid. Try Again!!'
                error=new ErrorHandler(message,400);
        }
        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Srever error'
        })
    }
   
}








     