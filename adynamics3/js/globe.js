var world = document.getElementsByTagName("path");
for (var i = 0; i < world.length; i++) {
  var country = world[i];
  if (country.getAttribute("id") == 'plane') continue;
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
  setTimeout(function() {
    $(".south-africa").fadeOut(1000);
  }, 2000);
});

$("#usa").click(function () {
  window.location.href = "../inidvidual-clases/cpltaring.html";
});

$("#usa").mouseover(function () {
  $(".usa").show();
});

$("#usa").mouseout(function () {
    setTimeout(function() {
    $(".usa").fadeOut(1000);
  }, 2000);
});

$("#argentina").click(function () {
  window.location.href = "../inidvidual-clases/cplargentina.html";
});

$("#argentina").mouseover(function () {
  $(".argentina").show();
});

$("#argentina").mouseout(function () {
    setTimeout(function() {
    $(".argentina").fadeOut(1000);
  }, 2000);
});

$("#tunisia").click(function () {
  window.location.href = "../inidvidual-clases/cpltunisia.html";
});

$("#tunisia").mouseover(function () {
  $(".tunisia").show();
});

$("#tunisia").mouseout(function () {
    setTimeout(function() {
    $(".tunisia").fadeOut(1000);
  }, 2000);
});

$("#morocco").click(function () {
  window.location.href = "../inidvidual-clases/cplmorocco.html";
});

$("#morocco").mouseover(function () {
  $(".morocco").show();
});

$("#morocco").mouseout(function () {
    setTimeout(function() {
    $(".morocco").fadeOut(1000);
  }, 2000);
});

$("#india").click(function () {
  window.location.href = "../inidvidual-clases/CONVESION.html";
});

$("#india").mouseover(function () {
  $(".india").show();
});

$("#india").mouseout(function () {
    setTimeout(function() {
    $(".india").fadeOut(1000);
  }, 2000);
});
function positionMarkers() {
  const countryPaths = {
    country1: document.getElementById('india'),
    country2: document.getElementById('usa'),
    country3: document.getElementById('south_africa'),
    country4: document.getElementById('morocco'),
    country5: document.getElementById('tunisia'),
    country6: document.getElementById('argentina'),
  };
  
  Object.keys(countryPaths).forEach(countryId => {
      const countryPath = countryPaths[countryId];
      const marker = document.getElementById(`marker${countryId.replace('country', '')}`);

      const bbox = countryPath.getBBox();
      const centerX = bbox.x + bbox.width / 2; // Calculate center X
      const centerY = bbox.y + bbox.height / 2; // Calculate center Y

      // Adjust marker position based on its size and special cases (e.g. Tunisia)
      marker.setAttribute('x', centerX - marker.getAttribute('width') / 2 - 3);
      marker.setAttribute('y', countryId === 'country5' ? centerY - marker.getAttribute('height') / 2 - 11 : centerY - marker.getAttribute('height') / 2 - 5);
  });
}

// Call the positionMarkers function initially
positionMarkers();

// Update marker positions on window resize
window.addEventListener('resize', positionMarkers);
