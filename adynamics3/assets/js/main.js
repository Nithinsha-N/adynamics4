(function() {
	// Horizontal Timeline - by CodyHouse.co
	var HorizontalTimeline = function(element) {
	  this.element = element;
	  this.datesContainer = this.element.getElementsByClassName('cd-h-timeline__dates')[0];
	  this.line = this.datesContainer.getElementsByClassName('cd-h-timeline__line')[0]; // grey line in the top timeline section
	  this.fillingLine = this.datesContainer.getElementsByClassName('cd-h-timeline__filling-line')[0]; // green filling line in the top timeline section  
	  this.date = this.line.getElementsByClassName('cd-h-timeline__date');
	  this.selectedDate = this.line.getElementsByClassName('cd-h-timeline__date--selected')[0];
	  this.dateValues = parseDate(this);
	  this.minLapse = calcMinLapse(this);
	  this.navigation = this.element.getElementsByClassName('cd-h-timeline__navigation');
	  this.contentWrapper = this.element.getElementsByClassName('cd-h-timeline__events')[0];
	  this.content = this.contentWrapper.getElementsByClassName('cd-h-timeline__event');
  
	  this.eventsMinDistance = 60; // min distance between two consecutive events (in px)
	  this.eventsMaxDistance = 200; // max distance between two consecutive events (in px)
	  this.translate = 0; // this will be used to store the translate value of this.line
	  this.lineLength = 0; //total length of this.line
  
	  // store index of selected and previous selected dates
	  this.oldDateIndex = Util.getIndexInArray(this.date, this.selectedDate);
	  this.newDateIndex = this.oldDateIndex;
  
	  initTimeline(this);
	  initEvents(this);
	};
  
	function initTimeline(timeline) {
	  // set dates left position
	  var left = 0;
	  for (var i = 0; i < timeline.dateValues.length; i++) { 
		var j = (i == 0) ? 0 : i - 1;
		var distance = daydiff(timeline.dateValues[j], timeline.dateValues[i]),
		  distanceNorm = (Math.round(distance/timeline.minLapse) + 2)*timeline.eventsMinDistance;
  
		if(distanceNorm < timeline.eventsMinDistance) {
		  distanceNorm = timeline.eventsMinDistance;
		} else if(distanceNorm > timeline.eventsMaxDistance) {
		  distanceNorm = timeline.eventsMaxDistance;
		}
		left = left + distanceNorm;
		timeline.date[i].setAttribute('style', 'left:' + left+'px');
	  }
  
	  // set line/filling line dimensions
	  timeline.line.style.width = (left + timeline.eventsMinDistance)+'px';
	  timeline.lineLength = left + timeline.eventsMinDistance;
	  // reveal timeline
	  Util.addClass(timeline.element, 'cd-h-timeline--loaded');
	  selectNewDate(timeline, timeline.selectedDate);
	  resetTimelinePosition(timeline, 'next');
	};
  
	function initEvents(timeline) {
	  var self = timeline;
	  // click on arrow navigation
	  self.navigation[0].addEventListener('click', function(event){
		event.preventDefault();
		if (!self.navigation[0].classList.contains('cd-h-timeline__navigation--inactive')) {
		  translateTimeline(self, 'prev');
		  selectNewDate(self, self.date[self.newDateIndex - 1]);
		}
	  });
	  self.navigation[1].addEventListener('click', function(event){
		event.preventDefault();
		if (!self.navigation[1].classList.contains('cd-h-timeline__navigation--inactive')) {
		  translateTimeline(self, 'next');
		  selectNewDate(self, self.date[self.newDateIndex + 1]);
		}
	  });
  
	  // swipe on timeline
	  new SwipeContent(self.datesContainer);
	  self.datesContainer.addEventListener('swipeLeft', function(event){
		if (!self.navigation[1].classList.contains('cd-h-timeline__navigation--inactive')) {
		  translateTimeline(self, 'next');
		  selectNewDate(self, self.date[self.newDateIndex + 1]);
		}
	  });
	  self.datesContainer.addEventListener('swipeRight', function(event){
		if (!self.navigation[0].classList.contains('cd-h-timeline__navigation--inactive')) {
		  translateTimeline(self, 'prev');
		  selectNewDate(self, self.date[self.newDateIndex - 1]);
		}
	  });
  
	  // select a new event
	  for(var i = 0; i < self.date.length; i++) {
		(function(i){
		  self.date[i].addEventListener('click', function(event){
			event.preventDefault();
			selectNewDate(self, event.target);
		  });
  
		  self.content[i].addEventListener('animationend', function(event){
			if( i == self.newDateIndex && self.newDateIndex != self.oldDateIndex) resetAnimation(self);
		  });
		})(i);
	  }
	};
  
	function updateFilling(timeline) { // update fillingLine scale value
	  var dateStyle = window.getComputedStyle(timeline.selectedDate, null),
		left = dateStyle.getPropertyValue("left"),
		width = dateStyle.getPropertyValue("width");
  
	  left = Number(left.replace('px', '')) + Number(width.replace('px', ''))/2;
	  timeline.fillingLine.style.transform = 'scaleX('+(left/timeline.lineLength)+')';
	};
  
	function translateTimeline(timeline, direction) { 
	  var containerWidth = timeline.datesContainer.offsetWidth;
	  var selectedDateLeft = timeline.selectedDate.offsetLeft;
	  var selectedDateWidth = timeline.selectedDate.offsetWidth;
	  var newTranslate = timeline.translate;
  
	  if (direction) {
		if (direction == 'next') {
		  // Move left to show the next date, but ensure it's centered
		  if (selectedDateLeft + selectedDateWidth > containerWidth - timeline.translate) {
			newTranslate = containerWidth / 2 - selectedDateLeft - selectedDateWidth / 2;
		  }
		} else if (direction == 'prev') {
		  // Move right to show the previous date, but ensure it's centered
		  if (selectedDateLeft < -timeline.translate) {
			newTranslate = containerWidth / 2 - selectedDateLeft - selectedDateWidth / 2;
		  }
		}
	  }
  
	  // Ensure the translation does not go out of bounds
	  newTranslate = Math.max(newTranslate, containerWidth - timeline.lineLength);
	  newTranslate = Math.min(newTranslate, 0);
  
	  timeline.translate = newTranslate;
	  timeline.line.style.transform = 'translateX(' + timeline.translate + 'px)';
  
	  // Update the navigation items status (toggle inactive class)
	  updateNavigationStatus(timeline);
	}
  
	function updateNavigationStatus(timeline) {
	  var containerWidth = timeline.datesContainer.offsetWidth;
	  (timeline.newDateIndex == 0) ? Util.addClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive') : Util.removeClass(timeline.navigation[0], 'cd-h-timeline__navigation--inactive');
	  (timeline.newDateIndex == timeline.date.length - 1) ? Util.addClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive') : Util.removeClass(timeline.navigation[1], 'cd-h-timeline__navigation--inactive');
	}
  
	function selectNewDate(timeline, target) {
	  timeline.newDateIndex = Util.getIndexInArray(timeline.date, target);
	  timeline.oldDateIndex = Util.getIndexInArray(timeline.date, timeline.selectedDate);
	  Util.removeClass(timeline.selectedDate, 'cd-h-timeline__date--selected');
	  Util.addClass(timeline.date[timeline.newDateIndex], 'cd-h-timeline__date--selected');
	  timeline.selectedDate = timeline.date[timeline.newDateIndex];
	  updateOlderEvents(timeline);
	  updateVisibleContent(timeline);
	  updateFilling(timeline);
  
	  // Adjust the timeline translation to show the selected date
	  var selectedDateLeft = timeline.selectedDate.offsetLeft;
	  var containerWidth = timeline.datesContainer.offsetWidth;
  
	  if (selectedDateLeft < -timeline.translate || selectedDateLeft + timeline.selectedDate.offsetWidth > containerWidth - timeline.translate) {
		timeline.translate = -Math.min(Math.max(selectedDateLeft - containerWidth / 2 + timeline.selectedDate.offsetWidth / 2, 0), timeline.lineLength - containerWidth);
		timeline.line.style.transform = 'translateX(' + timeline.translate + 'px)';
	  }
  
	  // Update navigation items status
	  updateNavigationStatus(timeline);
	}
  
	function updateOlderEvents(timeline) { // update older events style
	  for(var i = 0; i < timeline.date.length; i++) {
		(i < timeline.newDateIndex) ? Util.addClass(timeline.date[i], 'cd-h-timeline__date--older-event') : Util.removeClass(timeline.date[i], 'cd-h-timeline__date--older-event');
	  }
	}
  
	function updateVisibleContent(timeline) { // show content of new selected date
	  if (timeline.newDateIndex > timeline.oldDateIndex) {
		var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-right',
		  classLeaving = 'cd-h-timeline__event--leave-left';
	  } else if (timeline.newDateIndex < timeline.oldDateIndex) {
		var classEntering = 'cd-h-timeline__event--selected cd-h-timeline__event--enter-left',
		  classLeaving = 'cd-h-timeline__event--leave-right';
	  } else {
		var classEntering = 'cd-h-timeline__event--selected',
		  classLeaving = '';
	  }
  
	  Util.addClass(timeline.content[timeline.newDateIndex], classEntering);
	  if (timeline.oldDateIndex != timeline.newDateIndex) {
		Util.removeClass(timeline.content[timeline.oldDateIndex], 'cd-h-timeline__event--selected');
		Util.addClass(timeline.content[timeline.oldDateIndex], classLeaving);
		timeline.contentWrapper.style.height = timeline.content[timeline.newDateIndex].offsetHeight + 'px';
	  }
	}
  
	function resetAnimation(timeline) { // fix a bug on Firefox with css animations
	  timeline.content[timeline.newDateIndex].addEventListener('webkitAnimationEnd', function cb(){
		this.removeEventListener('webkitAnimationEnd', cb);
		removeAnimationClasses(timeline);
	  });
	  timeline.content[timeline.newDateIndex].addEventListener('animationend', function cb(){
		this.removeEventListener('animationend', cb);
		removeAnimationClasses(timeline);
	  });
	}
  
	function removeAnimationClasses(timeline) {
	  Util.removeClass(timeline.content[timeline.newDateIndex], 'cd-h-timeline__event--enter-right cd-h-timeline__event--enter-left');
	  Util.removeClass(timeline.content[timeline.oldDateIndex], 'cd-h-timeline__event--leave-right cd-h-timeline__event--leave-left');
	}
  
	function resetTimelinePosition(timeline, direction) { //translate timeline to the right position
	  var eventStyle = window.getComputedStyle(timeline.selectedDate, null),
		eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
		timelineWidth = timeline.datesContainer.offsetWidth,
		timelineTotWidth = Number(window.getComputedStyle(timeline.line, null).getPropertyValue("width").replace('px', ''));
  
	  if( (direction == 'next' && eventLeft > timelineWidth - timelineWidth/4) || (direction == 'prev' && eventLeft < timelineWidth/4 ) ) {
		timeline.translate = timelineWidth/2 - eventLeft;
	  } else if( timeline.translate > 0 || timelineTotWidth <= timelineWidth) {
		timeline.translate = 0;
	  } else if( timeline.translate < timelineWidth - timelineTotWidth ) {
		timeline.translate = timelineWidth - timelineTotWidth;
	  }
	  timeline.line.style.transform = 'translateX(' + timeline.translate + 'px)';
	  
	  // update navigation status
	  updateNavigationStatus(timeline);
	}
  
	function parseDate(timeline) {
	  var dateArrays = [];
	  for (var i = 0; i < timeline.date.length; i++) {
		var singleDate = timeline.date[i].getAttribute('data-date'),
		  dateComp = singleDate.split('T');
		  
		if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
		  var dayComp = dateComp[0].split('/'),
			timeComp = dateComp[1].split(':');
		} else if( dateComp[0].indexOf(':') > 0 ) { //only time is provide
		  var dayComp = ["2000", "0", "0"],
			timeComp = dateComp[0].split(':');
		} else { //only DD/MM/YEAR
		  var dayComp = dateComp[0].split('/'),
			timeComp = ["0", "0"];
		}
		var newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
		dateArrays.push(newDate);
	  }
	  return dateArrays;
	};
  
	function calcMinLapse(timeline) {
	  var dateDistances = [];
	  for (var i = 1; i < timeline.dateValues.length; i++) { 
		var distance = daydiff(timeline.dateValues[i-1], timeline.dateValues[i]);
		dateDistances.push(distance);
	  }
  
	  return Math.min.apply(null, dateDistances);
	};
  
	function daydiff(first, second) {
	  return Math.round((second-first));
	};
  
	var horizontalTimeline = document.getElementsByClassName('js-cd-h-timeline'),
	  horizontalTimelineTimelineArray = [];
	if(horizontalTimeline.length > 0) {
	  for(var i = 0; i < horizontalTimeline.length; i++) {
		(function(i){
		  horizontalTimelineTimelineArray.push(new HorizontalTimeline(horizontalTimeline[i]));
		})(i);
	  }
	  // emit custom event - this is used in the demo to initialize the timeline animation
	  var event = new CustomEvent('newTimeline', {detail: {timeline: horizontalTimelineTimelineArray}});
	  window.dispatchEvent(event);
	}
  })();

function redirectEnquiry(){
	window.location.href = "../../adynamics3/enquiry.html";
}

document.addEventListener('DOMContentLoaded', function () {
  var videos = document.querySelectorAll('video');

  videos.forEach(function (video) {
	  video.addEventListener('play', function () {
		  // Pause all other videos
		  videos.forEach(function (otherVideo) {
			  if (otherVideo !== video && !otherVideo.paused) {
				  otherVideo.pause();
			  }
		  });
	  });
  });
});

// document.getElementById('enquiryForm').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const form = e.target;
//     const data = {
//         name: form.name.value,
//         phone: form.phone.value,
//         email: form.email.value,
//         course: form.course.value,
//         message: form.message.value
//     };
    
//     fetch('https://script.google.com/macros/s/AKfycbz0HgvkGfh3g7vqEpRzRIMZuuRkbJujHcEsoN2elbhF5V4iNcNpyMxJhO31gPm6ZYrctw/exec', {
//     redirect: "follow",
//       method: "POST",
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "text/plain;charset=utf-8",
//         }
//     }).then(response => response.json()).then(data => {
//         alert('Form submitted successfully!');
//         form.reset();
//     }).catch(error => {
//         console.error('Error:', error);
//         alert('There was an error submitting the form.');
//     });
// });