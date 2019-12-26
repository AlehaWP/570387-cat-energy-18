var requiredElements = document.querySelectorAll('.input-required');

for (var i = 0; i < requiredElements.length; i++) {
  requiredElements[i].removeAttribute('required');
}

var formSubmit = document.querySelector('.form__submit');
formSubmit.addEventListener("click", function (evt) {
  console.log('Начали');
  var requiredElements = document.querySelectorAll('.input-required');
  for (var i = 0; i < requiredElements.length; i++) {
    requiredElements[i].setAttribute("required", "");
  }
  console.log('Закончили');
});
