function setupScrolls() {
	document.querySelectorAll(".scrollable").forEach((el) => {
		Ps.initialize(el, {
			useBothWheelAxes: true
		});
	});
}

function updateScrolls() { // придумать как лучше апдейтить скроллы, ведь их будет куча
	document.querySelectorAll(".scrollable").forEach((el) => {
		Ps.update(el);
	});
}

function updateParentScrollIfExist(el) {
  let scrollable = el.closest(".scrollable");
  if (scrollable) {
    Ps.update(scrollable);
  }
}

window.addEventListener('load', setupScrolls);
window.addEventListener("resize", updateScrolls);

export { updateScrolls, updateParentScrollIfExist };