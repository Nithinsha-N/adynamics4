var world = document.getElementsByTagName("path");
for (var i = 0; i < world.length; i++) {
  var country = world[i];
  country.setAttribute("data-toggle", "tooltip");
  country.setAttribute("data-placement", "top");
  country.setAttribute("title", country.getAttribute("id"));
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

$("#south_africa").click(function () {
  window.location.href = "../inidvidual-clases/cplsouth.html";
});

$("#south_africa").mouseover(function () {
  $(".south-africa").show();
});

$("#south_africa").mouseout(function () {
  $(".south-africa").hide();
});

$("#usa").click(function () {
  window.location.href = "../inidvidual-clases/cpltaring.html";
});

$("#usa").mouseover(function () {
  $(".usa").show();
});

$("#usa").mouseout(function () {
  $(".usa").hide();
});
