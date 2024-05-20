const express = require("express");
const fs = require("node:fs");

const app = express();

var seconds = 0;
const reqLogging = (req, res, next)=>{
    if(!(req.url).includes("/api/v1/products?")){
        // console.log("Error : 404 : Wrong URL route has been called !");
        // fs.writeFileSync("access.log");
        next(`Error : 404 : Wrong URL route has been called ! \nTime: ${new Date()} \n-------------------------------`);
    }
    else{
        seconds = new Date().getSeconds();
        const logDetails = `Time: ${new Date().toISOString()}
Method: ${req.method}
URL: ${req.url}
Headers: ${JSON.stringify(req.headers)}
Query Params: ${JSON.stringify(req.query)}\n`;
        fs.appendFileSync("access.log",logDetails);
        next();
    }
};

// request headers, parameters, payloads, response status codes, and timestamp
const errorLog = (err,req,res,next)=>{
    console.log(err);
    fs.appendFileSync("access.log",`${err} \n`)
}

app.use(reqLogging);
app.use(errorLog);

app.get("/api/v1/products",(req,res)=>{
    const products = [
        {
            id:1,
            name:"Samsung"
        },
        {
            id:2,
            name:"Apple"
        },
        {
            id:3,
            name:"Redme"
        }
    ]
    try {
        const data = products.find((item)=> item.id == req.query.id );
        console.log("Request is being processed");
        if(!data){
            res.status(404).json({
                status : false,
                message : "Sorry data for given id is not present !"
            })
            console.log("Sorry data is not present !");
        }
        else{
            res.json(data);
            console.log("Response has been sent to client");
            console.log(`Time taken to processed the request : ${seconds}/ms\nClient name : ${req.query.user}`);
            fs.appendFileSync("access.log",
`Time Taken to processed the request : ${seconds}/ms
Status 200 : Response has been sent to client\n-----------------------\n`);
        }
    } 
    catch (error) {
        console.log(error);
    }
})

app.listen(8082,()=>{
    console.log("Server is up and running on port : 8082");
});