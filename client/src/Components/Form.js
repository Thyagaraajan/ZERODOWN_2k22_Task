import { Fragment,useState } from "react";
import "./Form.css"
import PieChart from "./PieChart";

const Form = ()=>{

    const [showScore,setShowScore]  = useState(false);
    const [score,setScore]  = useState({score:0,details:[]}); 
    const [city,setCity ] = useState("");

    const scoreHandler = async()=>{
        
        const score = await fetch("/calculateScore/"+city).then(response => response.json());
        console.log(score);
        setScore({
            score:score.score,
            details:[
                { place:'Places of Worship', value:score.plotDetails[0] },
                { place:'Convention Centers', value:score.plotDetails[1]},
                { place:'Cruise Line Terminal', value:score.plotDetails[2]},
                { place:'Major Sport Venues', value:score.plotDetails[3]},
                { place:'Mobile Home Parks', value:score.plotDetails[4]},
            ]
        });
        setShowScore(true)
    }

    const cityHandler = (e)=>{
        console.log(e.target.value)
        const city = e.target.value;
        setCity(city);
    }

    return (
        <Fragment>
            <div className="form">
                <div className="city">
                    <input type="text" placeholder="Enter the City" onChange={cityHandler} value={city}></input>
                </div>
                {showScore && <div className="score">Score is {score.score}</div>}
                {showScore && <PieChart data ={score.details} city={city}/>}
                {!showScore && <div className="button"><button onClick={scoreHandler}>View Score</button></div>}
            </div>
        </Fragment>
    )
}

export default Form;