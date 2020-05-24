function openNav() {
  document.getElementById("mySidenav").style.width = "150px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function openInfo() {
  document.getElementById("mySideinfoCabinet").style.width = "200px";
}

function closeInfo() {
  document.getElementById("mySideinfoCabinet").style.width = "0";
}
/*For open and close poup */

$(document).ready(function () {
  //Скрыть PopUp при загрузке страницы
  PopUpHide();
});
//Функция отображения PopUp
function PopUpShow() {
  $("#popup1").css("visibility", "visible");
}
//Функция скрытия PopUp
function PopUpHide() {
  $("#popup1").css("visibility", "hidden");
}

/* Login / Sign up */

$(".login-form").hide();
$(".login").css("background", "none");

$(".login").click(function () {
  $(".signup-form").hide();
  $(".login-form").show();
  $(".signup").css("background", "none");
  $(".login").css("background", "#3f4347");
});

$(".signup").click(function () {
  $(".signup-form").show();
  $(".login-form").hide();
  $(".login").css("background", "none");
  $(".signup").css("background", "#3f4347");
});

$(".btn").click(function () {
  $(".input").val("");
});
