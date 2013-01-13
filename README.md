gbif-namefinder
===============

Node Library for interacting with GBIF's Name Finder API.
http://tools.gbif.org/namefinder/

install
===============
npm install gbif-namefinder

how to use
===============
var gbifNameFinder = require('gbif-namefinder');
var nf = new gbifNameFinder();

var ocrTxt1 = 'LICHENS OF FLORIDA, U.S.A.\n\nArthopyrenia cinchonae (Ach.) Mull. Arg. \non Quercus\n\nLevy County: Cedar Key Scrub State Preserve, \n along Co. Rd. 347 ca. 1.5 mi N of jct of \n Fla. Hwy 24, 29°12\'N, 83°01\'W; dry oak-\n ericad scrub with low swampy areas.\n\n30 November 1992\n\nRichard C. Williams 29352\n';

nf.setOcr( ocrTxt1 );
console.log("OCR:", nf.getOcr() );
nf.findNames(function( results ) {
  console.log(results);
  console.log( nf.getNames() );
});

// TaxonFinger Service
nf.findNamesTF(function( results ) {
  console.log(results);
  console.log( nf.getNames() );
});
