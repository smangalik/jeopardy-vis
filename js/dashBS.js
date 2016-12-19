var colNames = ['Show', 'Round', 'Value', 'qLength', 'qHardWords', 'qDaleChall', 'aLength', 'hasMedia'];
// indexed correctly
var colIndex = 0;
// number of the current column displayed

var selectedX = colNames[0];
var selectedY = colNames[0];

document.getElementById('myDropdownX').selectedIndex = 0;
document.getElementById('myDropdownY').selectedIndex = 0;

function xSwitchTo(requestedColumn) {
	selectedX = colNames[requestedColumn];
	d3.selectAll("svg").remove();
	drawBS();
	drawPC();
	drawHS();
}

function ySwitchTo(request) {
	selectedY = colNames[request];
	d3.selectAll("svg").remove();
	drawBS();
	drawPC();
	drawHS();
}

function xySwitchTo(requestX, requestY) {
	selectedX = colNames[requestX];
	selectedY = colNames[requestY];
	d3.selectAll("svg").remove();
	drawBS();
	drawPC();
	drawHS();
}

function drawBS() {

	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 40
	},
	    width = 740,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.linear().range([0, width]);

	var y = d3.scale.linear().range([height, 0]);

	var color = d3.scale.linear().range(["rgb(6,12,233)", "rgb(255, 200, 0)"]);

	update();

	function update() {

		var xAxis = d3.svg.axis().scale(x).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left");

		var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// add the tooltip area to the webpage
		var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

		var data = d3.csv("Jeopardy5k.csv", function(error, data) {
			if (error)
				throw error;

			data.forEach(function(d) {
				d[selectedX] = +d[selectedX];
				d[selectedY] = +d[selectedY];
			});

			x.domain(d3.extent(data, function(d) {
				return d[selectedX];
			})).nice();
			y.domain(d3.extent(data, function(d) {
				return d[selectedY];
			})).nice();
			color.domain(d3.extent(data, function(d) {
				return d[selectedY];
			})).nice();

			// x-axis
			svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(selectedX);

			// y-axis
			svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(selectedY);

			// dots
			var dots = svg.selectAll(".dot").data(data).enter().append("circle").attr("class", "dot").attr("r", 3.5).attr("cx", function(d) {
				return x(d[selectedX]);
			}).attr("cy", function(d) {
				return y(d[selectedY]);
			}).attr("fill", function(d) {
				return color(d[selectedY]);
			}).on("mouseover", function(d) {
				tooltip.transition().duration(200).style("opacity", .9);
				tooltip.html(selectedX + ": " + d[selectedX] + "<br>" + selectedY + ": " + d[selectedY]).style("left", (d3.event.pageX + 5) + "px").style("top", (d3.event.pageY - 28) + "px");
			}).on("mouseout", function(d) {
				tooltip.transition().duration(500).style("opacity", 0);
			});

			var BSbrush = svg.append("g")
				.attr("class", "brush")
				.call(d3.svg.brush()
				.x(d3.scale.identity().domain([0, width]))
				.y(d3.scale.identity().domain([0, height]))
				.on("brush", function() {
					// capture all indices
					indices = [];
					var s = d3.event.target.extent();
					dots.each(function(d,i) {
						var point = d3.select(this);
		    				if(point.attr("cx") >= s[0][0] 
		    					&& point.attr("cx") <= s[1][0] 
		    					&& point.attr("cy") >= s[0][1] 
		    					&& point.attr("cy") <= s[1][1]) indices.push(i);
					});
					brushAll(indices);
				})); 

		});
	}

	
	BSbrushFunc = function(indices) {
		// revert to old state
		d3.selectAll(".dot").attr("fill", function(d) {return color(d[selectedY]);});
		
		// brush functions
		if (brush_type == "Highlight") {
			d3.selectAll(".dot").attr("fill", function(d,i) {	
				if (indices.indexOf(i) == -1){return "#ddd";}
				else{return color(d[selectedY]);}
			});
		} else if (brush_type == "Ignore") {
			d3.selectAll(".dot").attr("fill", function(d,i) {	
				if (indices.indexOf(i) != -1){return "none";}
				else{return color(d[selectedY]);}
			});
		} else if (brush_type == "Filter") {
			d3.selectAll(".dot").attr("fill", function(d,i) {	
				if (indices.indexOf(i) == -1){return "none";}
				else{return color(d[selectedY]);}
			});
		} else if (brush_type == "Understate") {
			d3.selectAll(".dot").attr("fill", function(d,i) {	
				if (indices.indexOf(i) == -1){return color(d[selectedY]);}
				else{return "#ddd";}
			});
		}
	};

}
