// Hide initial table
$('#transport-select').hide()
$('#transport-table').hide()

// On click, the transportation tab will show
$('#transport-tab').on('click',function() {
    $('#transport-select').show()

    // The title will be Transportation and added to the id widget title
    var title = $('<h1>')
    title.text('Transportation')
    $('#widget-title').html(title);

})

$('#submit-transport').on('click', function() {
    $('#transport-table').show()
    // Adding Row for Table Headers
    var contentRowHeader = $('<tr>')
    var contentHeader = $('<th>Transport</th><th>Status<th>')
    contentRowHeader.append(contentHeader)


    // Adding Data to table Headers
    var contentRowData = $('<tr>')
    var contentData = $('<td>(Place Holder for Data)</td><td>(Place Holder for Data)</td>')
    contentRowData.append(contentData)

    // Appending items to table
    
    $('table').append(contentRowHeader)
    $('table').append(contentRowData)
})



$('#weather-tab').on('click',function() {
    
    var title = $('<h1>')
    title.text('Weather')
    $('#widget-title').html(title);
})
$('#events-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Events')
    $('#widget-title').html(title);
})
$('#food-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Transportation')
    $('#widget-title').html(title);
})
