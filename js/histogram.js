var columns = [0,2,4,5,6,7,8,9]; //must be in order
var colIndex = 0; // number of the current column displayed
var data_array;

d3.text("JeopardyDataFinal.csv", function(data){
		data_array = d3.csvParseRows(data);
		document.getElementById('myDropdown').selectedIndex=columns[colIndex];
		switchTo(columns[0]);
	});

 
function switchTo(requestedColumn){
	
	colIndex = columns.indexOf(parseInt(requestedColumn));
	var colNum = columns[colIndex];
	document.getElementById('myDropdown').selectedIndex=colIndex;
	
	var row_data = [];
	for(i = 1; i < data_array.length; i++){
		var item = data_array[i][colNum];
		if (item == "FALSE")
			row_data.push(0);
		else if (item == "TRUE")
			row_data.push(1);
		else if (item == "Jeopardy!")
			row_data.push(0);
		else if (item == "Double Jeopardy!")
			row_data.push(1);
		else
			row_data.push(parseInt(item));
	}
	update(row_data);
}

    
// when called gives a pop up with info in row 1    
function showRow(){
	d3.csv("JeopardyDataFinal.csv", function(jData) {
		alert(jData[0].Show + " " + //interesting 4000-6000 
			jData[0].AirDate + " " +  
			jData[0].Round + " " +  //interesting 0-1
			jData[0].Category + " " +  
			jData[0].Value + " " + //interesting 100 - 2000
			jData[0].qLength + " " +  //interesting 0 - 50
			jData[0].qHardWords + " " +  //interesting 0 - 20
			jData[0].qDaleChall + " " +  //interesting 0 - 20
			jData[0].aLength + " " + //interesting 0 - 50
			jData[0].hasMedia + " " + //eh 0 - 1
			jData[0].mediaLink + " " + 
			jData[0].Question + " " + 
			jData[0].Answer);
		console.log(jData[0]);
	});
}

function update(inputData){
	
	d3.selectAll("svg").remove();
	
	data = inputData;
		
	var formatCount = d3.format(",.0f");
	
	var margin = {top: 25, right: 50, bottom: 50, left: 50};
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	
	var x = d3.scaleLinear().domain(d3.extent(data)).range([0,width]);
	
	var bins = d3.histogram()
	    .domain(d3.extent(data))
	    .thresholds(20)
	    (data);
	
	var y = d3.scaleLinear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([height, 20]);
	    
	var color = d3.scaleLinear()
	    //.domain([0, d3.max(bins)])//, function(d) { return d.length; })])
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range(["black", "blue"]);
	    
	//canvas
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	    
	// assign bar positions
	var bar = svg.selectAll(".bar")
	    .data(bins)
	  .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
	    .on("mouseover", function(d){
	    	d3.select(this).selectAll("test")
			.attr("visbility", "hidden");
		});
	
	//bars
	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
	    .attr("height", function(d) { return height - y(d.length); })
	    .attr("fill", function(d) {
			return color(d.length);
	   	})
	    .on("mouseover", function(d,i){
	    	d3.select(this)
	    	//.transition()
			//.duration(50)
			.attr("width", +d3.select(this).attr("width") + 10)
			.attr("x", +d3.select(this).attr("x") - 5)
			.attr("height", +d3.select(this).attr("height") + 20)
			.attr("y", +d3.select(this).attr("y") - 20);
			
			$(this).next().css("visibility","visible");
			
		})
		.on("mouseout", function(d,i){
	    	d3.select(this)
	    	//.transition()
			//.duration(250)
			.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
			.attr("x", 1)
			.attr("height", function(d) { return height - y(d.length); })
			.attr("y", +d3.select(this).attr("y") + 20)
			.attr("fill", function(d) {
				return color(d.length);
	   		});
			$(this).next().css("visibility","hidden");
		})
		.on("click", function () {
			colIndex++;
			if (colIndex > columns.length - 1)
				colIndex = 0;
			switchTo(columns[colIndex]);
		});
	
	//labels
	var texts = bar.append("text")
	    .attr("dy", "0.75em")
	    .attr("y", -32)
	    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.length); });
	
	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));
	    
}