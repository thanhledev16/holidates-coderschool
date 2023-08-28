const API_KEY = "6e8f863f-064f-4e67-834b-4cbaaf3d45ab";
const holidayURL = `https://holidayapi.com/v1/holidays?pretty=true&key=${API_KEY}`;
let allCountriesList;
let allLanguagesList;
let allHolidaysList;
let onlyHolidayInput = false;
let defaultCountry = "VN";

let showCountriesListButton = document.getElementById("countries-list-btn");
let showLanguagesListButton = document.getElementById("languages-list-btn");
let showHolidaysListButton = document.getElementById("holidays-btn");

// Section 1: Render Country List

// Fetch The Country List From The API
const getCountries = async () => {
  try {
    const countryURL = `https://holidayapi.com/v1/countries?pretty=true&key=${API_KEY}`;
    const res = await fetch(countryURL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

getCountries(); // Check Respone True or False

//Create 'Li' HTML And Render List Of Countries
function createLiHtml(targetList, ulList) {
  targetList.forEach((target, index) => {
    //  create new `li for each element;
    const x = document.createElement("li");
    x.innerHTML = `
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${target.name}</div>
          <div class="li-text">Code: ${target.code}</div>
        </div>`;

    ulList.appendChild(x);
  });
}

function renderCountries() {
  const countriesList = document.getElementById("countries-list");
  const ulCountriesList = countriesList.children[2];
  ulCountriesList.innerHTML = ""; // Delete the content inside `ul` element
  createLiHtml(allCountriesList.countries, ulCountriesList);
}

// show countries list
showCountriesListButton.addEventListener("click", async function () {
  allCountriesList = await getCountries();
  console.log(typeof allCountriesList);
  renderCountries();
});

// Section 2: Render Languages List
// Fetch The Languages List From The API
const getLanguages = async () => {
  try {
    const languageURL = `https://holidayapi.com/v1/languages?pretty&key=${API_KEY}`;
    const res = await fetch(languageURL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }
};
/* getLanguages(); // Check Respone True Or False */

// Function Render Languages List
function renderLanguages() {
  const languagesList = document.getElementById("languages-list");
  const ulLanguagesList = languagesList.children[2];
  ulLanguagesList.innerHTML = ""; // Delete the content inside `ul` element
  createLiHtml(allLanguagesList.languages, ulLanguagesList);
}

// Show Languages List
showLanguagesListButton.addEventListener("click", async function () {
  allLanguagesList = await getLanguages();
  renderLanguages();
});

// Part3:  Holidays of a country

// Create Holidays "li" html
function createHolidaysLiHtml(holidays, ulList) {
  holidays.forEach((holiday, index) => {
    let code = holiday.country;
    let countryName = getCountryName(code);
    const x = document.createElement("li");
    if (onlyHolidayInput) {
      x.innerHTML = `
      <div class="bullet">${index + 1}</div>
      <div class="li-wrapper">
        <div class="li-title">${holiday.name}</div>
        <div> ${countryName} - ${holiday.date}</div>
      </div>`;
    } else {
      x.innerHTML = `
        <div class="bullet">${index + 1}</div>
        <div class="li-wrapper">
          <div class="li-title">${holiday.name}</div>
          <div> ${holiday.weekday.date.name} - ${holiday.date}</div>
        </div>`;
    }
    ulList.appendChild(x);
  });
}

const searchHolidayByName = document.querySelector("#search-query");
const searchYear = document.querySelector("#year-query");
const searchMonth = document.querySelector("#month-query");
const searchDay = document.querySelector("#day-query");
const searchCountry = document.querySelector("#country-query");
const searchLanguageCode = document.querySelector("#language-query");

// get Holiday URL
function getHolidayUrl() {
  let newUrl = "";
  if (searchHolidayByName.value && searchCountry.value) {
    newUrl += `${holidayURL}&search=${searchHolidayByName.value}&country=${searchCountry.value}&year=2022`;
    onlyHolidayInput = false;
  } else if (searchHolidayByName.value && !searchCountry.value) {
    onlyHolidayInput = true;
    newUrl += `${holidayURL}&search=${searchHolidayByName.value}&year=2022`;
  } else {
    onlyHolidayInput = false;
    if (!searchCountry.value) {
      searchCountry.value = defaultCountry;
    }
    newUrl += `${holidayURL}&country=${searchCountry.value}&year=2022`;

    if (searchYear.value) {
      newUrl = "";
      newUrl += `${holidayURL}&country=${searchCountry.value}&year=${searchYear.value}`;
    }
    if (searchMonth.value) {
      newUrl += `&month=${searchMonth.value}`;
    }
    if (searchDay.value) {
      newUrl += `&day=${searchDay.value}`;
    }
    if (searchLanguageCode.value) {
      newUrl += `&language=${searchLanguageCode.value}`;
    }
  }
  return newUrl;
}

// Get Holidays Function
const getHolidays = async () => {
  try {
    const url = getHolidayUrl();
    const res = await fetch(url);
    const holidaysList = await res.json();
    return holidaysList.holidays;
  } catch (err) {
    console.log("Error: ", error);
  }
};

// Get Country Name Function
function getCountryName(countryCode) {
  if (!countryCode) {
    return "Vietnam";
  } else
    for (let i = 0; i < allCountriesList.countries.length; i++) {
      if (allCountriesList.countries[i].code === countryCode) {
        return allCountriesList.countries[i].name;
      }
    }
  return "";
}

// Change title of " Holiday Of Country "
const title = document.getElementById("holidays-title");
function displayCountry(countryName) {
  if (onlyHolidayInput) {
    title.textContent = `The holidays found in the following countries`;
  } else {
    title.textContent = `Holiday of ${countryName}`;
    onlyHolidayInput = false;
  }
}

// Get Render Holidays Function
const renderHolidays = async () => {
  try {
    let holidaysListFromApi = await getHolidays();
    const holidaysList = document.getElementById("holidays-list");
    const ulHolidaysList = holidaysList.children[1];
    ulHolidaysList.innerHTML = "";
    createHolidaysLiHtml(holidaysListFromApi, ulHolidaysList);
  } catch (err) {
    console.log("Error: ", error);
  }
};

// show Render Holidays list
showHolidaysListButton.addEventListener("click", async function () {
  allCountriesList = await getCountries();
  let countryName = getCountryName(searchCountry.value);
  renderHolidays();
  displayCountry(countryName);
});
