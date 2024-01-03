import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import userRoutes  from './routes/user.routes'
import errorMiddleware from './middleWares/error.middleware';

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

app.use('/api/v1/user',userRoutes);  //ab iss routes p jitne v error aenge vo iss code se niche ka code (app.all) link p jaege vha dekhenge ki mai kuch ni kr skta to phir uske niche jeange  vha milega "app.use(errorMiddleware);" jisme ki hum error aae to kya show krna h vo sb define krke rkhe h

//below we are giving a route for all routes that is not defined
app.all('*',(req,res)=>{
    res.status(404).send('oops! 404 page not found')
})


app.use(errorMiddleware);


export default app