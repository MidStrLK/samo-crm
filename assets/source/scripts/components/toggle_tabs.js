import { updateParentScrollIfExist } from './scroll.js';
import { kanban_prebid } from '../examples/chart_tab.js';
import { KanbanManager } from './kanban-manager.js';
import { table_manager } from './table-manager.js';

function tabToogle({parent, switches, switch_class, tabs, tab_class}) {
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

tabToogle.prototype.setup = function() {
  this.switches.forEach((el) => {
    el.addEventListener("click", this.onSwitchClick.bind(this));
  });
};

tabToogle.prototype.onSwitchClick = function(e) {
  let el = e.target.closest("." + this.switch_class);
  if (el.classList.contains(this.switch_class_active)) return;

  this.resetActiveSwitch();
  this.resetActiveTab();
  this.toogle(el);
  this.onChange(el);
};

tabToogle.prototype.resetActiveSwitch = function() {
  this.switch_active.classList.remove(this.switch_class_active);
};

tabToogle.prototype.resetActiveTab = function() {
  this.tab_active.classList.remove(this.tab_class_active);
};

tabToogle.prototype.toogle = function(el) {
  el.classList.add(this.switch_class_active);
  let selector = "." + this.tab_class + "[data-tab='" + el.dataset.tab + "']";
  let tab = this.parent.querySelector(selector);
  tab.classList.add(this.tab_class_active);

  this.switch_active = el;
  this.tab_active = tab;
};

tabToogle.prototype.onChange = function() {
  // override
};

/* переключатели в форме быстрого создания задачи и общения */
document.querySelectorAll(".quick-creation").forEach((item) => {
  new tabToogle({
    parent: item,
    switches: item.querySelectorAll(".quick-creation__tab"),
    switch_class: "quick-creation__tab",
    tabs: item.querySelectorAll(".quick-creation__content"),
    tab_class: "quick-creation__content"
  });
});

/* переключатели в окне предзаявок */
let prebid_window = document.getElementById("prebid-window");
if (prebid_window) {
  let toogle = new tabToogle({
    parent: prebid_window,
    switches: prebid_window.querySelectorAll(".window__middle .tabs__tab"),
    switch_class: "tabs__tab",
    tabs: prebid_window.querySelectorAll("window__tab"),
    tab_class: "window__tab"
  });

  toogle.onChange = function() {
    Ps.update(prebid_window.querySelector(".window__middle-wrapper"));
  };
}

/* переключатель в средней версии правой части страницы предзаявок */
let prebid_quickview_medium = document.getElementById("prebid_quickview_medium");
if (prebid_quickview_medium) {
  let toogle = new tabToogle({
      parent: prebid_quickview_medium,
      switches: prebid_quickview_medium.querySelectorAll(".tabs__tab"),
      switch_class: "tabs__tab",
      tabs: prebid_quickview_medium.querySelectorAll(".table-quick-view__tab"),
      tab_class: "table-quick-view__tab"
  });
  toogle.onChange = function() {
    Ps.update(prebid_quickview_medium);
  };
}

/* переключатели вида контента в разделе предзаявок */
let prebid = document.getElementById("pre-bid");
if (prebid) {
  let kanban_manager;
  let grid = document.getElementById("kanban-grid");
  let toggle = new tabToogle({
    parent: prebid,
    switches: prebid.querySelectorAll(".header__view-item"),
    switch_class: "header__view-item",
    tabs: prebid.querySelectorAll(".layout"),
    tab_class: "layout"
  });
  toggle.onChange = function(el) {
    let data = el.dataset.tab;
    if (data == "kanban") {
      if (kanban_manager) {
        kanban_manager.setColumnView();
      } else {
        kanban_manager = new KanbanManager(grid);
      }
    } else if (data == "graph") {
      kanban_prebid.reflow();
    } else if (data == "table") {
      table_manager.render();
    }
  };
}