var JB = JB || {};

JB.webWorker = (function() {
	
	var init = function(url) {
		
		var worker = new Worker(url);
		
		worker.addEventListener('message', function(event) {
			console.log("Called back by the worker!\n");
		}, false);
		
		return worker;

	};
	
	var destroy = function(worker) {
	
		worker.terminate();
			
	};
	
	var postMessage = function(worker, message) {
		
		worker.postMessage(message); // start the worker.
		
	};
	
	return {
		
		init : init,
		destroy : destroy,
		postMessage : postMessage
		
	}
	

	//Web worker (goes in seperate file)
	this.addEventListener('message',  function(event) {
	    var data = event.data;
	    
	    setInterval(function() {
		    
		    postMessage(data);

	    }, 500);
	});
	
}());
