//set initial indicator
var indicator = "jobratio";

//make communeData global accessible
var communeData = [];

var communeName;

var indicator = "jobratio";
var key = 10;

/* Nothing here yet */
d3.json("data/data.json").then(function(dataset) {
  //function to update data barplot
  var updateDataBarplot = function() {
    dataBarplot = [];

    dataset.forEach(function(element) {
      var obs = { commune: element.commune, value: element[indicator][key] };
      dataBarplot.push(obs);
    });
  };

  communeData = dataset.filter(elem => elem.commune == "GENT")[0];
  communeName = communeData.commune;

  updateDataBarplot();

  drawBarplot(dataBarplot, communeData.commune);
}); //end of json function

//function to draw the graph
var drawBarplot = function(inputdata, highlight) {
  //get the width of the containing div
  var barcodeDiv = d3
    .select("body")
    .select("#barplot")
    .node();

  //define the padding of the div
  var padding = 12;

  //define the outer width of the svg element
  var outerWidth = barcodeDiv.getBoundingClientRect().width - 2 * padding;

  //define outer height
  var outerHeight = 400;

  //define margins
  var margin = { top: 20, right: 10, bottom: 20, left: 10 };

  //define the inner width of the svg element
  var innerWidth = outerWidth - (margin.left + margin.right);

  //define inner height
  var innerHeight = outerHeight - (margin.top + margin.bottom);

  //apend an svt element to the div
  var svg = d3
    .select("body")
    .select("#barplot")
    .append("svg")
    .attr("width", 150)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("rect")
    .attr("width", 60)
    .attr("height", innerHeight)
    .attr("fill", "#ece5dc")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  //define scale
  var yScale = d3
    .scaleLinear()
    .domain(
      d3.extent(inputdata, function(d) {
        return d.value;
      })
    )
    .range([0, innerHeight]);

  //setup axis
  var xAxis = d3.axisRight(yScale).tickSize(0);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 80 + "," + 0 + ")")
    .call(xAxis);

  //remove domain line
  d3.select("g")
    .selectAll(".domain")
    .remove();

  var bars = svg
    .selectAll(".bar")
    .data(inputdata)
    .enter()
    .append("line")
    .attr("class", "bar")
    .attr("x1", function(d) {
      return 0;
    })
    .attr("y1", function(d) {
      return yScale(d.value);
    })
    .attr("x2", 60)
    .attr("y2", function(d) {
      return yScale(d.value);
    })
    .style("stroke", "#e49f27")
    .style("opacity", 0.3)
    .style("stroke-width", 2)
    .on("mouseover", function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr("x1", 0)
        .attr("x2", 80)
        .style("stroke-width", 3)
        .style("opacity", 1);

      svg
        .append("text")
        .attr("class", "label")
        .attr("y", yScale(d.value))
        .attr("text-anchor", function() {
          if (yScale(d.value) > innerHeight / 2) {
            return "end";
          } else {
            return "start";
          }
        })
        .attr("y", 0);
    })
    .on("mouseout", function(d) {
      svg
        .selectAll(".bar")
        .transition()
        .delay(50)
        .attr("x1", 0)
        .attr("x2", 60)
        .style("stroke-width", 1)
        .style("opacity", 0.5);

      svg.selectAll(".label").remove();
    })
    .filter(function(d) {
      return d.commune == highlight;
    })
    .classed("bar", false)
    .attr("x1", 0)
    .attr("x2", 80)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("stroke-width", 2.5)
    .raise();
}; //end of drawBarplot function
