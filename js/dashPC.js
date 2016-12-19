function drawPC() {

	var margin = {
		top : 20,
		right : 0,
		bottom : 30,
		left : 0
	},
	    width = 800,
	    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
	    y = {},
	    dragging = {};

	var line = d3.svg.line(),
	    axis = d3.svg.axis().orient("left"),
	    background,
	    foreground;

	var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var all_data;

	d3.csv("Jeopardy5k.csv", function(error, data) {
		// Extract the list of dimensions and create a scale for each.
		x.domain( dimensions = d3.keys(data[0]).filter(function(d) {
			return d != "name" && (y[d] = d3.scale.linear().domain(d3.extent(data, function(p) {
				return +p[d];
			})).range([height, 0]));
		}));
		all_data = data;
		// Add grey background lines for context.
		background = svg.append("g").attr("class", "background").selectAll("path").data(data).enter().append("path").attr("d", path);

		// Add blue foreground lines for focus.
		foreground = svg.append("g").attr("class", "foreground").selectAll("path").data(data).enter().append("path").attr("d", path);

		// Add a group element for each dimension.
		var g = svg.selectAll(".dimension").data(dimensions).enter().append("g").attr("class", "dimension").attr("transform", function(d) {
			return "translate(" + x(d) + ")";
		}).call(d3.behavior.drag().origin(function(d) {
			return {
				x : x(d)
			};
		}).on("dragstart", function(d) {
			dragging[d] = x(d);
			background.attr("visibility", "hidden");
		}).on("drag", function(d) {
			dragging[d] = Math.min(width, Math.max(0, d3.event.x));
			foreground.attr("d", path);
			dimensions.sort(function(a, b) {
				return position(a) - position(b);
			});
			x.domain(dimensions);
			g.attr("transform", function(d) {
				return "translate(" + position(d) + ")";
			})
		}).on("dragend", function(d) {
			delete dragging[d];
			transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
			transition(foreground).attr("d", path);
			background.attr("d", path).transition().delay(500).duration(0).attr("visibility", null);
		}));

		// Add an axis and title.
		g.append("g").attr("class", "axis").each(function(d) {
			d3.select(this).call(axis.scale(y[d]));
		}).append("text").style("text-anchor", "middle").attr("y", -9).text(function(d) {
			return d;
		});

		// Add and store a brush for each axis.
		g.append("g").attr("class", "brush").each(function(d) {
			d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", function() {
				//get indices
				var actives = dimensions.filter(function(p) {
					return !y[p].brush.empty();
				}),
				    extents = actives.map(function(p) {
					return y[p].brush.extent();
				});

				var indices = [];
				actives.every(function(p) {
					for (var i = 0; i < all_data.length; i++) {
						if (all_data[i][p] <= extents[0][1] && all_data[i][p] >= extents[0][0])
							indices.push(i);
					}
				});
				brushAll(indices)
			}));
		}).selectAll("rect").attr("x", -5).attr("width", 10);
	});

	function position(d) {
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(g) {
		return g.transition().duration(500);
	}

	// Returns the path for a given data point.
	function path(d) {
		return line(dimensions.map(function(p) {
			return [position(p), y[p](d[p])];
		}));
	}

	function brushstart() {
		d3.event.sourceEvent.stopPropagation();
	}

	// Handles a brush event, toggling the display of foreground lines.
	PCbrushFunc = function(indices) {

		foreground.style("display", "inline");

		background.style("display", "inline");

		if (brush_type == "Highlight") {// make other data points gray
			foreground.style("display", function(d, i) {
				if (indices.indexOf(i) == -1) {
					return "none";
				}
			});
		} else if (brush_type == "Filter") {// make other data points invisible
			foreground.style("display", function(d, i) {
				if (indices.indexOf(i) == -1) {
					return "none";
				}
			});

			background.style("display", function(d, i) {
				if (indices.indexOf(i) == -1) {
					return "none";
				}
			});
			
		} else if (brush_type == "Understate") {// make other data points invisible
			foreground.style("display", function(d, i) {
				if (indices.indexOf(i) != -1) {
					return "none";
				}
			});			
		} else if (brush_type == "Ignore") {// make only other points visible
			foreground.style("display", function(d, i) {
				if (indices.indexOf(i) != -1) {
					return "none";
				}
			});

			background.style("display", function(d, i) {
				if (indices.indexOf(i) != -1) {
					return "none";
				}
			});
		}

	}
}
