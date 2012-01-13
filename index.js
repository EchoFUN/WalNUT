/**
 * @description 
 * WALNUT NodeJS MVC framework
 *
 * Copy right 2011, xukai.ken@gmail.com (XU Kai)
 * Date 2011.11.10
 */

require('./namespace');

Walnut.common = require('./common');
Walnut.route  = require('./route');
var sessionFactory = require('./sessions');

var url         = require('url');
var path        = require('path');
var http        = require('http');
var fileSystem  = require('fs');
var querystring = require('querystring');

/**
 * @description The main function.
 */
Walnut.start = function(port) {
	fileSystem.readFile('./walnut.conf', function(error, data){
		var CMDContext = new function(){
			var feedBacks = [];
		
			this.query = function(nickName, callback) {
				var feedBack = {
					nickName: nickName,
					callback: callback
				}
				feedBacks.push(feedBack);
			};
			
			// 更新消息机制	
			this.appendMessage = function(data) {
				while (feedBacks.length > 0) {
					var feedBack = feedBacks[0];
					var callback = feedBack['callback'];
					if (feedBack['nickName'] == data.data.from || feedBack['nickName'] == data.data.to) {
						callback(data);
					} else {
						callback();
					}
					feedBacks.shift();
				}
			};
			
			// 更新在线用户列表机制
			this.updateContacts = function(data) {
				while (feedBacks.length > 0) {
					var feedBack = feedBacks[0];
					var callback = feedBack['callback'];
					callback(data);
					feedBacks.shift();
				}
			};
			
			setInterval(function(){
				var length = feedBacks.length;
				for (var i=0; i<length; i++) {
					var feedBack = feedBacks.shift();
					feedBack.callback({});
				}
			}, 15000);
		};
		
		Walnut.CMDContext = CMDContext;
		Walnut.config = JSON.parse(data);
		var server = http.createServer(function(request, response){
			response.setHeader('Server', 'Node/WALNUT');
			var postData = '';
			request.on('data', function(chunk){
				postData += chunk;
			}).on('end', function(){
				request.post = querystring.parse(postData);
				handleRequest(request, response);
			});
		});
		server.listen(port);
	});
}

/**
 * @description Handle the request from client.
 * @param {object} request 
 * @param {object} response
 */
var handleRequest = function(request, response) {
	Walnut.route.requestAction(function(controller, actionInfo){
		if (actionInfo) {
			sessionFactory.startSession(request, response, function(){
				request.session = this;
				var query;
				if (request.method == 'GET')
					query = querystring.parse(url.parse(request.url).query).q;
				else if (request.method == 'POST')
					query = request.post.q;
					
				try {
					var actionName;
					if (query && actionInfo[query])
						actionName = actionInfo[query];
					else
						actionName = 'index';
					var actionPath = './controllers/' + controller + '/' + actionName + '.js';
					path.exists(actionPath, function(exists){
						if (exists) {
							response.setHeader('Content-Type', 'text/json');
							var action = require(actionPath);
							Walnut.route.executeAction.call(action, request, response);
						} else {
							console.log('Action not found !');
						}
					});
				} catch(e) {
					console.log(e);
				}
			});
		} else {
			var staticFolder = Walnut.config.staticFilesFolder;
			var filePath = staticFolder + controller;
			path.exists(filePath, function(exists) {
				if (exists) {
					fileSystem.readFile(filePath, "binary", function(error, file){
						var ext = path.extname(filePath);
						ext = ext ? ext.slice(1) : 'unknown';
						var contentType = Walnut.mineTypes[ext] || "text/plain";
						response.setHeader('Content-Type', contentType);
						response.write(file, "binary");
						response.end();
					});
				} else {
					response.end('404 not found !');
				}
			});
		}
	}, request.url, Walnut.config.DEFAULT_URL)
}

/**
 * @description Content type mapping list.
 */
Walnut.mineTypes = {
    "aiff": "audio/x-aiff",
    "arj": "application/x-arj-compressed",
    "asf": "video/x-ms-asf",
    "asx": "video/x-ms-asx",
    "au": "audio/ulaw",
    "avi": "video/x-msvideo",
    "bcpio": "application/x-bcpio",
    "ccad": "application/clariscad",
    "cod": "application/vnd.rim.cod",
    "com": "application/x-msdos-program",
    "cpio": "application/x-cpio",
    "cpt": "application/mac-compactpro",
    "csh": "application/x-csh",
    "css": "text/css",
    "deb": "application/x-debian-package",
    "dl": "video/dl",
    "doc": "application/msword",
    "drw": "application/drafting",
    "dvi": "application/x-dvi",
    "dwg": "application/acad",
    "dxf": "application/dxf",
    "dxr": "application/x-director",
    "etx": "text/x-setext",
    "ez": "application/andrew-inset",
    "fli": "video/x-fli",
    "flv": "video/x-flv",
    "gif": "image/gif",
    "gl": "video/gl",
    "gtar": "application/x-gtar",
    "gz": "application/x-gzip",
    "hdf": "application/x-hdf",
    "hqx": "application/mac-binhex40",
    "html": "text/html",
    "ice": "x-conference/x-cooltalk",
    "ief": "image/ief",
    "igs": "model/iges",
    "ips": "application/x-ipscript",
    "ipx": "application/x-ipix",
    "jad": "text/vnd.sun.j2me.app-descriptor",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "latex": "application/x-latex",
    "lsp": "application/x-lisp",
    "lzh": "application/octet-stream",
    "m": "text/plain",
    "m3u": "audio/x-mpegurl",
    "man": "application/x-troff-man",
    "me": "application/x-troff-me",
    "midi": "audio/midi",
    "mif": "application/x-mif",
    "mime": "www/mime",
    "movie": "video/x-sgi-movie",
    "mp4": "video/mp4",
    "mpg": "video/mpeg",
    "mpga": "audio/mpeg",
    "ms": "application/x-troff-ms",
    "nc": "application/x-netcdf",
    "oda": "application/oda",
    "ogm": "application/ogg",
    "pbm": "image/x-portable-bitmap",
    "pdf": "application/pdf",
    "pgm": "image/x-portable-graymap",
    "pgn": "application/x-chess-pgn",
    "pgp": "application/pgp",
    "pm": "application/x-perl",
    "png": "image/png",
    "pnm": "image/x-portable-anymap",
    "ppm": "image/x-portable-pixmap",
    "ppz": "application/vnd.ms-powerpoint",
    "pre": "application/x-freelance",
    "prt": "application/pro_eng",
    "ps": "application/postscript",
    "qt": "video/quicktime",
    "ra": "audio/x-realaudio",
    "rar": "application/x-rar-compressed",
    "ras": "image/x-cmu-raster",
    "rgb": "image/x-rgb",
    "rm": "audio/x-pn-realaudio",
    "rpm": "audio/x-pn-realaudio-plugin",
    "rtf": "text/rtf",
    "rtx": "text/richtext",
    "scm": "application/x-lotusscreencam",
    "set": "application/set",
    "sgml": "text/sgml",
    "sh": "application/x-sh",
    "shar": "application/x-shar",
    "silo": "model/mesh",
    "sit": "application/x-stuffit",
    "skt": "application/x-koan",
    "smil": "application/smil",
    "snd": "audio/basic",
    "sol": "application/solids",
    "spl": "application/x-futuresplash",
    "src": "application/x-wais-source",
    "stl": "application/SLA",
    "stp": "application/STEP",
    "sv4cpio": "application/x-sv4cpio",
    "sv4crc": "application/x-sv4crc",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tcl": "application/x-tcl",
    "tex": "application/x-tex",
    "texinfo": "application/x-texinfo",
    "tgz": "application/x-tar-gz",
    "tiff": "image/tiff",
    "tr": "application/x-troff",
    "tsi": "audio/TSP-audio",
    "tsp": "application/dsptype",
    "tsv": "text/tab-separated-values",
    "txt": "text/plain",
    "unv": "application/i-deas",
    "ustar": "application/x-ustar",
    "vcd": "application/x-cdlink",
    "vda": "application/vda",
    "vivo": "video/vnd.vivo",
    "vrm": "x-world/x-vrml",
    "wav": "audio/x-wav",
    "wax": "audio/x-ms-wax",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "wmx": "video/x-ms-wmx",
    "wrl": "model/vrml",
    "wvx": "video/x-ms-wvx",
    "xbm": "image/x-xbitmap",
    "xlw": "application/vnd.ms-excel",
    "xml": "text/xml",
    "xpm": "image/x-xpixmap",
    "xwd": "image/x-xwindowdump",
    "xyz": "chemical/x-pdb",
    "zip": "application/zip"
}

/**
 * @description Start the server.
 */
Walnut.start(80);
