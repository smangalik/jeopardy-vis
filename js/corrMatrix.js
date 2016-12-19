function generateCorrMatrix(){
	d3.csv("JeopardyDataFinal.csv", function(data) {
		var size = columns.length;
		var data_array = [];
		for ( i = 0; i < size; i++) {
			data_array[i] = [];
			for ( j = 0; j < data.length; j++) {
				data_array[i][j] = +data[j][colNames[columns[i]]];
			}
		}
		// Create the correlation matrix
		for ( i = 0; i < size; i++) {
			for ( j = 0; j < size; j++) {
				var xs = data_array[0];
				var ys = data_array[0];	
				//console.log(Correlation(xs, ys));					
			}
		}
		var corr_matrix = [
			[1,			-0.001,	0.002,	0.012,	0.009,	0.004,	-0.015,	0.057],
			[-0.001,	1,		0.543,	0.039,	0.057,	0.029,	0.012,	0.023],
			[0.002,		0.543,	1,		0.059,	0.079,	0.039,	0.033,	0.051],
			[0.012,		0.039,	0.059,	1,		0.684,	-0.202,	0.046,	0.45],
			[0.009,		0.057,	0.079,	0.684,	1,		0.406,	0.024,	0.253],
			[0.004,		0.029,	0.039,	-0.202,	0.406,	1,		-0.033,	-0.075],
			[-0.015,	0.012,	0.033,	0.046,	0.024,	-0.033,	1,		0.038],
			[0.057,		0.023,	0.051,	0.45,	0.253,	-0.075,	0.038,	1]
		];
	});
}


function Correlation(xs, ys) {
	var sx = 0.0;
	var sy = 0.0;
	var sxx = 0.0;
	var syy = 0.0;
	var sxy = 0.0;

	var n = xs.length;

	for ( i = 0; i < n; ++i) {
		var x = xs[i];
		var y = ys[i];

		sx += x;
		sy += y;
		sxx += x * x;
		syy += y * y;
		sxy += x * y;
	}

	// covariation
	cov = sxy / n - sx * sy / n / n;
	// standard error of x
	sigmax = Math.sqrt(sxx / n - sx * sx / n / n);
	// standard error of y
	sigmay = Math.sqrt(syy / n - sy * sy / n / n);

	// correlation is just a normalized covariation
	corr = cov / sigmax / sigmay;

	return Math.round(corr * 1000) / 1000;
}

function scaleCells(id) {
	var columns = [0, 2, 4, 5, 6, 7, 8, 9]; //must be in order
	var colNames = ['Show', 'AirDate', 'Round', 'Category', 'Value', 
	'qLength', 'qHardWords', 'qDaleChall', 'aLength', 'hasMedia', 
	'mediaLink', 'Question', 'Answer']; // indexed correctly

	var pos_color = d3.scale.linear().domain([0, 1]).range(["white", "red"]);
	var neg_color = d3.scale.linear().domain([-1, 0]).range(["blue", "white"]);
	
	var table = document.getElementById(id);
	for (var r = 1,	n = table.rows.length; r < n; r++) {
		for (var c = 1, m = table.rows[r].cells.length; c < m; c++) {
			table.rows[r].cells[c].onclick = function () {
                // call the redraw functions
                x_coordinate = this.cellIndex - 1; // [0-7]
                y_coordinate = this.parentNode.rowIndex - 1; // [0-7]
                console.log('Draw: ' + colNames[columns[x_coordinate]]
                	+ ' by ' + colNames[columns[y_coordinate]]);
                xySwitchTo(x_coordinate,y_coordinate);
                document.getElementById('myDropdownX').selectedIndex = x_coordinate;
				document.getElementById('myDropdownY').selectedIndex = y_coordinate;
            };    
			var value = +table.rows[r].cells[c].innerHTML;
			if(value < 0)
				table.rows[r].cells[c].style.backgroundColor = neg_color(value);
			if(value > 0)
				table.rows[r].cells[c].style.backgroundColor = pos_color(value);
		}
	}
}
