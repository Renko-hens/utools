import toolCreate from './_1_tooltip';

// Форма
const form = document.querySelector("#formCabinetAuth");

// Поля Ввода
const flashMessages = document.querySelector(".js-flash-message");
const email = document.querySelector(".form__input--email");
const code = document.querySelector(".form__input--code");
const promocode = document.querySelector(".form__input--promocode");
const checkboxRegistration = document.querySelector("#checkboxRegistration");
const blockButtons = document.querySelector(".form__wrapper-button");
let buttonSendCode = document.querySelector("#buttonSendCode");
let buttonRegistration = document.querySelector("#buttonRegistration");
let buttonLogIn = document.querySelector("#buttonLogIn");

const emailRedirect = document.querySelector(".form__link--helper");
// Все инпуты и чекбоксы
let inputList = document.querySelectorAll(".form__input");
const checkboxList = document.querySelectorAll(".custom-checkbox__input");


// Регулярки
var expressionPatternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var expressionPatternCode = /^\d+$/;
var expressionPatternPromocode = /[a-zA-Z]/;

// Объект сообщений
var messageObject = {
  error: {
    email: "Неправильно введена почта, введите пожалуйста по примеру: email@myemail.com",
    code: {
      minLength: "Код должен состоять только из 6 цифр!",
      wrongValue: "Код введен не верно"
    },
    promo: "Промо-код состоит не менее 3 символов",
    empty: 'Заполните пустые поля',
    checked: "Вы должны принять соглашение"
  }
};


// Обработчик событий на отправку
// Ручник
$("body").on('submit', "#formCabinetAuth", function (e) {
  e.preventDefault();
  if (validateEmail()) {
    sendEmail();
  };
});

$("body").on('submit', "#formCabinetRegistration", function (e) {
  // console.log(validateEmail(), validateAgreeRegistration(), validatePromocode(), validateCode());
  e.preventDefault();
  if (validateEmail() && validateAgreeRegistration() && validatePromocode() && validateCode()) {
    registration();
  }
});

$("body").on('submit', "#formCabinetSignIn", function (e) {
  // console.log(validateEmail(), validateCode());
  e.preventDefault();
  if (validateEmail() && validateCode()) {
    signIn();
  }
});

// Ajax запросы
function sendEmail() {
  var f = $(".form--validate").serializeObject();

  $.ajax({
    url: '/api/cabinet/v1/code/',
    type: "POST",
    data: {
      email: f.inputEmail
    },
    beforeSend: function () {
      $("#buttonSendCode").addClass("btn--state-b disabled btn--disabled");
      $("#formCabinetAuth").off('submit');

      // Записываем почту перед отправкой
      var emailText = document.querySelector(".form__input--email").value;
      localStorage.setItem('emailText', emailText);
    },
    success: function (data) {
      var response = JSON.parse(data);
      // var response = data;

      // console.log(response);
      if (response.success) {

        $("#titleForm").html(response.titleForm);
        $("#formCabinetAuthWrapper").html(response.appendForm);

        // Создаем таймер
        createElementTimer(10);
        // Добавляем таймер // Добавляем кнопку "Отправить кнопку повторно", сперва удаляя её и добавляя снова
        window.intervalID = setInterval(setTimer, 1000);

        // Создаем туллтип в форме если он есть.
        toolCreate();
        $("#buttonSendCode").removeClass("btn--state-b disabled btn--disabled");

        // Проверяет адресную строку есть ли промокод или нет
        isPromoCode();
      } else if (response.error) {
        // TODO Добавить сообщение об ошибках с сервера в уведомлялку
        $("#buttonSendCode").removeClass("btn--state-b disabled btn--disabled");
        // Показываем ошибки с сервера
        showFlashMessage(response.message, 4000);
      }
    },
    error: function () {
      console.log("Ошибка сервера");
      //  TODO Нарисовать zeroState для офф ошибок
      $("#buttonSendCode").removeClass("btn--state-b disabled btn--disabled");
    }
  });
};

function signIn() {
  var f = $("#formCabinetSignIn").serializeObject();

  $.ajax({
    url: '/api/cabinet/v1/login/',
    type: "POST",
    data: {
      email: f.inputEmail,
      authCode: f.inputAuthCode
    },
    beforeSend: function () {
      $("#buttonLogIn").addClass("btn--state-b disabled btn--disabled");
      // $("#formCabinetAuth").off('submit');
    },
    success: function (data) {
      // var response = JSON.parse(data);
      var response = data;

      // console.log(response);
      if (response.success) {
        $("#titleForm").html(response.titleForm);

        $("#formCabinetAuthWrapper").html(response.appendForm);

        // Создаем туллтип в форме если он есть.
        toolCreate();

        $("#buttonLogIn").removeClass("btn--state-b disabled btn--disabled");

        window.location.reload();

      } else if (response.error) {
        $("#buttonLogIn").removeClass("btn--state-b disabled btn--disabled");
        // Показываем ошибки с сервера
        showFlashMessage(response.message, 4000);
      }

      // Отправка кода повторно
      if (response.error && response.message == "Код не подошел или устарел") {
        if (response.error_code == 1002) {
          // console.log("1");
          code.setAttribute('aria-invalid', true);
        }
        // Добавляем кнопке "Войти" атрибут невалидности
        addDisabledClassButton();

        // Навешиваем обработчик на изменение поля формы, если оно меняется то кнопка включается
        checkAttribute(code);
      }

    },
    error: function () {
      console.log("Ошибка сервера");
      $("#buttonLogIn").removeClass("btn--state-b disabled btn--disabled");
    }
  });
};

function registration() {
  var f = $("#formCabinetRegistration").serializeObject();

  $.ajax({
    url: '/api/cabinet/v1/login/',
    type: "POST",
    data: {
      email: f.inputEmail,
      authCode: f.inputAuthCode,
      promoCode: f.inputPromoCode
    },
    beforeSend: function () {
      $("#buttonRegistration").addClass("btn--state-b disabled btn--disabled");
      // $("#formCabinetAuth").off('submit');
    },
    success: function (data) {
      // var response = JSON.parse(data);
      var response = data;

      // console.log(response);
      if (response.success) {
        window.location.reload();
      } else if (response.error) {
        $("#buttonRegistration").removeClass("btn--state-b disabled btn--disabled");
        // Показываем ошибки с сервера
        showFlashMessage(response.message, 4000);
      }

      if (response.error && response.message == "Код не подошел или устарел") {
        if (response.error_code == 1001) {
          // console.log("1");
          code.setAttribute('aria-invalid', true);
        }
        // Отправка кода повторно
        if (response.error && response.message == "Промокод не найден!") {
          if (response.error_code == 1003) {
            promocode.setAttribute('aria-invalid', true);
          }
        }

        // Добавляем кнопке "Войти" атрибут невалидности
        addDisabledClassButton();

        // Навешиваем обработчик на изменение поля формы, если оно меняется то кнопка включается
        checkAttribute(code);
      }
    },
    error: function () {
      console.log("Ошибка сервера");
      $("#buttonRegistration").removeClass("btn--state-b disabled btn--disabled");
    }
  });
};

function reSendEmail() {
  var f = $(".form--validate").serializeObject();

  $.ajax({
    url: '/api/cabinet/v1/code/',
    type: "POST",
    data: {
      email: f.inputEmail
    },
    beforeSend: function () {
      // Добавляем кнопке loader
      $("#buttonSendCodeAgain").addClass("btn--state-b btn--disabled");
    },
    success: function (data) {
      var response = JSON.parse(data);
      // console.log(response);

      // Кнопке "отправить код повторно" убираем loader
        $("#buttonSendCodeAgain").removeClass("btn--state-b disabled btn--disabled");

      if (response.success) {
        showFlashMessage("Код отправлен на вашу почту", 4000);

        deleteButtonToSendCode();

        // Создаем таймер
        createElementTimer(10);

        // Добавляем таймер // Добавляем кнопку "Отправить кнопку повторно", сперва удаляя её и добавляя снова
        window.intervalID = setInterval(setTimer, 1000);
      } else if (response.error) {
        // Показываем ошибки с сервера
        showFlashMessage(response.message, 4000);
      }
    },
    error: function () {
      console.log("Ошибка сервера");
      //  TODO Нарисовать zeroState для офф ошибок
      $("#buttonSendCodeAgain").removeClass("btn--state-b disabled btn--disabled");
    }
  });
};

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //



function validateEmail() {
  let email = document.querySelector(".form__input--email");
  // Проверяем на пустоту
  return !checkIfEmpty(email) && checkEmail(email);
}

function validateCode() {
  let code = document.querySelector(".form__input--code");
  // Проверяем на пустоту
  return !checkIfEmpty(code) && checkCode(code, 6, 7);
  // Проверяем по регулярному выражению и задаём максимальную длину цифр от 6 и больше и меньше 7 (включительно)
}

function validatePromocode() {
  let promocode = document.querySelector(".form__input--promocode");
  // Проверяем на пустоту
  return !checkIfEmpty(promocode) && checkPromocode(promocode, 3);
  // Проверяем по регулярному выражению и задаём минимальную длину цифр от 3
}

function validateAgreeRegistration() {
  let checkboxRegistration = document.querySelector("#isUserAgreement");
  // Проверям чекбокс на :checked
  return checkCheckbox(checkboxRegistration);
}

function checkIfEmpty(field) {
  if (isEmpty(field.value)) {
    // Уcтанавливаем поле не валидность
    setInvalid(messageObject.error.empty, field, 3000);
    return true;
  }
  //  Поле валидное
  setValid(field);
  return false;
}

function isEmpty(value) {
  return (value.trim() === '' || value === null);
}

// Задаем и показываем сообщение, где проблема, время показа уведомления
function setInvalid(objMessage, item, time) {
  let messages = objMessage;
  showFlashMessage(messages, time);
  addDisabledClassButton();
  // Проверяем поле после ошибки при отправке
  if (item !== null) {
    item.setAttribute('aria-invalid', true);
    checkAttribute(item);
  }
}

// Добавляем уведомление с сообщением
function showFlashMessage(text, time) {
  flashMessages.innerHTML = text;
  flashMessages.classList.add("flash-message--is-visible");
  setTimeout(hideFlashMessage, time);
};

// Удаляет класс у уводемлялки
function hideFlashMessage() {
  flashMessages.classList.remove("flash-message--is-visible");
};

// Делаем валидным поле при проверке
function setValid(field) {
  field.removeAttribute('aria-invalid');
  removeDisabledClassButton();
}

function removeDisabledClassButton() {
  buttonRegistration = document.querySelector("#buttonRegistration");
  buttonLogIn = document.querySelector("#buttonLogIn");

  if (buttonSendCode) {
    buttonSendCode.classList.remove("disabled");
  }
  if (buttonLogIn) {
    buttonLogIn.classList.remove("disabled");
  }
  if (buttonRegistration) {
    buttonRegistration.classList.remove("disabled");
  }
}

function addDisabledClassButton() {
  buttonRegistration = document.querySelector("#buttonRegistration");
  buttonLogIn = document.querySelector("#buttonLogIn");

  if (buttonSendCode) {
    buttonSendCode.classList.add("disabled");
  }
  if (buttonLogIn) {
    buttonLogIn.classList.add("disabled");
  }
  if (buttonRegistration) {
    buttonRegistration.classList.add("disabled");
  }
}

// Навешивает полям событие на изменение поля и убирает aria-invalid если они true
function checkAttribute(field) {
  inputList = document.querySelectorAll(".form__input");
  if (field.hasAttribute('aria-invalid')) {
    inputList.forEach(function (field) {
      field.addEventListener('input', deleteAriaInvalid);
    });
  }

  if (field.hasAttribute('data-checkboxAttribute')) {
    field.addEventListener('change', removeDisabledClassButton);
  };
};

// Удаляет INVALID для checkAttribute
function deleteAriaInvalid() {
  this.removeAttribute('aria-invalid');
  removeDisabledClassButton();
};


// Проверка почты по Регулярке
function checkEmail(field) {
  if (expressionPatternEmail.test(field.value.trim())) {
    setValid(field);
    return true;
  }

  setInvalid(messageObject.error.email, field, 3000);
  return false;
}

// Проверка кода по регулярке
function checkCode(field, minLength, maxLength) {
  // Если код прошел по регулярке и при этом равен минимальной и максимальной длине цифр то вернем 'true'
  if (expressionPatternCode.test(field.value.trim()) && field.value.length >= minLength && field.value.length < maxLength) {
    setValid(field);
    return true;
  } else if (field.value.length < minLength) {
    setInvalid(messageObject.error.code.minLength, field, 3000);
  } else {
    setInvalid(messageObject.error.code.wrongValue, field, 3000);
  }

  return false;
};

function checkPromocode(field, minLength) {
  // Если код прошел по регулярке и при этом равен минимальной и максимальной длине цифр
  if (expressionPatternPromocode.test(field.value.trim()) && field.value.length >= minLength) {
    setValid(field);
    return true;
  }

  setInvalid(messageObject.error.promo, field, 3000);
  return false;
};

function checkCheckbox(field) {
  if (field.checked) {
    return true;
  }

  setInvalid(messageObject.error.checked, field, 3000);
  return false;
};


function addButtonToSendCode() {
  var buttonReSend = document.querySelector("#buttonSendCodeAgain");
  var blockButtons = document.querySelector(".form__wrapper-button");
  var buttonResendCode = document.createElement("button");
  buttonResendCode.id = "buttonSendCodeAgain";
  buttonResendCode.type = "button";
  buttonResendCode.innerHTML = "<span class='btn__content-a'>Отправить код повторно</span><span class='btn__content-b'><svg class='icon icon--is-spinning' aria-hidden='true' viewBox='0 0 16 16'><title>Loading</title><g stroke-width='1' fill='currentColor' stroke='currentColor'><path d='M.5,8a7.5,7.5,0,1,1,1.91,5' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'></path></g></svg></span>"

  buttonResendCode.classList.add("form__button", "btn", "btn--secondary", "width-100%");

  // Проверяем на наличие кнопки если есть то удаляем, после добавляем
  if (buttonReSend) {
    buttonResend.remove();

    // Добавляем таймер (отсчет) после которого появляется кнопка
    blockButtons.appendChild(buttonResendCode);
    // Добавляем
  } else {
    blockButtons.appendChild(buttonResendCode);
  };

  // Определяем кнопку "Отправить код повторно"
  var buttonReSend = document.querySelector("#buttonSendCodeAgain");
  // Навешиваем и следим
  buttonReSend.addEventListener('click', function () {
    reSendEmail();
  });
};

function deleteButtonToSendCode() {
  var buttonReSend = document.querySelector("#buttonSendCodeAgain");
  buttonReSend.remove();
};
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

function setTimer() {

  function fixTimer(value) {
    var str = String(value);
    var result = (value < 10 && str.length === 1) ? "0"+value : value;
    return result;
  };

  // var hour = document.querySelector('.hour').innerHTML;
	// var minute = document.querySelector('.minute').innerHTML;
	var second = document.querySelector('.second').innerHTML;
  var end = false;

  if( second > 0 ) second--;
  else{
      end = true;
  }

if (end){
  // Таймер заканчивает свою работу и тут добавляется кнопка
  clearInterval(intervalID);
  deleteElementTimer();
  addButtonToSendCode();

 } else {
  // document.querySelector('.hour').innerHTML = fixTimer(minute);
  // document.querySelector('.minute').innerHTML = fixTimer(minute);
  document.querySelector('.second').innerHTML = fixTimer(second);
}
};

function createElementTimer(seconds) {
  var blockTimer = document.createElement("div");
  var blockButtons = document.querySelector(".form__wrapper-button");
  blockTimer.classList.add('timer')
  blockTimer.innerHTML = "<p class='timer__text'>Отправить код через&nbsp;</p><div class = 'second'>"+ seconds +"</div>"

  // Добавляем таймер
  blockButtons.appendChild(blockTimer);
}

function deleteElementTimer() {
  var blockTimerElement = document.querySelector(".timer");
  // Добавляем таймер
  blockTimerElement.remove();
}

// // // // // // // // // // // 

function isPromoCode() {
  var urlString = window.location.href;
  var url = new URL(urlString);
  var promoCode = url.searchParams.get("promoCode");
  // в переменной promoCode будет содержаться значение параметра promoCode, дальше тупо определяйте его значение.
  // Если параметра нет, то promoCode===null

  if (promoCode === null) {
    return false;
  } else {
    setPromoCode(promoCode);
  }
};

function setPromoCode(value) {
  var inputPromoCode = document.querySelector(".form__input--promocode");

  inputPromoCode.value = value;
};



