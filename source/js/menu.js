var menu_toggle = document.querySelector('.page-header__menu-toggle');
var menu_block = document.querySelector('.page-header__nav');

menu_toggle.classList.remove('page-header__menu-toggle--opened');

menu_toggle.onclick = function(evt) {
  this.classList.toggle ('page-header__menu-toggle--opened');
  menu_block.classList.toggle('page-header__nav--mobile-closed');
}

var no_js_elements = document.querySelectorAll('.no-js');

for (var i = 0; i < no_js_elements.length; i++) {
  no_js_elements[i].classList.remove('no-js');
}
