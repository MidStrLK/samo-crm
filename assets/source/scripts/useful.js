function getHeightWithMargin(el) {
  let styles = window.getComputedStyle(el, null);
  let margin_top = styles.getPropertyValue("margin-top");
  let margin_bottom = styles.getPropertyValue("margin-top");
  let height = el.getBoundingClientRect().height + parseInt(margin_top) + parseInt(margin_bottom);
  return height;
}

function log(obj) {
  console.warn('<log>', obj);
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

export { getHeightWithMargin, log };