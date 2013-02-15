/**
 * This class holds info that are global to the whole application 
 */

JB.storage = (function() {
	
	var c = JB.constants;
	
	var privateBrowsingEnabled = function() {
		
		try {
			
			// Try and catch quota exceeded errors
			sessionStorage.setItem('ICTestKey', '1');
			sessionStorage.removeItem('ICTestKey');
			return false;
		
		} catch (error) {
			
			if (error.code === DOMException.QUOTA_EXCEEDED_ERR && sessionStorage.length === 0) {
				JB.helpers.log('Private browsing enabled');
			}
			
			JB.helpers.log('Session storage error');
			return true;
		}
	};
	
	/*
	 * Expire days
	 */
	var setPersistProperty = function( name, value, daysTillExpire, fixedExpiry) {
		var data = {};
		data.value = value;
		if (daysTillExpire > 0) {
			var now = new Date().getTime();
			data.sessionExpire =  now + (daysTillExpire * 60000 * 60 * 24);
		}
		if (fixedExpiry > 0) {
			data.sessionExpire = fixedExpiry;
		}
		localStorage.setItem( name, JSON.stringify(data));
	};
	
	/*
	 * Expire mins
	 */
	var setProperty = function( name, value, minsTillExpire, fixedExpiry) {
		var data = {};
		data.value = value;
		if (minsTillExpire > 0) {
			var now = new Date().getTime();
			data.sessionExpire =  now + (minsTillExpire * 60000);
		}
		if (fixedExpiry > 0) {
			data.sessionExpire = fixedExpiry;
		}
		sessionStorage.setItem( name, JSON.stringify(data));
	};
	
	/*
	 * Returns:
	 * 0 if no data held anywhere
	 * 1 if held in storage (local or session) but expired
	 * 2 if held in storage and not expired
	 */
	
	var getProperty = function( name ) {
		var rawData, response = {};
		var now = new Date().getTime();
		
		response.status = 0;
		
		if (sessionStorage.getItem(name)) {
			
			rawData = JSON.parse(sessionStorage.getItem(name));
			
			if (rawData.value) {
			
				response.data = rawData.value;
				
				if (rawData.sessionExpire > now || rawData.sessionExpire === 0) {
					
					response.status = c.CACHE_AVAILABLE;
					
				} else {
					
					response.status = c.CACHE_EXPIRED;
					
				}
				
			} else {
				response.status = c.CACHE_UNAVAILABLE;
			}
			
		} else if (localStorage.getItem(name)) {
			
			rawData = JSON.parse(localStorage.getItem(name));
			
			if (rawData.value) {
				
				response.data = rawData.value;
				
				if (rawData.sessionExpire > now || rawData.sessionExpire === 0) {
					
					response.status = c.CACHE_AVAILABLE;
					
				} else {
					
					response.status = c.CACHE_EXPIRED;
					
				}
				
			} else {
				response.status = c.CACHE_UNAVAILABLE;
			}
			
		} else {
			
			response.status = c.CACHE_UNAVAILABLE;
			
		}
		
		return response;
	};
	
	var removeItem = function(key) {
		
		sessionStorage.removeItem(key);
		
	};
	 
	/*************** Public  ****************/
	return {
		setProperty: setProperty,
		setPersistProperty: setPersistProperty,
		getProperty: getProperty,
		privateBrowsingEnabled: privateBrowsingEnabled,
		removeItem : removeItem
	};
	
}());