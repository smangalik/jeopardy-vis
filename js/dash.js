var colNames = ['Show','Round','Value','qLength','qHardWords',
	'qDaleChall','aLength','hasMedia']; // indexed correctly
var colIndex = 0; // number of the current column displayed

var brush_type = "Highlight";

//Global variables for actual brushes
var HSbrush;
var PCbrush;
var BSbrush;

//Global anonymous functions, assigned inside each chart function
var HSbrushFunc;
var PCbrushFunc;
var BSbrushFunc;

d3.selectAll("svg").remove();
drawHS(); // Draw Histogram
drawPC(); // Draw Parallel Coordinates
drawBS(); // Draw Bivariate Scatterplot

function swap_brush(type){
	brush_type = type;
}

/** BRUSH FUNCTIONS **/

function brushAll(indices){
	if(!indices) return;
	HSbrushFunc(indices);
	PCbrushFunc(indices);
	BSbrushFunc(indices);
}