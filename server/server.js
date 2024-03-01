import app from './app.js'
import {config} from 'dotenv'
import connectionToDB from './config/dbConnection.js';
import cloudinary  from 'cloudinary';
import { token } from 'morgan';
config();





const PORT= process.env.PORT || 5000;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY  ,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
});




app.listen(PORT,async ()=>{    //here we use async await for firstly we check our database is connected or not then it give the port where or port is running
     await connectionToDB();
    console.log(`App is running at http://localhost:${PORT}`);
})