var ChartField = function() {
	Canvas.call(this);
};
Util.extend(ChartField, Canvas);
ChartField.type = "ChartField";
ChartField.func = {};
ChartField.prototype.data = ChartField.addProperty("data",undefined);
ChartField.prototype.xLineOffset = ChartField.addProperty("xLineOffset",20);
ChartField.prototype.yLineOffset = ChartField.addProperty("yLineOffset",40);
ChartField.prototype.xTextOffset = ChartField.addProperty("xTextOffset",10);
ChartField.prototype.yTextOffset = ChartField.addProperty("yTextOffset",10);
ChartField.prototype.options = ChartField.addProperty("options",{});
ChartField.prototype.showYLabels = ChartField.addProperty("showYLabels",true);
ChartField.prototype.guideLineWidth = ChartField.addProperty("guideLineWidth",20);
ChartField.prototype.xStep = ChartField.addProperty("xStep",50);
ChartField.prototype.scaleX = ChartField.addProperty("scaleX",true);
ChartField.prototype.showXLabels = ChartField.addProperty("showXLabels",false);

ChartField.func.afterDraw = function(){
	this._elements.canvas.on("parentVisibleChanged", this.refresh, this);
	this._elements.canvas.on("widthChanged", this.refresh, this);
	this._elements.canvas.on("heightChanged", this.refresh, this);
	this.refresh();
};

ChartField.prototype.refresh = function(){
	var my = this;
	if (this._elements.canvas.width() == 0 || this._elements.canvas.height() == 0) {
		return;
	}
	
	var chartData = this.data();
	if (!chartData) {
		return;
	}

	this.applySizes();
	var data = {
		labels:chartData.labels,
		datasets:[]
	}
	var lines = [];
	for (var k in chartData.datasets){
		if (chartData.datasets[k].type == "curve"){
			data.datasets.push(chartData.datasets[k]);
		} else {
			lines.push(chartData.datasets[k]);
		}
	}
	var periodCount = data.labels.length;
	this._v.options.callBack = function(){
		my.trigger("frameEnd");
		var context = my.getContext();
		var yAxisX = 30;
		var xAxisOffset = 25;
		var xAxisY = my.height() - xAxisOffset;
		var yAxisXFinalOffset = 2;
		var xStep = Math.ceil((my.width() - yAxisX - yAxisXFinalOffset) / periodCount);
		
		
		for (var k in data.labels){
			for (var lineK in lines){
				var line = lines[lineK];
				if (true || line.data[k]){
					context.beginPath();
					context.moveTo(yAxisX + k * xStep, xAxisY);
					context.lineTo(yAxisX + k * xStep,20);
					context.strokeStyle = '#ff0000';
					context.stroke();
				}
			}
			//debugger;
			
		}
	};
	var myNewChart = new Chart(this.getContext()).Line(data, this.options());

};

ChartField.func.dataChanged = function(){
	this.refresh();
};


ChartField.on("afterDraw", ChartField.func.afterDraw);
ChartField.on("dataChanged", ChartField.func.dataChanged);