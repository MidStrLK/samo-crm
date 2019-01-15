function setupToggleList() {
	document.querySelectorAll(".divided-list__switchable").forEach((list) => {
		list.addEventListener("click", toggle);
	});
}

function toggle(e) {
	if (e.which != 1) return false;

	let elem = e.target;
	if (elem.classList.contains("divided-list__title_show") || elem.classList.contains("divided-list__title_hide")) {
		elem.classList.toggle("divided-list__title_show");
		elem.classList.toggle("divided-list__title_hide");
		elem.parentNode.querySelector(".divided-list__hidden").classList.toggle("divided-list__hidden_show");
	}
}

window.addEventListener('load', setupToggleList);