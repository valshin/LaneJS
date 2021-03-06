var Container = function(){
	FormElement.call(this);
	this.children(new BasicList());
	this.addPropertyTranslator([{name:'horizontal', target:"inner"}, {name:"padding", target:"inner"}, {name:"hAlign", target:"inner"}, {name:"vAlign", target:"inner"}, {name:"overflow", target:"inner"}]);
	this._v.children.on("removed", this.removeChild, this);
	var my = this;
	this._childRemovedFunction = function(){
		my.removeChild(this);
	};
};
Util.extend(Container,FormElement);
Container.type = "Container";
Container.funcs = {};
Container.prototype.children = Container.addProperty("children", false, {type:"BasicList", hidden:true, export:false});
Container.prototype.overflow = Container.addProperty("overflow", BoxElement.OVERFLOW_MODE.none, {type:BoxElement.OVERFLOW_MODE});
Container.prototype.horizontal = Container.addProperty("horizontal", false, {type:"boolean"});
Container.prototype.hAlign = Container.addProperty("hAlign", BoxElement.ALIGN.begin, {type:BoxElement.ALIGN});
Container.prototype.vAlign = Container.addProperty("vAlign", BoxElement.ALIGN.begin, {type:BoxElement.ALIGN});
Container.prototype.padding = Container.addProperty("padding", [0,0,0,0], {type:"intArray", hidden:true});

Container.prototype.addChild = function(child){
	if (this._v.children.add(child)){
		child.parent(this);
		child.on("removed",this._childRemovedFunction);
	}
};

Container.prototype.removeChild = function(child){
	child.removeListener("removed",this._childRemovedFunction);
	if (!child._removed){
		child.remove();
	}
};

Container.prototype.clear = function(){
	this.children.clear();
};

Container.prototype.getElementById = function(id){
	var found = false;
	if (this.id == id){
		return this;
	}
	this.enumChilds(function(){
		if (this.id != id){
			if (this instanceof Container){
				var result = this.getElementById(id);
				if (result){
					found = result;
					return false;
				}
			}
		} else {
			found = this;
			return false;
		}
	});
	return found;
};


Container.prototype.enumChilds = function(callBack){
	var children = this._v.children._data;
	for(var k in children){
		 var res = callBack.call(children[k], children[k]);
		 if (res === undefined && children[k] instanceof Container){
			 res = children[k].enumChilds(callBack);
		 }
		 if (res === true) {
			 continue;
		 }  else if (res === false) {
		 	 return false;
		 }
	}
};