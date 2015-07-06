var namespaces = require('./namespaces');
var u = require('util');

/*

  URI's that we know about are minimized into URNs
  http://vocab.getty.com/thing/1234?v=1 ~> 'urn:hg:tgn:v=1,thing=1234'

  URI's that we dont know are left as-is.

  Identifiers in the HG-id tradition `foo/123` are mapped to internal-only URNs
  foo/123 ~> urn:hgid:foo/123

  Identifiers without HG scope `123` are mapped to scoped integer-only URNs
  123 ~> urn:hgid:foo/123

*/

// match if this string looks like a URI
var SCHEME = /^[a-zA-Z][a-zA-Z0-9+-\.]*:.*$/;

// match `a/b` HG identifiers (whitespace flexible)
var HGID = /^\s*([a-zA-Z0-9\.+-_]+)\/([a-zA-Z0-9\.+-_]+)\s*$/;

// match normal identifiers (whitespace flexible)
var ID = /^\s*([a-zA-Z0-9\.+-_]+)\s*$/;

exports.normalize = function(s, nid) {

  // normalize URIs
  if (SCHEME.test(s)) {
    try {
      return exports.URLtoURN(s);
    }
    catch (e) {
      return s;
    }
  }

  // it is (or, should be) a HGID
  return exports.normalizeHGID(s, nid);
};

// normalize dataset names; `KOEKwous.floes.tozz` ~> `koekwous`
exports.normalizeSourceID = function(sourceid) {
  return sourceid.split('.')[0].toLowerCase();
};

exports.parseHGID = function(s, sourceId) {

  // the case `a/x`
  var ax = HGID.exec(s);
  if (ax)
    return [ax[1], ax[2]];

  // the case `x`
  var x = ID.exec(s);
  if (x)
    return [sourceId, x[1]];

  // undefined otherwise
};

// normalize HG identifiers; `fOE.bar/234` ~> `urn:hgid:foo/123`
exports.normalizeHGID = function(hgid_string, sourceId) {
  // split `a/b` into a and b
  var hgid = exports.parseHGID(hgid_string, sourceId);

  // turn 'foo.bar.baz' into foo
  hgid[0] = exports.normalizeSourceID(hgid[0]);

  // namespace 'foo' is known in `urn:hg` namespace
  if (namespaces[hgid[0]])
    return u.format('urn:hg:%s:%s', hgid[0], hgid[1]);

  // HGID namespace
  return u.format('urn:hgid:%s/%s', hgid[0], hgid[1]);
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
      return namespace.URNtoURL(nid, nss.toLowerCase());
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
