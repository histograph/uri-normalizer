var u = require('util');

function prefix(nid) {
  return u.format('urn:hg:%s:', nid);
}

module.exports = {
  geonames: {
    baseUrl: 'http://sws.geonames.org/',

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
  }
};
