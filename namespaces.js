module.exports = {
  geonames: {
    baseUrl: 'http://sws.geonames.org/',

    URLtoURN: function(url) {
      var match = /.*?(\d+).*/.exec(url);
      return 'urn:geonames:' + match[1];
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + nss + '/';
    }
  },
  tgn: {
    baseUrl: 'http://vocab.getty.edu/tgn/',

    URLtoURN: function(url) {
      var match = /.*?(term)?\/?(\d+).*/.exec(url);
      var nss = [match[1], match[2]].filter(function(part) { return part; }).join(':');
      return 'urn:tgn:' + nss;
    },

    URNtoURL: function(nid, nss) {
      return this.baseUrl + nss.split(':').join('/');
    }
  }
};
