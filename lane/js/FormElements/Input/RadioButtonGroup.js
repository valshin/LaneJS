var RadioButtonGroup = function() {
	Container.call(this);
	this._v.children.on("added",this._added);
};
Util.extend(RadioButtonGroup, Container);
RadioButtonGroup.type = "RadioButtonGroup";
RadioButtonGroup.prototype.checked = RadioButtonGroup.addProperty("checked",false,{type:"boolean"});
RadioButtonGroup.func = {};

RadioButtonGroup.prototype._added = function(element) {
	var my = this;
	element.on("checkedChanged",function(value){
		if (value){
			
		}
	});
};