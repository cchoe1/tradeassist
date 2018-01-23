class AjaxRequest {
	constructor() {
		this.httpReq = new XMLHttpRequest();

	}
	setup(type, url, func, args) {
		func = func || function() { };
		args = args || [];

		function callbackFunc() {
			if (this.httpReq.readyState === 4) {
				if (this.httpReq.status === 200) {
					//let data = JSON.parse(this.httpReq.response);
					let data = this.httpReq.response;
					//console.log("Returned from ajax query: ", data);
					func(data);
				} 
				else {
				  	console.log('There was a problem with the request.');
				}
  			}
		}
		this.httpReq.open(type, url);
		this.httpReq.setRequestHeader("Content-type", "application/json");

		this.httpReq.onreadystatechange = callbackFunc.bind(this);
	}
	send(params){
		params = params || {};
		params = JSON.stringify(params);
		this.httpReq.send(params);
	}
}

/*module.exports = {
	AjaxRequest: AjaxRequest
}*/