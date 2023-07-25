// get all the elements from the DOM
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

//Default city when the page Loads
let cityInput = "OPorto";

function defaultData(){
  nameOutput.innerHTML = cityInput;
  fetchWeatherData();
}
defaultData();


//add click event to each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    //change from default to selected city
    cityInput = e.target.innerHTML;

    console.log(cityInput);

    //function responsible for fetching and display all the data from the weather API
    fetchWeatherData();

    //fade out the app
    app.style.opacity = "0";
  });
});

//Add submit event to the form
form.addEventListener("submit", (e) => {
  if (search.value.length == 0) {
    alert("Please type a city name");
  } else {
    //change from default city to the written ciy
    cityInput = search.value;

    console.log(cityInput);

    //function responsible for fetching and display all the data from the weather API
     fetchWeatherData();

    //Remove all text from the input field
    search.value = "";

    //fade out the app
    app.style.opacity = "0";
  }
  //this will prevent the app from reloading after the city name is updated
  e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  //Date is YYYY-MM-DD
  return weekday[new Date(`${year}/${month}/${day}`).getDay()];
}

//Fetch the data and dynamicly add the city name with template literals
function fetchWeatherData() {
  //Real url for the API to get Dat for the chosen city
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=61b0e16070694b6aae1173640232207&q=${cityInput}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      //add the temperature and weather condition to the page
      temp.innerHTML = data.current.temp_c + "&#176";
      console.log(temp.innerHTML);

      conditionOutput.innerHTML = data.current.condition.text;
      console.log(conditionOutput.innerHTML);

      //Get the date and time from the city and extract the day,month, yeard and time into variables
      const date = data.location.localtime; // e.g: [2023, 12, 19 20:59]
      
      console.log("1: " + date);

      //console.log(date.split("-")[2].split(" "));

      const info = date.split("-"); // [2023, 12, 19-20:59]
      const year = info[0];
      const month = info[1];
      const day = info[2].split(" ")[0]; // this will retrieve the day (19)
      const time = info[2].split(" ")[1]; // this will retrieve the time (20:59)
      console.log(year, month, day, time);

      // const year = parseInt(date.substring(0,4));
      // const month = parseInt(date.substring(5,2));
      // const day = parseInt(date.substring(8,2));
      // const time = parseInt(date.substring(11));

      //Reformat the date into something appealing and add it to the page.
      //Original format: 2023-7-21 16:27
      //New format: 2023-7-22 19:28
      dateOutput.innerHTML = `${dayOfTheWeek(
        day,
        month,
        year
      )} ${day}, ${month} ${year}`;
      timeOutput.innerHTML = time;

      //Add the name of city into the page
      nameOutput.innerHTML = data.location.name;

      //Get the corresponding icon url for the weather and extracts it
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );

      //Reformat the icon url to local folder path and add it to the page
      icon.src = "icons/" + iconId;

      //Add the weather details to the page
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";

      //set default time of day
      let timeofDay = "day";

      //get the id for each weather condition
      const code = data.current.condition.code;

      //change to night if its night time in the city
      if (!data.current.is_day) {
        
        timeofDay = "night";
      }

      if (code == 1000) {
        //set the background image to clear if the weather is clear
        //change the background image and button color deppending on the time of day and weather.
        console.log(`${timeofDay}`);
        app.style.backgroundImage = `url(/images/${timeofDay}/clear.jpg)`;

        //change the button by color depending of its day or night
        btn.style.background = "#e5ba92";

        if (timeofDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        app.style.backgroundImage = `url(/images/${timeofDay}/cloudy.jpg)`;
        btn.style.background = "fa6d1b";
        if (timeofDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        app.style.backgroundImage = `url(/images/${timeofDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeofDay == "night") {
          btn.style.background = "#325c80";
        }
      } else {
        app.style.backgroundImage = `url(/images/${timeofDay}/snowy.jpg)`;
        
        btn.style.background = "#4d72aa";
        if (timeofDay == "night") {
          btn.style.background = "#1b1b1b";
        }
      }
      // fade in the page once all is done

      app.style.opacity = "1";
    })
    //if user types a city that doesn't exist, thrown an alert
    
}
