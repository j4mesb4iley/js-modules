/* 
	Browser reference
*/

var JB = JB || {};

JB.browser = (function() {

	var ua = typeof userAgent != 'undefined' ? userAgent : window.navigator.userAgent,
		av = typeof appVersion != 'undefined' ? appVersion : window.navigator.appVersion,
		p = typeof platform != 'undefined' ? platform : window.navigator.platform;
	
	return {
		
		ua : ua,
		version : (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || []),
		safari : (/Safari/gi).test(av),
		webkit : /webkit/i.test(ua),
		opera : /opera/i.test(ua),
		msie : /msie/i.test(ua) && !opera,
		chrome : /Chrome/i.test(ua),
		mozilla : /mozilla/i.test(ua) && !/(compatible|webkit)/.test(ua),
		android : /android/i.test(ua),
		blackberry : /blackberry/i.test(ua),
		iOS : (/iphone|ipod|ipad/gi).test(p),
		iPad : (/ipad/gi).test(p),
		iPhone : (/iPhone/gi).test(p),
		iPod : (/ipod/gi).test(p),
		vendorPrefix : ('webkitAnimation' in document.body.style) ? '-webkit-' : ('MozAnimation' in document.body.style ? '-moz-' : ''),
		transitionPrefix : ('webkitTransition' in document.body.style) ? 'webkitTransition' : ('MozTransition' in document.body.style ? 'MozTransition' : 'transition'),
		transformPrefix : ('webkitTransform' in document.body.style) ? 'webkitTransform' : ('MozTransform' in document.body.style ? 'MozTransform' : 'transform'),
		transitionEnd : ('webkitTransition' in document.body.style) ? "webkitTransitionEnd" : "transitionend"
	};
	
}());