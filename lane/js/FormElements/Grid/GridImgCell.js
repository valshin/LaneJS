var GridImgCell = function(column, row) {
	GridCell.call(this, column, row);
};
Util.extend(GridImgCell, GridCell);
GridImgCell.type = "GridImgCell";
GridImgCell.prototype.caption = function(value){
	this._element._elements.img.backgroundImage(value);
};