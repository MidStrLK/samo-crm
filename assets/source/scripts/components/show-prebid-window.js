document.querySelectorAll(".show_prebid_window").forEach((item) => {
  item.addEventListener("click", showModal);
});

document.querySelectorAll(".left-menu__close-window").forEach((form)=> {
  form.addEventListener("click", hideModal);
});

function showModal() {
  document.getElementById("prebid-window").style.display = "block";
  document.querySelector(".left-menu__close-window").style.display = "block";
  document.querySelector(".left-menu__avatar").style.display = "none";
} 

function hideModal() {
  document.getElementById("prebid-window").style.display = "none";
  document.querySelector(".left-menu__close-window").style.display = "none";
  document.querySelector(".left-menu__avatar").style.display = "block";
}