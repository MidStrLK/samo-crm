import './components/toggle_tabs.js';
import './components/show-prebid-window.js';

/* полезные функции */
import './useful.js';

/* универсальный элементы */
import './components/search-field.js';
import './components/select.js';
import './components/quick-view.js';
import './components/creation-form.js';
import './components/table-manager.js';
import './components/kanban-manager.js';
import { DragScroll } from './components/drag-scroll.js';
import './components/modal.js';

/* для разработки */
import './examples/chart_tab.js';

/* инициализация компонентов */
import './components/toggle-divided-list.js';
import './components/left-menu-modal.js';
import './components/left-menu-resize.js';
import './components/set-wrapper-width.js';
import './components/scroll.js';

/* расчет размера плашки для быстрых фильтров*/
(function() {
  let header_filters = document.querySelector(".quick-filters");
  if (!header_filters) return;
  let header_row = header_filters.closest(".header__bottom");
  let quick_filters = new DragScroll({
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
    onStart(e) {
      quick_filters.enableEdgeScroll(e.item);
    },
    onEnd(e) {
      quick_filters.disableEdgeScroll(e.item);
    }
  });
})();