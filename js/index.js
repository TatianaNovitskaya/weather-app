let currentTempInCelsius = document.querySelector(".show-temperature");
let apiKey = "a9573fb89158f89d83ceea2936963385";

let currentCity = document.querySelector(".city");
let currentCountry = document.querySelector(".country");

function setCity() {
  let inputSearch = document.querySelector(".input-search");
  let btnSearch = document.querySelector(".btn-search");
  inputSearch.addEventListener("keyup", (e)=>{
    if(e.key === "Enter"){
      let inputValue = inputSearch.value.toLowerCase();
      inputSearch.value = "";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`
      getAxiosUrl(apiUrl);
    }


  })
  btnSearch.addEventListener("click", function () {
    let inputValue = inputSearch.value.toLowerCase();
    let cityFirstLetterUpper =
      inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    inputSearch.value = "";
    currentCity.innerText = `${cityFirstLetterUpper}`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityFirstLetterUpper}&units=metric&appid=${apiKey}`;
    getAxiosUrl(apiUrl);
  });
}
setCity();

function getCurrentTemperature(response) {
  let newCurrentTemperature = Math.floor(response.data.main.temp);
  currentTempInCelsius.innerText = newCurrentTemperature;
}
function getPosition(position) {
  let currentLatitude = position.coords.latitude;
  let currentLongitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${currentLatitude}&lon=${currentLongitude}&appid=${apiKey}&units=metric`;
  getAxiosUrl(apiUrl);
}

function getAxiosUrl(apiUrl) {
  axios.get(apiUrl).then((response) => {
    getCurrentTemperature(response);
    setCurrentCity(response);
  });
}

navigator.geolocation.getCurrentPosition(getPosition);

function setCurrentCity(response) {
  currentCity.innerText = `${response.data.name}, `;
  currentCountry.innerText = response.data.sys.country;
}

let buttonCurrentLocation = document.querySelector(".current-position");
buttonCurrentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(getPosition);
});
