
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "3278fe0233c3d7771085e58f168309bd"
let searchInput = $("#search-input")
let searchForm = $("#search-form");

function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5appid=${weatherAPIKey}`;
    console.log(queryURL);
    fetch(queryURL).then(function(data){
        return data.json()
     }).then(function(response){
        console.log(response);
     }
}
function submitSearchForm(event){
    
    event.preventDefault();
    let search = searchInput.val().trim()

    fetchWeather(search);

}

searchForm.on("submit",submitSearchForm);