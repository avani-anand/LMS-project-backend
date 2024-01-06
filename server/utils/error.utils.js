class AppError extends Error{
    constructor(message,statusCode){
        super(message);  //'super' keyword is used in the context of classes and extends the functionality of the 'this' keyword

        this.statusCode=statusCode;

        Error.captureStackTrace(this.constructor);   //"captureStackTrace" ek error object method hai, jo ki error stack trace ko capture karne mein madad karta hai.
    }
}

export default AppError