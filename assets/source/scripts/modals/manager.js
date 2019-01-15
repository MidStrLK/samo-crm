let modalManager = new function() {
	let activator;

	function onMouseDown(e) {
		if (e.which != 1) return false;

		activator = findModalActivator(e);
		if (!activator) {
			return false;
		}

		let modal_window = activator.dataset.modal;
		document.querySelector("#" + modal_window).style.display = "block";
	}

	function findModalActivator(e) {
		let elem = e.target;
		while (elem != document && !elem.classList.contains("modal")) {
			elem = elem.parentNode;
		}
		if (elem == document) return false;
		return elem;
	}

	document.onmousedown = onmousedown;
};

export { modalManager };