$(document).ready(function () {

    var apiKey = "8597a4ffa3726d171c1bfae3bf2a141e"
    var storedCitySearchList = [];
    var queryURL = "";
    var fiveDayForecast = "";

    //1. Trigger city search for an ajax call

    $("#citySearchButton").on("click", function (event) {
        event.preventDefault();
        var cityButton = "";
        //1.1 Create city-searched list on sidebar
        //a. Create local storage array for cities searched
        function addToCityList() {
            // Retrieve value of city search entry and save to variable
            var searchWord = $("#citySearch").val();

            // Add new searchWord to citySearchList array
            storedCitySearchList.push(searchWord);
            // Stringify and set "citySearchList" key in localStorage to citySearchList array
            localStorage.setItem("citySearchList", JSON.stringify(storedCitySearchList));
        };
        // Calling function
        addToCityList();

        //b. Loop and append cities searched as a list on sidebar
        function renderCityList() {
            // Get local storage array for display
            var getSearchedCity = JSON.parse(localStorage.getItem("citySearchList"));

            // Create button for every value in array using for loop
            for (var i = 0; i < getSearchedCity.length; i++) {
                var cityList = getSearchedCity[i];

                // Create button for every city searched
                cityButton = $("<button type='button' class='list-group-item cityDisplay'></button>");
                $(cityButton).text(cityList);
            }
            // Prepend buttons to display on sidebar
            $("#cityDisplayHead").attr("class", "list-group show");
            $("#cityDisplayHead").prepend(cityButton);

        };
        // Calling function
        renderCityList();

        var cityButtonText = $(cityButton)[0].textContent;

        $(cityButton).on("click", function () {
            var searchWord = $(this)[0].innerHTML;

            var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&APPID=8597a4ffa3726d171c1bfae3bf2a141e"

            var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchWord + "&units=metric&APPID=8597a4ffa3726d171c1bfae3bf2a141e"

            function currentWeatherAJAX() {
                //e. AJAX call for current weather
                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    // After data comes back from the request
                    .then(function (response) {

                        // storing the data from the AJAX request in the results variable
                        var nameResults = response.name;
                        var tempResults = Math.round(response.main.temp);
                        var humidResults = response.main.humidity;
                        var windSpResults = response.wind.speed;
                        var weatherIconCode = response.weather[0].icon;
                        var cityCoordLat = response.coord.lat;
                        var cityCoordLon = response.coord.lon;

                        //e.1 show city name and date and weathericon
                        // store current date into variable
                        var current = new Date();
                        //convert month to 2 digits
                        var twoDigitMonth = ((current.getMonth().length + 1) === 1) ? (current.getMonth() + 1) : '0' + (current.getMonth() + 1);
                        //string date together
                        var currentDate = twoDigitMonth + "/" + current.getDate() + "/" + current.getFullYear();

                        //show icon for weather beside date
                        var weatherIconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + ".png"

                        $(".cityWeather").html("<h2 class='cityNameDate'>" + nameResults + " (" + currentDate + ")<i id='icon'><img id='wicon' src='' alt='weatherIcon'></i></h2>");
                        $("#wicon").attr('src', weatherIconURL);
                        $(".cityWeather").append("<br>");

                        //e.2 show temperature
                        $(".cityWeather").append("Temperature: " + tempResults + '&#8451;');
                        $(".cityWeather").append("<br><br>");

                        //e.3 show humidity
                        $(".cityWeather").append("Humidity: " + humidResults + '%');
                        $(".cityWeather").append("<br><br>");

                        //e.4 show wind speed
                        $(".cityWeather").append("Wind Speed: " + windSpResults + 'MPH');
                        $(".cityWeather").append("<br><br>");

                        //e.5 show UV index
                        var UVIndexURL = "http://api.openweathermap.org/data/2.5/uvi?&APPID=8597a4ffa3726d171c1bfae3bf2a141e&lat=" + cityCoordLat + "&lon=" + cityCoordLon

                        //trigger AJAX call for UVIndex
                        $.ajax({
                            url: UVIndexURL,
                            method: "GET"
                        })
                            .then(function (response) {
                                var UVIndex = response.value;

                                //show UVIndex
                                $(".cityWeather").append("<div id='UVIndexbox'> UV Index: </div>");
                                $("#UVIndexbox").append("<i id='UVIndex'>" + UVIndex + "</i>")
                                $(".cityWeather").append("<br><br>");
                            });
                    });
            }
            currentWeatherAJAX();

            function forecastWeatherAJAX() {
                //g. trigger city search for an ajax call for 5-day forecast
                $.ajax({
                    url: fiveDayForecast,
                    method: "GET"
                })
                    .then(function (response) {

                        //creating 5-day date variables
                        var current = new Date();
                        //convert month to 2 digits
                        var twoDigitMonth = ((current.getMonth().length + 1) === 1) ? (current.getMonth() + 1) : '0' + (current.getMonth() + 1);
                        //string date together
                        var currentDate = twoDigitMonth + "/" + current.getDate() + "/" + current.getFullYear();
                        var dayOne = twoDigitMonth + "/" + [current.getDate() + 1] + "/" + current.getFullYear();
                        var dayTwo = twoDigitMonth + "/" + [current.getDate() + 2] + "/" + current.getFullYear();
                        var dayThree = twoDigitMonth + "/" + [current.getDate() + 3] + "/" + current.getFullYear();
                        var dayFour = twoDigitMonth + "/" + [current.getDate() + 4] + "/" + current.getFullYear();
                        var dayFive = twoDigitMonth + "/" + [current.getDate() + 5] + "/" + current.getFullYear();

                        // logging 5-day weathericon to variables
                        var weatherIconCode1 = response.list[0].weather[0].icon;
                        var weatherIconCode2 = response.list[8].weather[0].icon;
                        var weatherIconCode3 = response.list[16].weather[0].icon;
                        var weatherIconCode4 = response.list[24].weather[0].icon;
                        var weatherIconCode5 = response.list[32].weather[0].icon;

                        var weatherIconURL1 = "http://openweathermap.org/img/wn/" + weatherIconCode1 + ".png"
                        var weatherIconURL2 = "http://openweathermap.org/img/wn/" + weatherIconCode2 + ".png"
                        var weatherIconURL3 = "http://openweathermap.org/img/wn/" + weatherIconCode3 + ".png"
                        var weatherIconURL4 = "http://openweathermap.org/img/wn/" + weatherIconCode4 + ".png"
                        var weatherIconURL5 = "http://openweathermap.org/img/wn/" + weatherIconCode5 + ".png"


                        // logging 5-day temp forecast to variables
                        var tempForecast1 = Math.round(response.list[0].main.temp);
                        var tempForecast2 = Math.round(response.list[8].main.temp);
                        var tempForecast3 = Math.round(response.list[16].main.temp);
                        var tempForecast4 = Math.round(response.list[24].main.temp);
                        var tempForecast5 = Math.round(response.list[32].main.temp);

                        // logging 5-day humidity forecast to variables
                        var humidForecast1 = response.list[0].main.humidity;
                        var humidForecast2 = response.list[8].main.humidity;
                        var humidForecast3 = response.list[16].main.humidity;
                        var humidForecast4 = response.list[24].main.humidity;
                        var humidForecast5 = response.list[32].main.humidity;

                        //g.1 show date icon temp and humidity for 5 days
                        $(".forecastSection").attr("class", "row show forecastSection");
                        $("#forecast1").html("<h6>" + dayOne + "</h6><div id='weaFIcon1'><img id='wFIcon1' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast1 + '&#8451;</p><p>Humidity: ' + humidForecast1 + '%</p>');
                        $("#wFIcon1").attr('src', weatherIconURL1);

                        $("#forecast2").html("<h6>" + dayTwo + "</h6><div id='weaFIcon2'><img id='wFIcon2' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast2 + '&#8451;</p><p>Humidity: ' + humidForecast2 + '%</p>');
                        $("#wFIcon2").attr('src', weatherIconURL2);

                        $("#forecast3").html("<h6>" + dayThree + "</h6><div id='weaFIcon3'><img id='wFIcon3' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast3 + '&#8451;</p><p>Humidity: ' + humidForecast3 + '%</p>');
                        $("#wFIcon3").attr('src', weatherIconURL3);

                        $("#forecast4").html("<h6>" + dayFour + "</h6><div id='weaFIcon4'><img id='wFIcon4' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast4 + '&#8451;</p><p>Humidity: ' + humidForecast4 + '%</p>');
                        $("#wFIcon4").attr('src', weatherIconURL4);

                        $("#forecast5").html("<h6>" + dayFive + "</h6><div id='weaFIcon5'><img id='wFIcon5' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast5 + '&#8451;</p><p>Humidity: ' + humidForecast5 + '%</p>');
                        $("#wFIcon5").attr('src', weatherIconURL5);
                    });
            }
            forecastWeatherAJAX();
        })

        //1.2 Retrieve AJAX call from Open Weather API
        function AJAXCall() {
            //a. Retrieve value of city search entered
            var searchWord = $("#citySearch").val();

            //b. Save entry to local storage as searchword for AJAX
            localStorage.setItem("citySearch", searchWord);

            //c. Get searchword for AJAX call
            var getSearchWord = localStorage.getItem("citySearch");

            //d. Insert searchword for open weather AJAX call to api
            var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + getSearchWord + "&units=metric&APPID=8597a4ffa3726d171c1bfae3bf2a141e"

            var fiveDayForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + getSearchWord + "&units=metric&APPID=8597a4ffa3726d171c1bfae3bf2a141e"

            function currentWeatherAJAX() {
                //e. AJAX call for current weather
                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    // After data comes back from the request
                    .then(function (response) {
                        console.log(response);

                        // storing the data from the AJAX request in the results variable
                        var nameResults = response.name;
                        var tempResults = Math.round(response.main.temp);
                        var humidResults = response.main.humidity;
                        var windSpResults = response.wind.speed;
                        var weatherIconCode = response.weather[0].icon;
                        var cityCoordLat = response.coord.lat;
                        var cityCoordLon = response.coord.lon;

                        //e.1 show city name and date and weathericon
                        // store current date into variable
                        var current = new Date();
                        //convert month to 2 digits
                        var twoDigitMonth = ((current.getMonth().length + 1) === 1) ? (current.getMonth() + 1) : '0' + (current.getMonth() + 1);
                        //string date together
                        var currentDate = twoDigitMonth + "/" + current.getDate() + "/" + current.getFullYear();

                        //show icon for weather beside date
                        var weatherIconURL = "http://openweathermap.org/img/wn/" + weatherIconCode + ".png"

                        $(".cityWeather").html("<h2 class='cityNameDate'>" + nameResults + " (" + currentDate + ")<i id='icon'><img id='wicon' src='' alt='weatherIcon'></i></h2>");
                        $("#wicon").attr('src', weatherIconURL);
                        $(".cityWeather").append("<br>");

                        //e.2 show temperature
                        $(".cityWeather").append("Temperature: " + tempResults + '&#8451;');
                        $(".cityWeather").append("<br><br>");

                        //e.3 show humidity
                        $(".cityWeather").append("Humidity: " + humidResults + '%');
                        $(".cityWeather").append("<br><br>");

                        //e.4 show wind speed
                        $(".cityWeather").append("Wind Speed: " + windSpResults + 'MPH');
                        $(".cityWeather").append("<br><br>");

                        //e.5 show UV index
                        var UVIndexURL = "http://api.openweathermap.org/data/2.5/uvi?&APPID=8597a4ffa3726d171c1bfae3bf2a141e&lat=" + cityCoordLat + "&lon=" + cityCoordLon

                        //trigger AJAX call for UVIndex
                        $.ajax({
                            url: UVIndexURL,
                            method: "GET"
                        })
                            .then(function (response) {
                                var UVIndex = response.value;

                                //show UVIndex
                                $(".cityWeather").append("<div id='UVIndexbox'> UV Index: </div>");
                                $("#UVIndexbox").append("<i id='UVIndex'>" + UVIndex + "</i>")
                                $(".cityWeather").append("<br><br>");
                            });
                    });
            }
            currentWeatherAJAX();

            function forecastWeatherAJAX() {
                //g. trigger city search for an ajax call for 5-day forecast
                $.ajax({
                    url: fiveDayForecast,
                    method: "GET"
                })
                    .then(function (response) {

                        //creating 5-day date variables
                        var current = new Date();
                        //convert month to 2 digits
                        var twoDigitMonth = ((current.getMonth().length + 1) === 1) ? (current.getMonth() + 1) : '0' + (current.getMonth() + 1);
                        //string date together
                        var currentDate = twoDigitMonth + "/" + current.getDate() + "/" + current.getFullYear();
                        var dayOne = twoDigitMonth + "/" + [current.getDate() + 1] + "/" + current.getFullYear();
                        var dayTwo = twoDigitMonth + "/" + [current.getDate() + 2] + "/" + current.getFullYear();
                        var dayThree = twoDigitMonth + "/" + [current.getDate() + 3] + "/" + current.getFullYear();
                        var dayFour = twoDigitMonth + "/" + [current.getDate() + 4] + "/" + current.getFullYear();
                        var dayFive = twoDigitMonth + "/" + [current.getDate() + 5] + "/" + current.getFullYear();

                        // logging 5-day weathericon to variables
                        var weatherIconCode1 = response.list[0].weather[0].icon;
                        var weatherIconCode2 = response.list[8].weather[0].icon;
                        var weatherIconCode3 = response.list[16].weather[0].icon;
                        var weatherIconCode4 = response.list[24].weather[0].icon;
                        var weatherIconCode5 = response.list[32].weather[0].icon;

                        var weatherIconURL1 = "http://openweathermap.org/img/wn/" + weatherIconCode1 + ".png"
                        var weatherIconURL2 = "http://openweathermap.org/img/wn/" + weatherIconCode2 + ".png"
                        var weatherIconURL3 = "http://openweathermap.org/img/wn/" + weatherIconCode3 + ".png"
                        var weatherIconURL4 = "http://openweathermap.org/img/wn/" + weatherIconCode4 + ".png"
                        var weatherIconURL5 = "http://openweathermap.org/img/wn/" + weatherIconCode5 + ".png"


                        // logging 5-day temp forecast to variables
                        var tempForecast1 = Math.round(response.list[0].main.temp);
                        var tempForecast2 = Math.round(response.list[8].main.temp);
                        var tempForecast3 = Math.round(response.list[16].main.temp);
                        var tempForecast4 = Math.round(response.list[24].main.temp);
                        var tempForecast5 = Math.round(response.list[32].main.temp);

                        // logging 5-day humidity forecast to variables
                        var humidForecast1 = response.list[0].main.humidity;
                        var humidForecast2 = response.list[8].main.humidity;
                        var humidForecast3 = response.list[16].main.humidity;
                        var humidForecast4 = response.list[24].main.humidity;
                        var humidForecast5 = response.list[32].main.humidity;

                        //g.1 show date icon temp and humidity for 5 days
                        $(".forecastSection").attr("class", "row show forecastSection");
                        $("#forecast1").html("<h6>" + dayOne + "</h6><div id='weaFIcon1'><img id='wFIcon1' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast1 + '&#8451;</p><p>Humidity: ' + humidForecast1 + '%</p>');
                        $("#wFIcon1").attr('src', weatherIconURL1);

                        $("#forecast2").html("<h6>" + dayTwo + "</h6><div id='weaFIcon2'><img id='wFIcon2' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast2 + '&#8451;</p><p>Humidity: ' + humidForecast2 + '%</p>');
                        $("#wFIcon2").attr('src', weatherIconURL2);

                        $("#forecast3").html("<h6>" + dayThree + "</h6><div id='weaFIcon3'><img id='wFIcon3' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast3 + '&#8451;</p><p>Humidity: ' + humidForecast3 + '%</p>');
                        $("#wFIcon3").attr('src', weatherIconURL3);

                        $("#forecast4").html("<h6>" + dayFour + "</h6><div id='weaFIcon4'><img id='wFIcon4' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast4 + '&#8451;</p><p>Humidity: ' + humidForecast4 + '%</p>');
                        $("#wFIcon4").attr('src', weatherIconURL4);

                        $("#forecast5").html("<h6>" + dayFive + "</h6><div id='weaFIcon5'><img id='wFIcon5' src='' alt='weatherIcon'></div><p>Temp: " + tempForecast5 + '&#8451;</p><p>Humidity: ' + humidForecast5 + '%</p>');
                        $("#wFIcon5").attr('src', weatherIconURL5);
                    });
            }
            forecastWeatherAJAX();
        };
        AJAXCall();
    })
});