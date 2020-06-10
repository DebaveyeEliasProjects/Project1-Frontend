"use strict";
const ip =  window.location.hostname;
const api ="http://" +  ip + ":5000"
const endpoint = "/aquastats/api/v1/"
const apiConnection = api + endpoint

const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);
let charts = []
var controlChart    
let dropdown;


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

    if(jsonData.readings[0].Eenheid == "Ph"){
            
        if(values[0]>7.6){

            $.notify("pH is too high. Add pHMin");

        }
        else if(values[0] < 7.2){
            $.notify("pH is too low. Add pHPlus");
        }
        else{
            $.notify("pH is in optimal range", {className:"success"});
        }

    }
    if(jsonData.readings[0].Eenheid == "mV"){
            
        if(values[0]>750){

            $.notify("ORP is too high. Don't add chlorine for some days.");

        }
        else if(values[0] < 600){
            $.notify("ORP is too low. Add chlorine");
        }
        else{
            $.notify("ORP is in optimal range!", {className:"success"});
        }
    }
    if(jsonData.readings[0].Eenheid == "Degrees"){
            
        if(values[0]>29){

            $.notify("Temperatur is too high. Let it cool down  ");

        }
        else if(values[0] < 28){
            $.notify("Temperature is too low. Make it hot again");
        }
        else{
            $.notify("Temperature is in optimal range", {className:"success"});
        }

    }
    let id = jsonData.readings[0].DeviceID;
    charts[(jsonData.readings[0].DeviceID)-4].data.datasets[0].data = values;
    charts[(jsonData.readings[0].DeviceID)-4].data.labels = dates;
    charts[(jsonData.readings[0].DeviceID)-4].options.scales.yAxes[0].scaleLabel.labelString = jsonData.readings[0].Eenheid;
    charts[(jsonData.readings[0].DeviceID)-4].update();
}

const showChartsForDate = function(jsonData){

    try{
        console.log(jsonData);
        const colors = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)']
        const borders = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)']
        let dates = []
        let values = []
        jsonData.readings.forEach(element => {
            dates.push(element.Datum)
        });

        let sum = 0
        jsonData.readings.forEach(element => {
            values.push(element.Waarde)
            sum += element.Waarde;
        });
        let id = jsonData.readings[0].DeviceID;
        let avg = sum / values.length;
        if(jsonData.readings[0].Eenheid == "Ph"){
            
            if(avg>7.6){
    
                $.notify("pH was too high for this date");
    
            }
            else if(avg < 7.2){
                $.notify("pH is was too low for this date");
            }
            else{
                $.notify("pH is was in optimal range", {className:"success"});
            }
    
        }
        if(jsonData.readings[0].Eenheid == "mV"){
                
            if(avg>750){
    
                $.notify("ORP was too high");
    
            }
            else if(avg < 600){
                $.notify("ORP was too low");
            }
            else{
                $.notify("ORP was in optimal range!", {className:"success"});
            }
        }
        if(jsonData.readings[0].Eenheid == "Degrees"){
                
            if(avg>29.0){
    
                $.notify("Temperatur was too high");
    
            }
            else if(avg < 26.0){
                $.notify("Temperature was too low");
            }
            else{
                $.notify("Temperature was in optimal range", {className:"success"});
            }
    
        }

        //const ctx = document.getElementById('myChart' + String(jsonData.readings[0].DeviceID)).getContext("2d");
        charts[(jsonData.readings[0].DeviceID)-4].data.datasets[0].data = values;
        charts[(jsonData.readings[0].DeviceID)-4].data.labels = dates;
        charts[(jsonData.readings[0].DeviceID)-4].options.scales.yAxes[0].scaleLabel.labelString = jsonData.readings[0].Eenheid;
        charts[(jsonData.readings[0].DeviceID)-4].update();
    }
    catch{
        console.log("error")
        window.scrollTo(-50, 0);   
        document.querySelector(".js-error").style.display = "flex"
        document.querySelector(".body").classList.add("u-disable_overflow");
        for(let i = 0; i<3; i++){
            charts[i].data.datasets[0].data = [null];
            charts[i].data.labels = [null];
            charts[i].options.scales.yAxes[0].scaleLabel.labelString = "";
            charts[i].update();
        }
    }
};

const getSensorsForDate = function(date){   
        handleData(apiConnection + `readings/${date}/4`, showChartsForDate);
        handleData(apiConnection + `readings/${date}/5`, showChartsForDate);
        handleData(apiConnection + `readings/${date}/6`, showChartsForDate);
        
}

const initCharts = function(){  
    const borders = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)']
    for(let i = 0; i<3; i++){
        const canvas = document.querySelector("#myChart" + (i+4)).getContext("2d")
        const chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: null,
                datasets: [{
                    label: 'Reading',
                    data: null,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: borders[i],
                    borderWidth: 2
                }]
            },
            options: {
                "horizontalLine": [{
                    "y": 4.2,
                    "style": "rgba(255, 0, 0, .4)",
                    "text": "max"
                  }, {
                    "y": 4.32,
                    "style": "#00ffff",
                    "text": "min"
                  }],
                legend: {
                    display: true,
                    labels: {
                        fontFamily: 'Raleway'
                    }
                },
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ""
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }]
                }
            }
        });
            if(charts.length != 3){
                charts.push(chart);
            }

    }

}

const listenToSocket = function(){

    socketio.on("B2F_verandering_data", getSensors)

};

const listenToControlSocket = function(){
    socketio.on("B2F_self_control", function(data){
        console.log(data)
        controlChart.data.datasets[0].data = [data.ph];  
        controlChart.data.datasets[1].data = [data.orp]; 
        controlChart.data.datasets[2].data = [data.degrees];
            if(data.ph>7.6){
    
                $.notify("pH is too high. Add pHMin");
    
            }
            else if(data.ph < 7.2){
                $.notify("pH is is too low. Add pHPlus");
            }
            else{
                $.notify("pH is is in optimal range", {className:"success"});
            }      

            if(data.orp>750){
    
                $.notify("ORP is too high. Don't add chlorine for some days.");
    
            }
            else if(data.orp < 600){
                $.notify("ORP is is too low. Add chlorine");
            }
            else{
                $.notify("ORP is is in optimal range!", {className:"success"});
            } 

            if(data.degrees>29){
    
                $.notify("Temperatur is too high. Let it cool down  ");
    
            }
            else if(data.degrees < 28){
                $.notify("Temperature is is too low. Make it hot again");
            }
            else{
                $.notify("Temperature is is in optimal range", {className:"success"});
            }
    
        controlChart.update();
    })
};

const listenToDropdown = function(){

    dropdown.addEventListener('change', function(){

        let value = dropdown.options[dropdown.selectedIndex].value;
        getSensorsForDate(value);

    });

};

const listenToConnectButton = function(){
    document.querySelector(".js-connection_button").addEventListener('click', function(){
        let ssid = document.querySelector(".js-ssid").value;
        let password = document.querySelector(".js-password").value;    
        socketio.emit("F2B_connection_wifi", {"ssid":ssid, "password":password})
    })
    
};


const showdates = function(jsonData){

    
    let html = ``;
    jsonData.dates.forEach(element => {
        html += `<option value="${element}">${element}</option>`;     
    });
    dropdown.innerHTML += html;
    listenToDropdown();
};

const getSensors = function(){
    handleData(apiConnection + `last-five-readings/4`, showChart);
    handleData(apiConnection + `last-five-readings/5`, showChart);
    handleData(apiConnection + `last-five-readings/6`, showChart);
    
};

const getDates = function(){

    handleData(apiConnection + `dates`, showdates);

};

const initControlChart = function(){
    const borders = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)']

    const canvas = document.querySelector("#myChart").getContext("2d")
    const chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ["Messurement"],
            datasets: [{
                yAxisID: 'A',
                label: 'Acidity',
                data: null,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: borders[0],
                borderWidth: 2
            },{
                yAxisID: 'B',
                label: 'Oxidation',
                data: null,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: borders[1],
                borderWidth: 2
            },{
                yAxisID: 'C',
                label: 'Temperature',
                data: null,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: borders[2],
                borderWidth: 2
            }]
        },
        options: {
            legend: {
                display: true,
                labels: {
                    fontFamily: 'Raleway'
                }
            },
            responsive: true,
            scales: {
                yAxes: [{
                    id:'C',
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Degrees"
                    },
                    
                },{
                    id:'B',
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "mV"
                    },
                },{
                    id:'A',
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "pH"
                    },
                }]
            }
        }
    });
    controlChart = chart;
    listenToControlSocket();

};

const controlButtonPressed  = function(){
    if(!document.querySelector(".js-control__button").classList.contains("c-button__disabled")){
        
        socketio.emit("F2B_ButtonPressed");
        document.querySelector(".js-status").innerHTML =" Currently messuring water";
        document.querySelector(".js-control__button").classList.add("c-button__disabled")
        socketio.on("B2F_pump_change", function(data){

            console.log(data);
            document.querySelector(".js-status").innerHTML =" No messurements active";
            document.querySelector(".js-control__button").classList.remove("c-button__disabled")

        });
    }
    
};

const getDate = function(){

    let value = document.querySelector(".js-date").value
    getSensorsForDate(value);

};

const clickedOnLast5 = function(){

    getSensors();

};

const hideErrorMessage = function(){

    document.querySelector(".js-error").style.display = "none"
    document.querySelector(".body").classList.remove("u-disable_overflow");
    getSensors();

};

const init = function() {
    if(document.querySelector('.js-main')){
        initCharts();
        console.log("it works");
        $.notify.defaults({position:"right bottom", className:"error",showDuration: 400, autoHideDelay: 10000})
       
        dropdown = document.querySelector(`.js-date_selector`);
        document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");
        document.querySelector(".js-nav__hamburger-checkbox").addEventListener("click", listenToHamburgerMenu);
        document.querySelector(".js-date").addEventListener("change", getDate)
        document.querySelector(".js-last5").addEventListener("click", clickedOnLast5)
        document.querySelector(".js-error__close").addEventListener("click", hideErrorMessage)
        //getDates();
        getSensors();
        listenToSocket();
        document.querySelector(".js-error").style.display = "none"
    }
    if(document.querySelector('.js-control')){
        $.notify.defaults({position:"right bottom", className:"error",showDuration: 400,autoHideDelay: 10000})
        document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");
        document.querySelector(".js-nav__hamburger-checkbox").addEventListener("click", listenToHamburgerMenu);
        console.log("controlpage")
        initControlChart();
        
        document.querySelector(".js-control__button").addEventListener("click", controlButtonPressed)
    }
    if(document.querySelector(".js-information")){
        document.querySelector(".js-nav__hamburger-slider").classList.add("u-hidden");
        document.querySelector(".js-nav__hamburger-checkbox").addEventListener("click", listenToHamburgerMenu);
        listenToConnectButton();
    
    
    }
};

document.addEventListener("DOMContentLoaded", init);