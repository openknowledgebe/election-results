/**
 * Reusable, responsive ladder chart, that can have two switchable left axes.
 * For D3.js v4.
 *
 * In use:
 *
 * <div class="js-chart" style="max-width: 400px; height: 500px;"></div>
 *
 * <script>
 *   var data = [
 *    {
 *      'Service': 5,
 *      'Speed': 7,
 *      'Overall': 88,
 *      'Name': 'Bob'
 *      'Age': 34
 *    },
 *    ...
 *  ];
 *
 *  var laddergraph = charts.laddergraph()
 *                            .leftKey1('Service')
 *                            .leftKey2('Speed')
 *                            .rightKey('Overall')
 *                            .tooltipFormat(function(d) {
 *                              return '<b>' + d['Name'] + '</b> ' + d['Age'];
 *                            });
 *
 *  d3.select('js-chart')
 *      .datum(data)
 *      .call(laddergraph);
 *
 * </script>
 *
 *
 * If you want one of the left-hand axes to be the other way up (i.e. have
 * lower values at the top) then change the default orientation to 'inverted'.
 * e.g.:
 *
 *  var laddergraph = charts.laddergraph()
 *                            .leftKey1('Service')
 *                            .leftKey1Orientation('inverted')
 *                            .leftKey2('Speed')
 *                            .rightKey('Overall');
 */
;(function() {
  'use strict';
  window.charts = window.charts || {};

  charts.laddergraph = function module() {

    // Default values that can be overridden:
    var leftKey1 = '',
        rightKey = '',
        tooltipFormat = function(d, i) {
          return i;
        };

    function chart(selection) {

      var margin = {top: 45, bottom: 10, left: 0, right: 0};

      var tooltip = d3.select('body')
                      .append('div')
                      .classed('tooltip', true)
                      .style('position', 'absolute')
                      .style('visibility', 'hidden');

      selection.each(function(data) {

        var container = d3.select(this);

        var svg = container.append('svg');

        // Initial defaults for left y-axis:
        var leftKey = leftKey1;

        var yScaleLeft = d3.scaleLinear()
        .domain([20, 1]);
        
        var yScaleRight = d3.scaleLinear()
                            .domain([20, 1]);

        var yAxisLeft = svg.append('g')
                            .classed('axis axis-l', true)
                            .attr('stroke', 'lighgrey');

        var yAxisRight = svg.append('g')
                            .classed('axis axis-r', true);

        var yAxisLeftLabel = svg.append('text')
                              .classed('axis-label axis-label-l', true);

        var yAxisRightLabel = svg.append('text')
                              .classed('axis-label axis-label-r', true);

        

        // Need to be in a scope the functions below can access:
        var totalW;
        var totalH;
        var chartW;
        var chartH;

        render();

        window.addEventListener('resize', render);

        function render() {
          setOuterDimensions();
          renderStructure();
          renderAxes();
          setInnerDimensions();
          renderLines()
          renderCirclesleft();
          renderCirclesright();
        };

        /**
         * Work out how big the entire chart area is.
         */
        function setOuterDimensions() {
          var rect = container.node().getBoundingClientRect();
          // Total width and height:
          totalW = parseInt(rect.width, 10);
          totalH = parseInt(rect.height, 10);
        };

        /**
         * Draw chart to correct dimensions.
         */
        function renderStructure() {
          svg.transition().attr('width', totalW)
                          .attr('height', totalH);
        };

        /**
         * Draw the two y axes and ticks.
         * AND set margin.left and margin.right to allow for how wide the tick
         * labels are.
         */
        function renderAxes() {
          renderLeftAxis();
          renderRightAxis();
        };

        function renderLeftAxis() {
          yScaleLeft.range([totalH - margin.bottom, margin.top]);

          yAxisLeft
              .call(d3.axisLeft(yScaleLeft).ticks(20));

          // Find widest left axis tick label and base margin.left on that.

          // Because we have two left axes we need to do this for both.
          var maxw = 0;

          // First, for the left axis that is currently displayed.
          yAxisLeft.selectAll('text').each(function() {
            if(this.getBBox().width > maxw) maxw = this.getBBox().width;
          });


          margin.left = maxw + 10;

          yAxisLeft.attr("transform", "translate(" + margin.left + ",0)");

          yAxisLeftLabel
            .attr('dx', 10)
            .attr('dy', 30)
            .attr('text-anchor', 'start')
            .text(leftKey);

            // .attr('dx', totalW)
            // .attr('dy', 30)
            // .attr('text-anchor', 'end')
            // .text(rightKey);

          // The 'Change' link.

        };

        function renderRightAxis() {
          yScaleRight.range([totalH - margin.bottom, margin.top])

          yAxisRight
              .call(d3.axisRight(yScaleRight).ticks(0));

          // Find widest right axis tick label and base margin.right on that.
          var maxw = 0;

          yAxisRight.selectAll('text').each(function() {
            if(this.getBBox().width > maxw) maxw = this.getBBox().width;
          });

          margin.right = maxw + 10;

          yAxisRight.attr(
                  "transform", "translate(" + (totalW - margin.right) + ",0)");

          yAxisRightLabel
            .attr('dx', totalW)
            .attr('dy', 30)
            .attr('text-anchor', 'end')
            .text(rightKey);
        };

        /**
         * Set dimensions of inner chart area, between y axes.
         * Needs the left and right margins to have been set.
         */
        function setInnerDimensions() {
          // Area of the chart itself:
          chartW = totalW - margin.left - margin.right;
          chartH = totalH - margin.top - margin.bottom;
        };

        /**
         * Draw the lines between the axes.
         */
        function renderLines() {
          var lines = svg.selectAll('.js-line')
                          .data(data);

          // Update
          lines.transition()
              .attr('x2', chartW + margin.left)
              .attr('y1', function(d) { return yScaleLeft(d[leftKey]); })
              .attr('y2', function(d) { return yScaleRight(d[rightKey]); });

          // Enter
          lines.enter()
            .append('line')
              .attr('x1', margin.left)
              .attr('x2', chartW + margin.left)
              .attr('y1', function(d) { return yScaleLeft(d[leftKey]); })
              .attr('y2', function(d) { return yScaleRight(d[rightKey]); })
              .style('fill', d => (d.Color))
              .classed('js-line line', true)
                          .on('mouseover', function(d) {
                            tooltip.html( tooltipFormat(d) );
                            tooltip.style('visibility', 'visible');
                          })
                          .on('mousemove', function(d) {
                            tooltip
                              .style('top', (event.pageY-10)+'px')
                              .style('left',(event.pageX+15)+'px');
                          })
                          .on('mouseout', function(d) {
                            tooltip.style('visibility', 'hidden');
                          });

          // Remove
          lines.exit().remove();
        };

        function renderCirclesleft() {
          var circles1 = svg.selectAll('.js-circle')
                          .data(data);

        // circles.transition()
        //         .attr('x2', chartW + margin.left)
        //         .attr('y1', function(d) { return yScaleLeft(d[leftKey]); })
        
                circles1.enter()
            .append('circle')
              .attr('cx', margin.left)
              .attr('cy', function(d) { return yScaleLeft(d[leftKey]); })
              .style('fill', d => (d.Color))
              .attr("r", 5)
              .classed('js-circle circle', true)
                          .on('mouseover', function(d) {
                            tooltip.html( tooltipFormat(d) );
                            tooltip.style('visibility', 'visible');
                          })
                          .on('mousemove', function(d) {
                            tooltip
                              .style('top', (event.pageY-10)+'px')
                              .style('left',(event.pageX+15)+'px');
                          })
                          .on('mouseout', function(d) {
                            tooltip.style('visibility', 'hidden');
                          })
                          circles1.exit().remove();
        };

        function renderCirclesright() {
          var circles2 = svg.selectAll('.js-circle2')
                          .data(data);

        // circles2.transition()
        //         .attr('x2', chartW + margin.left)
        //         .attr('y2', function(d) { return yScaleRight(d[rightKey]); });
        
            circles2.enter()
            .append('circle')
            .attr('cx', chartW + margin.left)
            .attr('cy', function(d) { return yScaleRight(d[rightKey]); })
            .style('fill', d => (d.Color))
              .attr("r", 5)
              .classed('js-circle2 circle', true)
                          .on('mouseover', function(d) {
                            tooltip.html( tooltipFormat(d) );
                            tooltip.style('visibility', 'visible');
                          })
                          .on('mousemove', function(d) {
                            tooltip
                              .style('top', (event.pageY-10)+'px')
                              .style('left',(event.pageX+15)+'px');
                          })
                          .on('mouseout', function(d) {
                            tooltip.style('visibility', 'hidden');
                          });


                          circles2.exit().remove();
        };


        /**
         * Set the domain of whatever the current left y-axis is.
         */
        // function setLeftAxisDomain() {
        //   var leftMax = d3.max(data, function(d) { return d[leftKey]; });
        //   if (leftKeyOrientation === 'inverted') {
        //     yScaleLeft.domain([leftMax, 0]);
        //   } else {
        //     yScaleLeft.domain([0, leftMax]);
        //   };
        // };

      });
    }; // end chart()

    chart.leftKey1 = function(value) {
      if (!arguments.length) {
        return leftKey1;
      };
      leftKey1 = value;
      return this;
    };
    
    chart.rightKey = function(value) {
      if (!arguments.length) {
        return rightKey;
      };
      rightKey = value;
      return this;
    };
    chart.tooltipFormat = function(value) {
      if (!arguments.length) {
        return tooltipFormat;
      };
      tooltipFormat = value;
      return this;
    };

    return chart;
  };

}());