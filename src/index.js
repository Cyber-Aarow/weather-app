import './main.css';

//Left
const cityName = document.querySelector('#city-name');
const mainIcon = document.querySelector('#main-icon');
//Mid
const currentTemp = document.querySelector('#current-temp');
const conditions = document.querySelector('#conditions');
const high = document.querySelector('#high');
const low = document.querySelector('#low');
//Right
const feelsLike = document.querySelector('#feels-like');
const humidity = document.querySelector('#humidity');
const chanceOfRain = document.querySelector('#chance-of-rain');
const uvIndex = document.querySelector('#UV-index');

//Search
const searchButton = document.querySelector('#search-button');
const searchBar = document.querySelector('#search-bar');
const errorsUI = document.querySelector('#errors');

//Scroll
const scroller = document.querySelector('#hours > ul');

let down = false;
let mousePosAtStart = 0;
let scrollPosAtStart = 0;

let location = 'sanfrancisco';
updateWeather();

searchButton.addEventListener('click', (e)=>{
    e.preventDefault();
    if(search()){
        updateWeather();
    }
});

//All scroll events
scroller.addEventListener('mousedown', (e) => {
    down = true;
    mousePosAtStart = e.clientX;
    scrollPosAtStart = scroller.scrollLeft;
    scroller.style.scrollSnapType = 'none';
    e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
    if(!down) return;
    scroller.scrollLeft = scrollPosAtStart - (e.clientX - mousePosAtStart);
});

window.addEventListener('mouseup', () => {
    if(!down) return;
    down = false;
    scroller.style.scrollSnapType = 'x mandatory';
});

//Search function
function search(){
    location = searchBar.value.toLowerCase().replaceAll(" ", '');
    searchBar.value = "";
    if(checkInputError()) return false;
    return true;
}

//The two big ones
async function getWeather(location){
    try {
        const weather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=29GQTWHF9EU6UHLVPZKEFH43C`); //public key; no need to hide for this assignment
        if(checkResponseError(weather)) return;
        const weatherData = await weather.json();
        console.log(weatherData);
        return weatherData;
    } catch (error) {
        handleError('Network Error: Please try again.');
    }
}

async function updateWeather(){
    try {
        const weather = await getWeather(location);
        if(!weather) return;
        displayWeather(weather);
    } catch (error) {
        handleError('Network Error: Please try again.');
    }
}

//Error checker
function checkInputError(){
    if(!location){
        handleError('Please enter a city or location.');
        return true;
    }
    else if(!/^[a-zA-Z\s]+$/.test(location)){
        handleError('Please enter a valid location name.');
        return true;
    }
    return false;
}

function checkResponseError(weather){
    if(!weather.ok){
        if(weather.status === 404 || weather.status === 400){
            handleError('Error: Couldn\'t find that location.');
            return true;
        }
        else if(weather.status >= 500){
            handleError('Error: Weather service currently unavailable.');
            return true;
        }
        else{
            handleError('Error: Something went wrong.');
            return true;
        }
    }
    return false;
}

//Error handler
function handleError(error){
    errorsUI.textContent = error;
}

//All the small ones for easier readability and debugging
function displayCityName(weather){
    let city = weather.resolvedAddress.split(',')[0]; //Make into array of 3; pull 0 (the city name)
    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1); //Make the first letter capital (1-word cities were appearing lowercase)
}

async function displayIcon(iconElement, iconName){
    try {
        const {default: iconLocation} = await import(
            `./icons/${iconName}.svg`
        );
        iconElement.src = iconLocation;
        iconElement.alt = iconName.replaceAll('-', ' ');
    } catch (error) {
        console.error('Icon load failed: ', iconName, error);
    }
}

async function displayMainIcon(weather){
    const iconName = weather.currentConditions.icon;
    await displayIcon(mainIcon, iconName); 
}

function displayCurrentTemp(weather){
    currentTemp.textContent = weather.currentConditions.temp;
}

function  displayConditions(weather){
    conditions.textContent = weather.currentConditions.conditions;
}

function displayHigh(weather){
    high.textContent = weather.days[0].tempmax;
}

function displayLow(weather){
    low.textContent = weather.days[0].tempmin;
}

function displayFeelsLike(weather){
    feelsLike.textContent = weather.currentConditions.feelslike;
}

function displayHumidity(weather){
    humidity.textContent = weather.currentConditions.humidity;
}

function displayChanceOfRain(weather){
    chanceOfRain.textContent = weather.currentConditions.precipprob;
}

function displayUVIndex(weather){
    uvIndex.textContent = weather.currentConditions.uvindex;
}

//Hours
function arrayMapNextHours(weather){
    const now = weather.currentConditions.datetimeEpoch;
    const nextHour = Math.floor(now / 3600) * 3600 + 3600;

    return weather.days
    .flatMap(day => day.hours)
    .filter(hour => hour.datetimeEpoch >= nextHour)
    .slice(0,24);
}

function discernTime(hour){
    let pm = false;
    const num_string = hour.datetime.slice(0,2);
    let num = Number(num_string);

    if(num > 12){
        num = num - 12;
        pm = true;
    }
    else if(num === 0) num = 12;
    
    let time = num + ':00 ';
    if(pm){
        time += 'pm';
    } 
    else{
        time += 'am';
    }
    return time;
}

async function updateHourCard(hourElement, hour){
    const time = hourElement.querySelector('.time');
    const icon = hourElement.querySelector('img');
    const temperature = hourElement.querySelector('.temperature');

    time.textContent = discernTime(hour);
    await displayIcon(icon, hour.icon);
    temperature.textContent = hour.temp;
}

function displayNextHours(weather){
    const nextHours = arrayMapNextHours(weather);
    const hourElements = document.querySelectorAll('.hour');

    nextHours.forEach((hour, i) => {
        const hourCard = hourElements[i];
        updateHourCard(hourCard, hour);
    });
}

//Days
function arrayMapNextWeek(weather){
    return weather.days.slice(1,8);
}

function discernDay(day, timezone){
    return new Date(day.datetimeEpoch * 1000)
    .toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: timezone
    });
}

async function updateDayCard(dayElement, day, timezone){
    const weekday = dayElement.querySelector('.weekday');
    const icon = dayElement.querySelector('img');
    const temperature = dayElement.querySelector('.temperature');

    weekday.textContent = discernDay(day, timezone);
    await displayIcon(icon, day.icon);
    temperature.textContent = day.tempmax;
}

function displayNextWeek(weather){
    const nextWeek = arrayMapNextWeek(weather);
    const dayElements = document.querySelectorAll('.day');

    nextWeek.forEach((day, i) => {
        const dayCard = dayElements[i];
        updateDayCard(dayCard, day, weather.timezone);
    });
}

//Conglomeration of the small ones
function displayWeather(weather){
    displayCityName(weather);
    displayMainIcon(weather);

    displayCurrentTemp(weather);
    displayConditions(weather);
    displayHigh(weather);
    displayLow(weather);

    displayFeelsLike(weather);
    displayHumidity(weather);
    displayChanceOfRain(weather);
    displayUVIndex(weather);

    displayNextHours(weather);
    displayNextWeek(weather);

    handleError("");
}


