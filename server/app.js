import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'

const app= express();

app.use(express.json());

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))


app.use(cookieParser());

app.use(morgan('dev')); //here we are using morgan package and passing dev result it give us link in our terminal which user render or search on website

app.use('/ping',function(req,res){
    res.send('/pong')
})


//below we are giving a route for all routes that is not defined
app.all('*',(req,res)=>{
    res.status(404).send('oops! 404 page not found')
})


export default app