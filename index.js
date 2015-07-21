var namespaces = require('./namespaces');
var util = require('util');

/*
  - URIs that we know about are minimized into URNs
  http://vocab.getty.com/thing/1234?v=1 ~> 'urn:hg:tgn:v=1,thing=1234'

  - URIs that we dont know are left as-is.

  - Histograph identifiers (e.g. `dataset1/123`) are mapped to internal-only URNs
  dataset1/123 ~> urn:hgid:dataset1/123

  - Dataset-internal identifiers (without dataset scope, e.g. `123`) are mapped to scoped internal-only URNs
  123 ~> urn:hgid:dataset1/123 - To do this, a dataset identifier is needed
*/

// match if this string looks like a URI
var URI_PATTERN = /^[a-zA-Z][a-zA-Z0-9+-\.]*:.*$/;

// match `a/b` HG identifiers
var HGID_PATTERN = /^([a-zA-Z0-9\.+-_]+)\/([a-zA-Z0-9\.+-_]+)$/;

// match normal identifiers
var ID_PATTERN = /^([a-zA-Z0-9\.+-_]+)$/;

exports.normalize = function(s, nid) {
  // normalize URIs
  if (URI_PATTERN.test(s)) {
    try {
      return exports.URLtoURN(s);
    } catch (e) {
      return s;
    }
  }

  // it is (or, should be) a HGID
  return exports.normalizeHGID(s, nid);
};

// normalize dataset names; `KOEKwous.floes.tozz` ~> `koekwous`
exports.normalizeSourceID = function(sourceid) {
  if (sourceid) {
    return sourceid.split('.')[0].toLowerCase();
  } else {
    return undefined;
  }
};

exports.parseHGID = function(s, sourceId) {

  // the case `a/x`
  var ax = HGID_PATTERN.exec(s);
  if (ax) {
    return [ax[1], ax[2]];
  }

  // the case `x`
  var x = ID_PATTERN.exec(s);
  if (x) {
    return [sourceId, x[1]];
  } else {
    return undefined;
  }
};

// normalize HG identifiers; `fOE.bar/234` ~> `urn:hgid:foo/123`
exports.normalizeHGID = function(hgid, sourceId) {
  // split `a/b` into a and b
  var hgidParts = exports.parseHGID(hgid, sourceId);

  // turn 'foo.bar.baz' into foo
  hgidParts[0] = exports.normalizeSourceID(hgidParts[0]);

  if (hgidParts[0]) {
    // namespace 'foo' is known in `urn:hg` namespace
    if (namespaces[hgidParts[0]])
      return util.format('urn:hg:%s:%s', hgidParts[0], hgidParts[1]);

    // HGID namespace
    return util.format('urn:hgid:%s/%s', hgidParts[0], hgidParts[1]);
  } else {
    return undefined;
  }
};

exports.URLtoURN = function(url, nid) {
  if (nid !== undefined && namespaces[nid]) {
    var namespace = namespaces[nid];
    return namespace.URLtoURN(url);
  } else {
    for (var n in namespaces) {
      var urlMatch = function(url, baseUrl) {
        return url.toLowerCase().indexOf(baseUrl) === 0;
      };

      var urlMatched = namespaces[n].urlMatch ? namespaces[n].urlMatch(url) : urlMatch(url, namespaces[n].baseUrl);
      if (urlMatched) {
        return namespaces[n].URLtoURN(url);
      }
    }

    throw new Error('No namespace found for URL: ' + url);
  }
};

exports.URNtoURL = function(urn) {
  var parts = urn.split(':');
  if (parts[0] === 'urn') {
    var hg = parts[1];
    var nid = parts[2];
    var nss = parts.splice(3).join(':');

    if (hg === 'hg' && nid !== undefined && namespaces[nid]) {
      var namespace = namespaces[nid];
      return namespace.URNtoURL(nid, nss);
    } else {
      throw new Error('No namespace found for URN: ' + urn);
    }
  } else {
    throw new Error('Invalid URN: ' + urn);
  }
};

exports.addNamespace = function(nid, namespace) {
  if (!nid) {
    throw new Error('Invalid namespace: ' + nid);
  }

  if (!namespaces[nid]) {
    var namespaceValid = namespace.baseUrl &&
      namespace.URLtoURN &&
      namespace.URNtoURL;

    if (namespaceValid) {
      namespaces[nid] = namespace;
    } else {
      throw new Error('Namespace namespace not valid, should include baseUrl, URLtoURN and URNtoURL');
    }
  } else {
    throw new Error('Namespace already exists: ' + nid);
  }
};

exports.removeNamespace = function(nid) {
  if (namespaces[nid]) {
    delete namespaces[nid];
  } else {
    throw new Error('Namespace does not exist: ' + nid);
  }
};
