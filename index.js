var namespaces = require('./namespaces');

exports.URLtoURN = function(url, nid) {
  if (nid !== undefined && namespaces[nid]) {
    var namespace = namespaces[nid];
    return namespace.URLtoURN(url);
  } else {
    for (var n in namespaces) {
      var urlMatch = function(url, baseUrl) {
        return url.indexOf(baseUrl) === 0;
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
    var nid = parts[1];
    var nss = parts.splice(2).join(':');

    if (nid !== undefined && namespaces[nid]) {
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
