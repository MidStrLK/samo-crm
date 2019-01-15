import { updateParentScrollIfExist } from './scroll.js';

function creationFormManager(form) {
  this.form = form;

  this._onTextareaClick = this.onTextareaClick.bind(this);
  this.form.addEventListener("click", this._onTextareaClick);
}

creationFormManager.prototype.onTextareaClick = function (e)  {
  let textarea = e.target.closest("textarea");
  if (!textarea) return;

  this.form.classList.add("quick-creation_active");
  this.form.removeEventListener("click", this._onTextareaClick);

  updateParentScrollIfExist(textarea);
};


document.querySelectorAll(".quick-creation").forEach((form) => {
  new creationFormManager(form);
});

// TODO: перенести сюда функционал переключения вкладок, если в форме они есть