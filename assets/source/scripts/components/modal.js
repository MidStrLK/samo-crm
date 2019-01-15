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

Modal.prototype.selectRelevantBlackout = function() {
  if (this.blackout_type == "full-screen") {
    this.blackout = document.querySelector(".blackout_full-screen");
  }  
};

Modal.prototype.activate = function() {
  if (this.active) return;
  this.active = true;
  this.enableModal();
  if (this.highlight) this.enableHighlight();
  this.enableBlackout();
  window.addEventListener("click", this._disable);
  window.addEventListener("resize", this._setModalCoordinates);
};

Modal.prototype.disable = function(e) {
  if (e.target.closest(".modal") || e.target.closest(".modal-target")) return;
  this.active = false;
  this.disableModal();
  if (this.highlight) this.disableHighlight();
  this.disableBlackout();
  window.removeEventListener("click", this._disable);
  window.removeEventListener("resize", this._setModalCoordinates);
};

Modal.prototype.enableModal = function() {
  this.modal.classList.add("modal_active");
  this.setModalCoordinates();
};

Modal.prototype.disableModal = function() {
  this.modal.classList.remove("modal_active");
};

Modal.prototype.enableHighlight = function() {
  this.target.classList.add("modal-target_active");
};

Modal.prototype.disableHighlight = function() {
  this.target.classList.remove("modal-target_active");
};

Modal.prototype.enableBlackout = function() {
  this.blackout.classList.add("blackout_active");
};

Modal.prototype.disableBlackout = function() {
  this.blackout.classList.remove("blackout_active");
};

Modal.prototype.getHorizontalCoordinates = function() {
  let left;
  if (this.target_rect.left - 20 > this.modal_width) {
    left = this.target_rect.left - this.modal_width - 15;
  } else if (((window.innerWidth - 20) - this.target_rect.right) > this.modal_width) {
    left = this.target_rect.right + 15;
  } else {
    left = 20;
  }
  return left;
};

Modal.prototype.getVerticalCoordinates = function() {
  let top = this.target_rect.top;
  let bottom = null;
  if (top + this.modal_height > (window.innerHeight - 20)) {
    let diff = (top + this.modal_height) - (window.innerHeight - 20);
    top -= diff;
    if (top <= 20) {
      top = 20;
      if (top + this.modal_height > window.innerHeight - 20) bottom = 20;
    }
  }
  return { top, bottom };
};

Modal.prototype.setModalCoordinates = function() {
  this.modal_width = this.modal.offsetWidth;
  this.modal_height = this.modal.scrollHeight;
  this.target_rect = this.target.getBoundingClientRect();
  let left = this.getHorizontalCoordinates();
  let { top, bottom } = this.getVerticalCoordinates();
  this.modal.style.top = top + "px";
  this.modal.style.left = left + "px";
  if (bottom) {
    this.modal.style.bottom = bottom + "px";
  } else {
    this.modal.style.bottom = "auto";
  }
};

document.querySelectorAll(".modal-target").forEach((modal) => {
  new Modal(modal);
});

export { Modal };