var ChartField = function() {
	Canvas.call(this);
	this.type = "ChartField";
};

Util.extend(ChartField, Canvas);
ChartField.types = {};
ChartField.func = {};
ChartField.addProperty("data",undefined);
ChartField.addProperty("xLineOffset",20);
ChartField.addProperty("yLineOffset",40);
ChartField.addProperty("xTextOffset",10);
ChartField.addProperty("yTextOffset",10);
ChartField.addProperty("showYLabels",true);
ChartField.addProperty("options",{
	animation:false,
	scaleStartValue:2,
	//scaleLabel: divider + "*<%=value%>",
	scaleSteps : 12,
    scaleStepWidth : 2,
	scaleOverride:true
});
ChartField.addProperty("guideLineWidth",10);
ChartField.addProperty("xStep",50);
ChartField.addProperty("scaleX",true);
ChartField.addProperty("showXLabels",false);

ChartField.func.afterDraw = function(){
	this._elements.canvas.on("parentVisibleChanged", this.refresh, this);
	this._elements.canvas.on("widthChanged", this.refresh, this);
	this._elements.canvas.on("heightChanged", this.refresh, this);
	this.refresh();
};

ChartField.prototype.refresh = function(){
	if (this._elements.canvas.width() == 0 || this._elements.canvas.height() == 0) {
		return;
	}
	this.clear();
	
	var params = {
		xLineOffset : this.xLineOffset(),
		yLineOffset : this.yLineOffset(),
		xFieldWidth : this._elements.canvas.width() - this.yLineOffset() * 2,
		yFieldHeight : this._elements.canvas.height() - this.xLineOffset() * 2,
		lineWidth : 2
	}
	var data = this.data();
	/*
	 * drawing coordinateLines
	 */
	this.applySizes();
	if (!this._values.data) {
		return;
	}
	
	
	params.max = this._values.options.scaleStepWidth * this._values.options.scaleSteps;
	if (this._values.scaleX){
		this.xStep(params.xFieldWidth / data.datasets[0].data.length);
	}
	
	this.drawGuideLines(data, params);
	
	for (var k in data.datasets){
		var dataSet = data.datasets[k];
		switch(dataSet.type){
			case "curve":
				ChartField.types.curve.call(this,dataSet, this._values.options, params);
				break;
			case "lines":
				ChartField.types.lines.call(this,dataSet, this._values.options, params);
				break;
			default:
				console.error("No chart type:" + dataSet.type);
		}
	}
};

ChartField.prototype.drawGuideLines = function(data, params){
	var max = params.max;
	var xLineOffset = this.xLineOffset();
	var yLineOffset = this.yLineOffset();
	var xPosition = this._elements.canvas.height() - xLineOffset;
	var yPosition = this._elements.canvas.width() - yLineOffset;
	var opts = this._values.options;
	var xTextOffset = 20;
	var stepRatio = params.yFieldHeight / opts.scaleSteps;
	
	
	
	this.beginPath();
	this.drawColor("#eeeeee");
	for (var k in data.labels) {
		var x = yLineOffset + k * this._values.xStep;
		this.drawLine(x,xPosition, x ,xPosition - params.yFieldHeight);
	}
	
	for (var i = 0; i < opts.scaleSteps; i++) {
		var y = this._values.height - xLineOffset - (i + 1) * stepRatio;
		var x = yLineOffset;
		this.drawLine(x, y, x + params.xFieldWidth ,y);
	}
	this.stroke();
	
	this.beginPath();
	this.drawColor("#000000");
	
	for (var k in data.labels) {
		var x = yLineOffset + k * this._values.xStep;
		this.drawLine(x,xPosition + this._values.guideLineWidth / 2, x ,xPosition - this._values.guideLineWidth / 2);
		if (this._values.showXLabels) {
			this.fillText(data.labels[k], x, xPosition + this._values.guideLineWidth / 2 + this.yTextOffset());
		}
	}
	if (this._values.showYLabels) {
		for (var i = 0; i < opts.scaleSteps; i++) {
			var val = (i + 1) * opts.scaleStepWidth;
			var y = this._values.height - xLineOffset - (i + 1) * stepRatio;
			var x = yLineOffset;
			this.fillText(val, x - xTextOffset, y);
			this.drawLine(x + this._values.guideLineWidth / 2, y, x - this._values.guideLineWidth / 2 ,y);
		}
	}
	this.stroke();
	this.drawLines([
	   [params.yLineOffset, params.xLineOffset],
	   [params.yLineOffset, this._elements.canvas.height() - params.xLineOffset],
	   [this._elements.canvas.width() - params.yLineOffset,this._elements.canvas.height() - params.xLineOffset]
	]);
	
};

ChartField.prototype.drawDataSet = function(dataSet, ratio){
	if (ratio === undefined) {
		ratio = 1;
	}
	var xLineOffset = this.xLineOffset();
	var yLineOffset = this.yLineOffset();
	var xFieldWidth = this._elements.canvas.width() - xLineOffset * 2;
	var yFieldHeight = this._elements.canvas.height() - yLineOffset * 2;
	
	var count = xFieldWidth / this._values.xStep;
	var lines = [];
	for (var x = 0; x < count; x ++){
		var realX = x * this._values.xStep + yLineOffset;
		var realY = yFieldHeight - (dataSet.data[x] * ratio) + xLineOffset;
		lines.push([realX, realY]);
	}
	this.drawLines(lines);
}

ChartField.func.dataChanged = function(){
	/*var data = this._values.data;
	var length = data.labels.length;
	var ratio = this._elements.canvas.width() / length; 
	for (var k in data.labels){
		
	}*/
	this.refresh();
};


ChartField.on("afterDraw", ChartField.func.afterDraw);
ChartField.on("dataChanged", ChartField.func.dataChanged);