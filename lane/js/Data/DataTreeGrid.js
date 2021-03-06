//
//@@/@dependsOn: DataOutOfRangeError
//@@@dependsOn: DataColumn
//
/**
 * @constructor
 * @extends DataGrid
 */
var DataTreeGrid = function(){
	DataGrid.call(this);
};

Util.extend(DataTreeGrid, DataGrid);
DataTreeGrid.type = "DataTreeGrid";

/**
 * function adds row 
 * @param row - rowData object
 */
DataTreeGrid.prototype.add = function(rowParams, row){
	rowParams = rowParams || {};
	if (typeof row !== "object") {
		throw new Error("Row must be an object");
	}
	var dataUnit = new DataRow();
	dataUnit.data = row;
	dataUnit.dataGrid = this;
	
	if (rowParams.parent){
		dataUnit.parent = rowParams.parent;
		dataUnit.current = parent.lastVisible + 1
	} else {
		dataUnit.previous = this._data.length - 1;
		//	TODO: fix this
		dataUnit.previousVisible = dataUnit.previous
		
	}
	
	/*
	var currentLast = this._data[currentIndex];
	for (var k in row) {
		if (this._columnsCache[k] == undefined){
			throw new Error("Error, column " + k + " is not exists in DataTreeGrid");
		}
	}
	
	for (k in this._columnsCache == undefined) {
		if (!row[k]){
			throw new Error("Error, column " + k + " is not exists in row");
		}
	}
	
	var dataUnit = new DataRow({
		data:row, 
		previous:currentIndex,
		previousVisible:currentIndex,
		current:this._data.length,
		next:undefined,
		nextVisible:undefined,
		visible:true,
		node:false,
		DataTreeGrid:this,
		opened:true,
		level:0,
		parent:false
	});
	
	if (currentLast){
		currentLast.next = currentIndex + 1;
	}
	this._data.push(dataUnit);
	this._visible ++;*/
	this.trigger("dataUpdate");
};

/**
 * builds DataTreeGrid 
 */
DataTreeGrid.build = function(struct){
	var dataTreeGrid = new DataTreeGrid();
	var columns = DataColumn.build(struct.columns);
	DataTreeGrid.columns(columns);
	return dataTreeGrid;
};




