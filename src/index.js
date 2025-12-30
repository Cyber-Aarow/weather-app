import './main.css';

let location = 'london';

async function getWeather(location){
    try {
        const weather = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=29GQTWHF9EU6UHLVPZKEFH43C`);
        const weatherData = await weather.json();
        console.log(weatherData);
    } catch (error) {
        console.log(error);
    }
}

getWeather(location);