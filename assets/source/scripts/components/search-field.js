function searchFilter(field) {
  this.field = field;
  this.modal = document.getElementById(field.dataset.filters);
  this.active = false;
  this.blackout = document.querySelector(".blackout_table");
  this.field.addEventListener("click", this.showModal.bind(this));
}

searchFilter.prototype.showModal = function() {
  if (this.active) return;

  this.blackout.classList.add("blackout_active");
  this.modal.classList.add("search-filters_active");

  this._isInModal = this.isInModal.bind(this);
  document.addEventListener("click", this._isInModal);
  this.active = true;
};

searchFilter.prototype.isInModal = function(e) {
  let in_modal = e.target.closest(".search-filters");
  let in_header = e.target.closest(".header");

  if (!in_modal && !in_header) {
    this.blackout.classList.remove("blackout_active");
    this.modal.classList.remove("search-filters_active");
    this.active = false;
    document.removeEventListener("click", this._isInModal);
  }
};

document.querySelectorAll(".search-field").forEach((field) =>  {
  new searchFilter(field);
});