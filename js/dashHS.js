
function drawHS(){
	
	var data = d3.csv("Jeopardy5k.csv", function(error, data) {
		if (error) throw error;
		
		requestedColumn = document.getElementById('myDropdownX').selectedIndex;
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
		.attr("class", "barRect")
	    .attr("x", function(d,i) { return i*width/bins.length; })
	    .attr("y", function(d,i) { return y(d.length); })
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
			.attr("height", +d3.select(this).attr("height") - 10);
			//.attr("fill", function(d) {
			//	return color(d.length);
	   		//});
			$(this).next().css("visibility","hidden");
		})
		.on("click", function (d,i) {
			//update all graphs with info info in that bin
			d3.select(this)
			indices = [];
			bin = bins[i];
			let unique = [...new Set(bin)];
			bin = unique; 
			//push the index of every entry with a value in bin

			//for (j = 0; j < bin.length; j++){
			//	indices.push(inputData.indexOf(bin[j]));
			//}
			for(j = 0; j < inputData.length; j++){
				for(k = 0; k < bin.length; k++){
					if (inputData[j] == bin[k]){ 
						indices.push(j); 
					}		
				}
			}
	
			console.log(inputData);
			console.log(bin);
			console.log(indices);
			brushAll(indices);
		});
	
	//labels
	var texts = bar.append("text")
	    .attr("y", -10)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.length); });
	
	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.svg.axis().scale(x).orient("bottom"));
	    
	// Handles a brush event, toggling the display of foreground lines.
	HSbrushFunc = function(indices) {

		//revert old status
		d3.selectAll("rect.barRect").attr("fill", function(d) {
			return color(d.length);
	   	});
		
		// which data points are selected
		var actives = [];
		for(i = 0; i < indices.length; i++){
			actives.push(inputData[(indices[i])]);
		}
				
		// which bins are selected
		var active_bins = [];
		for(i = 0; i < bins.length; i++){
		  bin = bins[i];
		  for(j = 0; j < actives.length; j++){
		  	done = false;
		  	if (done) continue;
	  		if(bin.indexOf(actives[j]) != -1){
	  			done = true;
	  			active_bins.push(i);
	  		}
		  }
	 	}	
	 	
	 	let unique = [...new Set(active_bins)]; 
	 	active_bins = unique;		

		if (brush_type == "Highlight") {// make other bins gray
			d3.selectAll("rect.barRect").attr("fill", function(d,i) {
				if (active_bins.indexOf(i) == -1){
					return "#ddd";
				}
				if (active_bins.indexOf(i) != -1){
					return color(d.length);
				}		
	   		});
	   	}
	   		else if (brush_type == "Understate") {// make other bins gray
			d3.selectAll("rect.barRect").attr("fill", function(d,i) {
				if (active_bins.indexOf(i) == -1){
					return color(d.length);
				}
				if (active_bins.indexOf(i) != -1){
					return "#ddd";
				}		
	   		});	
	   		
		} else if (brush_type == "Filter") {// make other bins invisible
			d3.selectAll("rect.barRect").attr("fill", function(d,i) {
				if (active_bins.indexOf(i) == -1){
					return "none";
				}
				if (active_bins.indexOf(i) != -1){
					return color(d.length);
				}		
	   		});
		} else if (brush_type == "Ignore") {// make only other bins visible
			d3.selectAll("rect.barRect").attr("fill", function(d,i) {
				if (active_bins.indexOf(i) == -1){
					return color(d.length);
				}
				if (active_bins.indexOf(i) != -1){
					return "none";
				}		
	   		});
		}
	}

}
