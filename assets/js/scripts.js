(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./components/toggle_tabs.js');

require('./components/show-prebid-window.js');

require('./useful.js');

require('./components/search-field.js');

require('./components/select.js');

require('./components/quick-view.js');

require('./components/creation-form.js');

require('./components/table-manager.js');

require('./components/kanban-manager.js');

var _dragScroll = require('./components/drag-scroll.js');

require('./components/modal.js');

require('./examples/chart_tab.js');

require('./components/toggle-divided-list.js');

require('./components/left-menu-modal.js');

require('./components/left-menu-resize.js');

require('./components/set-wrapper-width.js');

require('./components/scroll.js');

/* расчет размера плашки для быстрых фильтров*/


/* для разработки */


/* универсальный элементы */
(function () {
  var header_filters = document.querySelector(".quick-filters");
  if (!header_filters) return;
  var header_row = header_filters.closest(".header__bottom");
  var quick_filters = new _dragScroll.DragScroll({
    container: header_row,
    x_scroll_container: ".header__bottom-wrapper",
    exception: ".quick-filters__draggable",
    mouse_scroll_y: false
  });

  new Sortable(header_filters, {
    animation: 150,
    handle: ".quick-filters__draggable",
    draggable: ".quick-filters__item",
    ghostClass: "quick-filters__item_dim",
    onStart: function onStart(e) {
      quick_filters.enableEdgeScroll(e.item);
    },
    onEnd: function onEnd(e) {
      quick_filters.disableEdgeScroll(e.item);
    }
  });
})();

/* инициализация компонентов */


/* полезные функции */

},{"./components/creation-form.js":2,"./components/drag-scroll.js":3,"./components/kanban-manager.js":4,"./components/left-menu-modal.js":5,"./components/left-menu-resize.js":6,"./components/modal.js":7,"./components/quick-view.js":8,"./components/scroll.js":9,"./components/search-field.js":10,"./components/select.js":11,"./components/set-wrapper-width.js":12,"./components/show-prebid-window.js":13,"./components/table-manager.js":14,"./components/toggle-divided-list.js":15,"./components/toggle_tabs.js":16,"./examples/chart_tab.js":17,"./useful.js":18}],2:[function(require,module,exports){
"use strict";

var _scroll = require("./scroll.js");

function creationFormManager(form) {
  this.form = form;

  this._onTextareaClick = this.onTextareaClick.bind(this);
  this.form.addEventListener("click", this._onTextareaClick);
}

creationFormManager.prototype.onTextareaClick = function (e) {
  var textarea = e.target.closest("textarea");
  if (!textarea) return;

  this.form.classList.add("quick-creation_active");
  this.form.removeEventListener("click", this._onTextareaClick);

  (0, _scroll.updateParentScrollIfExist)(textarea);
};

document.querySelectorAll(".quick-creation").forEach(function (form) {
  new creationFormManager(form);
});

// TODO: перенести сюда функционал переключения вкладок, если в форме они есть

},{"./scroll.js":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function DragScroll(_ref) {
  var container = _ref.container,
      x_scroll_container = _ref.x_scroll_container,
      y_scroll_container = _ref.y_scroll_container,
      _ref$handle = _ref.handle,
      handle = _ref$handle === undefined ? null : _ref$handle,
      _ref$exception = _ref.exception,
      exception = _ref$exception === undefined ? null : _ref$exception,
      _ref$mouse_scroll_x = _ref.mouse_scroll_x,
      mouse_scroll_x = _ref$mouse_scroll_x === undefined ? true : _ref$mouse_scroll_x,
      _ref$mouse_scroll_y = _ref.mouse_scroll_y,
      mouse_scroll_y = _ref$mouse_scroll_y === undefined ? true : _ref$mouse_scroll_y;

  this.container = container;
  this.exception = exception;
  this.handle = handle;
  this.x_scroll_container = x_scroll_container || y_scroll_container;
  this.y_scroll_container = y_scroll_container || x_scroll_container;
  this.mouse_scroll_x = mouse_scroll_x;
  this.mouse_scroll_y = mouse_scroll_y;
  this.active = false;

  this._onMouseMove = this.onMouseMove.bind(this);
  this._onMouseUp = this.onMouseUp.bind(this);
  this._dragOnEdge = this.dragOnEdge.bind(this);
  this.container.addEventListener("mousedown", this.onMouseDown.bind(this));
  this.container.addEventListener("touchstart", this.onMouseDown.bind(this));
  this.container.addEventListener("dragend", this._onMouseUp);
  this.setupMouseScroll();
}

DragScroll.prototype.setupMouseScroll = function () {
  if (this.mouse_scroll_x) {
    this.container.querySelectorAll(this.x_scroll_container).forEach(function (container) {
      Ps.initialize(container, {
        suppressScrollY: true,
        handlers: ['wheel', 'keyboard', 'drag-scrollbar']
      });
    });
  }

  if (this.mouse_scroll_y) {
    this.container.querySelectorAll(this.y_scroll_container).forEach(function (container) {
      Ps.initialize(container, {
        suppressScrollX: true,
        handlers: ['wheel', 'keyboard', 'drag-scrollbar']
      });
    });
  }
};

DragScroll.prototype.updateMouseScroll = function (target) {
  var x = target.closest(this.x_scroll_container);
  var y = target.closest(this.y_scroll_container);
  Ps.update(x);
  Ps.update(y);
};

DragScroll.prototype.updateXMouseScroll = function (target) {
  var container = void 0;
  container = target.closest(this.x_scroll_container) && Ps.update(container);
};

DragScroll.prototype.enableEdgeScroll = function (el) {
  el.addEventListener("touchmove", this._dragOnEdge);
  el.addEventListener("drag", this._dragOnEdge);
};

DragScroll.prototype.disableEdgeScroll = function (el) {
  el.removeEventListener("touchmove", this._dragOnEdge);
  el.removeEventListener("drag", this._dragOnEdge);
  this.onDragEnd();
};

DragScroll.prototype.dragOnEdge = function (e) {
  var _getXY = this.getXY(e),
      x = _getXY.x,
      y = _getXY.y;

  this.dragOnHorizontalEdge(e.target, x, y);
  this.dragOnVerticalEdge(e.target, x, y);
};

DragScroll.prototype.getXY = function (e) {
  var x = void 0,
      y = void 0;
  if (e.clientX && e.clientX >= 0) {
    x = e.clientX;
    y = e.clientY;
  } else if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  return { x: x, y: y };
};

DragScroll.prototype.dragOnHorizontalEdge = function (target, x, y) {
  var container = target.closest(this.x_scroll_container);
  var rect = container.getBoundingClientRect();
  var ver_fit = y > rect.top && y < rect.bottom;
  var near_right_edge = x > rect.right - 70 && x < rect.right && ver_fit;
  var near_left_edge = x < rect.left + 70 && x > rect.left && ver_fit;

  if (near_right_edge && container.scrollLeft != container.scrollWidth - container.clientWidth) {
    this.scrollToRight(container);
  } else if (near_left_edge && container.scrollLeft !== 0) {
    this.scrollToLeft(container);
  } else {
    if (this.x_move) {
      window.clearInterval(this.x_move);
      this.x_move = null;
    }
  }
};

DragScroll.prototype.dragOnVerticalEdge = function (target, x, y) {
  var container = target.closest(this.y_scroll_container);
  var rect = container.getBoundingClientRect();
  var hor_fit = x > rect.left && x < rect.right;
  var near_top_edge = y < rect.top + 70 && y > rect.top && hor_fit;
  var near_bottom_edge = y > rect.bottom - 70 && y < rect.bottom && hor_fit;

  if (near_bottom_edge && container.scrollTop != container.scrollHeight - container.clientHeight) {
    this.scrollToBottom(container);
  } else if (near_top_edge && container.scrollTop !== 0) {
    this.scrollToTop(container);
  } else {
    if (this.y_move) {
      window.clearInterval(this.y_move);
      this.y_move = null;
    }
  }
};

DragScroll.prototype.scrollToTop = function (container) {
  if (!this.y_move) {
    this.y_move = window.setInterval(function () {
      container.scrollTop -= 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToRight = function (container) {
  if (!this.x_move) {
    this.x_move = window.setInterval(function () {
      container.scrollLeft += 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToBottom = function (container) {
  if (!this.y_move) {
    this.y_move = window.setInterval(function () {
      container.scrollTop += 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToLeft = function (container) {
  if (!this.x_move) {
    this.x_move = window.setInterval(function () {
      container.scrollLeft -= 3;
    }, 10);
  }
};

DragScroll.prototype.onDragEnd = function () {
  window.clearInterval(this.y_move);
  this.y_move = null;
  window.clearInterval(this.x_move);
  this.x_move = null;
};

DragScroll.prototype.onMouseDown = function (e) {
  var target = e.target;
  if (this.notException(target) && this.itIsHandle(target)) {
    this.active = true;

    var _getXY2 = this.getXY(e),
        x = _getXY2.x,
        y = _getXY2.y;

    this.clientX = x;
    this.clientY = y;
    this.current_x_container = e.target.closest(this.x_scroll_container);
    this.current_y_container = e.target.closest(this.y_scroll_container);
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
    window.addEventListener("touchmove", this._onMouseMove);
    window.addEventListener("touchend", this._onMouseUp);
  }
};

DragScroll.prototype.notException = function (el) {
  if (this.exception) {
    return el.closest(this.exception) ? false : true;
  } else {
    return true;
  }
};

DragScroll.prototype.itIsHandle = function (el) {
  if (this.handle) {
    return el.closest(this.handle) ? true : false;
  } else {
    return true;
  }
};

DragScroll.prototype.onMouseMove = function (e) {
  this.active && this.updateScrollPosition(e);
};

DragScroll.prototype.updateScrollPosition = function (e) {
  if (e.clientX && e.clientX >= 0) {
    this.current_x_container.scrollLeft -= -this.clientX + (this.clientX = e.clientX);
    this.current_y_container.scrollTop -= -this.clientY + (this.clientY = e.clientY);
  } else if (e.touches) {
    this.current_x_container.scrollLeft -= -this.clientX + (this.clientX = e.touches[0].clientX);
    this.current_y_container.scrollTop -= -this.clientY + (this.clientY = e.touches[0].clientY);
  }
};

DragScroll.prototype.onMouseUp = function (e) {
  this.active = null;
  window.removeEventListener("mousemove", this._onMouseMove);
  window.removeEventListener("mouseup", this._onMouseUp);
  window.removeEventListener("touchmove", this._onMouseMove);
  window.removeEventListener("touchend", this._onMouseUp);
};

exports.DragScroll = DragScroll;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KanbanManager = undefined;

var _dragScroll = require("./drag-scroll.js");

function KanbanManager(grid) {
  this.grid = grid;
  this.grid_cols = this.grid.querySelectorAll(".column-grid__col");
  this.wrapper = this.grid.querySelector(".column-grid__wrapper");

  this.kanban_options = this.grid.querySelector(".column-grid__options");
  this.drag_scroll = new _dragScroll.DragScroll({
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

KanbanManager.prototype.setupColumnItemDrag = function () {
  var _this = this;

  this.grid_cols.forEach(function (col) {
    var list = col.querySelector(".column-grid__list");
    var sortable = new Sortable(list, {
      group: "kanban",
      animation: 150,
      handle: ".column-grid__draggable",
      draggable: ".column-grid__col-item",
      ghostClass: "column-grid__col-item_dim",
      scroll: false
    });
    sortable.option("onStart", function (e) {
      _this.kanban_options && _this.showDragOptions();
      _this.drag_scroll.enableEdgeScroll(e.item);
    });
    sortable.option("onEnd", function (e) {
      _this.kanban_options && _this.hideDragOptions();
      _this.drag_scroll.disableEdgeScroll(e.item);
    });
    sortable.option("onAdd", function (e) {
      _this.drag_scroll.updateMouseScroll(e.from);
      _this.drag_scroll.updateMouseScroll(e.to);
    });
  });
};

KanbanManager.prototype.showDragOptions = function () {
  this.kanban_options.classList.add("column-grid__options_active");
};

KanbanManager.prototype.hideDragOptions = function () {
  this.kanban_options.classList.remove("column-grid__options_active");
};

KanbanManager.prototype.setColumnView = function () {
  var col_width = this.grid.offsetWidth / this.grid_cols.length;
  if (col_width > 350) {
    this.wrapper.classList.add("column-grid__wrapper_table");
    this.wrapper.classList.remove("column-grid__wrapper_default");
  } else {
    this.wrapper.classList.add("column-grid__wrapper_default");
    this.wrapper.classList.remove("column-grid__wrapper_table");
  }
};

KanbanManager.prototype.setWrapperWidth = function (margin) {
  this.wrapper.style.width = this.grid_cols[0].offsetWidth * this.grid_cols.length + margin * this.grid_cols.length + "px";
};

exports.KanbanManager = KanbanManager;

},{"./drag-scroll.js":3}],5:[function(require,module,exports){
"use strict";

var _scroll = require("./scroll.js");

function leftMenuModal() {
	var target = void 0,
	    menu_item = void 0,
	    modal_wrapper = void 0,
	    previous_menu_item = void 0,
	    is_active = void 0,
	    previous_wrapper = void 0;
	var left_menu = document.querySelector(".left-menu");
	var arrow = document.querySelector(".menu-modal__arrow");
	var modal = document.querySelector(".menu-modal");

	if (!left_menu) return;

	function modalManager(e) {
		target = e.target;
		menu_item = target.closest(".left-menu__item_full-size");
		if (!menu_item || menu_item == previous_menu_item) return;

		modal_wrapper = document.querySelector(menu_item.dataset.menuModal);

		if (!is_active) {
			initialSetup();
		}

		if (previous_wrapper) {
			previous_wrapper.classList.remove("menu-modal__wrapper_active");
		}

		changeWrapper();
	}

	function initialSetup() {
		modal.classList.add("menu-modal_active");
		arrow.classList.add("menu-modal__arrow_active");
		document.addEventListener("mousedown", isOutOfZone);
		is_active = true;
	}

	function changeWrapper() {
		previous_wrapper = modal_wrapper;
		previous_menu_item = menu_item;

		changeArrowProperties();
		modal_wrapper.classList.add("menu-modal__wrapper_active");
		(0, _scroll.updateScrolls)();
	}

	function changeArrowProperties() {
		var top = menu_item.getBoundingClientRect().bottom - menu_item.offsetHeight / 2 - arrow.offsetHeight / 2 - 6; // 6 это отступ всплывающего окна от края
		arrow.style.top = top + "px";

		if (modal_wrapper.id == "menu-modal-search") {
			arrow.style.backgroundColor = "#F9F9F9";
		} else {
			arrow.style.backgroundColor = "white";
		}
	}

	function isOutOfZone(e) {
		var in_modal = e.target.closest(".menu-modal");
		var is_current_menu_item = e.target.closest(".left-menu__item_full-size") == previous_menu_item;

		if (e.target.closest(".left-menu__item_full-size") && !is_current_menu_item) {
			previous_wrapper.classList.remove("menu-modal__wrapper_active");
		} else if (!in_modal && !is_current_menu_item) {
			cleanUp();
		}
	}

	function cleanUp() {
		modal.classList.remove("menu-modal_active");
		arrow.classList.remove("menu-modal__arrow_active");

		previous_wrapper.classList.remove("menu-modal__wrapper_active");
		is_active = previous_wrapper = previous_menu_item = false;
		document.removeEventListener("mousedown", isOutOfZone);

		window.setTimeout(function () {
			// ждем окончания анимации исчезновения окна и после ресетим стрелку
			arrow.style.top = "initial";
		}, 200);
	}

	left_menu.addEventListener("click", modalManager);
}

window.addEventListener("load", leftMenuModal);

},{"./scroll.js":9}],6:[function(require,module,exports){
"use strict";

(function () {
  var menu = document.querySelector(".left-menu");
  if (!menu) return;

  var menu_height = menu.offsetHeight;
  var more = document.querySelector(".left-menu__more");
  var items = menu.querySelectorAll(".left-menu__item_category");
  var submenu = menu.querySelector(".left-menu__submenu_other");
  var was_edit = false;

  function menuFitIntoScreen(e) {
    if (menu_height > window.innerHeight) {
      resetMenu();
      toggleMenuItems();
    } else if (was_edit) {
      resetMenu();
    }
  }

  function toggleMenuItems() {
    was_edit = true;
    more.style.display = "block";
    for (var i = items.length - 1; i >= 0; i--) {
      items[i].style.display = "none";
      var name = items[i].querySelector(".left-menu__tip").innerText;
      var icon_class = items[i].querySelector(".left-menu__icon").className.split(" ")[1];
      var href = items[i].querySelector(".left-menu__to-category").getAttribute("href");
      createSubmenuItem(name, icon_class, href);

      if (menu.offsetHeight < window.innerHeight) break;
    }
  }

  function createSubmenuItem(name, icon_class, href) {
    var wrapper = document.createElement("div");
    var icon = document.createElement("div");
    var link = document.createElement("a");
    wrapper.classList.add("left-menu__subitem");
    icon.classList.add("left-menu__icon", icon_class + "-black");
    link.classList.add("left-menu__link");
    link.setAttribute("href", href);
    link.innerText = name;
    wrapper.appendChild(icon);
    wrapper.appendChild(link);
    submenu.insertAdjacentElement("afterbegin", wrapper);
  }

  function resetMenu() {
    was_edit = false;
    items.forEach(function (item) {
      item.style.display = "block";
    });
    submenu.innerHTML = "";
    more.style.display = "none";
  }

  window.addEventListener("resize", menuFitIntoScreen);
  window.addEventListener("load", menuFitIntoScreen);
})();

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Modal(target) {
  this.target = target;
  this.blackout_type = target.dataset.blackout || "full-screen";
  this.highlight = !!target.dataset.highlight || false;
  this.modal = document.querySelector(".modal[data-modal='" + target.dataset.modal + "']");
  this.active = false;
  this._disable = this.disable.bind(this);
  this._setModalCoordinates = this.setModalCoordinates.bind(this);
  this.selectRelevantBlackout();
  this.target.addEventListener("click", this.activate.bind(this));
}

Modal.prototype.selectRelevantBlackout = function () {
  if (this.blackout_type == "full-screen") {
    this.blackout = document.querySelector(".blackout_full-screen");
  }
};

Modal.prototype.activate = function () {
  if (this.active) return;
  this.active = true;
  this.enableModal();
  if (this.highlight) this.enableHighlight();
  this.enableBlackout();
  window.addEventListener("click", this._disable);
  window.addEventListener("resize", this._setModalCoordinates);
};

Modal.prototype.disable = function (e) {
  if (e.target.closest(".modal") || e.target.closest(".modal-target")) return;
  this.active = false;
  this.disableModal();
  if (this.highlight) this.disableHighlight();
  this.disableBlackout();
  window.removeEventListener("click", this._disable);
  window.removeEventListener("resize", this._setModalCoordinates);
};

Modal.prototype.enableModal = function () {
  this.modal.classList.add("modal_active");
  this.setModalCoordinates();
};

Modal.prototype.disableModal = function () {
  this.modal.classList.remove("modal_active");
};

Modal.prototype.enableHighlight = function () {
  this.target.classList.add("modal-target_active");
};

Modal.prototype.disableHighlight = function () {
  this.target.classList.remove("modal-target_active");
};

Modal.prototype.enableBlackout = function () {
  this.blackout.classList.add("blackout_active");
};

Modal.prototype.disableBlackout = function () {
  this.blackout.classList.remove("blackout_active");
};

Modal.prototype.getHorizontalCoordinates = function () {
  var left = void 0;
  if (this.target_rect.left - 20 > this.modal_width) {
    left = this.target_rect.left - this.modal_width - 15;
  } else if (window.innerWidth - 20 - this.target_rect.right > this.modal_width) {
    left = this.target_rect.right + 15;
  } else {
    left = 20;
  }
  return left;
};

Modal.prototype.getVerticalCoordinates = function () {
  var top = this.target_rect.top;
  var bottom = null;
  if (top + this.modal_height > window.innerHeight - 20) {
    var diff = top + this.modal_height - (window.innerHeight - 20);
    top -= diff;
    if (top <= 20) {
      top = 20;
      if (top + this.modal_height > window.innerHeight - 20) bottom = 20;
    }
  }
  return { top: top, bottom: bottom };
};

Modal.prototype.setModalCoordinates = function () {
  this.modal_width = this.modal.offsetWidth;
  this.modal_height = this.modal.scrollHeight;
  this.target_rect = this.target.getBoundingClientRect();
  var left = this.getHorizontalCoordinates();

  var _getVerticalCoordinat = this.getVerticalCoordinates(),
      top = _getVerticalCoordinat.top,
      bottom = _getVerticalCoordinat.bottom;

  this.modal.style.top = top + "px";
  this.modal.style.left = left + "px";
  if (bottom) {
    this.modal.style.bottom = bottom + "px";
  } else {
    this.modal.style.bottom = "auto";
  }
};

document.querySelectorAll(".modal-target").forEach(function (modal) {
  new Modal(modal);
});

exports.Modal = Modal;

},{}],8:[function(require,module,exports){
'use strict';

var _scroll = require('./scroll.js');

var _tableManager = require('./table-manager.js');

var _chart_tab = require('../examples/chart_tab.js');

var parent = document.querySelector(".layout");
var table = document.querySelector(".layout__table");
var quick_view = document.querySelectorAll(".layout__view");

/* TODO: Заменить на свое решение и убать библиотеку*/

interact('.layout__view').resizable({
  preserveAspectRatio: true,
  edges: { left: true }
}).on("resizemove", changeLayout);

function changeLayout(event) {
  var rect = event.rect.width;
  var table_width = parent.offsetWidth - rect;
  _tableManager.table_manager.changeOverlayStyle();

  if (table_width <= 350) {
    table.style.right = parent.offsetWidth - 350 + "px";
    _tableManager.table_manager.enableLinearView();
    changeQuickViewWidth(parent.offsetWidth - 350);
    (0, _scroll.updateScrolls)();
  } else {
    table.style.right = rect + "px";
    _tableManager.table_manager.disableLinearView();
    changeQuickViewWidth(rect);

    _tableManager.table_manager.render();
    resetColumnActivity();
    (0, _scroll.updateScrolls)();
    if (rect <= 750) {
      document.querySelector(".table-quick-view__size_small").classList.add("table-quick-view__size_active");
    } else if (rect <= 1240) {
      document.querySelector(".table-quick-view__size_medium").classList.add("table-quick-view__size_active");
    } else {
      document.querySelector(".table-quick-view__size_large").classList.add("table-quick-view__size_active");
    }
  }
}

function resetColumnActivity() {
  document.querySelectorAll(".table-quick-view__size").forEach(function (item) {
    item.classList.remove("table-quick-view__size_active");
  });
}

function changeQuickViewWidth(width) {
  quick_view.forEach(function (view) {
    view.style.width = width + "px";
  });
}

},{"../examples/chart_tab.js":17,"./scroll.js":9,"./table-manager.js":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
function setupScrolls() {
	document.querySelectorAll(".scrollable").forEach(function (el) {
		Ps.initialize(el, {
			useBothWheelAxes: true
		});
	});
}

function updateScrolls() {
	// придумать как лучше апдейтить скроллы, ведь их будет куча
	document.querySelectorAll(".scrollable").forEach(function (el) {
		Ps.update(el);
	});
}

function updateParentScrollIfExist(el) {
	var scrollable = el.closest(".scrollable");
	if (scrollable) {
		Ps.update(scrollable);
	}
}

window.addEventListener('load', setupScrolls);
window.addEventListener("resize", updateScrolls);

exports.updateScrolls = updateScrolls;
exports.updateParentScrollIfExist = updateParentScrollIfExist;

},{}],10:[function(require,module,exports){
"use strict";

function searchFilter(field) {
  this.field = field;
  this.modal = document.getElementById(field.dataset.filters);
  this.active = false;
  this.blackout = document.querySelector(".blackout_table");
  this.field.addEventListener("click", this.showModal.bind(this));
}

searchFilter.prototype.showModal = function () {
  if (this.active) return;

  this.blackout.classList.add("blackout_active");
  this.modal.classList.add("search-filters_active");

  this._isInModal = this.isInModal.bind(this);
  document.addEventListener("click", this._isInModal);
  this.active = true;
};

searchFilter.prototype.isInModal = function (e) {
  var in_modal = e.target.closest(".search-filters");
  var in_header = e.target.closest(".header");

  if (!in_modal && !in_header) {
    this.blackout.classList.remove("blackout_active");
    this.modal.classList.remove("search-filters_active");
    this.active = false;
    document.removeEventListener("click", this._isInModal);
  }
};

document.querySelectorAll(".search-field").forEach(function (field) {
  new searchFilter(field);
});

},{}],11:[function(require,module,exports){
'use strict';

var _scroll = require('./scroll.js');

var select_unique_index = 1;

function customSelect(el) {
	this.select = el;
	this.unique_id = this.setUniqueId();

	this.wrapper = create('div', 'select__wrapper');
	var input_wrapper = this.setInput();
	this.wrapper.append(input_wrapper);
	this.select.append(this.wrapper);
	this.input.addEventListener('click', this.showModal.bind(this));
}

customSelect.prototype.setUniqueId = function () {
	var id = 'select_' + select_unique_index;
	this.select.id = id;
	select_unique_index += 1;
	return "#" + id;
};

customSelect.prototype.showModal = function () {
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

customSelect.prototype.hideModal = function () {
	this.select.classList.remove('select_active');
	this.input.removeEventListener('input', this._onInputValueChange);
	this.dropdown_list.removeEventListener('click', this._onListItemClick);
	delete this.fuse;
	document.removeEventListener('click', this._isInModal);
};

customSelect.prototype.setDropDownLayout = function () {
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

customSelect.prototype.setCreateLink = function () {
	this.create_wrapper = create('div', 'select__dropdown-create');
	var link = create('span', 'pseudo');
	this.create_wrapper.append(link);
	link.innerHTML = "Создать <span></span>";
	this.create_item_text = link.querySelector('span');
	this._createListItem = this.createListItem.bind(this);
	link.addEventListener('click', this._createListItem);
	return this.create_wrapper;
};

customSelect.prototype.createListItem = function () {
	var new_item = {
		text: this.create_item_text.textContent,
		index: this.initial_data[this.initial_data.length - 1].index + 1
	};
	var option = create('option');
	option.textContent = new_item.text;
	this.default_select.append(option);
	if (this.empty) {
		this.empty_block.classList.remove("select__empty_active");
	}
	this.initial_data.push(new_item);
	this.addItemToList(new_item);
};

customSelect.prototype.setInput = function () {
	var wrapper = create('div', 'select__input-wrapper');
	this.input = create('input', 'select__input');
	var placeholder = this.select.dataset.placeholder || "Введите значение";
	this.input.placeholder = placeholder;
	wrapper.append(this.input);
	return wrapper;
};

customSelect.prototype.parseData = function () {
	var arr = [];
	this.select.querySelectorAll("option:not(:disabled)").forEach(function (el) {
		var option = {};
		option.text = el.textContent;
		option.index = el.index;
		arr.push(option);
	});
	this.initial_data = arr;
	return arr;
};

customSelect.prototype.createList = function (data) {
	var _this = this;

	this.dropdown_list.innerHTML = "";
	data.forEach(function (item) {
		_this.addItemToList(item);
	});
	this.toggleActiveListItem(this.active_list_item_index);
};

customSelect.prototype.addItemToList = function (item) {
	var option = create('div', 'select__dropdown-item');
	option.textContent = item.text;
	option.dataset.index = item.index;
	this.dropdown_list.append(option);
	Ps.update(this.dropdown);
};

customSelect.prototype.isInModal = function (e) {
	if (!e.target.closest(this.unique_id)) {
		this.hideModal();
	}
};

customSelect.prototype.onInputValueChange = function (e) {
	var value = e.target.value;
	if (value.length) {
		var result = this.fuse.search(value);
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

customSelect.prototype.setupSearch = function () {
	var options = {
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

customSelect.prototype.onListItemClick = function (e) {
	var item = e.target.closest(".select__dropdown-item");
	if (!item) return;

	var text = item.textContent;
	var index = item.dataset.index;
	this.toggleActiveListItem(index);
	this.active_list_item_index = index;
	this.input.value = text;
	this.default_select.selectedIndex = index;
};

customSelect.prototype.toggleActiveListItem = function (index) {
	this.dropdown_list.querySelectorAll(".select__dropdown-item").forEach(function (item) {
		if (item.dataset.index === index) {
			item.classList.add("select__dropdown-item_active");
		} else {
			item.classList.remove("select__dropdown-item_active");
		}
	});
};

function create() {
	var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';

	var el = document.createElement(type);

	for (var _len = arguments.length, classes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		classes[_key - 1] = arguments[_key];
	}

	classes.forEach(function (item) {
		el.classList.add(item);
	});
	return el;
}

function setupSelectFields() {
	document.querySelectorAll('.select').forEach(function (item) {
		new customSelect(item);
	});
}

window.addEventListener('load', setupSelectFields);

},{"./scroll.js":9}],12:[function(require,module,exports){
"use strict";

function setWrapperWidth(wrapper, col_class) {
  var width = 0;
  wrapper.querySelectorAll(col_class).forEach(function (col) {
    width += Math.ceil(col.getBoundingClientRect().width);
  });
  wrapper.style.width = width + "px";
}

document.querySelectorAll(".desktop__columns .column-grid__wrapper").forEach(function (grid) {
  setWrapperWidth(grid, ".column-grid__col");
});

document.querySelectorAll(".quick-filters").forEach(function (filters) {
  setWrapperWidth(filters, ".quick-filters__item");
});

document.querySelectorAll(".calendar-hor__drag").forEach(function (calendar) {
  setWrapperWidth(calendar, ".calendar-hor__item");
});

},{}],13:[function(require,module,exports){
"use strict";

document.querySelectorAll(".show_prebid_window").forEach(function (item) {
  item.addEventListener("click", showModal);
});

document.querySelectorAll(".left-menu__close-window").forEach(function (form) {
  form.addEventListener("click", hideModal);
});

function showModal() {
  document.getElementById("prebid-window").style.display = "block";
  document.querySelector(".left-menu__close-window").style.display = "block";
  document.querySelector(".left-menu__avatar").style.display = "none";
}

function hideModal() {
  document.getElementById("prebid-window").style.display = "none";
  document.querySelector(".left-menu__close-window").style.display = "none";
  document.querySelector(".left-menu__avatar").style.display = "block";
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table_manager = undefined;

var _useful = require("../useful.js");

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

TableManager.prototype.onLoadSeetings = function () {
  var _this = this;

  this.settings.querySelectorAll(".checkbox__input").forEach(function (checkbox) {
    checkbox.addEventListener("change", _this.onSettingsChange.bind(_this));
  });

  this.setupSettingsDrag();
  this.setupBodyCheckboxes();
  this.changeOverlayStyle();
  window.addEventListener("resize", this.changeOverlayStyle.bind(this));
  window.addEventListener("resize", this.render.bind(this));
};

TableManager.prototype.setupBodyCheckboxes = function () {
  var _this2 = this;

  this.body_checkboxes = this.table.querySelectorAll(".main-table__tbody .checkbox__input");
  this.body_checkboxes.forEach(function (input) {
    input.addEventListener("change", _this2.onBodyInputChange.bind(_this2));
  });
};

TableManager.prototype.onBodyRowClick = function (e) {
  var target = e.target.closest(".main-table__tbody-row");
  var not_checkbox = e.target.closest(".main-table__check");
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

TableManager.prototype.showDetail = function () {
  document.querySelector(".layout__default").classList.add("layout__default_disabled");
  document.querySelector(".layout__detail").classList.add("layout__detail_active");
};

TableManager.prototype.hideDetail = function () {
  document.querySelector(".layout__default").classList.remove("layout__default_disabled");
  document.querySelector(".layout__detail").classList.remove("layout__detail_active");
};

TableManager.prototype.getData = function () {
  var _this3 = this;

  this.data = [];
  this.head_cols.forEach(function (col, index) {
    var data = {};
    data.name = col.dataset.colName || "";
    data.min = parseInt(col.dataset.minWidth) || "auto";
    data.max = parseInt(col.dataset.maxWidth) || "auto";
    col.classList.contains("main-table__thead-item_hide") ? data.active = false : data.active = true;
    data.immortal = !!col.dataset.immortal || false;
    _this3.data.push(data);
  });
};

TableManager.prototype.render = function () {
  var _getActiveColumnCount = this.getActiveColumnCountAndRemain(),
      remain = _getActiveColumnCount.remain,
      active_cols_count = _getActiveColumnCount.active_cols_count;

  this.columnRemainAssignment(remain, active_cols_count);
  this.setHeadColsWidth();
  this.setBodyColsWidth();
};

TableManager.prototype.getActiveColumnCountAndRemain = function () {
  var remain = this.table.offsetWidth - this.imortalColumnsWidth();
  var filled = false;
  var active_cols_count = 0;
  this.data.forEach(function (col) {
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

TableManager.prototype.imortalColumnsWidth = function () {
  var immortal_cols = this.data.filter(function (el) {
    return el.immortal;
  });
  var width = immortal_cols.reduce(function (sum, current) {
    return sum + current.min;
  }, 0);
  return width;
};

TableManager.prototype.columnRemainAssignment = function (remain, active_cols_count) {
  var cols_count = active_cols_count;
  this.data.forEach(function (col) {
    if (!col.active || cols_count === 0 || col.immortal) return;
    var free_px = remain / cols_count;
    var width = col.current + free_px;
    if (col.max && col.max < width) {
      var difference = width - col.max;
      width -= difference;
      free_px -= difference;
    }

    col.current = Math.round(width);
    remain -= free_px;
    cols_count -= 1;
  });
};

TableManager.prototype.setHeadColsWidth = function () {
  var _this4 = this;

  this.head_cols.forEach(function (col, index) {
    _this4.data[index].current === 0 ? _this4.hideHeadCol(index) : _this4.showHeadCol(index);
    col.style.width = _this4.data[index].current + "px";
  });
};

TableManager.prototype.showHeadCol = function (i) {
  this.head_cols[i].classList.remove("main-table__thead-item_hide");
};

TableManager.prototype.hideHeadCol = function (i) {
  this.head_cols[i].classList.add("main-table__thead-item_hide");
};

TableManager.prototype.setBodyColsWidth = function () {
  var _this5 = this;

  this.body_colgroup.forEach(function (col, index) {
    _this5.data[index].current === 0 ? _this5.hideBodyCol(index) : _this5.showBodyCol(index);
    col.style.width = _this5.data[index].current + "px";
  });
};

TableManager.prototype.hideBodyCol = function (i) {
  this.body_colgroup[i].classList.add("main-table__tbody-col_hide");
  this.body_rows.forEach(function (row) {
    row.querySelectorAll(".main-table__tbody-item")[i].classList.add("main-table__tbody-item_hide");
  });
};

TableManager.prototype.showBodyCol = function (i) {
  this.body_colgroup[i].classList.remove("main-table__tbody-col_hide");
  this.body_rows.forEach(function (row) {
    row.querySelectorAll(".main-table__tbody-item")[i].classList.remove("main-table__tbody-item_hide");
  });
};

TableManager.prototype.changeColumnPosition = function (from, to) {
  var el = this.data[from];
  this.data.remove(from);
  this.data.splice(to, 0, el);
  if (from - to < 0) to += 1;

  this.changeHeadColPosition(from, to);
  this.changeBodyColgroupColPosition(from, to);
  this.changeBodyColPosition(from, to);
  this.updateNodesData();
  this.render();
};

TableManager.prototype.changeHeadColPosition = function (from, to) {
  var head_el = this.head_cols[from];
  var thead_row = this.table.querySelector(".main-table__thead-row");
  thead_row.removeChild(head_el);
  thead_row.insertBefore(head_el, this.head_cols[to]);
};

TableManager.prototype.changeBodyColgroupColPosition = function (from, to) {
  var body_colgroup_el = this.body_colgroup[from];
  var body_colgroup_row = this.table.querySelector(".main-table__tbody-colgroup");
  body_colgroup_row.removeChild(body_colgroup_el);
  body_colgroup_row.insertBefore(body_colgroup_el, this.body_colgroup[to]);
};

TableManager.prototype.changeBodyColPosition = function (from, to) {
  this.body_rows.forEach(function (row) {
    var cols = row.querySelectorAll(".main-table__tbody-item");
    var body_el = cols[from];
    row.removeChild(body_el);
    row.insertBefore(body_el, cols[to]);
  });
};

TableManager.prototype.updateNodesData = function () {
  this.head_cols = this.table.querySelectorAll(".main-table__thead-item");
  this.body_colgroup = this.table.querySelectorAll(".main-table__tbody-col");
  this.body_rows = this.table.querySelectorAll(".main-table__tbody-row");
};

TableManager.prototype.onSettingsChange = function (e) {
  var input = e.target;
  var data_el = this.data.find(function (el) {
    return el.name === input.name;
  });

  var index = this.data.indexOf(data_el);
  if (input.checked) {
    this.showColumnByIndex(index);
  } else {
    this.hideColumnByIndex(index);
  }

  this.activeColumnMoreThanOne();
};

TableManager.prototype.hideColumnByIndex = function (index) {
  this.data[index].active = false;
  if (this.render_enable) {
    this.render();
  } else {
    this.hideHeadCol(index);
    this.hideBodyCol(index);
  }
};

TableManager.prototype.showColumnByIndex = function (index) {
  this.data[index].active = true;
  if (this.render_enable) {
    this.render();
  } else {
    this.showHeadCol(index);
    this.showBodyCol(index);
  }
};

TableManager.prototype.activeColumnMoreThanOne = function () {
  var active_checkboxes = this.settings.querySelectorAll(".checkbox__input:checked");
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

TableManager.prototype.setupSettingsDrag = function () {
  var self = this;
  var sort = new Sortable(this.settings, {
    animation: 150,
    // handle: ".set-sequence__marker",
    draggable: ".set-sequence__item",
    ghostClass: "set-sequence__item_dim",
    onEnd: function onEnd(evt) {
      if (evt.oldIndex != evt.newIndex) {
        self.changeColumnPosition(evt.oldIndex + 1, evt.newIndex + 1); // + 1 это исключение колонки с чекбоксами
      }
    }
  });
};

TableManager.prototype.onBodyInputChange = function (e) {
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

TableManager.prototype.changeOverlayCounter = function (value) {
  this.selected_counter.innerText = value;
};

TableManager.prototype.showSelectedOverlay = function () {
  this.selected_overlay.classList.add("main-table__selected-overlay_active");
  this.table.querySelector(".main-table__tbody").classList.add("main-table__tbody_selected-overlay");
};

TableManager.prototype.hideSelectedOverlay = function () {
  this.selected_overlay.classList.remove("main-table__selected-overlay_active");
  this.table.querySelector(".main-table__tbody").classList.remove("main-table__tbody_selected-overlay");
};

TableManager.prototype.changeOverlayStyle = function () {
  var width = this.table.offsetWidth;
  if (width <= 500) {
    this.selected_overlay.classList.add("main-table__selected-overlay_small");
  } else {
    this.selected_overlay.classList.remove("main-table__selected-overlay_small");
  }
};

TableManager.prototype.onHeadInputSelect = function (e) {
  if (e.target.checked) {
    this.selected_count = this.body_checkboxes.length;
    this.showSelectedOverlay();
  } else {
    this.selected_count = 0;
    this.hideSelectedOverlay();
  }
  this.body_checkboxes.forEach(function (checkbox) {
    checkbox.checked = e.target.checked;
  });
  this.changeOverlayCounter(this.selected_count);
};

TableManager.prototype.enableLinearView = function () {
  this.table.classList.add("main-table_linear");
  this.showActiveCols();
  this.render_enable = false;
};

TableManager.prototype.disableLinearView = function () {
  this.table.classList.remove("main-table_linear");
  this.render_enable = true;
};

TableManager.prototype.showActiveCols = function () {
  var _this6 = this;

  this.body_rows.forEach(function (row) {
    row.querySelectorAll(".main-table__tbody-item").forEach(function (col, index) {
      if (_this6.data[index].active) col.classList.remove("main-table__tbody-item_hide");
    });
  });
};

var table_manager = new TableManager(document.querySelector(".main-table"));

exports.table_manager = table_manager;

},{"../useful.js":18}],15:[function(require,module,exports){
"use strict";

function setupToggleList() {
	document.querySelectorAll(".divided-list__switchable").forEach(function (list) {
		list.addEventListener("click", toggle);
	});
}

function toggle(e) {
	if (e.which != 1) return false;

	var elem = e.target;
	if (elem.classList.contains("divided-list__title_show") || elem.classList.contains("divided-list__title_hide")) {
		elem.classList.toggle("divided-list__title_show");
		elem.classList.toggle("divided-list__title_hide");
		elem.parentNode.querySelector(".divided-list__hidden").classList.toggle("divided-list__hidden_show");
	}
}

window.addEventListener('load', setupToggleList);

},{}],16:[function(require,module,exports){
'use strict';

var _scroll = require('./scroll.js');

var _chart_tab = require('../examples/chart_tab.js');

var _kanbanManager = require('./kanban-manager.js');

var _tableManager = require('./table-manager.js');

function tabToogle(_ref) {
  var parent = _ref.parent,
      switches = _ref.switches,
      switch_class = _ref.switch_class,
      tabs = _ref.tabs,
      tab_class = _ref.tab_class;

  this.parent = parent;

  this.switches = switches;
  this.switch_class = switch_class;
  this.switch_class_active = switch_class + "_active";
  this.switch_active = parent.querySelector("." + this.switch_class_active);

  this.tabs = tabs;
  this.tab_class = tab_class;
  this.tab_class_active = tab_class + "_active";
  this.tab_active = parent.querySelector("." + this.tab_class_active);

  this.setup();
}

tabToogle.prototype.setup = function () {
  var _this = this;

  this.switches.forEach(function (el) {
    el.addEventListener("click", _this.onSwitchClick.bind(_this));
  });
};

tabToogle.prototype.onSwitchClick = function (e) {
  var el = e.target.closest("." + this.switch_class);
  if (el.classList.contains(this.switch_class_active)) return;

  this.resetActiveSwitch();
  this.resetActiveTab();
  this.toogle(el);
  this.onChange(el);
};

tabToogle.prototype.resetActiveSwitch = function () {
  this.switch_active.classList.remove(this.switch_class_active);
};

tabToogle.prototype.resetActiveTab = function () {
  this.tab_active.classList.remove(this.tab_class_active);
};

tabToogle.prototype.toogle = function (el) {
  el.classList.add(this.switch_class_active);
  var selector = "." + this.tab_class + "[data-tab='" + el.dataset.tab + "']";
  var tab = this.parent.querySelector(selector);
  tab.classList.add(this.tab_class_active);

  this.switch_active = el;
  this.tab_active = tab;
};

tabToogle.prototype.onChange = function () {
  // override
};

/* переключатели в форме быстрого создания задачи и общения */
document.querySelectorAll(".quick-creation").forEach(function (item) {
  new tabToogle({
    parent: item,
    switches: item.querySelectorAll(".quick-creation__tab"),
    switch_class: "quick-creation__tab",
    tabs: item.querySelectorAll(".quick-creation__content"),
    tab_class: "quick-creation__content"
  });
});

/* переключатели в окне предзаявок */
var prebid_window = document.getElementById("prebid-window");
if (prebid_window) {
  var toogle = new tabToogle({
    parent: prebid_window,
    switches: prebid_window.querySelectorAll(".window__middle .tabs__tab"),
    switch_class: "tabs__tab",
    tabs: prebid_window.querySelectorAll("window__tab"),
    tab_class: "window__tab"
  });

  toogle.onChange = function () {
    Ps.update(prebid_window.querySelector(".window__middle-wrapper"));
  };
}

/* переключатель в средней версии правой части страницы предзаявок */
var prebid_quickview_medium = document.getElementById("prebid_quickview_medium");
if (prebid_quickview_medium) {
  var _toogle = new tabToogle({
    parent: prebid_quickview_medium,
    switches: prebid_quickview_medium.querySelectorAll(".tabs__tab"),
    switch_class: "tabs__tab",
    tabs: prebid_quickview_medium.querySelectorAll(".table-quick-view__tab"),
    tab_class: "table-quick-view__tab"
  });
  _toogle.onChange = function () {
    Ps.update(prebid_quickview_medium);
  };
}

/* переключатели вида контента в разделе предзаявок */
var prebid = document.getElementById("pre-bid");
if (prebid) {
  var kanban_manager = void 0;
  var grid = document.getElementById("kanban-grid");
  var toggle = new tabToogle({
    parent: prebid,
    switches: prebid.querySelectorAll(".header__view-item"),
    switch_class: "header__view-item",
    tabs: prebid.querySelectorAll(".layout"),
    tab_class: "layout"
  });
  toggle.onChange = function (el) {
    var data = el.dataset.tab;
    if (data == "kanban") {
      if (kanban_manager) {
        kanban_manager.setColumnView();
      } else {
        kanban_manager = new _kanbanManager.KanbanManager(grid);
      }
    } else if (data == "graph") {
      _chart_tab.kanban_prebid.reflow();
    } else if (data == "table") {
      _tableManager.table_manager.render();
    }
  };
}

},{"../examples/chart_tab.js":17,"./kanban-manager.js":4,"./scroll.js":9,"./table-manager.js":14}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var kanban_prebid = document.querySelector("#tab-chart");

if (kanban_prebid) {
    exports.kanban_prebid = kanban_prebid = Highcharts.chart('tab-chart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stacked column chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: Highcharts.theme && Highcharts.theme.textColor || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: Highcharts.theme && Highcharts.theme.background2 || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: Highcharts.theme && Highcharts.theme.dataLabelsColor || 'white'
                }
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5]
        }]
    });
}

var chart_2 = document.querySelector("#view-stats-1");

if (chart_2) {
    Highcharts.chart('view-stats-1', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Клиентский спрос'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: Highcharts.theme && Highcharts.theme.textColor || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: Highcharts.theme && Highcharts.theme.background2 || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: Highcharts.theme && Highcharts.theme.dataLabelsColor || 'white'
                }
            }
        },
        series: [{
            name: 'John',
            data: [5, 3, 4, 7, 2]
        }, {
            name: 'Jane',
            data: [2, 2, 3, 2, 1]
        }, {
            name: 'Joe',
            data: [3, 4, 4, 2, 5]
        }]
    });
}

var chart_3 = document.querySelector("#view-stats-2");

if (chart_3) {
    Highcharts.chart('view-stats-2', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Сравнение кол-ва предзаявок'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function formatter() {
                    return this.value; // clean, unformatted number for year
                }
            }
        },
        yAxis: {
            title: {
                text: 'Nuclear weapon states'
            },
            labels: {
                formatter: function formatter() {
                    return this.value / 1000 + 'k';
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'USA',
            data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605, 24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
        }, {
            name: 'USSR/Russia',
            data: [null, null, null, null, null, null, null, null, null, null, 5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000, 21000, 20000, 19000, 18000, 18000, 17000, 16000]
        }]
    });
}

var chart_4 = document.querySelector("#view-stats-3");

if (chart_4) {
    Highcharts.chart('view-stats-3', {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Активность менеджеров'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },
        series: [{
            name: 'Female',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0], [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8], [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8], [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0], [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8], [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6], [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3], [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8], [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3], [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3], [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0], [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7], [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5], [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2], [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8], [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9], [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2], [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4], [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4], [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2], [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0], [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0], [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4], [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4], [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5], [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5], [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2], [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2], [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3], [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5], [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4], [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6], [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8], [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1], [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5], [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2], [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6], [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0], [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0], [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9], [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1], [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4], [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7], [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5], [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8], [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0], [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9], [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6], [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8], [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]

        }, {
            name: 'Male',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8], [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6], [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0], [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9], [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8], [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9], [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1], [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1], [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6], [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1], [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2], [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2], [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0], [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2], [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2], [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9], [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9], [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0], [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3], [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7], [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5], [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3], [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1], [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0], [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2], [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1], [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6], [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1], [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5], [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1], [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5], [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5], [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9], [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1], [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8], [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5], [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4], [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5], [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6], [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7], [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5], [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6], [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7], [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0], [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3], [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3], [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9], [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1], [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1], [180.3, 83.2], [180.3, 83.2]]
        }]
    });
}

exports.kanban_prebid = kanban_prebid;
exports.chart_2 = chart_2;
exports.chart_3 = chart_3;
exports.chart_4 = chart_4;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getHeightWithMargin(el) {
  var styles = window.getComputedStyle(el, null);
  var margin_top = styles.getPropertyValue("margin-top");
  var margin_bottom = styles.getPropertyValue("margin-top");
  var height = el.getBoundingClientRect().height + parseInt(margin_top) + parseInt(margin_bottom);
  return height;
}

function log(obj) {
  console.warn('<log>', obj);
}

Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

exports.getHeightWithMargin = getHeightWithMargin;
exports.log = log;

},{}]},{},[1]);
