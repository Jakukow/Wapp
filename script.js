const Weather = {
  temperature: 0,
  dailyTemp: [],
  weeklyTemp: [],
  location: "",
  date: "",
  active: "Today",
};

const location = document.querySelector(".location-name");
const dateDisplay = document.querySelector(".date");
const mainTemp = document.querySelector(".main-temp");
const mainIcon = document.querySelector(".weather-icon");
const marker = document.querySelector("#marker");
const item = document.querySelectorAll("nav a");
const searchInput = document.querySelector(".search__field");
const searchButton = document.querySelector(".search__btn");
const futureDisplay = document.querySelector(".small-disp");

function indicator(e) {
  marker.style.left = e.offsetLeft + "px";
  marker.style.width = e.offsetWidth + "px";
}
item.forEach((link) => {
  link.addEventListener("click", (e) => {
    indicator(e.target);
    if (e.target.textContent === Weather.active) return;
    else {
      Weather.active = e.target.textContent;
      console.log(e.target.textContent);
      changeMarkup();
    }
  });
});
indicator(item[0]);

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (!searchInput.value) return;
  const key = searchInput.value;
  searchInput.value = "";
  GetUrl(key);
});
const getData = async function (url, options, key) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const todayDate = new Date().toJSON().slice(0, 14);
    assignData(result.forecast.items, todayDate, key);
  } catch (error) {
    console.error(error);
  }
};
const assignData = function (result, date, key) {
  const dailyForecast = result.slice(2, 26);

  const weeklyForecast = [];
  const todayTemperature = dailyForecast.find((el) => el.date.includes(date));

  let l = 0;
  for (let step = 0; step < 7; step++) {
    ///?? jak zamienic fora
    weeklyForecast.push(result[26 + l]);
    l = l + 22;
  }
  (Weather.temperature = todayTemperature), (Weather.location = key);
  Weather.dailyTemp = dailyForecast;
  Weather.weeklyTemp = weeklyForecast;
  dayFormat();
  ChangeDisplay();
};
const GetUrl = function (key) {
  const url = `https://forecast9.p.rapidapi.com/rapidapi/forecast/${key}/hourly/`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "fe95829ccbmsh01559489080330fp1ac769jsneffb2f977d2d",
      "X-RapidAPI-Host": "forecast9.p.rapidapi.com",
    },
  };
  getData(url, options, key);
};
const dayFormat = function () {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(new Date().toJSON().slice(0, 10));
  const dayName = days[d.getDay()];
  const monthName = monthNames[d.getMonth()];
  const dayNumber = d.getDate();
  const stringDate = `${dayName}, ${dayNumber} ${monthName}`;
  return (Weather.date = stringDate);
};
const ChangeDisplay = function () {
  location.textContent = Weather.location.toUpperCase();
  dateDisplay.textContent = Weather.date;
  mainTemp.textContent = Weather.temperature.temperature.avg + "°";
  mainIcon.src = `${Weather.temperature.weather.text}.svg`;
  smallDisplay();
  indicator(item[0]);
  Weather.active = "Today";
};

const smallDisplay = function () {
  futureDisplay.innerHTML = "";
  Weather.dailyTemp.map((x) => {
    console.log(x);
    const markup = `<div class="small-disp-single">
    <span class="small-date">${x.date.slice(11, 16)}</span>
    <img class="small-we" src="${x.weather.text}.svg" />
    <span class="small-temp">${x.temperature.avg}°</span>
  </div>`;
    futureDisplay.insertAdjacentHTML("beforeend", markup);
  });
};
const smallDisplayWeek = function () {
  futureDisplay.innerHTML = "";
  Weather.weeklyTemp.map((x) => {
    const markup = `<div class="small-disp-single">
  <span class="small-date">${x.date.slice(8, 10)}.${x.date.slice(5, 7)}</span>
  <img class="small-we" src="${x.weather.text}.svg" />
  <span class="small-temp">${x.temperature.avg}°</span>
</div>`;
    futureDisplay.insertAdjacentHTML("beforeend", markup);
  });
};

const changeMarkup = function () {
  if (Weather.active === "Today") smallDisplay();
  if (Weather.active === "Weekly") smallDisplayWeek();
};
