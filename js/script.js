"use strict";
const ip =  window.location.hostname;
const api ="http://" +  ip + ":5000"
const endpoint = "/aquastats/api/v1/"
const apiConnection = api + endpoint

const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);


const listenToHamburgerMenu = function(){

    console.log(document.querySelector(".js-nav__hamburger-checkbox").checked);
    if(document.querySelector(".js-nav__hamburger-checkbox").checked){
        document.querySelector(".js-nav__hamburger-slider").classList.add("c-nav__hamburger-menu");
        document.querySelector(".js-nav__hamburger-slider").classList.remove("u-hidden");
        document.querySelector('.js-nav__hamburger-slider').style.opacity = "";
        
    }
    else{
        
        document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");  
        document.querySelector(".js-nav__hamburger-slider").classList.remove("c-nav__hamburger-menu");  
    }

}

const showChart = function(jsonData){
    const colors = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)']
    const borders = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)']
    let dates = []
    let values = []
    jsonData.readings.forEach(element => {
        dates.push(element.Datum)
    });
    jsonData.readings.forEach(element => {
        values.push(element.Waarde)
    });
    let id = jsonData.readings[1].DeviceID;
    const ctx = document.getElementById('myChart' + String(jsonData.readings[1].DeviceID)).getContext("2d");
    const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: 'Waarde',
            data: values,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: borders[id-4],
            borderWidth: 2
        }]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                },
                scaleLabel: {
                    display: true,
                    labelString: jsonData.readings[1].Eenheid
                },
            }]
        }
    }
});

}

const listenToSocket = function(){

    socketio.on("B2F_verandering_data", getSensors)

};

const callbackDates = function(jsonData){

    console.log(jsonData);
    

    

};

const getSensors = function(){
    console.log(apiConnection)
    // handleData(apiConnection + "5dates", callbackDates);
    handleData(apiConnection + `last-five-readings/4`, showChart);
    handleData(apiConnection + `last-five-readings/5`, showChart);
    handleData(apiConnection + `last-five-readings/6`, showChart);
};

const init = function() {
    console.log("it works")
    
    document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");
    document.querySelector(".js-nav__hamburger-checkbox").addEventListener("click", listenToHamburgerMenu);
    getSensors();
    listenToSocket();

    
};

document.addEventListener("DOMContentLoaded", init);