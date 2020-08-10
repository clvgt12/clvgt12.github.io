//
// whatBrowser JS object
// This object defines methods that determine which Browser the JS is executing under
// The general consensus is this is a worthless exercise, but whatever.
//

function whatBrowser() {

	// Opera 8.0+
	this.isOpera = function() {
	  var r = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	  return r;
	};

	// Firefox 1.0+
	this.isFirefox = function() {
	  var r = typeof InstallTrigger !== 'undefined';
	  return r;
	};

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	this.isSafari = function() {
	  var r = /constructor/i.test(window.HTMLElement) || (function(p) {
		 return p.toString() === "[object SafariRemoteNotification]";
	  })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
	  return r;
	};

	// Internet Explorer 6-11
	this.isIE = function() {
		var r = /*@cc_on!@*/false || !!document.documentMode;
		return r;
	};

	// Edge 20+
	this.isEdge = function() {
	  var r = !this.isIE() && !!window.StyleMedia;
	  return r;
	};

	// Chrome 1+
	this.isChrome = function() {
	  var r = !!window.chrome;
	  return r;
	};

	// Blink engine detection
	this.isBlink = function() {
	  var r = (this.isChrome() || this.isOpera()) && !!window.CSS;
	  return (r);
	};

	this.debug = function() {
	  console.log("Opera - " + this.isOpera());
	  console.log("Firefox - " + this.isFirefox());
	  console.log("Safari - " + this.isSafari());
	  console.log("IE - " + this.isIE());
	  console.log("Edge - " + this.isEdge());
	  console.log("Chrome - " + this.isChrome());
	  console.log("Blink - " + this.isBlink());
	};
}

