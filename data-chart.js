var data = {
    "company": "Hargreaves Sercies PLC",
    "ticker": "PSON:LSE",
    "graphData": [
        {
            "value": 1124,
            "key": "Mon"
        },
        {
            "value": 1123,
            "key": "Tue"
        },
        {
            "value": 1122,
            "key": "Wed"
        },
        {
            "value": 1121,
            "key": "Thu"
        }
    ]
};

var constants = {

	ARTICLE_CHART_PADDING_TOP : 5,
	ARTICLE_CHART_PADDING_RIGHT : 5,
	ARTICLE_CHART_PADDING_BOTTOM : 20,
	ARTICLE_CHART_PADDING_LEFT : 30,

};


var articleChart = function(rawData) {
		
	rawData = JSON.parse(rawData);
	
    var data = [];
    var keys = [];
    
    for (var k = 0; k < rawData.graphData.length; k++) {

		data.push(rawData.graphData[k].value);
		keys.push(rawData.graphData[k].key);

	}
    
    var numSamples = data.length;
    var maxVal = Math.max.apply(Math, data);
    var minVal = Math.min.apply(Math, data);
    var range = maxVal - minVal;
	
	
	var ctx, i, j, x, y;
	var c = ICM.constants;
    var canvasEl = ICM.DOM.qs('#chart')[0];
    
    var chartWidth = canvasEl.width - c.ARTICLE_CHART_PADDING_RIGHT - c.ARTICLE_CHART_PADDING_LEFT;
    var chartHeight = canvasEl.height - c.ARTICLE_CHART_PADDING_BOTTOM - c.ARTICLE_CHART_PADDING_TOP;
    var yScalar = chartHeight / range;
    var xScalar = chartWidth / (numSamples - 1);
    
    ctx = canvasEl.getContext("2d");
    ctx.fillStyle = "#333";
    ctx.font = "10px";
    ctx.strokeStyle="rgba(206,206,206, 1)";
    
    ctx.beginPath();

    /*
     * Print column keys and draw the vertical grid lines
     */ 

    for (i = 0; i < numSamples; i++) {

        x = i * xScalar;
        ctx.fillText(keys[i], x + c.ARTICLE_CHART_PADDING_LEFT - 15, canvasEl.height);
        
        ctx.moveTo(x + c.ARTICLE_CHART_PADDING_LEFT, c.ARTICLE_CHART_PADDING_TOP);
        ctx.lineTo(x + c.ARTICLE_CHART_PADDING_LEFT, chartHeight + c.ARTICLE_CHART_PADDING_TOP);
        
    }

    
    /*
     * Print row keys and draw horizontal grid lines
     */
    
    var count = 0;
    var stepSize = Math.round((maxVal - minVal) / 3); // Divide by number of horizontal grid lines
    
	for (var scale = maxVal; scale >= minVal; scale -= stepSize) {

        y = yScalar * count * stepSize;
        ctx.fillText(scale, 1, y + c.ARTICLE_CHART_PADDING_TOP + 5);
        
        ctx.moveTo(c.ARTICLE_CHART_PADDING_LEFT, y + c.ARTICLE_CHART_PADDING_TOP);
        ctx.lineTo(c.ARTICLE_CHART_PADDING_LEFT + chartWidth, y + c.ARTICLE_CHART_PADDING_TOP );
        
        count++;
        
    }
    ctx.stroke();

	/*
	 * Plot graph
	 */
	
    ctx.strokeStyle = "C00000";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
   
	var rangeConst = chartHeight / range;
	
    for (j = 0; j < numSamples; j++) {
        
        /*
         * Calculate new position and plot
         */
        var pos = rangeConst * (data[j] - minVal);
        ctx.lineTo((j * xScalar) + c.ARTICLE_CHART_PADDING_LEFT, chartHeight - pos + c.ARTICLE_CHART_PADDING_TOP);
    }

	/*
	 * Some nice drop shadow effects
	 */
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "black";
    
    /*
     * And draw!
     */
    ctx.stroke();
	
};