var assert = require('assert');
var uriNormalizer = require('../index');

describe('uri-normalizer', function() {
   describe('normalize', function() {
     it('Should normalize strings to URNs when specifying a URL-link string', function() {
       // GeoNames
       assert.equal(uriNormalizer.normalize('http://sWS.geonames.org/2758064/about.rdf'), 'urn:hg:geonames:2758064');
       assert.equal(uriNormalizer.normalize('http://sws.geonames.org/2758064/'), 'urn:hg:geonames:2758064');
       assert.equal(uriNormalizer.normalize('http://www.geonames.org/2758064/'), 'urn:hg:geonames:2758064');
       assert.equal(uriNormalizer.normalize('hTTp://sws.geonAmEs.org/2758064'), 'urn:hg:geonames:2758064');

       // TGN
       assert.equal(uriNormalizer.normalize('http://vocab.getty.edu/tgn/7006952'), 'urn:hg:tgn:7006952');
       assert.equal(uriNormalizer.normalize('http://vocab.getty.edu/tgn/term/352466'), 'urn:hg:tgn:term:352466');
     });

     it('Should return `urn:hgid` URNs for unknown namepspaces', function() {
       // HGIDs
       assert.equal(uriNormalizer.normalize('7006952', 'foo'), 'urn:hgid:foo/7006952');
       assert.equal(uriNormalizer.normalize('term/352466', 'baz'), 'urn:hgid:term/352466');
       assert.equal(uriNormalizer.normalize('7006952', 'fOo'), 'urn:hgid:foo/7006952');
       assert.equal(uriNormalizer.normalize('flEp.tozz/352.466', 'hrmz'), 'urn:hgid:flep/352.466');
     });

     it('Should return `urn:hg:foo` URNs for known namepspaces', function() {
       // HGIDs
       assert.equal(uriNormalizer.normalize('tgn/7006952', 'foo'), 'urn:hg:tgn:7006952');
       assert.equal(uriNormalizer.normalize('352466', 'tgn'), 'urn:hg:tgn:352466');
     });

     it('Should return `undefined` when normalizing dataset-internal IDs', function() {
       assert.equal(uriNormalizer.normalize('7006952'), undefined);

       assert.equal(uriNormalizer.normalize('bus*'), undefined);
     });

   });

  describe('URLtoURN', function() {
    it('Should return proper URNs', function() {

      // GeoNames
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064/about.rdf', 'geonames'), 'urn:hg:geonames:2758064');
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064/', 'geonames'), 'urn:hg:geonames:2758064');
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064', 'geonames'), 'urn:hg:geonames:2758064');

      // TGN
      assert.equal(uriNormalizer.URLtoURN('http://vocab.getty.edu/tgn/7006952', 'tgn'), 'urn:hg:tgn:7006952');
      assert.equal(uriNormalizer.URLtoURN('http://vocab.getty.edu/tgn/term/352466', 'tgn'), 'urn:hg:tgn:term:352466');
    });

    it('Should return proper URNs (without specifying namespace)', function() {

      // GeoNames
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064/about.rdf'), 'urn:hg:geonames:2758064');
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064/'), 'urn:hg:geonames:2758064');
      assert.equal(uriNormalizer.URLtoURN('http://sws.geonames.org/2758064'), 'urn:hg:geonames:2758064');

      // TGN
      assert.equal(uriNormalizer.URLtoURN('http://vocab.getty.edu/tgn/7006952'), 'urn:hg:tgn:7006952');
      assert.equal(uriNormalizer.URLtoURN('http://vocab.getty.edu/tgn/term/352466'), 'urn:hg:tgn:term:352466');

      // DBpedia
      assert.equal(uriNormalizer.URLtoURN('http://dbpedia.org/resource/Bussum'), 'urn:hg:dbpedia:Bussum');
      assert.equal(uriNormalizer.URLtoURN('http://dbpedia.org/page/Bussum'), 'urn:hg:dbpedia:Bussum');

      // WikiData
      assert.equal(uriNormalizer.URLtoURN('http://www.wikidata.org/wiki/Q47887'), 'urn:hg:wikidata:Q47887');
      assert.equal(uriNormalizer.URLtoURN('http://www.wikidata.org/entity/Q47887'), 'urn:hg:wikidata:Q47887');

      // Pleiades
      assert.equal(uriNormalizer.URLtoURN('http://pleiades.stoa.org/places/99003/lugdunum'), 'urn:hg:pleiades:99003/lugdunum');
      // Kloekecodes
      assert.equal(uriNormalizer.URLtoURN('http://www.meertens.knaw.nl/kloeke/index.php?kloekenummer=A001a'), 'urn:hg:kloeke:A001a');

      // Gemeentegeschiedenis
      assert.equal(uriNormalizer.URLtoURN('http://www.gemeentegeschiedenis.nl/gemeentenaam/Adorp'), 'urn:hg:gemeentegeschiedenis:Adorp');

    });
  });

  describe('URNtoURL', function() {
    it('Should return proper URLs', function() {

      // GeoNames
      assert.equal(uriNormalizer.URNtoURL('urn:hg:geonames:2758064'), 'http://sws.geonames.org/2758064/');

      // TGN
      assert.equal(uriNormalizer.URNtoURL('urn:hg:tgn:7006952'), 'http://vocab.getty.edu/tgn/7006952');
      assert.equal(uriNormalizer.URNtoURL('urn:hg:tgn:term:352466'), 'http://vocab.getty.edu/tgn/term/352466');

      // DBpedia
      assert.equal(uriNormalizer.URNtoURL('urn:hg:dbpedia:Bussum'),'http://dbpedia.org/resource/Bussum');

      // WikiData
      assert.equal(uriNormalizer.URNtoURL('urn:hg:wikidata:Q47887'), 'http://www.wikidata.org/entity/Q47887');

      // Pleiades
      assert.equal(uriNormalizer.URNtoURL('urn:hg:pleiades:99003/lugdunum'), 'http://pleiades.stoa.org/places/99003/lugdunum');
      // Kloekecodes
      assert.equal(uriNormalizer.URNtoURL('urn:hg:kloeke:A001a'), 'http://www.meertens.knaw.nl/kloeke/index.php?kloekenummer=A001a');

      // Gemeentegeschiedenis
      assert.equal(uriNormalizer.URNtoURL('urn:hg:gemeentegeschiedenis:Adorp'), 'http://www.gemeentegeschiedenis.nl/gemeentenaam/Adorp');

    });
  });

  describe('addNamespace', function() {
    var namespace1 = {
      baseUrl: 'http://example.com/',
      URLtoURN: function(url) {
      },
      URNtoURL: function(nid, nss) {
      }
    };

    var namespace2 = {
      baseUrl: 'http://example.com/',
      URNtoURL: function(nid, nss) {
      }
    };

    it('Should add new namespace', function() {
      assert.doesNotThrow(function() {uriNormalizer.addNamespace('test1', namespace1)});
    });

    it('Should fail when adding namespace when not including URLtoURN function', function() {
      assert.throws(function() {uriNormalizer.addNamespace('test2', namespace2)});
    });

    it('Should fail when adding namespace that already exists', function() {
      assert.throws(function() {uriNormalizer.addNamespace('tgn', namespace1)});
    });
  });

  describe('removeNamespace', function() {
    it('Should remove existing namespace', function() {
      assert.doesNotThrow(function() {uriNormalizer.removeNamespace('tgn')});
    });

    it('Should fail when removing namespace that does not exist', function() {
      assert.throws(function() {uriNormalizer.removeNamespace('test3')});
    });
  });
});
