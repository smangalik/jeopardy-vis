// Why is the eigenvector of a covariance matrix equal to a principal component?
var columns = [0,1]; //must be in order
var colNames = ['x', 'y']; // indexed correctly
var selectedX = colNames[0];
var selectedY = colNames[1];

function xSwitchTo(requestedColumn){
	selectedX = colNames[requestedColumn];
	console.log("change x to " + selectedX);
	update(); 
}
function ySwitchTo(request){
	selectedY = colNames[request];
	console.log("change y to " + selectedY);
	update(); 
}

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.linear().range(["rgb(6,12,233)", "rgb(255, 200, 0)"]);

pcaplot();
screeplot();

function pcaplot(){

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = d3.csv("biplot.csv", function(error, data) {
	if (error) throw error;

  data.forEach(function(d) {
    d[selectedX] = +d[selectedX]; 
    d[selectedY] = +d[selectedY]; 
  });

  x.domain(d3.extent(data, function(d) { return d[selectedX]; })).nice(); 
  y.domain(d3.extent(data, function(d) { return d[selectedY]; })).nice(); 
  color.domain(d3.extent(data, function(d) { return d[selectedY]; })).nice(); 

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Principal Component 1");
  
  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Principal Component 2");
  
  // dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d[selectedX]); }) 
      .attr("cy", function(d) { return y(d[selectedY]); }) 
      .attr("fill", function(d) {
			return color(d[selectedY]);
	   	})

});
}

function screeplot(){

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("scree.csv", function(error, data) {

    data.forEach(function(d) {
        d.PC = +d.PC;
        d.Percent = +d.Percent;
        d.Cumulative = +d.Cumulative;
    });
	
  x.domain(data.map(function(d) { return d.PC; }));
  y.domain([0, 100]);

  //x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", ".25em")
      .attr("dy", ".60em")
      .attr("transform", "rotate(0)" );
  
  //y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percent Contribution");
      
  // Define the line
  var valueline = d3.svg.line()
    .x(function(d) { return x(d.PC); })
    .y(function(d) { return y(d.Cumulative); });
    
  // Add the line
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .attr("transform", "translate(35)");

  //bars
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "rgb(6,12,233)")
      .attr("x", function(d) { return x(d.PC); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Percent); })
      .attr("height", function(d) { return height - y(d.Percent); });

});

}