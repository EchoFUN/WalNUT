/**
 * @description 
 * WALNUT NodeJS MVC framework
 *
 * Copy right 2011, xukai.ken@gmail.com (XU Kai)
 * Date 2011.11.10
 */

var path       = require('path');
var parseURL   = require('url').parse;
var fileSystem = require('fs');

var routeInformation = [];

/**
 * @description Request the action information.
 * @param {string} urlString The URL information.
 * @param {function} callback
 */
exports.requestAction = function(callback, urlString, DEFAULT_URL) {
	fileSystem.readFile(Walnut.config.routeConfiguration, function (error, data) {
		routeInformation = JSON.parse(data);
		
		this.routeInformation = routeInformation;
		if (urlString == '/')
			urlString = Walnut.config.DEFAULT_URL;
		var controller = parseURL(urlString).pathname.slice(1);
		var actionInfo = (routeInformation[controller])?(routeInformation[controller]):null;
		if (actionInfo) {
			if (typeof(callback) == 'function')
				callback(controller, actionInfo);
		} else {
			callback(urlString);
		}
	});
};

/**
 * @description Execute the action.
 * @param {object} request
 * @param {object} response
 */
exports.executeAction = function(request, response) {
	var renderEngine = Walnut.config.viewRenderEngine;
	var self = this;
	path.exists(renderEngine + '.js', function(exists){
		if (exists) {
			require(renderEngine);
			self.execute(request, response);
		}
	});
}
