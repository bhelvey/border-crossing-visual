var svgWidth = 960;
var svgHeight = 500;
// Define the chart's margins as an object
var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};
// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
width = 460 - margin.left - margin.right;
height = 400 - margin.top - margin.bottom;
// Select body, append SVG area to it, and set its dimensions​
var svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
// Append a group area, then set its margins
var gUnit = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%d/%m/%Y %H:%M");
d3.json("/south_state").then(files => {
    // file will contain northState.csv

    var southState = d3.map(files, d => { return (d.State) }).keys()

    files.forEach(data => {
        data.Date = parseTime(data.Date);
        data.Value = +data.Value
    });
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(southState)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; });
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(files, data => data.Date))
        .range([0, chartWidth]);
    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(files, data => data.Value)])
        .range([chartHeight, 0]);
    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // creating the line eq
    var drawLine = d3.line()
        .x(data => xTimeScale(data.Date))
        .y(data => yLinearScale(data.Value));

    // plotting line
    gUnit.append("path")
        .attr("d", drawLine(files))
        .style("fill", "none")
        .classed("line", true);

    // Append an SVG group element to the chartGroup, create the left axis inside of it 
    gUnit.append("g")
        .classed("axis", true)
        .call(leftAxis);
    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    gUnit.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);


    var myColor = d3.scaleOrdinal()
        .domain(southState)
        .range(d3.schemeSet2);
    function update(selectedGroup) {
        console.log(selectedGroup);
        // Create new data with the selection?
        var dataFilter = files.filter(function (d) { return d.State == selectedGroup })
        console.log(dataFilter)
        // Give the new data to update line
        svg.select("path")
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", drawLine)
            .attr("stroke", function (d) { return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)

    });
}).catch(err => {
    // handle error here
})