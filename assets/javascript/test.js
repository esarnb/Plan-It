

$('#transport-tab').on('click',function() {
    var title = $('<h1>')
    title.text('Transportation')
    $('#widget-title').html(title);
    // Make a table
    var content = $('<table>');

    // Adding Row for Table Headers
    var contentRowHeader = $('<tr>')
    var contentHeader = $('<th>Transport</th>')
    contentRowHeader.append(contentHeader)


    // Adding Data to table Headers
    var contentRowData = $('<tr>')
    var contentData = $('<td>Bus 48</td>')
    contentRowData.append(contentData)

    content.append(contentRowHeader)
    content.append(contentRowData)

    // Appending Content to Content Area
    $('#content').append(content)

    

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
