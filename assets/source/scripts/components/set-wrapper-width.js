function setWrapperWidth(wrapper, col_class) {
  let width = 0;
  wrapper.querySelectorAll(col_class).forEach((col) => {
    width += Math.ceil(col.getBoundingClientRect().width);
  });
  wrapper.style.width = width + "px";
}

document.querySelectorAll(".desktop__columns .column-grid__wrapper").forEach((grid) => {
  setWrapperWidth(grid, ".column-grid__col");
});

document.querySelectorAll(".quick-filters").forEach((filters) => {
  setWrapperWidth(filters, ".quick-filters__item");
});

document.querySelectorAll(".calendar-hor__drag").forEach((calendar) =>{
  setWrapperWidth(calendar, ".calendar-hor__item");
});