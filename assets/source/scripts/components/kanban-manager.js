import { DragScroll } from './drag-scroll.js';

function KanbanManager(grid) {
  this.grid = grid;
  this.grid_cols = this.grid.querySelectorAll(".column-grid__col");
  this.wrapper = this.grid.querySelector(".column-grid__wrapper");

  this.kanban_options = this.grid.querySelector(".column-grid__options");
  this.drag_scroll = new DragScroll({
    container: this.grid.querySelector(".column-grid__content-scroll"),
    x_scroll_container: ".column-grid__content-scroll",
    y_scroll_container: ".column-grid__col",
    exception: ".column-grid__draggable",
    mouse_scroll_x: false
  });

  this.setupColumnItemDrag();  
  this.setColumnView();
  window.addEventListener("resize", this.setColumnView.bind(this));
}

KanbanManager.prototype.setupColumnItemDrag = function() {
  this.grid_cols.forEach((col) => {
    let list = col.querySelector(".column-grid__list");
    let sortable = new Sortable(list, {
      group: "kanban",
      animation: 150,
      handle: ".column-grid__draggable",
      draggable: ".column-grid__col-item",
      ghostClass: "column-grid__col-item_dim",
      scroll: false
    });
    sortable.option("onStart", (e) => {
      this.kanban_options && this.showDragOptions();
      this.drag_scroll.enableEdgeScroll(e.item);
    });
    sortable.option("onEnd", (e) => {
      this.kanban_options && this.hideDragOptions();
      this.drag_scroll.disableEdgeScroll(e.item);
    });
    sortable.option("onAdd", (e) => {
      this.drag_scroll.updateMouseScroll(e.from);
      this.drag_scroll.updateMouseScroll(e.to);
    });
  });
};

KanbanManager.prototype.showDragOptions = function() {
  this.kanban_options.classList.add("column-grid__options_active");
};

KanbanManager.prototype.hideDragOptions = function() {
  this.kanban_options.classList.remove("column-grid__options_active");
};

KanbanManager.prototype.setColumnView = function() {
  let col_width = this.grid.offsetWidth / this.grid_cols.length;
  if (col_width > 350) {
    this.wrapper.classList.add("column-grid__wrapper_table");
    this.wrapper.classList.remove("column-grid__wrapper_default");
  } else {
    this.wrapper.classList.add("column-grid__wrapper_default");
    this.wrapper.classList.remove("column-grid__wrapper_table");
  }
};

KanbanManager.prototype.setWrapperWidth = function(margin) {
  this.wrapper.style.width = (this.grid_cols[0].offsetWidth * this.grid_cols.length) + (margin * this.grid_cols.length) + "px";
};

export { KanbanManager };