import { updateScrolls } from './scroll.js';

function leftMenuModal() {
	let target, menu_item, modal_wrapper, previous_menu_item, is_active, previous_wrapper;
	let left_menu = document.querySelector(".left-menu");
	let arrow = document.querySelector(".menu-modal__arrow");
	let modal = document.querySelector(".menu-modal");

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
		updateScrolls();
	}

	function changeArrowProperties() {
		let top = menu_item.getBoundingClientRect().bottom - (menu_item.offsetHeight / 2) - ( arrow.offsetHeight / 2 ) - 6; // 6 это отступ всплывающего окна от края
		arrow.style.top = top + "px";

		if (modal_wrapper.id == "menu-modal-search") {
			arrow.style.backgroundColor = "#F9F9F9";
		} else {
			arrow.style.backgroundColor = "white";
		}
	}

	function isOutOfZone(e) {
		let in_modal = e.target.closest(".menu-modal");
		let is_current_menu_item = e.target.closest(".left-menu__item_full-size") == previous_menu_item;

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

		window.setTimeout(function() { // ждем окончания анимации исчезновения окна и после ресетим стрелку
			arrow.style.top = "initial";
		}, 200);
	}

	left_menu.addEventListener("click", modalManager);

}

window.addEventListener("load", leftMenuModal);