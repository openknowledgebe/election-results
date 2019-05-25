var drawLinechart = function(inputdata, inputindicator, inputStartyear){

	//get the width of the containing div
	var barcodeDiv = d3.select("body").select('#linechart').node();

	//define the padding of the div
	var padding = 0;

	//define the outer width of the svg element
	var outerWidth = barcodeDiv.getBoundingClientRect().width - (2*padding);

	//define outer height
	var outerHeight = 200;

	//define margins
	var margin = {top:10, right:20, bottom:50, left:30};

	//define the inner width of the svg element
	var innerWidth = outerWidth - (margin.left + margin.right);

	//define inner height
	var innerHeight = outerHeight - (margin.top + margin.bottom);

	var svg = d3.select("body").select("#linechart")
	.append("svg")
	.attr("width", outerWidth)
	.attr("height", outerHeight)
	.append("g")
	.attr("transform", "translate(" + margin.left +  "," + margin.top + ")");

	//define scales
	var xScale = d3.scaleLinear()
  		.domain([0, inputdata[inputindicator].length -1])
  		.range([0, innerWidth]);

  	var yScale = d3.scaleLinear()
  		.domain(d3.extent(inputdata[inputindicator], function(d) { return d;}))
  		.range([innerHeight, 0]);

	var line = d3.line()
			.x(function(d,i) { 
				// return the X coordinate where we want to plot this datapoint
				return xScale(i); 
			})
			.y(function(d) { 
				// return the Y coordinate where we want to plot this datapoint
				return yScale(d); 
			});

	//setup axis
	var xAxis = d3.axisBottom(xScale)
	.tickFormat(function(d,i){
		return d + inputStartyear;
	}).tickSize(0)
	.tickValues(d3.range(0, 100, 2));

	var yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);

	svg.append("g")
	     .attr("class", "x axis")
	     .attr("transform", "translate(" + 0+ "," + (innerHeight + 20) + ")")
	     .call(xAxis);

	  	svg.append("g")
	     .attr("class", "y axis")
	     .attr("transform", "translate(" + 0+ "," + 0 + ")")
	     .style("stroke-dasharray", ("1, 2"))
	     .call(yAxis);

	  svg.append("path")
	      .datum(inputdata[inputindicator])
	      .attr("fill", "none")
	      .attr("stroke", "#e49f27")
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("stroke-width", 2.5)
	      .attr("d", line(inputdata[inputindicator]));

	d3.selectAll(".domain").remove();

	  svg.selectAll(".point")
	  	.data(inputdata[inputindicator])
	  	.enter()
	  	.append("circle")
	  	.attr("class", "point")
	  	.attr("cx", function(d,i){return xScale(i)})
	  	.attr("cy", function(d){return yScale(d)})
	  	.attr("r", 5)
	  	.attr("fill", "#e49f27");


};