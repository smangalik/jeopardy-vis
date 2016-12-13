/// given a matrix of distances between some points, returns the
/// point coordinates that best approximate the distances
var matrix = [
	[1, -0.001, 0.002, 0.012, 0.009, 0.004, -0.015, 0.057], 
	[-0.001, 1, 0.543, 0.039, 0.057, 0.029, 0.012, 0.023], 
	[0.002, 0.543, 1, 0.059, 0.079, 0.039, 0.033, 0.051], 
	[0.012, 0.039, 0.059, 1, 0.684, -0.202, 0.046, 0.45], 
	[0.009, 0.057, 0.079, 0.684, 1, 0.406, 0.024, 0.253], 
	[0.004, 0.029, 0.039, -0.202, 0.406, 1, -0.033, -0.075], 
	[-0.015, 0.012, 0.033, 0.046, 0.024, -0.033, 1, 0.038], 
	[0.057, 0.023, 0.051, 0.45, 0.253, -0.075, 0.038, 1]
];

var corr_matrix = [];
for ( i = 0; i < matrix.length; i++) {
	row = [];
	for ( j = 0; j < matrix.length; j++) {
		row.push(1 - Math.abs(matrix[i][j]));
	}
	corr_matrix.push(row);
}

coors = mds(corr_matrix);
console.log(coors);

function mds(distances, dimensions) {
	dimensions = dimensions || 2;

	// square distances
	var M = numeric.mul(-.5, numeric.pow(distances, 2));

	// double centre the rows/columns
	function mean(A) {
		return numeric.div(numeric.add.apply(null, A), A.length);
	}

	var rowMeans = mean(M),
	    colMeans = mean(numeric.transpose(M)),
	    totalMean = mean(rowMeans);

	for (var i = 0; i < M.length; ++i) {
		for (var j = 0; j < M[0].length; ++j) {
			M[i][j] += totalMean - rowMeans[i] - colMeans[j];
		}
	}

	// take the SVD of the double centred matrix, and return the
	// points from it
	var ret = numeric.svd(M),
	    eigenValues = numeric.sqrt(ret.S);
	return ret.U.map(function(row) {
		return numeric.mul(row, eigenValues).splice(0, dimensions);
	});
};


/// reads in a CSV made from the data above
/// Makes a scatterplot with labels
var labels = ['Show','Round','Value','Question Length','Hard Words', 
	'Dale Chall Score','Answer Length','Video Question?'];
var columns = [0,1,2]; //must be in order
var colNames = ['x', 'y', 'Data Labels']; // indexed correctly
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

update();

function update(){
	
console.log("drawing " + selectedX + " vs " + selectedY);
d3.selectAll("svg").remove();

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

var data = d3.csv("corrMDS.csv", function(error, data) {
	if (error) throw error;

  data.forEach(function(d) {
    d[selectedX] = +d[selectedX]; 
    d[selectedY] = +d[selectedY]; 
  });
  
  console.log(data);

  x.domain(d3.extent(data, function(d) { return d[selectedX]; })).nice(); 
  y.domain(d3.extent(data, function(d) { return d[selectedY]; })).nice(); 

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
      .text("");
  
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
      .text("");
  
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

 // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles 
  /*
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color); */
      
  // draw legend colored rectangles
  legend.append("circle")
      .attr("cx", width - 12)
      .attr("cy", 8)
      .attr("r", 6)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d,i) { return labels[i];})

});
}