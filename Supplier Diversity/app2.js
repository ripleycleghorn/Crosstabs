// SD CHART-------------------------------

d3.csv("data2.csv").then(d => chart(d))

function chart(csv) {

	var keys = csv.columns.slice(2);
    console.log(keys)

	var brand   = [...new Set(csv.map(d => d.Brand))]
	var metrics = [...new Set(csv.map(d => d.Metric))]

	var options = d3.select("#brand").selectAll("option")
		.data(brand)
	.enter().append("option")
		.text(d => d)

	var svg = d3.select("#chart2"),
		margin = {top: 35, left: 35, bottom: 0, right: 0},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([margin.left, width - margin.right])
		.padding(0.1)

	var y = d3.scaleLinear()
		.rangeRound([height - margin.bottom, margin.top])

	var xAxis = svg.append("g")
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis")

	var yAxis = svg.append("g")
		.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis")

	var z = d3.scaleOrdinal()
		.range(["darkblue", "lightgrey"])
		.domain(keys);

	update(d3.select("#brand").property("value"), 0)

	function update(input, speed) {

		var data = csv.filter(f => f.Brand == input)

		data.forEach(function(d) {
			d.total = d3.sum(keys, k => +d[k])
			return d
		})

        console.log(data)

		y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

		svg.selectAll(".y-axis").transition().duration(speed)
			.call(d3.axisLeft(y).ticks(null, "s"))

		x.domain(data.map(d => d.Metric));

		svg.selectAll(".x-axis").transition().duration(speed)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

        console.log(z(data.key))

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.Metric);

		bars.exit().remove()

		bars.enter().append("rect")
			.attr("width", x.bandwidth())
			.merge(bars)
		.transition().duration(speed)
			.attr("x", d => x(d.data.Metric))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]))

		var text = svg.selectAll(".text")
			.data(data, d => d.Metric);

		text.exit().remove()

		text.enter().append("text")
			.attr("class", "text")
			.attr("text-anchor", "middle")
			.merge(text)
		.transition().duration(speed)
			.attr("x", d => x(d.Metric) + x.bandwidth() / 2)
			.attr("y", d => y(d.total) - 5)
			.text(d => d.total)
	}

	var select = d3.select("#brand")
		.on("change", function() {
			update(this.value, 750)
		})

}