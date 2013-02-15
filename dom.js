/* 
	DOM Framework
*/

var JB = JB || {};

JB.DOM = (function() {
	
	var vendorPrefix = JB.browser.vendorPrefix,
		transitionPrefix = JB.browser.transitionPrefix,
		transformPrefix = JB.browser.transformPrefix,
		transitionEnd = JB.browser.transitionEnd;
	
	return {

		qs: function (selector, el) {
			if (!el) {el = document;}
			return el.querySelectorAll(selector);
		},

		addClass: function(el, name) {
			if (typeof(el) === 'string') {
				el = this.qs(el);
				for (var i = 0; i < el.length; i++) {
					el[i].classList.add(name);
				}
			} else {
				el.classList.add(name);
			}
		},

		removeClass: function(el, name) {
			if (typeof(el) === 'string') {
				el = this.qs(el);
				for (var i = 0; i < el.length; i++) {
					el[i].classList.remove(name);
				}
			} else {
				el.classList.remove(name);
			}
		},

		toggleClass: function (el, name) {
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				el[i].classList.toggle(name);
			}
		},

		show: function (el) {
			if (typeof(el) === 'string') {
				el = this.qs(el);
				
				for (var i = 0; i < el.length; i++) {
					el[i].style.display = "block";
				}
			} else {
				el.style.display = "block";
			}
		},

		hide: function (el) {
			if (typeof(el) === 'string') {
				el = this.qs(el);

				for (var i = 0; i < el.length; i++) {
					el[i].style.display = "none";
				}
			} else {
				el.style.display = "none";
			}
		},
		
		visible: function (el) {
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				el[i].style.opacity = 1;
			}
		},

		invisible: function (el) {
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				el[i].style.opacity = 0;
			}
		},

		toggleShowHide: function (el,srcEl) {
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				if(el[i].style.display == 'block') {
					el[i].style.display = 'none';
					if (srcEl) {
						this.removeClass(srcEl,'active');
						this.removeClass(srcEl.parentNode,'activeParent');
					}
				} else {
					el[i].style.display = 'block';
					if (srcEl) {
						this.addClass(srcEl,'active');
						this.addClass(srcEl.parentNode,'activeParent');
					}
				}
			}
		},

		remove: function (el) {
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				purge(el[i]);
				return el[i].parentNode.removeChild(el[i]);
			}
		},

		_cssTransition: function(el, property, val, speed, timingfn, callback){
			
			_self = this;
			
			el.style[transitionPrefix + 'Property'] = property;
			el.style[transitionPrefix + 'Duration'] = speed + 'ms';
			el.style[transitionPrefix + 'TimingFunction'] = timingfn;
			el.style[transitionPrefix + 'Delay'] = '0';
			el.style[transformPrefix] = transformPrefix;

			el.addEventListener(transitionEnd, function(e){
				_self._cssTransitionEnd(el);
				
				if (typeof callback != 'undefined')
					callback();
					
			});

			window.setTimeout(function(){
				el.style.setProperty(property, val);
			}, 50);
		},

		_cssTransitionEnd: function(el){

			el.style[transitionPrefix + 'Property'] = '';
			el.style[transitionPrefix + 'Duration'] = '';
			el.style[transitionPrefix + 'TimingFunction'] = '';
			el.style[transitionPrefix + 'Delay'] = '';
			el.style[transformPrefix] = '';

			el.removeEventListener(transitionEnd);
		},

		fadeIn: function (el, options, callback) {
			
			var speed = '500';
			var opacity = '1';
			var timingfn = 'linear';
			
			if (typeof options != 'undefined') {
				speed = (typeof options.speed == 'undefined') ? '500' : options.speed;
				opacity = (typeof options.opacity == 'undefined') ? '1' : options.opacity;
				timingfn = (typeof options.timingfn == 'undefined') ? 'linear' : options.timingfn;
			}

			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				this._cssTransition(el[i], 'opacity', opacity, speed, timingfn, callback);
				
			}
		},

		fadeOut: function (el, options, callback) {
			
			var speed = '500';
			var opacity = '0';
			var timingfn = 'linear';
			
			if (typeof options != 'undefined') {
				speed = (typeof options.speed === 'undefined') ? '500' : options.speed;
				opacity = (typeof options.opacity === 'undefined') ? '0' : options.opacity;
				timingfn = (typeof options.timingfn === 'undefined') ? 'linear' : options.timingfn;
			}
			
			el = this.qs(el);
			for (var i = 0; i < el.length; i++) {
				this._cssTransition(el[i], 'opacity', opacity, speed, timingfn, callback);
			}
		},

		empty: function (el) {

			el = this.qs(el);

			for (var i = 0; i < el.length; i++) {
				this.purge(el[i]);
				el[i].innerHTML = "";
			}
		},

		purge: function (d) {

			/* http://www.crockford.com/javascript/memory/leak.html */
			var a = d.attributes, i, l, n;
			if (a) {
				for (i = a.length - 1; i >= 0; i -= 1) {
					n = a[i].name;
					if (typeof d[n] === 'function') {
						d[n] = null;
					}
				}
			}
			a = d.childNodes;
			if (a) {
				l = a.length;
				for (i = 0; i < l; i += 1) {
					this.purge(d.childNodes[i]);
				}
			}
		},
		
		hasClass: function(elem,className) {
			
			var r = new RegExp('\\b' + className + '\\b');
			return r.test(elem.className);
	
		}
		
	};
	
}());


