BoxElement._applyTimer = false;
BoxElement.prototype.applyProperties = function(before){
	if (!this.visible){
		return;
	}
	var propMap = before ? this._applyBefore : this._applyAfter;
	var properties = this._baseClass._properties;
	for (var prop in propMap){
		
		var propParams = properties[prop];
		if (propParams.applyer){
			propParams.applyer.call(this,this._values[prop]);
		} else {
			try{
				this.htmlElement.style[prop] = this._values[prop] + (propParams.htmlEnding || "");
			} catch (e){
				console.log("error property [" + prop + "]:" + this._values[prop] + (propParams.htmlEnding || ""));
			}
			
			//console.log("applying[" + prop + "]:" + this._values[prop],this.htmlElement);
		}
	}
	if (before){
		this._applyBefore = {};
		delete this._baseClass._applyBefore[this.id];
	} else {
		this._applyAfter = {};
		delete this._baseClass._applyAfter[this.id];
	}
};

BoxElement.addPropertyApplyer("opacity",function(value){
	if (value !== undefined) {
		if (browser.ie && browser.version != 10) {
			value *= 100;
		    var oAlpha = this.htmlElement.filters['DXImageTransform.Microsoft.alpha'] || this.htmlElement.filters.alpha;
		    if (oAlpha) oAlpha.opacity = value;
		    else this.htmlElement.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+value+")";
		} else {
			this.htmlElement.style[browser.opacityProperty] = value;
		}
	}
});

BoxElement.addPropertyApplyer("caption",function(value){
	this.htmlInnerElement.innerHTML = value;
});

BoxElement.addPropertyApplyer("margin",function(value){
	this.htmlInnerElement.style = "margin:" + value.join(" px") + "px";
});

BoxElement.addPropertyApplyer("borderWidth",function(value){
	this.htmlElement.style.borderWidth = value.join("px ") + "px";
});

BoxElement.addPropertyApplyer("visible",function(value){
	var my = this;
	setTimeout(function(){
		my.htmlElement.style.display = value?"block":"none";
	},100);
	
});

BoxElement.addPropertyApplyer("borderRadius",function(value){
	this.htmlElement.style[browser.propertiesMap.borderRadiusProperty] = value.join("px ") + "px";
});

BoxElement.addPropertyApplyer("elementType",function(value){
	this.htmlElement.setAttribute("elementType",value);
});

BoxElement.addPropertyApplyer("width",function(value){
	var elementRealWidth = value - ((browser.ie && browser.version != 10)?0:this._values._dx);
	this.htmlElement.style.width = elementRealWidth + 'px';
});
BoxElement.addPropertyApplyer("hAlign",function(value){
	switch (value) {
		case this._baseClass.ALIGN.begin:
			this.htmlElement.style.textAlign = "left";
			return;
		case this._baseClass.ALIGN.middle:
			this.htmlElement.style.textAlign = "center";
			return;
		case this._baseClass.ALIGN.end:
			this.htmlElement.style.textAlign = "right";
			return;
	}
	 
});

BoxElement.addPropertyApplyer("height",function(value){
	var elementRealHeight = value - ((browser.ie && browser.version != 10)?0:this._values._dy);
	this.htmlElement.style.height = elementRealHeight + 'px';
	
});

BoxElement.addPropertyApplyer("padding",function(value){
	this.htmlElement.style.padding = value.join("px ") + "px";
});

BoxElement.addPropertyApplyer("backgroundImage",function(value){
	if (value){
		if (value != 'none'){
			value = value.split(' ').join('');
			this.htmlElement.style.backgroundImage = "url(" + browser._values.imageBase + value + ")";
		}
		else{
			this.htmlElement.style.backgroundImage = "none";
		}
	}
});
BoxElement.addPropertyApplyer("selectable",function(value) {
	this.htmlElement.style[browser.propertiesMap.selectionProperty] = browser.propertiesMap.selectionPropertyValues[value?0:1]; 
	this.htmlInnerElement.style[browser.propertiesMap.selectionProperty] = browser.propertiesMap.selectionPropertyValues[value?0:1];
	if (value) {
		this.htmlElement.removeAttribute("unselectable");
	}
	else {
		//
		//TODO: add functionality to browser for this
		//
		this.htmlElement.setAttribute("unselectable","on");
		 
	}
});
