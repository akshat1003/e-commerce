// create and send token
const sendToken=(user,statusCode,res)=>{
    //create jwtToken
    const token=user.getJwtToken();
    //options for cookie
    const options={
        expires: new Date(
            Date.now()+7*24*60*60*1000 
            ),
            httpOnly: true

    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token,
        user 
    })

}
module.exports=sendToken; 