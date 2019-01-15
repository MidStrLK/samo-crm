function DragScroll({
    container, 
    x_scroll_container, 
    y_scroll_container, 
    handle = null, 
    exception = null,
    mouse_scroll_x = true,
    mouse_scroll_y = true,
  }) {
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

DragScroll.prototype.setupMouseScroll = function() {
  if (this.mouse_scroll_x) {
    this.container.querySelectorAll(this.x_scroll_container).forEach((container) => {
      Ps.initialize(container, {
        suppressScrollY: true,
        handlers: ['wheel', 'keyboard', 'drag-scrollbar']
      });
    });
  }

  if (this.mouse_scroll_y) {
    this.container.querySelectorAll(this.y_scroll_container).forEach((container) => {
      Ps.initialize(container, {
        suppressScrollX: true,
        handlers: ['wheel', 'keyboard', 'drag-scrollbar']
      });
    });
  }
};

DragScroll.prototype.updateMouseScroll = function(target) {
  let x = target.closest(this.x_scroll_container);
  let y = target.closest(this.y_scroll_container);
  Ps.update(x);
  Ps.update(y);
};

DragScroll.prototype.updateXMouseScroll = function(target) {
  let container;
  container=target.closest(this.x_scroll_container) && Ps.update(container);
};

DragScroll.prototype.enableEdgeScroll = function(el) {
  el.addEventListener("touchmove", this._dragOnEdge);
  el.addEventListener("drag", this._dragOnEdge);
};

DragScroll.prototype.disableEdgeScroll = function(el) {
  el.removeEventListener("touchmove", this._dragOnEdge);
  el.removeEventListener("drag", this._dragOnEdge);
  this.onDragEnd();
};

DragScroll.prototype.dragOnEdge = function(e) {
  let { x, y } = this.getXY(e);
  this.dragOnHorizontalEdge(e.target, x, y);
  this.dragOnVerticalEdge(e.target, x, y);
};

DragScroll.prototype.getXY = function(e) {
  let x, y;
  if (e.clientX && e.clientX >= 0) {
    x = e.clientX;
    y = e.clientY;    
  } else if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  return { x, y };
};

DragScroll.prototype.dragOnHorizontalEdge = function(target, x, y) {
  let container = target.closest(this.x_scroll_container);
  let rect = container.getBoundingClientRect();
  let ver_fit = y > rect.top && y < rect.bottom;
  let near_right_edge = x > (rect.right - 70) && x < rect.right && ver_fit;
  let near_left_edge = x < (rect.left + 70) && x > rect.left && ver_fit;

  if (near_right_edge && container.scrollLeft != (container.scrollWidth - container.clientWidth)) {
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

DragScroll.prototype.dragOnVerticalEdge = function(target, x, y) {
  let container = target.closest(this.y_scroll_container);
  let rect = container.getBoundingClientRect();
  let hor_fit = x > rect.left && x < rect.right;
  let near_top_edge = y < (rect.top + 70) && y > rect.top && hor_fit;
  let near_bottom_edge = y > (rect.bottom - 70) && y < rect.bottom && hor_fit;

  if (near_bottom_edge && container.scrollTop != (container.scrollHeight - container.clientHeight)) {
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

DragScroll.prototype.scrollToTop = function(container) {
  if (!this.y_move) {
    this.y_move = window.setInterval(() => {
      container.scrollTop -= 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToRight = function(container) {
  if (!this.x_move) {
    this.x_move = window.setInterval(() => {
      container.scrollLeft += 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToBottom = function(container) {
  if (!this.y_move) {
    this.y_move = window.setInterval(() => {
      container.scrollTop += 3;
    }, 10);
  }
};

DragScroll.prototype.scrollToLeft = function(container) {
  if (!this.x_move) {
    this.x_move = window.setInterval(() => {
      container.scrollLeft -= 3;
    }, 10);
  }
};

DragScroll.prototype.onDragEnd = function() {
  window.clearInterval(this.y_move);
  this.y_move = null; 
  window.clearInterval(this.x_move);
  this.x_move = null;  
};

DragScroll.prototype.onMouseDown = function(e) {
  let target = e.target;
  if (this.notException(target) && this.itIsHandle(target)) {
    this.active = true;
    let { x, y } = this.getXY(e);
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

DragScroll.prototype.notException = function(el) {
  if (this.exception) {
    return el.closest(this.exception) ? false : true;
  } else {
    return true;
  }
};

DragScroll.prototype.itIsHandle = function(el) {
  if (this.handle) {
    return el.closest(this.handle) ? true : false;
  } else {
    return true;
  }
};

DragScroll.prototype.onMouseMove = function(e) {
  this.active && this.updateScrollPosition(e);
};

DragScroll.prototype.updateScrollPosition = function(e) {
  if (e.clientX && e.clientX >= 0) {
    this.current_x_container.scrollLeft -= (- this.clientX + (this.clientX = e.clientX));
    this.current_y_container.scrollTop -= (- this.clientY + (this.clientY = e.clientY));
  } else if (e.touches) {
    this.current_x_container.scrollLeft -= (- this.clientX + (this.clientX = e.touches[0].clientX));
    this.current_y_container.scrollTop -= (- this.clientY + (this.clientY = e.touches[0].clientY));
  }
};

DragScroll.prototype.onMouseUp = function(e) {
  this.active = null;
  window.removeEventListener("mousemove", this._onMouseMove);
  window.removeEventListener("mouseup", this._onMouseUp);
  window.removeEventListener("touchmove", this._onMouseMove);
  window.removeEventListener("touchend", this._onMouseUp);
};

export { DragScroll };