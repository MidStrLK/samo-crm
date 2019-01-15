import { updateScrolls } from "./scroll.js";
import { table_manager } from './table-manager.js';
import { chart_2, chart_3, chart_4 } from '../examples/chart_tab.js';

let parent = document.querySelector(".layout");
let table = document.querySelector(".layout__table");
let quick_view = document.querySelectorAll(".layout__view");

/* TODO: Заменить на свое решение и убать библиотеку*/

interact('.layout__view').resizable({
  preserveAspectRatio: true,
  edges: { left: true }
}).on("resizemove", changeLayout);

function changeLayout(event) {
  let rect = event.rect.width;
  let table_width = parent.offsetWidth - rect;
  table_manager.changeOverlayStyle();

  if (table_width <= 350) {
    table.style.right = (parent.offsetWidth - 350) + "px";
    table_manager.enableLinearView();
    changeQuickViewWidth(parent.offsetWidth - 350);
    updateScrolls();
  } else {
    table.style.right = rect + "px";
    table_manager.disableLinearView();
    changeQuickViewWidth(rect);

    table_manager.render();
    resetColumnActivity();
    updateScrolls();
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
  document.querySelectorAll(".table-quick-view__size").forEach((item) => {
    item.classList.remove("table-quick-view__size_active");
  });
}

function changeQuickViewWidth(width) {
  quick_view.forEach((view) => {
    view.style.width = width + "px";
  });
}