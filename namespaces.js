var u = require('util');

function prefix(nid) {
  return u.format('urn:hg:%s:', nid);
}

module.exports = {
  geonames: {
    baseUrl: 'http://sws.geonames.org/',

    urlMatch: function(url) {
      var alternativeBaseUrl = 'http://www.geonames.org/';
      return url.toLowerCase().indexOf(this.baseUrl) === 0 || url.toLowerCase().indexOf(alternativeBaseUrl) === 0;
    },

    baseUrlRegex: /http:\/\/(sws|www)\.geonames\.org\//,

    URLtoURN: function(url) {
      var match = /.*?(\d+).*/.exec(url);
      return prefix('geonames') + match[1];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + nss + '/';
    }
  },

  tgn: {
    baseUrl: 'http://vocab.getty.edu/tgn/',

    URLtoURN: function(url) {
      var match = /.*?(term)?\/?(\d+).*/i.exec(url);
      var nss = [match[1], match[2]].filter(function(part) { return part; }).join(':');
      return prefix('tgn') + nss;
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + nss.split(':').join('/');
    }
  },

  dbpedia: {
    baseUrl: 'http://dbpedia.org/',

    URLtoURN: function(url) {
      var match = /(resource|page)\/(.*)$/i.exec(url);
      return prefix('dbpedia') + match[2];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + 'resource/' + nss;
    }
  },

  wikidata: {
    baseUrl: 'http://www.wikidata.org/',

    URLtoURN: function(url) {
      var match = /(wiki|entity)\/(.*)$/i.exec(url);
      return prefix('wikidata') + match[2];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + 'entity/' + nss;
    }
  },

  pleiades: {
    baseUrl: 'http://pleiades.stoa.org/',

    URLtoURN: function(url) {
      var match = /places\/(.*)$/i.exec(url);
      return prefix('pleiades') + match[1];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + 'places/' + nss;
    }
  },

  gemeentegeschiedenis: {
    baseUrl: 'http://www.gemeentegeschiedenis.nl/',

    URLtoURN: function(url) {
      var match = /gemeentenaam\/(.*)$/i.exec(url);
      return prefix('gemeentegeschiedenis') + match[1];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + 'gemeentenaam/' + nss;
    }
  },

  kloeke: {
    baseUrl: 'http://www.meertens.knaw.nl/kloeke/',

    URLtoURN: function(url) {
      var match = /kloekenummer=(.*)$/i.exec(url);
      return prefix('kloeke') + match[1];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + 'index.php?kloekenummer=' + nss;
    }
  }

};
