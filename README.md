# Histograph URI Normalizer

Normalizes URLs to URNs, and resolves URNs to URLs. Used by [Histograph](http://histograph.io)'s [Graphmalizer](https://github.com/graphmalizer) instance.

Histograph/Graphmalizer accepts PITs/nodes with either a `id` or an `uri` field (but not both). It's easy to construct an URN from `id`, but Histograph/Graphmalizer needs an URI Normalizer to convert HTTP URIs to URNs for internal use.

Histograph URI Normalizer converts `http://vocab.getty.edu/tgn/7006952` to `urn:tgn:7006952`, and `urn:geonames:2758064` to `http://sws.geonames.org/2758064/`.

[`namespaces.js`](namespaces.js) contains a set of default namespaces.

See also:

- https://www.ietf.org/rfc/rfc1737.txt
- https://en.wikipedia.org/wiki/Uniform_resource_name

## Usage

First:

    npm install histograph/uri-normalizer

Then:

```js
var normalizer = require('histograph-uri-normalizer');

var urn = normalizer.URLtoURN('http://sws.geonames.org/2758064/');
console.log(urn); // contains 'urn:geonames:2758064'
```

## API

### `normalizer.URLtoURN(url, [nid])`

Tries to normalize `url`, using all available namespaces. If `nid` is specified, only uses that namespace.

### `normalizer.URNtoURL(urn)`

Resolves `urn` to URL.

### `normalizer.addNamespace(nid, namespace)`

Adds new namespace `nid` to available namespaces. A new namespace must define a string `baseUrl`, and two functions `URLtoURN(url)` and `URNtoURL(nid, nss)`.

Example:

```js
var newNamespace = {
  baseUrl: 'http://sws.geonames.org/',

  URLtoURN: function(url) {
    var match = /.*?(\d+).*/.exec(url);
    return 'urn:geonames:' + match[1];
  },

  URNtoURL: function(nid, nss) {
    return this.baseUrl + nss + '/';
  }
}

normalizer.addNamespace('geonames', newNamespace)
```

### `normalizer.removeNamespace(nid)`

Removes namespace `nid` from namespaces list.