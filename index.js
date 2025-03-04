//Backend for  Bank App
//code to create server using express

//1.import express
const express = require('express');

//4.import cors
const cors = require('cors');

//import logic
const logic = require('./services/logic')

//import jwt token
const jwt = require('jsonwebtoken')


//2.create server using express
const server=express();

//5. use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6.parse json data to js in server app
server.use(express.json());

//3setup port for server
server.listen(5000,()=>{
    console.log('server listening on port:5000');
});

//7. Resolving client request
//api call 

server.get('/',(req,res)=>{
    res.send('client get request')
})
server.post('/',(req,res)=>{
    res.send('client post request')
})

//bank app Requests

//Application specific Middleware
// const appMiddleware = (req,res,next)=>{
//     console.log('Application Specific Middleware');
//     next()
// }

//Router specific middleware
const routerMiddleware = (req,res,next)=>{
    console.log("Router specific middleware");
    try{
        const token = req.headers['verify-token'];//token
        // console.log(token);
        const data = jwt.verify(token,'superkey2023')
        console.log(data);//to get login acno -{{ loginAcno: '11', iat: 1687337974 }}
        req.currentAcno=data.loginAcno
        next();

    }
    catch{
res.status(404).json({message:"please login first"})
    }
   
}

//register
server.post('/register',(req,res)=>{
    console.log('Inside the register');
    console.log(req.body);
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
 // res.send('register request received');
 res.status(result.statusCode).json(result);//send to the client
    })
   
})

//login
server.post('/login',(req,res)=>{
    console.log("Inside the login api");
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client
    })
})
//balance enquiry
server.get('/balance/:acno',routerMiddleware,(req,res)=>{
    console.log('inside the balace api');
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client
    })
})
//fund transfer
server.post('/fundtransfer',routerMiddleware,(req,res)=>{
    console.log('inside the fund transfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result);//send to the client
    })
})

//get transcation
server.get('/transcation/:currentacno',routerMiddleware,(req,res)=>{
    console.log("Inside the transcation api",req.body.currentacno);
    logic.getTranscation(req.params.currentacno).then((result)=>{
    res.status(result.statusCode).json(result);
    })
})

//delete user account
server.delete('/deleteaccount',routerMiddleware,(req,res)=>{
    console.log('inside the delete api call');
    logic.deleteuseraccount(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result);//send to the client
    })
})