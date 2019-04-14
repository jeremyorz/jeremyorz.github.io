"use strict";

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function ajaxGet(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(request.responseText, "text/html");
      var content = htmlDoc.getElementById("content");

      window.history.pushState("", "", url);

      document.title = htmlDoc.title;
      document.getElementById("content").innerHTML = content.innerHTML;
    } else {
      console.log("We reached our target server, but it returned an error");
      console.log(request);
    }
  };

  request.onerror = function() {
    console.log("connection error");
  };

  request.send();
}

function ajaxLinkClickHandler(event) {
  event.preventDefault();

  var href = event.currentTarget.href;

  if (href) {
    ajaxGet(href);
  }
}

function init() {
  console.log("init");

  var ajaxLinks = document.querySelectorAll(".js-ajaxload");

  for (var i = 0; i < ajaxLinks.length; i++) {
    ajaxLinks[i].addEventListener("click", ajaxLinkClickHandler);
  }
}

ready(init);
