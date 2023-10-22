function fetchWeatherForecast() {

    const forecastElement = document.getElementById("w-forecast-table");

    const forcastFiveDays = fetch("https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=fed009a1aaae4078dd039f97e739b932")
        .then(res => res.json())
        .then(resJson => Object.groupBy(resJson.list, r => new Date(r.dt_txt).getDate()))
        .then(resMap => {

            for (const i in resMap) {
                const day = new Date(resMap[i][0].dt_txt).toLocaleString('en-us', { weekday: 'long' }).substr(0, 3)
                const minTemp = Math.round(Math.min(...resMap[i].map(x => x.main.temp_min)) * 10) / 10
                const maxTemp = Math.round(Math.max(...resMap[i].map(x => x.main.temp_max)) * 10) / 10
                const trow = forecastElement.insertRow(-1)
                const cell1 = trow.insertCell(0);
                const cell2 = trow.insertCell(1);
                cell1.innerHTML = `${day}`
                cell2.innerHTML = `${minTemp}&deg/${maxTemp}&deg`
            }
        })
}

function fetchCurrentWeather() {
    const weatherToday = fetch("https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=fed009a1aaae4078dd039f97e739b932")
        .then(res => res.json())
        .then(resJson => {
            const summaryElement = document.getElementById("w-summary");
            const descElement = document.getElementById("w-desc");
            const mainElement = document.getElementById("main-sec")
            const sunrise = new Date(resJson.sys.sunrise * 1000)
            const sunset = new Date(resJson.sys.sunset * 1000)
            const weatherStatus = resJson.weather[0].main.toLowerCase()
            const currentTemp = Math.round(resJson.main.temp * 10) / 10

            const summaryHTML = `
        <p>${weatherStatus} | ${currentTemp} &deg</p>
        <p>sunrise ${sunrise.getHours()}.${sunrise.getMinutes()}</p>
        <p>sunset ${sunset.getHours()}.${sunset.getMinutes()}</p>
        `
            summaryElement.innerHTML = summaryHTML

            if (weatherStatus == "cloudy" || weatherStatus == "clouds") {
                descElement.innerHTML = cloudyDesc
                mainElement.className = "main-cloudy"
            } else if (weatherStatus == "clear") {
                descElement.innerHTML = sunnyDesc
                mainElement.className = "main-sunny"
            } else if (weatherStatus == "rain") {
                descElement.innerHTML = rainyDesc
                mainElement.className = "main-rainy"
            } else {
                descElement.innerHTML = unknownDesc(weatherStatus)
                mainElement.className = "main-cloudy"
            }
        })
}

const sunnyDesc = `
    <img src="noun_Sunglasses_2055147.svg">
    <p>Get your sunnies on. Stockholm is looking rather great today.</p>

`

const rainyDesc = `
    <img src="noun_Umbrella_2030530.svg">
    <p>Don't forget your umbrella. It's wet in Stockholm today.</p>

`

const cloudyDesc = `
    <img src="noun_Cloud_1188486.svg">
    <p>Light a fire and get cosy. Stockholm is looking grey today</p>

`

function unknownDesc(status) {
    return `
    <img src="noun_Cloud_1188486.svg">
    <p>Stockholm is ${status} today</p>
`}

fetchWeatherForecast()
fetchCurrentWeather()