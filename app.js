const express = require("express")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(express.json());


mongoose.connect("mongodb+srv://Thyagaraajan:rajurath@cluster0.o15jq.mongodb.net/ZeroDown?retryWrites=true&w=majority",{useNewUrlParser:true});


const finalSchema = new mongoose.Schema({
    City:String,
    State:String,
    Zip:String,
    Places_Of_Worship: Number,
    Convention_Centers_Fairgrounds:Number,
    Cruise_Line_Terminals:Number,
    Major_Sport_Venues:Number,
    Mobile_Home_Parks:Number,
    location:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
  });

const Final = new mongoose.model("Final",finalSchema);

app.get("/calculateScore/:city",(req,res)=>{
    console.log(req.params.city);
    const city = req.params.city;

    Final.find({City:city},(err,results)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
            let details = [0,0,0,0,0];

            let score = 0

            for(let i=0;i<results.length;i++){
                score+=(results[i].Places_Of_Worship*30 + results[i].Convention_Centers_Fairgrounds*20 +results[i].Cruise_Line_Terminals*100+results[i].Major_Sport_Venues*80+results[i].Mobile_Home_Parks*20);
                details[0]+=results[i].Places_Of_Worship;
                details[1]+=results[i].Convention_Centers_Fairgrounds;
                details[2]+=results[i].Cruise_Line_Terminals;
                details[3]+=results[i].Major_Sport_Venues;
                details[4]+=results[i].Mobile_Home_Parks
            }

            console.log(score)
            console.log(details)
            return res.send({score:score,plotDetails:details});
        }
    })
});


app.get("/",(req,res)=>{

    Final.find({},(err,records)=>{
        if(err){
            console.log(err)
        }else{
            console.log(records);
        }  
    })
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"))
}

app.listen(8080|| process.env.PORT,()=>{
    console.log("server is running at 8080")
})