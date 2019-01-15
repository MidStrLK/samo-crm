(function() {
  let menu = document.querySelector(".left-menu");
  if (!menu) return;

  let menu_height = menu.offsetHeight;
  let more = document.querySelector(".left-menu__more");
  let items = menu.querySelectorAll(".left-menu__item_category");
  let submenu = menu.querySelector(".left-menu__submenu_other");
  let was_edit = false;

  function menuFitIntoScreen(e) {
    if (menu_height > window.innerHeight) {
      resetMenu();
      toggleMenuItems();
    } else if (was_edit) {
      resetMenu();
    }
  }

  function toggleMenuItems() {
    was_edit = true;
    more.style.display = "block";
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].style.display = "none";
      let name = items[i].querySelector(".left-menu__tip").innerText;
      let icon_class = items[i].querySelector(".left-menu__icon").className.split(" ")[1];
      let href = items[i].querySelector(".left-menu__to-category").getAttribute("href");
      createSubmenuItem(name, icon_class, href);

      if (menu.offsetHeight < window.innerHeight) break;
    }
  }

  function createSubmenuItem(name, icon_class, href) {
    let wrapper = document.createElement("div");
    let icon = document.createElement("div");
    let link = document.createElement("a");
    wrapper.classList.add("left-menu__subitem");
    icon.classList.add("left-menu__icon", icon_class + "-black");
    link.classList.add("left-menu__link");
    link.setAttribute("href", href);
    link.innerText = name;
    wrapper.appendChild(icon);
    wrapper.appendChild(link);
    submenu.insertAdjacentElement("afterbegin", wrapper);
  }

  function resetMenu() {
    was_edit = false;
    items.forEach((item) => {
      item.style.display = "block";
    });
    submenu.innerHTML = "";
    more.style.display = "none";
  }

  window.addEventListener("resize", menuFitIntoScreen);
  window.addEventListener("load", menuFitIntoScreen);
}());