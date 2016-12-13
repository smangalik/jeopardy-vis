var columns = [0,2,4,5,6,7,8,9]; //must be in order
var colNames = ['Show','AirDate','Round','Category',
	'Value','qLength','qHardWords', 'qDaleChall',
	'aLength','hasMedia','mediaLink','Question','Answer']; // indexed correctly


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
    width = 100 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.linear().range(["rgb(6,12,233)", "rgb(255, 200, 0)"]);

function update(xChoice, yChoice){
	
	var selectedX = colNames[xChoice];
	var selectedY = colNames[yChoice];
		
	console.log("drawing " + selectedX + " vs " + selectedY);
	
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
	
	var data = d3.csv("JeopardyDataMiniMini.csv", function(error, data) {
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
		    
		  
		  // y-axis
		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    
		  
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

update(4,4);
update(4,5);
update(4,6);
update(4,7);
update(4,9);


var t1 = document.createElement("span");
t1.className = 'row1';
document.body.appendChild(t1);
t1.innerHTML = "Value";
var div = document.createElement("div");
div.className = 'filler';
document.body.appendChild(div);

update(5,4);
update(5,5);
update(5,6);
update(5,7);
update(5,9);

var t2 = document.createElement("span");
t2.className = 'row2';
document.body.appendChild(t2);
t2.innerHTML = "Question Length";
var div = document.createElement("div");
div.className = 'filler';
document.body.appendChild(div);

update(6,4);
update(6,5);
update(6,6);
update(6,7);
update(6,9);

var t3 = document.createElement("span");
t3.className = 'row3';
document.body.appendChild(t3);
t3.innerHTML = "Number of Hard Words";
var div = document.createElement("div");
div.className = 'filler';
document.body.appendChild(div);

update(7,4);
update(7,5);
update(7,6);
update(7,7);
update(7,9);

var t4 = document.createElement("span");
t4.className = 'row4';
document.body.appendChild(t4);
t4.innerHTML = "Dale Chall Score";
var div = document.createElement("div");
div.className = 'filler';
document.body.appendChild(div);

update(9,4);
update(9,5);
update(9,6);
update(9,7);
update(9,9);

var t5 = document.createElement("span");
t5.className = 'row5';
document.body.appendChild(t5);
t5.innerHTML = "Video Question?";
var div = document.createElement("div");
div.className = 'filler';
document.body.appendChild(div);

var t5 = document.createElement("span");
t5.className = 'row6';
document.body.appendChild(t5);
t5.innerHTML = "<pre> Value        Q. Length      Hard Words     Dale Chall    Video Question</pre>";
