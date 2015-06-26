# Histograph URI Normalizer

Used by [Histograph](http://histograph.io) to define one set of identifiers to be used by [Graphmalizer](https://github.com/graphmalizer).

Graphmalizer is stupid (by design): when two identifiers are lexicographically equal (equal as character strings)
they are considered to refer to the same thing.

Histograph is more flexible when it comes to specifying identifiers:

- Identifiers can be URIs (`http://vocab.getty.edu/tgn/7006952`, `urn:ietf:rfc:2141`)
- Or HGID's (Histograph id's) (`123`, `foo/234`).
- Histograph accepts PITs/nodes with either an `id` or an `uri` field (but not both).
- Histograph relations have a `from` and `to` field which can be an URI or HGID.

This project matches any histograph identifier string and normalizes it into a URI.

## Summary

Known URLs are converted into canonical form URNs with NID `hg`

	http://vocab.getty.edu/tgn/7006952 ~> urn:hg:tgn:7006952
	http://sws.geonames.org/2758064/   ~> urn:hg:geonames:2758064

URNs are left untouched (if canonical form is known, convert to that):

	urn:hg:geonames:2758064            ~> urn:hg:geonames:2758064
	urn:ietf:rfc:2141                  ~> urn:ietf:rfc:2141

HGIDs within a dataset `foo` are expandend to URNs with NID `hgid`

	12345-nl                           ~> urn:hgid:foo:12345-nl
	bar/45678901                       ~> urn:hgid:bar:45678901

Reverse (resolving)

	urn:hg:geonames:2758064            ~> http://sws.geonames.org/2758064/

Etc.

[`namespaces.js`](namespaces.js) contains a set of default namespaces.

See also:

- https://www.ietf.org/rfc/rfc2141.txt
- https://www.ietf.org/rfc/rfc1737.txt
- https://en.wikipedia.org/wiki/Uniform_resource_name

Identifier strings are matched according to the following regular expressions

```js
// matching strings look like an URI to use, based on RFC2141
var SCHEME = /^[a-zA-Z][a-zA-Z0-9+-\.]*:$/

// match `foo/123` HGID's
var HGID = /^[a-zA-Z0-9\.+-_]+\/[a-zA-Z0-9\.+-_]+$/

// alleß Andere
var ID = /^[a-zA-Z0-9\.+-_]+$/
```

## Usage

First:

    npm install histograph/uri-normalizer

Just do the right thing:

```js
var n = require('histograph-uri-normalizer').normalize;

console.log(n('http://sws.geonames.org/2758064/'))
// => urn:hg:geonames:2758064

// don't need to, but might as well pass dataset identifier
console.log(n('foo/123', 'bar'))
// => urn:hgid:foo:123

// need to pass dataset identifier
console.log(n('123', 'bar'))
// => urn:hgid:bar:123
```

Or use the more specific methods:

```js
var normalizer = require('histograph-uri-normalizer');

var urn = normalizer.URLtoURN('http://sws.geonames.org/2758064/');
console.log(urn); // contains 'urn:hg:geonames:2758064'
```

## API

### `normalizer.normalize(s, nid)`

Tries to detect if you pass an URI, local HGID or global HGID.
Then does the right thing to normalize it.

It uses all namespaces to convert `s` if it's a URI.

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
