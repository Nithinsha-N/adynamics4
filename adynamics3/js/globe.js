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

// Function to handle click and hover events for countries
function setupCountryEvents(countryId, cardClass, url) {
  // Store the fadeOut timeout ID to clear it when necessary
  let fadeOutTimeout;

  // Function to check screen width
  function isScreenLargeEnough() {
    return window.innerWidth >= 578;
  }

  // Click event to redirect to the specific URL
  $(`#${countryId}`).click(function () {
    window.location.href = url;
  });

  // Mouseover event to show the card
  $(`#${countryId}`).mouseover(function () {
    if (isScreenLargeEnough()) {
      clearTimeout(fadeOutTimeout); // Clear any existing timeout
      $(".card").hide(); // Hide all cards
      $(`.${cardClass}`).show(); // Show the relevant card
    }
  });

  // Mouseout event to hide the card after a delay
  $(`#${countryId}`).mouseout(function () {
    if (isScreenLargeEnough()) {
      fadeOutTimeout = setTimeout(function() {
        $(`.${cardClass}`).fadeOut(1000);
      }, 3000);
    }
  });

  // Mouseover event to keep the card visible
  $(`.${cardClass}`).mouseover(function () {
    if (isScreenLargeEnough()) {
      clearTimeout(fadeOutTimeout); // Clear the timeout to prevent hiding
    }
  });

  // Mouseout event to hide the card after a delay
  $(`.${cardClass}`).mouseout(function () {
    if (isScreenLargeEnough()) {
      fadeOutTimeout = setTimeout(function() {
        $(`.${cardClass}`).fadeOut(1000);
      }, 3000);
    }
  });
}

// Setup events for each country
setupCountryEvents("south_africa", "south-africa", "../individual-classes/cplsouth.html");
setupCountryEvents("usa", "usa", "../individual-classes/cpltraining.html");
setupCountryEvents("argentina", "argentina", "../individual-classes/cplargentina.html");
setupCountryEvents("tunisia", "tunisia", "../individual-classes/cpltunisia.html");
setupCountryEvents("morocco", "morocco", "../individual-classes/cplmorocco.html");
setupCountryEvents("india", "india", "../individual-classes/conversion.html");

 function createRippleAnimation(ripple, delay) {
  gsap.fromTo(ripple, 
      { attr: { r: 0, opacity: 1 } }, 
      { attr: { r: 25, opacity: 0 }, 
        duration: 2, 
        ease: "power1.out", 
        repeat: -1, 
        delay: delay 
      }
  );
}

// Create ripple animations with delays
createRippleAnimation(".ripple1", 0);
createRippleAnimation(".ripple2", 0.5);
createRippleAnimation(".ripple3", 1);

// Function to animate a path
function animatePath(path) {
  const pathLength = path.getTotalLength();
  gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
  });
  gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
  });
}

// Animate the curved path from India to South Africa
animatePath(document.getElementById("in-sa"));
animatePath(document.getElementById("sa-usa"));
animatePath(document.getElementById("ag-in"));
animatePath(document.getElementById("mor-sa"));
animatePath(document.getElementById("tun-ag"));
animatePath(document.getElementById("mor-usa"));
animatePath(document.getElementById("tun-in"));


const viewBoxValues = {
  india: "580 120 200 250",
  south_africa: "400 280 200 250",
  tunisia: "450 180 100 125",
  morocco: "370 180 100 125",
  argentina: "200 310 200 250",
  usa: "100 100 200 250"
};

const countryOrder = ["india", "south_africa", "tunisia", "morocco", "argentina", "usa"];
let currentIndex = 0;

const svg = document.getElementById("world-map");
const originalViewBox = svg.getAttribute("viewBox");
const tooltip = document.getElementById("countryTooltip");

function showTooltip(countryName) {
  tooltip.textContent = countryName;
  gsap.fromTo(tooltip, {opacity: 0}, {opacity: 1, duration: 0.5, display: 'block'});
}

function hideTooltip() {
  gsap.to(tooltip, {opacity: 0, duration: 0.5, onComplete: () => {
      tooltip.style.display = 'none';
  }});
}

const updateViewBox = (index) => {
  const country = countryOrder[index];
  const newViewBox = viewBoxValues[country];
  gsap.to(svg, { attr: { viewBox: newViewBox }, duration: 1, ease: "power2.inOut" });
  const countryNames = {
    "india": "India",
    "south_africa": "South Africa",
    "usa": "USA",
    "argentina": "Argentina",
    "tunisia": "Tunisia",
    "morocco": "Morocco"
};

if (window.innerWidth < 578) {
    showTooltip(countryNames[country]);
} else {
    hideTooltip();
}

};

const resetViewBox = () => {
  gsap.to(svg, { attr: { viewBox: originalViewBox }, duration: 1, ease: "power2.inOut" });
};

const handleResize = () => {
  if (window.innerWidth < 578) {
      updateViewBox(currentIndex);
      $(".navigation-buttons").show();
  } else {
      resetViewBox();
      $(".navigation-buttons").hide();
      hideTooltip();
  }
};

window.addEventListener("resize", handleResize);
handleResize();

let startX;

const handleTouchStart = (event) => {
  startX = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  const endX = event.changedTouches[0].clientX;
  if (startX > endX + 50) {
      // Swipe left
      currentIndex = (currentIndex + 1) % countryOrder.length;
  } else if (startX < endX - 50) {
      // Swipe right
      currentIndex = (currentIndex - 1 + countryOrder.length) % countryOrder.length;
  }
  if (window.innerWidth < 578) {
      updateViewBox(currentIndex);
  }
};

svg.addEventListener("touchstart", handleTouchStart);
svg.addEventListener("touchend", handleTouchEnd);

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + countryOrder.length) % countryOrder.length;
  if (window.innerWidth < 578) {
      updateViewBox(currentIndex);
  }
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % countryOrder.length;
  if (window.innerWidth < 578) {
      updateViewBox(currentIndex);
  }
});


  
