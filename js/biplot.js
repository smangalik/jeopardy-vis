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
    
var color = d3.scale.category10();

var color = d3.scale.linear().range(["rgb(6,12,233)", "rgb(255, 200, 0)"]);

pcaplot();

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

colors = ['red','green','purple','orange','gray','magenta','cyan','brown'];
labels = ['Show','Value','Question Length','Dale Chall Score','Hard Words',
	'Answer Lengh','Round', 'Value']
  // arrows
  //center is (415,270)
  //left, right, top, bottom border = [0,830,0,450]
  svg.append("line") // SHOW
    .attr("x1", 0)
    .attr("y1", 285)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[0]);
  
  svg.append("line")
    .attr("x1", 400) // VALUE
    .attr("y1", 0)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[1]);
    
  svg.append("line")
    .attr("x1", 830) // Q_LENGTH
    .attr("y1", 225)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[2]);
    
   svg.append("line")
    .attr("x1", 400) // Q_DALE_CHALL
    .attr("y1", 450)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[3]);
    
   svg.append("line")
    .attr("x1", 525) // Q_HARD_WORDS
    .attr("y1", 450)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[4]);
    
   svg.append("line")
    .attr("x1", 830) // A_LENGTH
    .attr("y1", 50)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[5]);
    
   svg.append("line")
    .attr("x1", 830) // ROUND
    .attr("y1", 265)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[6]);
    
   svg.append("line")
    .attr("x1", 425) // VALUE
    .attr("y1", 0)
    .attr("x2", 415) //CENTER
    .attr("y2", 270) //CENTER
    .attr("stroke-width", 2)
    .attr("stroke", colors[7]);
    
   // draw legend
  var legend = svg.selectAll(".legend")
      .data(colors)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles 
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d,i){return colors[i]}); 

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) { return labels[i];})

});
}