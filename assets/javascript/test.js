// Hide initial table
$('#weather-widget').hide()
$('#transport-widget').hide()

// // On click, the transportation tab will show
$('#transport-tab').on('click',function() {
    $('#transport-widget').show()
    $('#display-page').empty()
    $('#display-page').hide()

    // The title will be Transportation and added to the id widget title
    var title = $('<h1>')
    title.text('Transportation')
    $('.card-title').html(title);

    $('#station-submit').on('click', function(event) {
        $('display-page').show()
        event.preventDefault()

        var stationInput = $('#station-submit').val().trim()
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




$('#weather-tab').on('click',function() {
    $('#weather-widget').show();
    $('#display-page').empty();
    $('#display-page').hide()
        
    var title = $('<h1>');
    title.text('Weather');
    $('.card-title').html(title);

    $('#location-submit').on('click',function(event) {
        $('#display-page').show()
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
        $('#weatherDisplay').append(locationTag)
        var tempTag = $('<p>')
        tempTag.append(fah)
        $('#weatherDisplay').append(tempTag)
       
        // Create CODE HERE to log the resulting object
        // Create CODE HERE to transfer content to HTML
        // Create CODE HERE to calculate the temperature (converted from Kelvin)
        // Hint: To convert from Kelvin to Fahrenheit: F = (K - 273.15) * 1.80 + 32
        // Create CODE HERE to dump the temperature content into HTML

        });

    })
})
$('#events-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Events')
    $('#widget-title').html(title);
})
$('#food-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Food')
    $('#widget-title').html(title);
})
