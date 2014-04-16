BoxElement.prototype.getAbsolutePosition = function(){
	return this.htmlElement.getBoundingClientRect();
};

/**
 * builds
 * 
 * @param struct -
 *            element structure
 * @param _topEl
 *            {object} - top element (inner parameter)
 * @returns elementMap
 */
BoxElement.prototype.build = function(struct, _topEl) {
	if (!_topEl) {
		_topEl = this;
	}
	this._topEl = _topEl;
	if (struct.events) {
		for ( var k in struct.events) {
			this.on(k, struct.events[k], this);
		}
	}

	for ( var k in struct) {
		if (k == "events" || k == "params" || k == "defaults") {
			continue;
		}
		var prop = struct[k];
		if (k == "c") {
			for ( var x in prop) {
				var newEl;
				if (this._values._isDrawn) {
					newEl = new BoxElement(prop[x].params);
					newEl.build(prop[x], _topEl);
					newEl.drawRec({
						target : this
					});
				} else {
					newEl = this.appendChild(new BoxElement(prop[x].params));
					newEl.build(prop[x], _topEl);
				}
			}
		} else {
			if (typeof (this[k]) == 'function') {
				this[k](prop);
			} else {
				debugger;
				throw new Error("BoxElement error, no such property:" + k);
			}
		}
	}
	if (this._values.name) {
		_topEl._elements[this._values.name] = this;
	}
	return _topEl._elements;
};
/**
 * appends child to this element
 * 
 * @param el -
 *            element to append
 * @returns {BoxElement} appended element
 */
BoxElement.prototype.appendChild = function(el) {
	if (!(el instanceof BoxElement)) {
		throw new Error("BoxElementError: Cant append non-BoxElement to BoxElement!!!");
	}

	if (el.parent) {
		throw new Error("Cant append already appended element!");
	}
	el.parent = this;
	this.c.push(el);
	el.neibourIndex = this.c.length - 1;
	this.addToRedrawQueue();
	if (this._isDrawn) {
		el.drawRec({
			target : this
		});
	}
	return el;
};
/**
 * Draws element recursively with childs
 * 
 * @param params
 */
BoxElement.prototype.drawRec = function(params, innerCall) {
	if (!this._values._isDrawn) {
		if (!(params.target instanceof BoxElement)) {
			throw new Error("element [" + this.toString() + "] drawRec must have parameter target (instanceof BoxElement)!!!");
		}

		if (this._values._virtualized) {
			throw new Error("Cant draw virtualized element [" + this.toString() + "]");
		}

		if (!this.parent) {
			params.target.appendChild(this);
			params.target.htmlInnerElement.appendChild(this.htmlElement);
		} else if (this.parent != params.target) {
			throw new Error("BoxElement [" + this.toString() + "] already has parent");
		}

		this._isDrawn(true);
		this.htmlElement.style.position = 'absolute';
		if (!this.params.noOverflow) {
			this.htmlElement.style.overflow = 'hidden';
		} 
		
		this.htmlElement.style.display = this._values._visible ? "block" : "none";
		this.parent.htmlInnerElement.appendChild(this.htmlElement);
	}

	for ( var k in this.c) {
		this.c[k].drawRec({
			target : this
		}, true);
	}
	this.addToRenderQueue();
	this._values.relativity && this.recalcRelativity();
};
/**
 * virtualizes htmlElement caution, virtualize draws an element
 * 
 * @param params
 */
BoxElement.prototype.virtualize = function(params) {
	if (!params.target) {
		throw new Error("Target must set");
	}
	if (this._values._isDrawn) {
		throw new Error("element [" + this.toString() + "] is already drawn, cant virtualize");
	}

	this.htmlElement = params.target;
	this.htmlInnerElement = params.target;
	this._isDrawn(true);
	this._virtualized(true);
	this.overflow(BoxElement.OVERFLOW_MODE.none);
};
/**
 * returns true if parents is visible
 */
BoxElement.prototype.isParentsVisible = function() {
	if (!this._values.visible) {
		return false;
	}
	if (this.parent) {
		return this.parent.isParentsVisible();
	}
	return true;
};
/**
 * function recalculates distance between width/innerWidth, etc...
 */
BoxElement.prototype.__recalcDxDy = function() {
	var bCache = this._values.borderWidth;
	var pCache = this._values.padding;
	this._dx(bCache[1] + bCache[3] + pCache[1] + pCache[3]);
	this._dy(bCache[0] + bCache[2] + pCache[0] + pCache[2]);
};

BoxElement.prototype.__updateHorizontal = function() {
	if (this._values.horizontal) {
		this._rProps = {
			value : "width",
			vMinValue : "vMinWidth",
			minValue : "minWidth"
		};
	} else {
		this._rProps = {
			value : "height",
			vMinValue : "vMinHeight",
			minValue : "minHeight"
		};
	}
	;
};
/**
 * removes element and his childs
 */
BoxElement.prototype.remove = function() {
	if (this._removed) {
		console.log("Trying to remove already removed node");
		return;
	}
	this._removed = true;
	delete elements[this.id];
	this.parent.htmlElement.removeChild(this.htmlElement);
	var index = this.neibourIndex;
	this.parent.c.splice(index,1);
	for (var k in parent.c){
		parent.c[k].neibourindex = k;
	}
	var toRemove = [];
	for ( var k in this.c) {
		toRemove.push(this.c[k]);
	}
	for ( var k in toRemove) {
		toRemove[k].remove();
	}
	this.trigger("removed");
	
};

/**
 * clears box element from children
 */
BoxElement.prototype.clear = function(){
	while(this.c[0]){
		this.c[0].remove();
	}
};
/**
 * sets properties from object and backups they to backup
 * @param properties - properties to apply
 * @param backup - object to backup
 */
BoxElement.prototype.setPropertiesWithBackup = function(properties, backup) {
	for ( var k in properties) {
		if (k == 'c') {
			for ( var x in properties.c) {
				var propertyMap = properties.c[x];
				var child = this._topEl.elements[x];
				if (!child) {
					console.warn("no element[" + x + "] when setting style");
				}
				if (!backup.c[x]) {
					backup.c[x] = {};
				}
				for ( var i in propertyMap) {
					backup.c[x][i] = child['_' + i];
					child[i](propertyMap[i]);
				}
			}
		} else {
			if (k === 'func') {
				properties.func.call(this);
			} else {
				backup[k] = this[k]();
				this[k](properties[k]);
			}
		}
	}
};

/**
 * restores properties backup
 * @param backup
 */
BoxElement.prototype.restoreProperties = function(backup) {
	var child = false;
	for ( var k in backup) {
		if (k != 'c') {
			this[k](backup[k]);
		} else {
			for ( var x in backup.c) {
				var childData = backup.c[x];
				child = this._topEl.elements[x];
				for ( var i in childData) {
					child[i](childData[i]);
				}
			}
		}
	}
};
BoxElement.prototype.enumChilds = function(callBack){
	for(var k in this.c){
		callBack(this.c[k]);
		this.c[k].enumChilds(callBack);
	}
}

BoxElement.build = function(struct, target){
	var el = new BoxElement();
	el.build(struct);
	if (target) {
		el.drawRec({target:target});
	}
	return el;
};

BoxElement.on("mouseover",function(){
	if (this._values.hovered && !this._hovered){
		if (!this._backup){
			this._backup = {};
		}
		if (!this._backup.hover) {
			this._backup.hover = {};
		}
		this.setPropertiesWithBackup(this._values.hovered, this._backup.hover);
		this._hovered = true;
	}
});

BoxElement.on("mouseout",function(){
	if (this._hovered) {
		this._hovered = false;
		this.restoreProperties(this._backup.hover);
	}
});




BoxElement.on("mousedown",function(){
	if (this._pressed) {
		return;
	}
	if (this._values.pressed) {
		if (!this._backup){
			this._backup = {};
		}
		if (!this._backup.pressed){
			this._backup.pressed = {};
		}
		this.setPropertiesWithBackup(this._values.pressed, this._backup.pressed);
		this._pressed = true;
	}
});

BoxElement.on("mouseup",function(){
	if (this._pressed) {
		this._pressed = false;
		this.restoreProperties(this._backup.pressed);
	}
});
