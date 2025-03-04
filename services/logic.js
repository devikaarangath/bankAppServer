//create logic for api call

//import db
const db = require('./db')

//import jwt token
const jwt= require('jsonwebtoken')

//Register logic

const register =(acno,username,password)=>{
    console.log("Inside the register function");

    return db.User.findOne({acno}).then((response)=>{
        console.log(response);

        if(response){
            //if acno is already registered
            return{
                statusCode:401,
                message:"User already registered"
            }
        }
        else{
            //if acno is not present in mongodb then create a new one
            const newUser =new db.User({
                acno,
                username,
                password,
                balance:2000,
                transaction:[]
            })
            //to store new user in mongodb
            newUser.save()
            //send response to the client
            return{
                statusCode:200,
                message:"User registered successfully"
            }
        }
    })


    
    

}
//login logic
const login=(acno,password)=>{
    console.log("inside login function")
    return db.User.findOne({acno,password}).then((result)=>{
        if(result){//acno is present in mongodb
            //generation of token
            const token = jwt.sign({
                loginAcno:acno
            },'superkey2023')
            return{//response sends to the client
                statusCode:200,
                message:"Login successful",
                currentUser:result.username,
                token,
                currentAcno:acno
            }
        }
        else{
            //acno is not present in mongodb
            return{
                statusCode:401,
                message:"Invalid data"
            }
        }
    })
}

//get balance logic
const getBalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){//acno is present in mongodb
            return{//response sends to the client
                statusCode:200,
                balance:result.balance//2000
            }
        }
        else{//acno is not present in mongodb
            return{
                statusCode:401,
                message:"Invalid Account Number"
            }
        }
        
    }
)}
//fund transfer
const fundTransfer=(fromAcno,toAcno,amt)=>{
    //convert amt to number
    let amount = parseInt(amt)
    //check fromAcno in mongodb
    return db.User.findOne({acno:fromAcno}).then((debit)=>{
     if(debit){//acno is present in mongodb
        //to check toAcno in mongodb
        return db.User.findOne({acno:toAcno}).then((credit)=>{
            if(credit){//credit is present in mongodb
              if(debit.balance>=amount){
                debit.balance=debit.balance-amount
                //to update transaction details in transaction[]
                debit.transaction.push({
                    type:'Debit',
                    amount,
                    fromAcno,
                    toAcno

                })
                //save changes in mongodb
                debit.save()
                //update in toAcno in transaction 
                credit.balance=credit.balance+amount
                credit.transaction.push({
                    type:'Credit',
                    amount,
                    fromAcno,
                    toAcno
                })
                credit.save()
                return{
                    statusCode:200,
                    message:debit
                }
              }
            }
            else{
                return{
                    statusCode:401,
                    message:"Invalid debit Account number"
                }
             }
        });

     }
     else{
        return{
            statusCode:401,
            message:"Invalid debit Account number"
        }
     }
    })

}
//get transcation details
const getTranscation=(acno)=>{
    //to check acno in mongodb
    return db.User.findOne({acno}).then((result)=>{
    if(result){//complete details of particularvacno
        return{// send transcation detaikls to client
            statusCode:200,
            transaction:result.transaction
        }
    }
    else{
        return{
            statusCode:401,
            message:"Invalid transcation number"
        }
    }
    })

}
//delete user account
const deleteUseraccount =(acno)=>{
    //delete user account from mongodb
return db.User.deleteOne({acno}).then((result)=>{
    return{
        statusCode:200,
        message:"Your account has been deleted"
    }
})

}
module.exports = { 
    register,
    login,
    getBalance,
    fundTransfer,
    getTranscation
}