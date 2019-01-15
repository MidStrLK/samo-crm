import { log } from '../useful.js';

/*
  Алгоритм расчета размеров:
  1. Получаем данные: ограничители размеров столбцов, названия
  2. Смотрим у каких столбцов есть свойство immortal (оно есть у столбцов которые должны отображаться на любом разрешении), вычитаем их ширину из общий ширины таблицы и не учитываем их в расчете размеров для остальных столбцов
  3. Считаем сколько столбцов уместится в текущий размер таблицы, считаем это кол-во исходя из минимальных размеров столбцов
  4. Остаток ширины (тот, в который еще один столбец не влезает) распределяем по всем видимым столбцам
  5. Передаем расчитанные размеры таблице для ререндера
*/

function TableManager(table) {
  console.log("init");
  this.table = table;
  this.head_cols = table.querySelectorAll(".main-table__thead-item");
  this.body_colgroup = table.querySelectorAll(".main-table__tbody-col");
  this.body_rows = table.querySelectorAll(".main-table__tbody-row");
  this.table.querySelector(".main-table__tbody").addEventListener("click", this.onBodyRowClick.bind(this));
  this.settings = this.table.querySelector(".set-sequence__list");

  this.render_enable = true;
  this.selected_count = 0;
  this.selected_overlay = this.table.querySelector(".main-table__selected-overlay");
  this.selected_counter = this.selected_overlay.querySelector(".main-table__selected-count span");
  this.head_checkbox = this.table.querySelector(".main-table__thead .checkbox__input");
  this.head_checkbox.addEventListener("change", this.onHeadInputSelect.bind(this));

  this.onLoadSeetings();
  this.getData();
  this.render();
}

TableManager.prototype.onLoadSeetings = function() {
  this.settings.querySelectorAll(".checkbox__input").forEach((checkbox) => {
    checkbox.addEventListener("change", this.onSettingsChange.bind(this));
  });

  this.setupSettingsDrag();
  this.setupBodyCheckboxes();
  this.changeOverlayStyle();
  window.addEventListener("resize", this.changeOverlayStyle.bind(this));
  window.addEventListener("resize", this.render.bind(this));
};

TableManager.prototype.setupBodyCheckboxes = function() {
  this.body_checkboxes = this.table.querySelectorAll(".main-table__tbody .checkbox__input");
  this.body_checkboxes.forEach((input) => {
    input.addEventListener("change", this.onBodyInputChange.bind(this));
  });
};

TableManager.prototype.onBodyRowClick = function(e) {
  let target = e.target.closest(".main-table__tbody-row");
  let not_checkbox = e.target.closest(".main-table__check");
  if (!target || not_checkbox) return;

  if (target.classList.contains("main-table__tbody-row_active")) {
    target.classList.remove("main-table__tbody-row_active");
    this.hideDetail();
    return;
  }

  target.classList.add("main-table__tbody-row_active");
  this.showDetail();
  if (this.previous_active_row && this.previous_active_row != target) {
    this.previous_active_row.classList.remove("main-table__tbody-row_active");
  }

  this.previous_active_row = target;
};

TableManager.prototype.showDetail = function() {
  document.querySelector(".layout__default").classList.add("layout__default_disabled");
  document.querySelector(".layout__detail").classList.add("layout__detail_active");
};

TableManager.prototype.hideDetail = function() {
  document.querySelector(".layout__default").classList.remove("layout__default_disabled");
  document.querySelector(".layout__detail").classList.remove("layout__detail_active");
};

TableManager.prototype.getData = function() {
  this.data = [];
  this.head_cols.forEach((col, index) => {
    let data = {};
    data.name = col.dataset.colName || "";
    data.min = parseInt(col.dataset.minWidth) || "auto";
    data.max = parseInt(col.dataset.maxWidth) || "auto";
    col.classList.contains("main-table__thead-item_hide") ? data.active = false : data.active = true;
    data.immortal = !!col.dataset.immortal || false;
    this.data.push(data);
  });
};

TableManager.prototype.render = function() {
  let {remain, active_cols_count} = this.getActiveColumnCountAndRemain();
  this.columnRemainAssignment(remain, active_cols_count);
  this.setHeadColsWidth();
  this.setBodyColsWidth();
};

TableManager.prototype.getActiveColumnCountAndRemain = function() {
  let remain = this.table.offsetWidth - this.imortalColumnsWidth();
  let filled = false;
  let active_cols_count = 0;
  this.data.forEach((col) => {
    col.current = 0;
    if (col.immortal) {
      col.current = col.min; 
      return; 
    }

    if (col.min > remain) filled = true;
    if (!col.active || filled) return;
    col.current = col.min;
    remain -= col.min;
    active_cols_count += 1;
  });

  return {
    active_cols_count: active_cols_count,
    remain: remain
  };
};

TableManager.prototype.imortalColumnsWidth = function() {
  let immortal_cols = this.data.filter(el => { return el.immortal; });
  let width = immortal_cols.reduce((sum, current) => {
    return  sum + current.min;
  }, 0);
  return width;
};

TableManager.prototype.columnRemainAssignment = function(remain, active_cols_count) {
  let cols_count = active_cols_count;
  this.data.forEach((col) => {
    if (!col.active || cols_count === 0 || col.immortal) return;
    let free_px = remain / cols_count;
    let width = col.current + free_px;
    if (col.max && col.max < width) {
      let difference = width - col.max;
      width -= difference;
      free_px -= difference;
    }

    col.current = Math.round(width);
    remain -= free_px;
    cols_count -= 1;
  });
};

TableManager.prototype.setHeadColsWidth = function() {
  this.head_cols.forEach((col, index) => {
    this.data[index].current === 0 ? this.hideHeadCol(index) : this.showHeadCol(index);
    col.style.width = this.data[index].current + "px";
  });
};

TableManager.prototype.showHeadCol = function(i) {
  this.head_cols[i].classList.remove("main-table__thead-item_hide");
};

TableManager.prototype.hideHeadCol = function(i) {
  this.head_cols[i].classList.add("main-table__thead-item_hide");
};

TableManager.prototype.setBodyColsWidth = function() {
  this.body_colgroup.forEach((col, index) => {
    this.data[index].current === 0 ? this.hideBodyCol(index) : this.showBodyCol(index);
    col.style.width = this.data[index].current + "px";
  });
};

TableManager.prototype.hideBodyCol = function(i) {
  this.body_colgroup[i].classList.add("main-table__tbody-col_hide");
  this.body_rows.forEach((row) => {
    row.querySelectorAll(".main-table__tbody-item")[i].classList.add("main-table__tbody-item_hide");
  });
};

TableManager.prototype.showBodyCol = function(i) {
  this.body_colgroup[i].classList.remove("main-table__tbody-col_hide");
  this.body_rows.forEach((row) => {
    row.querySelectorAll(".main-table__tbody-item")[i].classList.remove("main-table__tbody-item_hide");
  });
};

TableManager.prototype.changeColumnPosition = function(from, to) {
  let el = this.data[from];
  this.data.remove(from);
  this.data.splice(to, 0, el);
  if (from - to < 0) to += 1;

  this.changeHeadColPosition(from, to);
  this.changeBodyColgroupColPosition(from, to);
  this.changeBodyColPosition(from, to);
  this.updateNodesData();
  this.render();
};

TableManager.prototype.changeHeadColPosition = function(from, to) {
  let head_el = this.head_cols[from];
  let thead_row = this.table.querySelector(".main-table__thead-row");
  thead_row.removeChild(head_el);
  thead_row.insertBefore(head_el, this.head_cols[to]);
};

TableManager.prototype.changeBodyColgroupColPosition = function(from, to) {
  let body_colgroup_el = this.body_colgroup[from] ;
  let body_colgroup_row = this.table.querySelector(".main-table__tbody-colgroup");
  body_colgroup_row.removeChild(body_colgroup_el);
  body_colgroup_row.insertBefore(body_colgroup_el, this.body_colgroup[to]);
};

TableManager.prototype.changeBodyColPosition = function(from, to) {
  this.body_rows.forEach((row) => {
    let cols = row.querySelectorAll(".main-table__tbody-item");
    let body_el = cols[from];
    row.removeChild(body_el);
    row.insertBefore(body_el, cols[to]);
  });
};

TableManager.prototype.updateNodesData = function() {
  this.head_cols = this.table.querySelectorAll(".main-table__thead-item");
  this.body_colgroup = this.table.querySelectorAll(".main-table__tbody-col");
  this.body_rows = this.table.querySelectorAll(".main-table__tbody-row");
};

TableManager.prototype.onSettingsChange = function(e) {
  let input = e.target;
  let data_el = this.data.find((el) => {
    return el.name === input.name;
  });

  let index = this.data.indexOf(data_el);
  if (input.checked) {
    this.showColumnByIndex(index);
  } else {
    this.hideColumnByIndex(index);
  }

  this.activeColumnMoreThanOne();
};

TableManager.prototype.hideColumnByIndex = function(index) {
  this.data[index].active = false;
  if (this.render_enable) {
    this.render();
  } else {
    this.hideHeadCol(index);
    this.hideBodyCol(index);
  }
};

TableManager.prototype.showColumnByIndex = function(index) {
  this.data[index].active = true;
  if (this.render_enable){
    this.render();
  } else {
    this.showHeadCol(index);
    this.showBodyCol(index);
  }
};

TableManager.prototype.activeColumnMoreThanOne = function() {
  let active_checkboxes = this.settings.querySelectorAll(".checkbox__input:checked");
  if (active_checkboxes.length == 1) {
    this.disabled_setting = active_checkboxes[0];
    this.disabled_setting.disabled = true; 
    this.disabled_setting.dataset.single = true;
  } else {
    if (this.disabled_setting) {
      this.disabled_setting.removeAttribute("data-single");
      this.disabled_setting.disabled = false;
      this.disabled_setting = "";
    }
  }
};

TableManager.prototype.setupSettingsDrag = function() {
  let self = this;
  let sort = new Sortable(this.settings, {
    animation: 150,
    // handle: ".set-sequence__marker",
    draggable: ".set-sequence__item",
    ghostClass: "set-sequence__item_dim",
    onEnd: function(evt) {
      if (evt.oldIndex != evt.newIndex) {
        self.changeColumnPosition(evt.oldIndex + 1, evt.newIndex + 1); // + 1 это исключение колонки с чекбоксами
      }
    }
  });
};

TableManager.prototype.onBodyInputChange = function(e) {
  if (e.target.checked) {
    this.selected_count += 1;
  } else {
    this.selected_count -= 1;
  }

  if (this.selected_count > 0) {
    this.showSelectedOverlay();
  } else {
    this.head_checkbox.checked = false;
    this.hideSelectedOverlay();
  }
  this.changeOverlayCounter(this.selected_count);
};

TableManager.prototype.changeOverlayCounter = function(value) {
  this.selected_counter.innerText = value;
};

TableManager.prototype.showSelectedOverlay = function() {
  this.selected_overlay.classList.add("main-table__selected-overlay_active");
  this.table.querySelector(".main-table__tbody").classList.add("main-table__tbody_selected-overlay");
};

TableManager.prototype.hideSelectedOverlay = function() {
  this.selected_overlay.classList.remove("main-table__selected-overlay_active");
  this.table.querySelector(".main-table__tbody").classList.remove("main-table__tbody_selected-overlay");
};

TableManager.prototype.changeOverlayStyle = function() {
  let width = this.table.offsetWidth;
  if (width <= 500) {
    this.selected_overlay.classList.add("main-table__selected-overlay_small");
  } else {
    this.selected_overlay.classList.remove("main-table__selected-overlay_small");
  }
};

TableManager.prototype.onHeadInputSelect = function(e) {
  if (e.target.checked) {
    this.selected_count = this.body_checkboxes.length;
    this.showSelectedOverlay();
  } else {
    this.selected_count = 0;
    this.hideSelectedOverlay();
  }
  this.body_checkboxes.forEach((checkbox) =>  {
    checkbox.checked = e.target.checked;
  });
  this.changeOverlayCounter(this.selected_count);
};

TableManager.prototype.enableLinearView = function() {
  this.table.classList.add("main-table_linear");
  this.showActiveCols();
  this.render_enable = false;
};

TableManager.prototype.disableLinearView = function() {
  this.table.classList.remove("main-table_linear");
  this.render_enable = true;
};

TableManager.prototype.showActiveCols = function() {
  this.body_rows.forEach((row) => {
    row.querySelectorAll(".main-table__tbody-item").forEach((col, index) => {
      if (this.data[index].active) col.classList.remove("main-table__tbody-item_hide");
    });
  });
};

let table_manager = new TableManager(document.querySelector(".main-table"));

export { table_manager };