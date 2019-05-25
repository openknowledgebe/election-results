/* Nothing here yet */
// d3.json("data/barplot.json").then(function(dataBarplot){
// 	drawBarplot(dataBarplot, "LICHTERVELDE");
// });

//function to move elements to front on hover
// d3.selection.prototype.moveToFront = function() {
//   return this.each(function(){
//     this.parentNode.appendChild(this);
//   });
// };

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
  var outerHeight = 150;

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
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("rect")
    .attr("width", innerWidth)
    .attr("height", 55)
    .attr("fill", "#ece5dc")
    .attr("transform", "translate(" + 0 + "," + 30 + ")");

  //define scale
  var xScale = d3
    .scaleLinear()
    .domain(
      d3.extent(inputdata, function(d) {
        return d.value;
      })
    )
    .range([margin.left, innerWidth]);

  //setup axis
  var xAxis = d3.axisBottom(xScale).tickSize(0);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + (innerHeight - 10) + ")")
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
      return xScale(d.value);
    })
    .attr("y1", 30)
    .attr("x2", function(d) {
      return xScale(d.value);
    })
    .attr("y2", 85)
    .style("stroke", "#e49f27")
    .style("opacity", 0.3)
    .style("stroke-width", 2)
    .on("mouseover", function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr("y1", 10)
        .attr("y2", 105)
        .style("stroke-width", 3)
        .style("opacity", 1);

      svg
        .append("text")
        .attr("class", "label")
        .attr("x", xScale(d.value))
        .attr("text-anchor", function() {
          if (xScale(d.value) > innerWidth / 2) {
            return "end";
          } else {
            return "start";
          }
        })
        .attr("y", 0)
        .text(
          d.commune +
            " | " +
            accounting.formatNumber(
              d.value,
              [(precision = 1)],
              [(thousand = ".")],
              [(decimal = ",")]
            )
        );
    })
    .on("mouseout", function(d) {
      svg
        .selectAll(".bar")
        .transition()
        .delay(50)
        .attr("y1", 30)
        .attr("y2", 85)
        .style("stroke-width", 1)
        .style("opacity", 0.5);

      svg.selectAll(".label").remove();
    })
    .filter(function(d) {
      return d.commune == highlight;
    })
    .classed("bar", false)
    .attr("y1", 10)
    .attr("y2", 105)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("stroke-width", 2.5)
    .raise();
}; //end of drawBarplot function
