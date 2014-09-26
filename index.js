var gbifNameFinder = function (ocrTxt) {

	var needle = require('needle');
	var route = "http://ecat-dev.gbif.org/ws/indexer";
	var me = this;
	this.ocr = ocrTxt || null;
	this.lastResults = null;

	this.setOcr = function (ocrTxt) {
		me.ocr = ocrTxt;
	}

	this.getOcr = function (row) {
		if (row && me.ocr[row])
			return me.ocr.split("\n")[row];
		return me.ocr;
	}

	// uses taxon finder service
	this.findNamesTF = function (callback) {
		var input = encodeURIComponent(this.ocr);
		var type = "text";
		var format = "json";
		var req = route + "?input=" + input + "&type=" + type + "&format=" + format;
		needle.get(req, function (error, response, body) {
			if (error) {
				// console.log('Error:', error.stack);
				// console.log('Req:', req);
				// console.log('Res:', response);
				// process.exit(0);
			}
			if (response.statusCode == 200) {
				if (callback)
					callback(body.names);
			} else {
				// console.log('No Error....');
				// console.log('Req:', req);
				// console.log('Res:', response);
				// process.exit(0);
			}
		});
	}

	// Uses lucene name finder service
	this.findNames = function (callback) {
		var input = (this.ocr) ? this.ocr.replace(/\r\n/g, '<br>') : '';
		input = encodeURIComponent(input);
		var type = "text";
		var format = "json";
		var req = route + "?input=" + input + "&type=" + type + "&format=" + format;
		if (input && input !== '') {
			needle.get(req, function (err, response, body) {
				if (err) {
					console.log('--->', err.stack);
				} else {
					//console.log("Input:", input)
					console.log('Body:', body);
				}
				if (response && response.statusCode == 200) {
					me.lastResults = body.names;
					if (callback)
						callback(body.names);
				} else {
					if (callback)
						callback([]);
				}
			}, this);
		} else {
			callback([])
		}
	}

	// Returns just an array of scientific names
	this.getNames = function (limit) {
		var tmpList = [];
		if (this.lastResults) {
			// Use limit else return all
			var cnt = limit || this.lastResults.length;
			for (var i = 0; i < cnt; i++) {
				tmpList.push(this.lastResults[i].scientificName);
			}
		}
		return tmpList;
	}
};

module.exports = gbifNameFinder;
