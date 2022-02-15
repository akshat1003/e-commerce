 const app=require('./app');
const connectDatabase=require('./config/database')

const dotenv=require('dotenv');
//handled the uncaught exceptions
process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down systen system due to uncaught exceptions.`);
    process.exit(1); 
})

// setting up config file
// console.log(a);

dotenv.config({path:`backend/config/config.env`})

//connecting to database
connectDatabase(); 
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Serever started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)

}) 

// handle unhandled promised rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down System due to unhandled rejections`);
    server.close(()=>{
        process.exit(1);
    })
} )