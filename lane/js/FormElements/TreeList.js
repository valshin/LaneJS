var TreeList = function() {
	Panel.call(this);
	this.data = {};
	this.head = undefined;
};
Util.extend(TreeList, Panel);
TreeList.type = "TreeList";
TreeList.prototype.selectedNode = TreeList.addProperty("selectedNode", false);
// FormElement.prototype.data = FormElement.addProperty("data",{},{type:"object"});
TreeList.uniqId = 0;
TreeList.func.afterDraw = function() {
	var my = this;
	this.on("click", function(ev) {
		var htmlElement =  ev.srcElement || ev.target;
		if (htmlElement.getAttribute("expander")) {
			var element = htmlElement.parentNode.element;
			element.opened(!element._v.opened);
		}
		
		if (htmlElement.getAttribute("checker")) {
			var element = htmlElement.parentNode.parentNode.element;
			element.checked(!element._v.checked);
		}
		
		var parent = htmlElement;
		while (parent && !parent.element) {
			parent = parent.parentNode;
		}
		if (parent) {
			parent.element.selected(true);
		}
	});
};

TreeList.func.processKeyEvent = function(e){
	var k = e.keyCode ? e.keyCode : e.charCode;
	console.log("key:", k);
	switch(k) {
		case 40:
			if (this._v.selectedNode){
				var next = this._v.selectedNode.getNext();
				if (next && next != this.head){
					next.selected(true);
				}
			}
			break;
		case 38:
			if (this._v.selectedNode){
				var prev = this._v.selectedNode.getPrev();
				if (prev && prev != this.head){
					prev.selected(true);
				}
			}
			break;
		case 13:
			if (this._v.selectedNode){
				this._v.selectedNode.opened(!this._v.selectedNode.opened());
			}
			break;
		case 32:
			if (this._v.selectedNode){
				this._v.selectedNode.checked(!this._v.selectedNode.checked());
			}
			break;
		default:
			return;
		
	}
	return false;
};

TreeList.on("keydown", TreeList.func.processKeyEvent);
TreeList.on("afterDraw", TreeList.func.afterDraw);
TreeList.on("beforeNodeRemove",function(node){
	delete this.data[node.id];
//	
//	TODO:make safe node removal
//	
});
TreeList.on("selectedNodeBeforeChanged", function(value) {
	var old = this._v.selectedNode;
	if (old && old != value) {
		old.selected(false);
	}
});

TreeList.prototype.add = function(data) {
	if (!data.id) {
		throw new Error("Data must have an id");
	}
	this.data[data.id] = data;
	var parent;
	if (data.parent) {
		parent = this.data[data.parent];
		if (!this.data[data.parent]) {
			throw new Error("no parent with id:" + data.parent);
		}
	} else {
		if (!this.head) {
			parent = new TreeNode({
				root : true,
				htmlElement : this._elements.treeField.htmlElement,
				tree:this,
				id:"head_0"
			});
			this.head = parent;
		} else {
			parent = this.head;
		}
	}

	var newElement = new TreeNode({
		text : data.text,
		img : data.img,
		opened:data.opened,
		tree:this,
		id:data.id,
		checked:data.checked,
		canBeChecked:data.canBeChecked,
		parent:parent
	});

	this.data[data.id] = newElement;
	parent.addChild(newElement);
	return newElement;
};

TreeList.prototype.removeNode = function(id) {
	if (!this.data[id]) {
		throw new Error("TreeNode with id: " + id + " is not exists" );
	}
	this.data[id].remove();
};

TreeList.prototype.clear = function(){
	if (this.head){
		while (this.head.c.length) {
			this.head.c[0].remove(true);
		}
	}
};

TreeList.prototype.getRoot = function() {
	return this.head;
};

TreeList.prototype.getNodeById = function(id) {
	return this.data[id];
};

TreeList.prototype.sort = function(cmpFunc){
	this.head.sort(cmpFunc);
};

TreeList.prototype.setData = function(data) {
	this.data = {};
	this.head = undefined;
	for (var k in data) {
		data[k].id = k;
		this.add(data[k]);
	}
};

TreeList.prototype.syncNode = function(data){
	var node = this.getNodeById(data.id);
	if (!node) {
		return this.add(data);
	} else {
		node.__successUpdated = true;
		node.text(data.text);
		node.img(data.img);
		node.canBeChecked(data.canBeChecked);
	}
	return node;
};

