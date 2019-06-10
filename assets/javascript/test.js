// Hide initial tables

// TRANSPORTATION TAB //

// // On click, the transportation tab will show
$('#transport-tab').on('click',function() {
   
    // The title will be Transportation and added to the id widget title

    $('#widget-title').text('Transportation');

    //ELEMENTS
    $('#widget-input').empty() 
    var transportForm = $('<div class="form-group">')
    transportForm.append($('<label for="select-form>Please Select a Station</label>'))

    // ID for the Station Input

    var transportSelect = ($('<select class ="form-control" id = "select-form">'))
    transportSelect.append($('<option value="Station-1">Station One</option>'))
    transportSelect.append($('<option value="Station-2">Station Two</option>'))
    transportForm.append(transportSelect)
    $('#widget-input').append(transportForm)

    $('#widget-button').empty()
    var transportButton = $('<button type = "button" class="btn btn-primary" id = "submit-transport">Submit</button>')
    $('#widget-button').append(transportButton)

    $('#transport-submit').on('click', function(event) {
        event.preventDefault()

        var stationInput = $('option').val()
        console.log(stationInput)
    })
})

// $('#submit-transport').on('click', function() {
//     $('#transport-table').show()
//     var row = $('<tr>');
//     row.append($('<td>').text('Train T'))
//     row.append($('<td>').text('On Time'))
//     $('table').append(row)
// });
    
    // for (i=0;i<train.length;i++) {
    //     var contentData = $('<th>'+train[i]+'</th><th>'+status[i]+'</th>')
    //     contentRowData.append(contentData)
    // }
    // $('#transport-table').show()

    // Appending items to table
    
    // $('table').append(contentRowHeader)
    // $('table').append(contentRowData)

// WEATHER TAB //

$('#weather-tab').on('click',function() {
   
    $('#widget-title').text('Weather');
    $('#widget-input').empty() 
    var weatherInput = $('<label for="location-input">Please Enter a Location</label>') 
    weatherInput.append($('<input type="text" id = "location-input" placeholder="city,country">'))
    $("#widget-input").append(weatherInput)

    $('#widget-button').empty();
    var weatherButton = ('<button type = "button" class="btn btn-primary" id = "location-submit">Submit</button>')
    $('#widget-button').append(weatherButton)

    $('#widget-display').empty()

    $('#location-submit').on('click',function(event) {
     
        event.preventDefault();

        var locationInput = $('#location-input').val().trim()
        console.log(locationInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "fb510d3360292806c424e84f2751add1";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+locationInput+"&appid=" + APIKey;

        // We then created an AJAX call
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        console.log(response)

        var kelvin = response.main.temp

        var fah = (kelvin-273.15)*1.80+32
        var locationTag = $('<h3>')
        locationTag.append(locationInput)

        
        $('#widget-display').append(locationTag)
        var tempTag = $('<p>')
        tempTag.append('Temperature: '+fah)
        $('#widget-display').append(tempTag)

        });
    })
})

$('#events-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Events')
    $('.card-title').html(title);
})

$('#food-tab').on('click',function() {
    
    var title = $('<h1>')
    title.text('Food')
    $('.card-title').html(title);

    $('#food-submit').on('click',function(event) {
     
        event.preventDefault();

        var foodInput = $('#food-input').val().trim()
        console.log(foodInput)
        // This is our API key. Add your own API key between the ""
        var APIKey = "bnRdt6tABPwVy-_r8VJsslJ50Fpx44t18Ks5srqJTsQxv2cHZuB_UqX1Fp0XSKJVmjGIQkMRgEm-ve7qXU1I3yX0xNvH_IJo-h83WtIhb9DfhHIXcaW0l_zPQ9_9XHYx";

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.yelp.com/v3/businesses/search?&location="+foodInput
        console.log(queryURL)
        var heroku = 'https://cors-anywhere.herokuapp.com/'
        // We then created an AJAX call
        $.ajax({
        url: heroku+queryURL,
        headers: {
            'Authorization': 'Bearer '+APIKey
        },
        method: "GET"
        }).then(function(response) {
        console.log(response)
        
        var business = response.businesses
        for (var i = 0;i< business.length;i++) {
            var businessName = response.businesses[i].name
            var businessImage = response.businesses[i].image_url
            
            var businessImageDiv = $('<img src ='+ businessImage+'>')
            
            
            var businessDiv = $('<h4>')
            businessDiv.append(businessName)
            
            $('#foodDisplay').append(businessDiv)
            $('#foodDisplay').append(businessImageDiv)
        }

        });

    })
})

