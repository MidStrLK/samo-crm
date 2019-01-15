import { updateScrolls } from './scroll.js';

let select_unique_index = 1;

function customSelect(el) {
	this.select = el;
	this.unique_id = this.setUniqueId();

	this.wrapper = create('div', 'select__wrapper');
	let input_wrapper = this.setInput();
	this.wrapper.append(input_wrapper);
	this.select.append(this.wrapper);
	this.input.addEventListener('click', this.showModal.bind(this));
}

customSelect.prototype.setUniqueId = function() {
	let id = `select_${select_unique_index}`;	
	this.select.id = id;
	select_unique_index += 1;
	return "#" + id;
};

customSelect.prototype.showModal = function() {
	this.default_select = this.select.querySelector('select');
	this._onInputValueChange = this.onInputValueChange.bind(this);
	this._onListItemClick = this.onListItemClick.bind(this);
	this._isInModal = this.isInModal.bind(this);
	if (!this.dropdown) this.setDropDownLayout();
	this.setupSearch();

	this.select.classList.add('select_active');
	this.input.addEventListener('input', this._onInputValueChange);
	this.dropdown_list.addEventListener('click', this._onListItemClick);
	document.addEventListener('click', this._isInModal);
};

customSelect.prototype.hideModal = function() {
	this.select.classList.remove('select_active');
	this.input.removeEventListener('input', this._onInputValueChange);
	this.dropdown_list.removeEventListener('click', this._onListItemClick);
	delete this.fuse;
	document.removeEventListener('click', this._isInModal);
};

customSelect.prototype.setDropDownLayout = function() {
	this.dropdown = create('div', 'select__dropdown');
	Ps.initialize(this.dropdown);

	if (this.select.dataset.editable) this.dropdown.append(this.setCreateLink());
	this.empty_block = create('div', 'select__empty');
	this.empty_block.textContent = "Нет результатов поиска";

	this.dropdown_list = create('div', 'select__dropdown-list');
	this.createList(this.parseData());
	this.dropdown.append(this.empty_block, this.dropdown_list);
	this.wrapper.append(this.dropdown);
};

customSelect.prototype.setCreateLink = function() {
	this.create_wrapper = create('div', 'select__dropdown-create');
	let link = create('span', 'pseudo');
	this.create_wrapper.append(link);
	link.innerHTML = "Создать <span></span>";
	this.create_item_text = link.querySelector('span');
	this._createListItem = this.createListItem.bind(this);
	link.addEventListener('click', this._createListItem);
	return this.create_wrapper;
};

customSelect.prototype.createListItem = function() {
	let new_item = {
		text: this.create_item_text.textContent,
		index: this.initial_data[this.initial_data.length - 1].index + 1
	};
	let option = create('option');
	option.textContent = new_item.text;
	this.default_select.append(option);
	if (this.empty) {
		this.empty_block.classList.remove("select__empty_active");
	}
	this.initial_data.push(new_item);
	this.addItemToList(new_item);
};

customSelect.prototype.setInput = function() {
	let wrapper = create('div', 'select__input-wrapper');
	this.input = create('input', 'select__input');
	let placeholder = this.select.dataset.placeholder || "Введите значение";
	this.input.placeholder = placeholder;
	wrapper.append(this.input);	
	return wrapper;
};

customSelect.prototype.parseData = function() {
	let arr = [];
	this.select.querySelectorAll("option:not(:disabled)").forEach((el) => {
		let option = {};
		option.text = el.textContent;
		option.index = el.index;
		arr.push(option);
	});
	this.initial_data = arr;
	return arr;
};

customSelect.prototype.createList = function(data) {
	this.dropdown_list.innerHTML = "";
	data.forEach((item) => {
		this.addItemToList(item);
	});
	this.toggleActiveListItem(this.active_list_item_index);
};

customSelect.prototype.addItemToList = function(item) {
	let option = create('div', 'select__dropdown-item');
	option.textContent = item.text;
	option.dataset.index = item.index;
	this.dropdown_list.append(option);
	Ps.update(this.dropdown);
};

customSelect.prototype.isInModal = function(e) {
	if (!e.target.closest(this.unique_id)) {
		this.hideModal();
	}
};

customSelect.prototype.onInputValueChange = function(e) {
	let value = e.target.value;
	if (value.length) {
		let result = this.fuse.search(value);
		if (result.length) {
			this.createList(result);
			if (this.empty) {
				this.empty = false;
				this.empty_block.classList.remove("select__empty_active");
			}
		} else {
			this.empty = true;
			this.empty_block.classList.add("select__empty_active");
			this.dropdown_list.innerHTML = " ";
		}
		if (this.create_wrapper) {
			this.create_wrapper.classList.add("select__dropdown-create_active");
			this.create_item_text.textContent = value;
		}
	} else {
		if (this.create_wrapper) {
			this.create_wrapper.classList.remove("select__dropdown-create_active");
		}
		this.empty = false;
		this.empty_block.classList.remove("select__empty_active");
		this.createList(this.initial_data);
	}
	Ps.update(this.dropdown);
};

customSelect.prototype.setupSearch = function() {
	let options = {
	  shouldSort: true,
	  threshold: 0.3,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 1,
	  keys: ["text"]
	};
	this.fuse = new Fuse(this.initial_data, options);
};

customSelect.prototype.onListItemClick = function(e) {
	let item = e.target.closest(".select__dropdown-item");
	if (!item) return;

	let text = item.textContent;
	let index = item.dataset.index;
	this.toggleActiveListItem(index);
	this.active_list_item_index = index;
	this.input.value = text;
	this.default_select.selectedIndex = index;
};

customSelect.prototype.toggleActiveListItem = function(index) {
	this.dropdown_list.querySelectorAll(".select__dropdown-item").forEach((item) => {
		if (item.dataset.index === index) {
			item.classList.add("select__dropdown-item_active");
		} else {
			item.classList.remove("select__dropdown-item_active");
		}
	});
};

function create(type = 'div', ...classes) {
	let el = document.createElement(type);
	classes.forEach((item) => {
		el.classList.add(item);
	});
	return el;
}

function setupSelectFields() {
	document.querySelectorAll('.select').forEach((item) => {
		new customSelect(item);
	});
}

window.addEventListener('load', setupSelectFields);