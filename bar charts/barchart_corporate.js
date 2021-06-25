// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("noncustomers_corporate.csv").then(function (data) {

    let filtered_data = data.filter(function (d) { return d.brand == "BrandE" })
    console.log(filtered_data)
    // set the ranges
    var xScale = d3.scaleBand()
        .domain(filtered_data.map(function (d) { return d.metric; }))
        .range([0, width])
        .padding(0.1);
    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // format the data
    filtered_data.forEach(function (d) {
        d.percent = +d.percent;
    });


    // append the rectangles for the bar chart
    // Create rectangles
    let bars = svg.selectAll('.bar')
        .data(filtered_data)
        .enter()
    // .append("g");

    bars.append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.metric); })
        .attr("y", function (d) { return yScale(d.percent); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.percent); })
        .attr("fill", function (d) {
            if (d.metric.includes('NOT')) { return "grey" }
            else { return "#1CA8EE" }
            ;
        })
    console.log(xScale.bandwidth())
    bars.append("text")
        .text(function (d) { return d.percent + "%"; })
        .attr('class', 'label')
        .attr("text-anchor", "middle")
        //add half of the bandwidth to put the text in the middle of the bar
        .attr("x", function (d) { return xScale(d.metric) + xScale.bandwidth() / 2; })
        .attr("y", function (d) { return yScale(d.percent); })
        .attr('dy', '-0.5em') // add 0.5em offset
        .style("fill", "black")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")

    // add the x Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale))
    //     .attr("class", "x-axis");;

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .attr("class", "y-axis");

});
