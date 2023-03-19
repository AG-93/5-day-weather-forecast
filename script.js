const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "defaea347557fb32ad96ce45495ed14b"

let searchHistory = []
let searchInput = $("#search-input")
let searchForm = $("#search-form");
let searchHistoryContainer= $("#history");
let forecastContainer =$("#forecast");
let todayContainer = $("#today")


function renderSearchHistory() {
    searchHistoryContainer.html("");

    for(let i=0; i < searchHistory.length; i++){
        let btn = $("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history");

        btn.attr("data-search", searchHistory[i]);
        btn.text(searchHistory[i]);
        searchHsitoryContainer.append(btn);
    }
}

function appendSearchHistory(search){
    if(searchHistory.indexOf(search) !== -1){
        return
    }
    searchHistory.push(search);

    localStorage.setItem("search-history", JSON.stringify(search))

}

function renderCurrentWeather (city, weatherData) {
    let date = moment().format("DD/MM/YYYY");
    let tempC = weatherData["main"]["temp"];
    let WindKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humdity"];

    let iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
    let iconDescription = weatherData.weather[0].description || weatherData[0].main

    let card = $("<div>")
    let cardBody = $("<div>")
    let weatherIcon = $("<img>")

    let heading = $("<h2>")
    let tempElement = $("<p>")
    let windElement = $("<p>")
    let humidityElement = $("<p>")

    card.attr("class", "card");

    cardBody.attr("class", "card-body");

    card.append(cardBody) ;

    heading.attr("class", "h3 card-title")
    tempElement.attr("class", "card-text")
    windElement.attr("class", "card-text")
    humidityElement.attr("class", "card-text");

    heading.text(`${city} (${date})`)
    weatherIcon.attr("src", iconUrl);
    weatherIcon.attr("alt", iconDescription);

    heading.append(weatherIcon);
    tempElement.text(`Temp $(tempC) C`)
    windElement.text(`Wind ${windKph} Kph`)
    humidityElement.text(`Humiditiy ${humidity} %`)
    cardBody.append(heading, tempElement, windElement, humidityElement);

    todayContainer.html("");
    todayContainer.append(card);

}

function renderForecast(weatherData){
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    headingCol.text("5 day Forecast");
    headingCol.append(heading);

    forecastContainer.html("");

    forecastContainer.append(headingCol);

    let futureForecast = weatherData.filter(function(forecast){
        return forecast.dt_text.include("12")
    })

    console.log()

    for(let i = 0; i < futureForecast.length; i++){
        let iconURL = `https://openweathermap.org/img/w${futureForecast[i].weather[0].icon}.png`
        let iconDescription = futureForecast[i].weather[0].description;
        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humidity;
        let windKph = futureForecast[i].wind.speed;
        
        let col = $("<div>")
        let card = $("<div>");
        let cardBody = $("<div>");
        let cardTitle = $("<h5>");
        let weatherIcon = $("<img>");
        let tempElement = $("<p>");
        let windElement = $("<p>");
        let humidityElement = $("<p>")

        col.append(card)
        card.append(cardBody);
        cardBody.append(cardTitle, weatherIcon, tempElement, windElement, humidityElement);

        col.attr("class", "col-md");
        card.attr("class", "card bg-primary h-100 text-white");
        cardTItle.attr("class", "card-title");
        tempElement.attr("class", "card-text");
        windElement.attr("class", "card-text");
        humidityElement.attr("class", "card-text");

        cardTItle.text(moment(futureForecast[i].dt_text).format("DD/MM/YYYY"))
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", iconDescription);
        tempElement.text(`Temp ${tempC} C`);
        windElement.text(`Wind: ${windKph} KPH`);
        humidityElement.text(`Humidity ${humidity} %`)

        forecastContainer.append(col)

    }

}


function fetchWeather(location){
    let latitude = location.lat;
    let longitude = location.lon;

    let city = location.name

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKey}`;

    console.log(queryWeatherURL)

    $.ajax({
        url:queryWeatherURL,
        method: "GET"
    }).then(function(response){
        renderCurrentWeather(city, response.list[0]);

        renderForecast(response.list);
    })
}

function fetchCoord(search){
    // coordinate API URL
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`;
    console.log(queryURL)

    fetch(queryURL, {method: "GET"}).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("Location not found")
        } else { 
            appendSearchHistory(search)
            fetchWeather(response[0])
           
        }
    });
}

function initializeHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if(storedHistory) {
        searchHsitory = JSON.parse(storedHistory)
    }
    renderSearchHistory()
}

function submitSearchForm(event){
    
    event.preventDefault();
    let search = Input.val().trim()

    fetchCoord(search);
    searchInput.val("");
}

function clickSearchHistory(event){
    if(!$(event.target).hasClass("btn-history")){
        return
    }
    let search = $(event.target).attr("data-search")
    alert(search)

    fetchCoord(search)
    searchInput.value()

}

initializeHistory()
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click", clickSearchHistory)


