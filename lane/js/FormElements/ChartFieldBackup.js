var ChartField = function() {
	Canvas.call(this);
	this.type = "ChartField";
};
Util.extend(ChartField, Canvas);
ChartField.func = {};
ChartField.addProperty("data",undefined);
ChartField.addProperty("xLineOffset",20);
ChartField.addProperty("yLineOffset",40);
ChartField.addProperty("xTextOffset",10);
ChartField.addProperty("yTextOffset",10);
ChartField.addProperty("showYLabels",true);
ChartField.addProperty("guideLineWidth",20);
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
	var xLineOffset = this.xLineOffset();
	var yLineOffset = this.yLineOffset();
	var xFieldWidth = this._elements.canvas.width() - xLineOffset * 2;
	var yFieldHeight = this._elements.canvas.height() - yLineOffset * 2;
	/*var data = {
			labels : [1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : [65,59,90,81,56,55,40]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [28,48,40,19,96,27,100]
				}
			]
		}*/
	var data = this.data();
	/*for(var k = 0; k < 24; k++) {
		data.labels[k] = k;
		data.datasets[0].data[k] = Math.random() * 100;
		data.datasets[1].data[k] = Math.random() * 100;
	}*/
	//this.data(data);
	/*
	 * drawing coordinateLines
	 */
	this.applySizes();
	if (!this._values.data) {
		return;
	}
	this.drawColor("#000000");
	this.drawLines([
	   [yLineOffset, xLineOffset],
	   [yLineOffset, this._elements.canvas.height() - xLineOffset],
	   [this._elements.canvas.width() - yLineOffset,this._elements.canvas.height() - xLineOffset]
	]);
	
	var max = 0;
	for (var k in data.datasets){
		var dataSet = data.datasets[k];
		for (var x in dataSet.data){
			var value = dataSet.data[x];
			max = Math.max(max, value);
		}
	};
	var ratio
	if (max != 0) {
		ratio = yFieldHeight / max;
	} else {
		ratio = 1;
	}
	
	
	if (this._values.scaleX){
		this.xStep(xFieldWidth / data.datasets[0].data.length);
	}
	this.drawGuideLines(data, max);
	
	
	
	
	for (var k in data.datasets){
		var dataSet = data.datasets[k];
		this.drawColor(dataSet.strokeColor);
		this.drawDataSet(dataSet, ratio);
	}
	/*this.drawLines([
	   [1,1],
	   [00,150]
	]);*/ 
};

ChartField.prototype.drawGuideLines = function(data, max){
	var xLineOffset = this.xLineOffset();
	var yLineOffset = this.yLineOffset();
	var xPosition = this._elements.canvas.height() - xLineOffset;
	var yPosition = this._elements.canvas.width() - yLineOffset;
	this.beginPath();
	for (var k in data.labels) {
		var x = yLineOffset + k * this._values.xStep;
		this.drawLine(x,xPosition + this._values.guideLineWidth / 2, x ,xPosition - this._values.guideLineWidth / 2);
		//console.log(x,xPosition + this._values.guideLineWidth / 2);
		if (this._values.showXLabels){
			this.fillText(data.labels[k], x, xPosition + this._values.guideLineWidth / 2 + this.yTextOffset());
		}
	}
	if (this._values.showYLabels){
		this.fillText(max, yLineOffset - 20, xLineOffset);
	}
	this.stroke();
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