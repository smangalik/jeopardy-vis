var colNames = ['Show','Round','Value','qLength','qHardWords',
	'qDaleChall','aLength','hasMedia']; // indexed correctly
var colIndex = 0; // number of the current column displayed
	
drawHS(0);
 
function drawHS(requestedColumn){
	
	var data = d3.csv("Jeopardy5k.csv", function(error, data) {
		if (error) throw error;
		
		col_name = colNames[requestedColumn];
		var col_array = [];
		
		//clean up entries
		data.forEach(function(d) {		
			item = +d[col_name];		
			if (item == "FALSE") item = 0;
			else if (item == "TRUE") item = 1;
			else if (item == "Jeopardy!") item = 0;
			else if (item == "Double Jeopardy!") item = 1;
    		col_array.push(item);
  		});
  				
		console.log(col_name);	
		console.log(col_array);
		
		update(col_array);
	});
}

function update(inputData){
	
	values = inputData;
		
	var formatCount = d3.format(",.0f");
	
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 740,
    height = 400 - margin.top - margin.bottom;
	
	var x = d3.scale.linear()
		.domain(d3.extent(values))
		.range([0,width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var bins = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

	console.log(bins);

    var y = d3.scale.linear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([height, 20]);
	    
	var color = d3.scale.linear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range(["black", "blue"]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

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
	    .attr("x", function(d,i) { return i*width/bins.length; })
	    .attr("y", function(d,i) { return y(d.length); })
	    //.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
	    .attr("width", 30)
	    .attr("height", function(d) { return height - y(d.length); })
	    .attr("fill", function(d) {
			return color(d.length);
	   	})
	    .on("mouseover", function(d,i){
	    	d3.select(this)
	    	//.transition()
			//.duration(50)
			.attr("width", +d3.select(this).attr("width") + 5)
			.attr("x", +d3.select(this).attr("x") - 2.5)
			.attr("height", +d3.select(this).attr("height") + 10)
			.attr("y", +d3.select(this).attr("y") - 10);
			
			$(this).next().css("visibility","visible");
			
		})
		.on("mouseout", function(d,i){
	    	d3.select(this)
	    	//.transition()
			//.duration(250)
			.attr("width", 30)
			.attr("x", +d3.select(this).attr("x") + 2.5)
			.attr("y", +d3.select(this).attr("y") + 10)
			.attr("height", +d3.select(this).attr("height") - 10)
			.attr("fill", function(d) {
				return color(d.length);
	   		});
			$(this).next().css("visibility","hidden");
		})
		.on("click", function () {
			// update all graphs
		});
	
	//labels
	var texts = bar.append("text")
	    .attr("dy", "0.75em")
	    .attr("y", 15)
	    //.attr("x", this.parentNode.getAttribute("x"))
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.length); });
	
	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.svg.axis().scale(x).orient("bottom"));
	    
}