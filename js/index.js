document.addEventListener("DOMContentLoaded", () => {
    const currentTempInCelsius = document.querySelector(".show-temperature");
    const apiKey = "a9573fb89158f89d83ceea2936963385";
    const mainDiv = document.querySelector(".main");
    const currentCity = document.querySelector(".city");
    const currentCountry = document.querySelector(".country");
    const weatherIcon = document.querySelector(".weather-pic")
    const weatherDiscription = document.querySelector(".weather-temp-description");
    const feelsLikeTemperature = document.querySelector(".feels-like")
    const humidity = document.querySelector(".humidity")
    const wind = document.querySelector(".wind");
    let celsiusTemperature = null;
    const forecastElement = document.querySelector(".forecast");
    let forecastData = [];

    setCity();
    groupEvents();
    getCurrentLocation();

    function getStorageTemperarure() {
        return localStorage.getItem("temperature");
    }

    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(getPosition);
    }

    function groupEvents() {
        let buttonCurrentLocation = document.querySelector(".current-position");
        buttonCurrentLocation.addEventListener("click", () => {
            getCurrentLocation()
        });
    }

    function setCity() {
        let inputSearch = document.querySelector(".input-search");
        let btnSearch = document.querySelector(".btn-search");
        inputSearch.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                let inputValue = inputSearch.value.toLowerCase();
                inputSearch.value = "";
                let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`
                getAxiosUrl(apiUrl);
            }

        })
        btnSearch.addEventListener("click", function () {
            let inputValue = inputSearch.value.toLowerCase();
            inputSearch.value = "";
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`;
            getAxiosUrl(apiUrl);

        });
    }

    function getCurrentTemperature(response) {
        celsiusTemperature = Math.floor(response.data.main.temp);
        currentTempInCelsius.innerText = `${celsiusTemperature}°`;
    }

    function changeBackground(response) {
        let [weatherCondition] = response.data.weather;
        let weatherConditionLowercase = weatherCondition.main.toLowerCase()
        let currentWeatherCondition = weatherConditionsBg[weatherConditionLowercase];
        mainDiv.style.backgroundImage = currentWeatherCondition;
        weatherIcon.src = conditionsIcons(weatherConditionLowercase);
        weatherDiscription.innerText = weatherCondition.main;
    }

    function getWeatherInfo(response) {
        let feelsLikeCurrentTemp = Math.floor(response.data.main.feels_like);
        let windSpeed = Math.floor(response.data.wind.speed);

        feelsLikeTemperature.innerText = `${feelsLikeCurrentTemp}°`;
        humidity.innerText = `${response.data.main.humidity}%`;
        wind.innerText = `${windSpeed} km/h`;

    }

    function getPosition(position) {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;
        getAxiosUrl(apiUrl);

    }

    function displayForecast(coordinates) {
        let apiKey = "0df6a9dd1987o3afdebba40233td58aa";
        let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.lon}&lat=${coordinates.lat}&key=${apiKey}&units=metric`;

        axios.get(apiUrl).then((response)=>{
            forecastData = response.data.daily;
            displayForecastHTML();

        });


    }

    const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
        keyboard: false
    })


    function setCurrentCity(response) {
        currentCity.innerText = `${response.data.name}, `;
        currentCountry.innerText = response.data.sys.country;
    }

    const weatherConditionsBg = {
        clear: "url('./images/clear-sky.jpg')",
        clouds: "url('./images/clouds.jpg')",
        rain: "url('./images/shower-rain2.jpg')",
        drizzle: "url('./images/rain-drops.jpg')",
        thunderstorm: "url('./images/lightning.jpg')",
        snow: "url('./images/snowing.jpg')",
        mist: "url('./images/mist.jpg')",
    }

    function conditionsIcons(icon) {
        let descriptionToLowercase = icon.toLowerCase();
        let iconUrl = "";
        switch (descriptionToLowercase) {
            case "clear":
            case "clear-sky-day":
                iconUrl = "./images/sunny.png";
                break;
            case "few-clouds-day":
                iconUrl = "./images/cloudy-sun.png";
                break;
            case "clouds":
            case "broken-clouds-day":
            case "scattered-clouds-day":
                iconUrl = "./images/clouds.png";
                break;
            case "rain":
            case"shower-rain-day":
                iconUrl = "./images/rain.png";
                break;
            case "drizzle":
            case "rain-day":
                iconUrl = "./images/drizzle.png";
                break;
            case "thunderstorm":
            case "thunderstorm-day":
                iconUrl = "./images/clouds.png";
                break;
            case  "snow":
            case "snow-day":
                iconUrl = "./images/clouds.png";
                break;
            case "mist":
            case "mist-day":
                iconUrl = "./images/clouds.png";
                break;

        }
        return iconUrl
    }


    function convertDays(miliseconds) {
        let date = new Date(miliseconds * 1000);
        let day = new Intl.DateTimeFormat("en-US", {weekday: "short"}).format(date);
        return day
    }

    function displayForecastHTML() {

        let forecastHTML = "";
        forecastData.forEach(function (forecastDay) {
            forecastHTML += `<div class="col-1 forecast-item ">
                        <div class="forecast-item-day">
                            <p>${convertDays(forecastDay.time)}</p>
                        </div>
                        <div class="forecast-item-icon">
                            <img src="${conditionsIcons(forecastDay.condition.icon)}" alt="">
                        </div>
                        <div class="forecast-item-temp-max">
                            <p>${toggleTemperature(forecastDay.temperature.maximum)} °</p>
                        </div>
                        <div class="forecast-item-temp-min">
                            <p>${toggleTemperature(forecastDay.temperature.minimum)} °</p>
                        </div>
                    </div>`;

        })

        forecastElement.innerHTML = forecastHTML;

    }


    function getAxiosUrl(apiUrl) {
        axios.get(apiUrl).then((response) => {
            getCurrentTemperature(response);
            setCurrentCity(response);
            changeBackground(response);
            getWeatherInfo(response);
            displayForecast(response.data.coord);

            if(getStorageTemperarure() === "fahrenheit"){
                displayFahrengeit();
            }
        })
            .catch(function (error) {
                myModal.show()
            })
    }

    function displayFahrengeit() {
        let fahrengeitTemperature = conversionFahrenheit(celsiusTemperature)
        currentTempInCelsius.innerText = `${fahrengeitTemperature}°`;
        celsiusElement.classList.remove("active-convert");
        fahrenheitElement.classList.add("active-convert");
        displayForecastHTML()
    }

    function displayCelsius() {
        currentTempInCelsius.innerText = `${celsiusTemperature}°`;
        celsiusElement.classList.add("active-convert");
        fahrenheitElement.classList.remove("active-convert");
        displayForecastHTML()
    }

    let fahrenheitElement = document.querySelector(".fahrenheit");
    fahrenheitElement.addEventListener("click", ()=>{
        localStorage.setItem("temperature","fahrenheit");
        displayFahrengeit()
    })
    let celsiusElement = document.querySelector(".celsius");
    celsiusElement.addEventListener("click", ()=>{
        localStorage.setItem("temperature","celsius")
        displayCelsius()
    });

    function conversionFahrenheit(num) {
        return Math.round((num * 9 / 5) + 32);
    }

    function conversionCelsius(num) {
        return Math.round(num)
    }

    function toggleTemperature(number) {

        if(getStorageTemperarure() === "fahrenheit"){
            return conversionFahrenheit(number)
        } else {
            return conversionCelsius(number)
        }

    }

})
