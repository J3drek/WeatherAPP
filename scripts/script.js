'use strict'
const container = document.querySelector('.container');
const input = document.querySelector('.input--city');
const topBanner = document.querySelector('.searching');
const icon = document.querySelector('.weather--icon');
const weatherNow = document.querySelector('.weather--today');
const placeholder = document.querySelector('.weather--placeholder');
const confirmBtn = document.querySelector('.BUTTON_CLG');
const forecastPlaceholder = document.querySelector('.weather--pred');

const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

//MAIN CLASS
class Application{
    //CONSTRUCTOR
    constructor(){
        this.backgroundChange();
        this.getCurrentData();
        window.addEventListener('keydown',this.submitInput.bind(this));
        container.addEventListener('click',this.getSearchedData);
        confirmBtn.addEventListener('click',this.submitInput.bind(this)); 
    }
    //Making a promise that resolves your location(latlng), why promise? Because navigator doesn't return anything itself.
    getPosition(){
        return new Promise(function(resolve, reject){
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
    //Getting your location and weather in your location
    async getCurrentData(){
        try{
            const coords = await this.getPosition();
            const { latitude:lat, longitude:lng } = coords.coords;
            const myLocation = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=460119015d4849c9ad6122857222801&q=${lat},${lng}&days=7&aqi=yes&alerts=no`)
            const finalLocation = await myLocation.json();
            placeholder.innerHTML = '';
            forecastPlaceholder.innerHTML = '';            
            this.renderForecast(finalLocation);
            this.renderYouLocationWeather(finalLocation);           
            return finalLocation;
        }catch(e){
            console.error(e);
            throw new Error('error');
        };
    }
    //Changing bg-color depending on time(night-darer, day-brighter)
    async backgroundChange(){
        let res = await this.getCurrentData();
        let isDay = res.current.is_day;
        if(isDay === 0){
            container.classList.add('night--bg');
            topBanner.style.backgroundColor = 'rgba(32,34,51,1)';
        }
        else{
            container.classList.remove('night--bg');
            topBanner.style.backgroundColor = 'rgba(32,34,51,1)'; 
        }  
    }
    WeatherSearch(){
        return fetch(`https://api.weatherapi.com/v1/forecast.json?key=460119015d4849c9ad6122857222801&q=${input.value}&days=7&aqi=yes&alerts=no`).then(response => response.json());
    }
    //Getting input value by pressing enter
    submitInput(key){
        // console.log(key);
        let finalResponse;
        if(key.key === 'Enter' || key.type === 'click'){
            this.WeatherSearch().then(res2 => {
                finalResponse = res2;
                placeholder.innerHTML = '';
                forecastPlaceholder.innerHTML = '';
                this.renderYouLocationWeather(finalResponse);
                this.renderForecast(finalResponse); 
            }).catch(err => {
                console.error(err);
                throw err;
            });
            input.value = '';  
        }
        return;
    }
    //rendering main location
    renderYouLocationWeather(somePlace){
        // let data = await this.getCurrentData();
        const day = new Date();
        placeholder.insertAdjacentHTML('afterbegin',  
        `<div class="weather--today">   
            <div class="title">
                <div class="location">${somePlace.location.name}, ${somePlace.location.country}</div>
                <div class="date">${day.getDate()} ${months[day.getMonth()]} ${day.getFullYear()}</div>
            </div>
            
            <div class="main--data">
                <div id="temperature">${somePlace.current.temp_c.toFixed(0)}°C</div>
                <div id="icon"><img src="${somePlace.current.condition.icon}" alt="" class="weather--icon"></div>
            </div>
            <div class="rest--data">
                ${somePlace.current.condition.text}<br><br>
                Wind: ${somePlace.current.wind_kph} km/h<br>
                atmospheric pressure: ${somePlace.current.pressure_mb}hPa<br>
                humidity: ${somePlace.current.humidity}%<br>
            </div>
        </div>`)
    }
    //insert forecast panels
    renderForecast(item){
        item.forecast.forecastday.forEach(day => {
                forecastPlaceholder.insertAdjacentHTML('beforeend', 
            `<div class="weather--future">
                <div class="date--ft">${day.date}</div>
            <div class="main--data--ft">
                <div id="icon--ft">
                    <img src="${day.day.condition.icon}" alt="" class="weather--icon">
                </div>
                    <div id="temperature--ft">${day.day.avgtemp_c.toFixed(0)}°C</div>
                </div>
            </div>`)
            });
    }
};
const app = new Application();