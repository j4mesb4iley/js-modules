var JB = JB || {};

JB.AJAX = (function() {
	
	var c = JB.constants;
	
	/*
	 * Perform a standard GET request for JSON content
	 * @param params JSON object containing settings for ajax lookup
	 * 

	 	var demoArgs = {
			url : 'http://test.test.co.uk/',
			timeout : 10000,
			async : true,
			headersOnly : false,
			cacheResponse : true,
			cacheExpiry : 10, //mins
			complete : function(e) {
				console.log('complete');
			},
			error : function(e) {
				console.log('error');
			},
			success : function	(e) {
				console.log('success');
			},
			disableCacheResponse : true,
			loading : function() {
				
			}
		};
	 * 
	 */
	
	//Defaults
	var timeout = c.AJAX_TIMEOUT, //10 seconds
		async = true,
		headersOnly = false,
		cacheExpiry = c.CACHE_EXPIRY;
		
	var get = function(params) {
		
		if (typeof params.url == 'undefined')
			return false;
		
		var cacheKey = encodeURIComponent(params.url);
		var cachedContent = JB.storage.getProperty(cacheKey);
		
		if (cachedContent.status === c.CACHE_UNAVAILABLE || cachedContent.status === c.CACHE_EXPIRED) {
			
			/*
			 * Fire the loading method if available
			 */
			if (params.loading)
				params.loading();
			
			var xmlHttp = new XMLHttpRequest();
			
			xmlHttp.timeout = typeof params.timeout != 'undefined' ? params.timeout : timeout;
			
			var apiRoot = typeof params.apiRoot != 'undefined' ? params.apiRoot : c.API_ROOT;
			
			xmlHttp.open( 
				'GET', 
				apiRoot + params.url, 
				typeof params.async != 'undefined' ? params.async : async
			);
			
			/*
			 * Commented out due to API restrictions
			 */
			//xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			
	
			xmlHttp.onreadystatechange = function () {
				switch (xmlHttp.readyState) {
					case 2:
						//HEADERS_RECEIVED
						//send() has been called, and headers and status are available.
						
						if (headersOnly) {
							xmlHttp.abort();
							return false;
						}
						break;
					case 3:
						//LOADING
						//Downloading; responseText holds partial data.
						
						JB.helpers.log('Ajax Loading...');
						break;
					case 4:
						//DONE
						//The operation is complete.
						var r = xmlHttp.responseText;
						
						if (params.complete) {
							params.complete();
							JB.helpers.log('Ajax Complete...');
						}
						
						if ( xmlHttp.status === 200 )  {
							//Success
							
							if (!params.disableCacheResponse) {

								//Store the data in local storage
								cacheExpiry = typeof params.cacheExpiry != 'undefined' ? params.cacheExpiry : cacheExpiry;
								JB.storage.setProperty(cacheKey, r, cacheExpiry);

							}
							
							params.success(r);
							
						} else {
							
							if (params.error) {
								params.error(r, xmlHttp);
								JB.helpers.log('Ajax Error...');
							}
							
						}
						break;
				}
			};
			
			if (params.data) {
				
				var postData = JSON.stringify(params.data);
				xmlHttp.send(postData);
				
			} else {
				
				xmlHttp.send();
				
			}
		} else {
			
			if (params.complete)
				params.complete();
			
			params.success(cachedContent.data);
			
		}
		
	};
	
	return {
		get: get
	};
}());