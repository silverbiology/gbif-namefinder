var gbifNameFinder = function( ocrTxt ) {

	var needle = require('needle');
	var route = "http://ecat-dev.gbif.org/ws/indexer";
	var me = this;
	this.ocr = ocrTxt || null;
	this.lastResults = null;

	this.setOcr = function( ocrTxt ) {
		me.ocr = ocrTxt;
	}

	this.getOcr = function( row ) {
		if ( row && me.ocr[row] ) return me.ocr.split("\n")[row];
		return me.ocr;
	}

	// uses taxon finder service
	this.findNamesTF = function( callback ) {
		var input = encodeURIComponent( this.ocr );
		var type = "text";
		var format = "json";
		var req = route + "?input=" + input + "&type=" + type + "&format=" + format;
		needle.get(req, function(error, response, body){
			if (response.statusCode == 200) {
				if (callback) callback( body.names );
			} else {
				// error
			}
		});	
	}
	
	// Uses lucene name finder service
	this.findNames = function( callback ) {
		var input = encodeURIComponent( this.ocr );
		var type = "text";
		var format = "json";
		var req = route + "?input=" + input + "&type=" + type + "&format=" + format;
		needle.get(req, function(error, response, body){
			if (response.statusCode == 200) {
//			console.log(body.names);
				me.lastResults = body.names;
				if (callback) callback( body.names );
			} else {
				// error
			}
		}, this);	
	}
	
	// Returns just an array of scientific names
	this.getNames = function( limit ) {
		var tmpList = [];
		if (this.lastResults) {
			// Use limit else return all
			var cnt = limit || this.lastResults.length;
			for(var i=0; i<cnt; i++) {
				console.log("item", this.lastResults[i]);
				tmpList.push( this.lastResults[i].scientificName );
			}
		}
		return tmpList;
	}
};

module.exports = gbifNameFinder;