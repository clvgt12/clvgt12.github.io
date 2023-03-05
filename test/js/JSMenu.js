String.prototype.format = function() {
	var s = this,
		i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};

let JSMenu = function(params_) {
	try {
		const _Top_DOM_Id = document.getElementById(params_.Top_DOM_Id);
		const _Region_Div_Id = document.getElementById(params_.Region_Div_Id);
		if (!_Top_DOM_Id || !_Region_Div_Id) {
			throw "DOM Elements do not exist";
		}
		if (params_.This_Div_Id === undefined || params_.Menu_Text_Label === undefined || params_.Menu_Image_URL === undefined) {
			throw "Object initialization errors";
		}
	} catch (err) {
		console.log(err);
		return (void(0));
	}
	if (typeof(err) === "undefined") {
		this.TOP_DOM_ID = params_.Top_DOM_Id
		this.DIV_ID = params_.This_Div_Id;
		this.IMG_URL = params_.Menu_Image_URL;
		this.MENU_LABEL = params_.Menu_Text_Label;
		this.ARROW_BODY_COLOR = (params_.Arrow_Body_Color) ? params_.Arrow_Body_Color : "green";
		this.ARROW_OUTLINE_COLOR = (params_.Arrow_Outline_Color) ? params_.Arrow_Outline_Color : "black";
		this.ARROW_OUTLINE_STROKE_SIZE = (params_.Arrow_Outline_Stroke_Size) ? params_.Arrow_Outline_Stroke_Size : 3;
		this.REGION_DIV_ID = params_.Region_Div_Id;
		this.REGION_CONTENTS = params_.Region_Contents;
		this.STATE = 0; // 0 = block i.e. don't display, 1 = don't block, i.e. display
		this.createMenu();
		var _table = document.getElementById('{0}-table'.format(this.DIV_ID));
		if (_table) {
			_table.addEventListener('click', this.handleEvent.bind(this));
			_table.addEventListener('touchstart', this.handleEvent.bind(this));
			_table.addEventListener('taphold', this.handleEvent.bind(this));
		}
	}
}
JSMenu.prototype.rightArrow = function() {
	var _svg = '<svg viewbox="0 0 100 100" preserveaspectratio="xMidYMid meet"><polygon points="25,25 25,75 75,50" style="fill:{0};stroke:{1};stroke-width={2}"/></polygon></svg>'.format(this.ARROW_BODY_COLOR, this.ARROW_OUTLINE_COLOR, this.ARROW_OUTLINE_STROKE_SIZE);
	//console.log(_svg);
	return _svg;
};
JSMenu.prototype.downArrow = function() {
	var _svg = '<svg viewbox="0 0 100 100" preserveaspectratio="xMidYMid meet"><polygon points="25,25 50,75 75,25" style="fill:{0};stroke:{1};stroke-width={2}" /></polygon></svg>'.format(this.ARROW_BODY_COLOR, this.ARROW_OUTLINE_COLOR, this.ARROW_OUTLINE_STROKE_SIZE);
	//console.log(_svg);
	return _svg;
};
JSMenu.prototype.createMenu = function() {
	// Create Menu Div
	var _thisDiv = document.getElementById(this.TOP_DOM_ID);
	var _menuDiv = document.createElement('div');
	_menuDiv.setAttribute('id', this.DIV_ID);
	// Create Table
	var _tableElement = document.createElement('table');
	_tableElement.setAttribute('id', '{0}-table'.format(this.DIV_ID));
	_tableElement.setAttribute('style', 'cursor:pointer');
	var _tableTbodyElement = document.createElement('tbody');
	_tableTbodyElement.setAttribute('style', 'clear: both; float: left;');
	var _tableRowElement = document.createElement('tr');
	var _tableCellElement1 = document.createElement('td');
	//Create Arrow's Table Cell
	_tableCellElement1.setAttribute('id', '{0}-button'.format(this.DIV_ID));
	_tableCellElement1.setAttribute('class', 'timeline-button');
	//Create Image's Table Cell
	var _tableCellElement2 = document.createElement('td');
	_tableCellElement2.setAttribute('id', '{0}-social'.format(this.DIV_ID));
	_tableCellElement2.setAttribute('class', 'timeline-button-social');
	var _tableCellElement2Img = document.createElement('img');
	_tableCellElement2Img.setAttribute('id', '{0}-button-social-img'.format(this.DIV_ID));
	_tableCellElement2Img.setAttribute('src', this.IMG_URL);
	_tableCellElement2Img.setAttribute('width', '32');
	//Create Label's Table Cell
	var _tableCellElement3 = document.createElement('td');
	_tableCellElement3.setAttribute('id', '{0}-label'.format(this.DIV_ID));
	var _tableCellElement3p = document.createElement('p');
	_tableCellElement3p.setAttribute('id', '{0}-button-label-text'.format(this.DIV_ID));
	_tableCellElement3p.setAttribute('class', 'timeline-button-label');
	_tableCellElement3p.innerHTML = this.MENU_LABEL;
	// Create Region
	var _regionDiv = document.getElementById(this.REGION_DIV_ID);
	if (this.REGION_CONTENTS) {
		_regionDiv.innerHTML = this.REGION_CONTENTS;
	}
	// Build DOM tree
	_tableRowElement.appendChild(_tableCellElement1);
	_tableRowElement.appendChild(_tableCellElement2).appendChild(_tableCellElement2Img);
	_tableRowElement.appendChild(_tableCellElement3).appendChild(_tableCellElement3p);
	_menuDiv.appendChild(_tableElement).appendChild(_tableTbodyElement).appendChild(_tableRowElement);
	_thisDiv.appendChild(_menuDiv)
	//Set initial blocking state of Region
	_tableCellElement1.innerHTML = this.rightArrow();
	_regionDiv.style.display = 'none';
	this.STATE = 0; // 0 = block i.e. don't display, 1 = don't block, i.e. display
}
JSMenu.prototype.handleEvent = function() {
	var _button = document.getElementById('{0}-button'.format(this.DIV_ID));
	var _region = document.getElementById(this.REGION_DIV_ID);
	if (Boolean(this.STATE)) { // 0 = block i.e. don't display, 1 = don't block, i.e. display
		_button.innerHTML = this.downArrow();
		_region.style.display = 'block';
	} else {
		_button.innerHTML = this.rightArrow();
		_region.style.display = 'none';
	}
	this.STATE = Boolean(this.STATE) ? 0 : 1;
};