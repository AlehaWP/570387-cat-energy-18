var menu_toggle = document.querySelector('.page-header__menu-toggle');
var menu_block = document.querySelector('.page-header__nav');

menu_toggle.classList.remove('no-js');
menu_toggle.classList.remove('page-header__menu-toggle--opened');
menu_block.classList.remove('no-js');

menu_toggle.onclick = function(evt) {
  this.classList.toggle ('page-header__menu-toggle--opened');
  menu_block.classList.toggle('page-header__nav--mobile-closed');
}
