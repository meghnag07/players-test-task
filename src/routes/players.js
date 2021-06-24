import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import PlaceholderImage from '../assets/images/download.png';
import Moment from 'react-moment';
import 'moment-timezone';

function Players(){
    const [loading, setLoading]= useState(false);
    const [rawplayersList, setRawplayersList]= useState([]);
    const [playersList, setPlayersList]= useState([]);

    //function to sort List by players value
    const sortPlayerByValue=()=>{
        let sortedPlayersList = rawplayersList.sort(function(a, b) {
            return a.Value - b.Value;
        });

        setPlayersList(sortedPlayersList);
    }
    
    //function to search List by player or team name
    const searchPlayer=(e)=>{
        let searchString = e.target.value;
        if(searchString){
            if(searchString.length >= 3){
                let searchedArr = rawplayersList.filter(function(player){
                    let playerName= player.PFName.toLowerCase();
                    let teamName= player.TName.toLowerCase();

                    return playerName.includes(searchString) || teamName.includes(searchString)
                });
                setPlayersList(searchedArr);
            }
        }else{
            sortPlayerByValue();
        }
    }

    useEffect(()=>{
        //fetch List of Players from API
        setLoading(true); //set loading to true
        axios.get("https://api.npoint.io/20c1afef1661881ddc9c",{}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async response => {
            const data = await response.data;
            setLoading(false);  //set loading to False
            setRawplayersList(data.playerList); //set list of players
        }).catch(function (error) {
            setLoading(false); //set loading to False
            console.log(error);
        });
    },[])

    useEffect(()=>{
        if(rawplayersList .length > 0){
            sortPlayerByValue();
        }
    },[rawplayersList])

    return(
        <>
            <main>
            <div className="container mt-3">
                <h3 className="text-center mb-3">Players</h3>   
                <div className="row d-flex align-items-stretch">
                    <div className="col-sm-12 col-md-4 offset-md-8 mb-3">
                            <input className="form-control"
                            placeholder="Search by Player or Team Name"
                            aria-label="Search by Player's Name"
                            aria-describedby="searchBtn"
                            onKeyUp={(e)=>{searchPlayer(e)}}
                            />
                            {/* <button className="btn btn-outline-secondary" id="searchBtn" onclick={searchPlayer}>Search</button> */}
                    </div>
                    {
                        playersList &&
                        playersList.map(player => {
                            return (
                                <div key={player.Id} className="col-sm-6 col-md-4 col-lg-3 align-self-stretch h-100 mb-3">
                                    <div className="card h-100">
                                        <div className="text-center">
                                            <img className="img-fluid" 
                                                src={window.location.origin +"/img/player-images/"+player.Id+".jpg"} 
                                                onError={(e)=>e.target.src=PlaceholderImage}
                                            />
                                        </div>
                                        <div className="card-body">
                                            <h4>{player.PFName}</h4>
                                            <h5 className="mb-2 text-muted">${player.Value}</h5>
                                            <p className="mb-1"> <strong>Skill: </strong>{player.SkillDesc}</p>
                                            {
                                                player.UpComingMatchesList[0].CCode && 
                                                player.UpComingMatchesList[0].VsCCode &&
                                                <div>
                                                    <p className="mt-1">
                                                        <strong>Upcoming Match: </strong> 
                                                        {player.UpComingMatchesList[0].CCode} vs {player.UpComingMatchesList[0].VsCCode}
                                                    </p>
                                                    <Moment format="DD-MM-YYYY h:mm:ss a" local >
                                                        {player.UpComingMatchesList[0].MDate + " GMT+0000"}
                                                    </Moment>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            </main>
        </>
    )
}

export default withRouter(Players);