import mongoose from "mongoose";

mongoose.set('strictQuery',false);  // yha hum strict mode on ni kiye h taki agar koe hume galt v information de ya jada information de de to error show na ho

// here we are connection mongodb or also checking if connection is done or not previously we check mongo connect or not....... in diffrent syntax and way 

const connectionToDB=async ()=>{


    try {
        const {connection}= await mongoose.connect(
            process.env.MONGO_URL ||`mongodb://127.0.0.1:27017/LMS`

        );
        if (connection) {
            console.log(`connected to mongoDB :${connection.host}`);
        }
        
    } catch (error) {
        console.log(error); //if server is not connected to mongo den give error
        process.exit(1); //or exit from here
    }


}

export default connectionToDB;