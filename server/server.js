import app from './app.js'
import {config} from 'dotenv'
import connectionToDB from './config/dbConnection.js';
config();





const PORT= process.env.PORT || 5000;


app.listen(PORT,async ()=>{    //here we use async await for firstly we check our database is connected or not then it give the port where or port is running
     await connectionToDB();
    console.log(`App is running at http://localhost:${PORT}`);
})