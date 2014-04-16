var FormElement = function(){
	BaseObject.call(this);
	this.id = FormElement.idCounter++;
	this.outer(new BoxElement());
	this.inner(this.outer());
	this.type = "FormElement";
	this._propertyTranslators = {};
	this.addPropertyTranslator(['opacity','hs', 'vs', {name:'width', back:true}, {name:'height', back:true}, 'sizeRatio', {name: "margin", back:true}, "visible", "minWidth", "minHeight"]);
	this.logicalChildren = [];
};
Util.extend(FormElement,BaseObject);
FormElement.funcs = {};
FormElement.idCounter = 0;
FormElement.addProperty("opacity",1);
FormElement.addProperty("name","");
FormElement.addProperty("parent",false);
FormElement.addProperty("inner",false);
FormElement.addProperty("img", false, {type:"image"});
FormElement.addProperty("hint", false, {type:"string"});
FormElement.addProperty("outer",false);
FormElement.addProperty("isDrawn",false);
FormElement.addProperty("width",0);
FormElement.addProperty("height",20);
FormElement.addProperty("minWidth",0);
FormElement.addProperty("minHeight",0);
FormElement.addProperty("hs",false);
FormElement.addProperty("vs",false);
FormElement.addProperty("visible",true);
FormElement.addProperty("skin","def");
FormElement.addProperty("caption","");
FormElement.addProperty("captionWidth",0);
FormElement.addProperty("sizeRatio",100);
FormElement.addProperty("margin",[0,0,0,0]);
FormElement.addProperty("enabled",true);
FormElement.addProperty("contextMenu",false);
FormElement.addProperty("styleClass",false);
FormElement.addProperty("logicalParent",false);
FormElement.addProperty("focus",false);


FormElement.currentFocus = false;


FormElement.prototype.applyImg = function(){
	if (this._values.isDrawn && this._elements.img){
		this._elements.img.backgroundImage(this._values.img);
	}
};

FormElement.prototype.enumParents = function(callBack){
	if (callBack(this) === false) {
		return false;
	}
	if (this._values.parent){
		return this._values.parent.enumParents(callBack);
	}
};

FormElement.prototype.addPropertyTranslator = function(property){
	if (property instanceof Array){
		for (var k in property){
			this.addPropertyTranslator(property[k]);
		}
		return;
	}
	if (typeof property !== "object" ){
		property = {
			name: property
		};
	}
	property.target = property.target || "outer";
	if (!property.name) {
		throw new Error("Property has no parameter name");
	}
	property.propertyTranslator = function(value){
		if (this._values.isDrawn){
			this._values[property.target][property.name](value);
		}
	};
	this.on(property.name + "Changed",property.propertyTranslator,this);
	this._propertyTranslators[property.name] = property;
};
/**
 * removes property translator
 * @param property
 */

FormElement.prototype.removePropertyTranslator = function(name){
	this.removeListener(name + "Changed",this._propertyTranslators[name].propertyTranslator,this);
	delete this._propertyTranslators[name];
};

FormElement.prototype.componentBuilder = function(opts){
	if (!window[this.type + "Skin"]){
		throw new Error("No skin for:" + this.type);
	}
	if (!window[this.type + "Skin"][this.skin()]){
		throw new Error("No skin for:" + this.type);
	}
	this.buildComponent(window[this.type + "Skin"][this.skin()]);
};

/**
 * function builds an component from structure
 * @param struct
 */
FormElement.prototype.buildComponent = function(struct){
	if (struct.defaults){
		for (var k in struct.defaults){
			this[k](struct.defaults[k]);
		}
		//delete struct.defaults;
	}
	
	this._elements = this._values.outer.build(struct);
};

FormElement.prototype.draw = function(opts){
	if (!opts || !opts.target ){
		throw new Error("Cant draw to null target:" + this.type);
	}
	if (this.trigger("beforeDraw",opts) !== false) {
		this.componentBuilder(opts);
	}
	
	if (opts.target instanceof Container) {
		opts.target.addChild(this);
		opts.target._values.inner.appendChild(this._values.outer);
	} else if (opts.target instanceof BoxElement) {
		opts.target.appendChild(this._values.outer);
	}
	this.isDrawn(true);
	
	this._values.outer.elementType(this.type);
	this._values.outer.htmlElement.setAttribute("elementSkin", this._values.skin || "def");
	if (this instanceof Container){
		this.inner(this._elements.inner);
	}
	this._values.outer.on("contextMenu", function(e){
		this.trigger("contextMenu", e);
	}, this);
	this._values.outer.on("removed", function(){
		this.trigger("removed");
	}, this);
	this.trigger("afterDraw",opts);
	this.applyHint();
	this._values.outer.on("click", function(e){
		if (!e.usedForFocus){
			FormElement.currentFocus && FormElement.currentFocus.focus(false);
			this.focus(true);
			e.usedForFocus = true;
		}
	},this);
};

FormElement.prototype.remove = function(){
	this._removed = true;
	if (this.trigger("beforeRemove") !== false){
		this._values.outer.remove();
		this.trigger("removed");
	}
	
};

FormElement.funcs.captionChanged = function(value){
	if (this._values.isDrawn && this._elements.caption){
		this._elements.caption.caption(value);
	}
};
FormElement.prototype._captionWidthChanged = function(){
	if (this._values.isDrawn && this._elements.caption) {
		if (this._values.captionWidth === false) {
			this._elements.caption.hs(true);
		} else {
			this._elements.caption.hs(false);
			this._elements.caption.width(this._values.captionWidth);
		}
	}
};

FormElement.funcs.afterDraw = function(){
	var my = this;
	this._values.outer.formElement = this;
	this._values.inner.formElement = this;
	this._elements.caption&&this._elements.caption.caption(this._values.caption);
	for (var propName in this._propertyTranslators){
		var propTranslator = this._propertyTranslators[propName];
		this._values[propTranslator.target][propName](this._values[propName]);
		if (propTranslator.back){
			(function(propTranslator){
				my._values[propTranslator.target].on(propTranslator.name + "Changed", function(value){
					this[propTranslator.name](value);
				},my);
			})(propTranslator);
			
		}
	}
	this._values.outer.htmlElement.setAttribute("elementName",this._values.name);
	this._values.outer.htmlElement.setAttribute("formElementId",this.id);
	this._captionWidthChanged();
	this.refreshEnabled();
	this.applyStyleClass();
	this.applyImg();
};

FormElement.prototype.addLogicalChild = function(child){
	this.logicalChildren.push(child);
	child.logicalParent(this);
};
/**
 * triggers events recursively to parents
 */
FormElement.prototype.triggerRec = function(name, event){
	if (this instanceof Container){
		this._values.children.each(function(el){
			el.triggerRec(name,event);
		});
	}
	this.trigger(name,event);
};

FormElement.prototype.refreshEnabled = function(){
	if (this._values.isDrawn){
		var outer = this._values.outer;
		this._setStyleClass(outer, this._values.enabled?"enabled":"disabled");
		this._values.outer.opacity(this._values.enabled ? 1: 0.5);
	}
};

FormElement.prototype._setStyleClass = function(element, styleName){
	element.styleClass(styleName);
	if (element != this._values.outer && element.formElement) {
		return;
	}
	for (var k in element.c) {
		this._setStyleClass (element.c[k], styleName);
	}
};
FormElement.prototype.applyStyleClass = function(){
	if (this._values.isDrawn){
		this._setStyleClass(this._values.outer, this._values.styleClass);
	}
};
FormElement.prototype.applyFocus = function(){
	if (this._values.focus){
		FormElement.currentFocus = this;
	}
};
FormElement.prototype.applyHint = function(){
	if (this._values.isDrawn){
		if (this._values.hint){
			this._values.outer.htmlElement.setAttribute("title",this._values.hint);
		} else {
			this._values.outer.htmlElement.removeAttribute("title");
		}
		
	}
};
FormElement.on("hintChanged", FormElement.prototype.applyHint);
FormElement.on("focusChanged", FormElement.prototype.applyFocus);
FormElement.on("imgChanged", FormElement.prototype.applyImg);
FormElement.on("styleClassChanged",FormElement.prototype.applyStyleClass);
FormElement.on("enabledChanged",FormElement.prototype.refreshEnabled);
FormElement.on("captionWidthChanged",FormElement.prototype._captionWidthChanged);
FormElement.on("captionChanged",FormElement.funcs.captionChanged);
FormElement.on("afterDraw",FormElement.funcs.afterDraw);

FormElement._apply = function(el, struct){
	for (var k in struct){
		el[k](struct[k]);
	}
};

FormElement.build = function(struct, target, map){
	var topLevel = false;
	if (!map) {
		topLevel = true;
		map = {};
	}
	if (!struct.type) {
		throw new Error ("Error building FormElement: type must set");
	}
	if (!window[struct.type]){
		throw new Error ("Error building FormElement[" + struct.type + "] not found");
	}
	var el = new window[struct.type]();
	if (struct.importFrom){
		if (struct.importFrom instanceof Array){
			for (var k in struct.importFrom){
				this._apply(el, struct.importFrom[k]);
			}  
		} else {
			this._apply(el, struct.importFrom);
		}
		
	}
	if (struct.events){
		for (var k in struct.events){
			el.on(k, struct.events[k]);
		}
	}
	
	for (var k in struct){
		if (k === "type" || k === "c" || k === "importFrom" || k === "events" || k === "defaults"){
			continue;
		} 
		if (k === "name"){
			map[struct.name] = el;
		}
		el[k](struct[k]);
	}
	el.draw({ target: target });
	if (struct.c) {
		for (var k in struct.c){
			this.build(struct.c[k], el, map);
		}
	}
	el.elements = map;
	if (topLevel) {
		el.triggerRec("buildFinished", el);
	}
	return el;
};
/**
 * function fills topElement input elements from data
 */
FormElement.fillForm = function(topElement, data, options){
	options = options || {};
	var elements = topElement;
	if (elements.elements) {
		elements = elements.elements;
	}
	for (var k in data) {
		var propName = k;
		var targetPropName = k;
		if (options.map && options.map[k]) {
			targetPropName = options.map[k];
		} 
		elements[targetPropName].value(data[propName]);
	}
};

FormElement.getData = function(topElement, options, data){
	options = options || {};
	data = data || {};
	
	if (topElement instanceof Container) {
		for (var k in topElement._values.children._data){
			var el = topElement._values.children._data[k];
			FormElement.getData(el, options, data);
		}
	}
	if ((topElement instanceof InputElement) && topElement._values.name) {
		data[topElement._values.name] = topElement._values.value;
	}
	return data;
};
FormElement.func.contextMenu = function(e){
	if (FormElement.func.popupMenu){
		FormElement.func.popupMenu.hide();
	}
	var menu = this._values.contextMenu;
	if (menu) {
		if (!(menu instanceof PopupMenu)){
			menu = PopupMenu.build(menu);
			menu.component(this);
		}
		menu.visible(true);
		FormElement.func.popupMenu = menu;
		return false;
	}
};
FormElement.on("contextMenu", FormElement.func.contextMenu);

FormElement._eventListener = function(e){
	if (FormElement.currentFocus){
		return FormElement.currentFocus.enumParents(function(parent){
			return parent.trigger(e.type, e);
		});
	}
};
Util.addListener(document, "keydown", FormElement._eventListener);
Util.addListener(document, "keyup", FormElement._eventListener);
Util.addListener(document, "keypress", FormElement._eventListener);
		
//document.oncontextmenu