# connect-js-codec
[![Build Status](https://travis-ci.org/spotware/connect-js-codec.svg?branch=master)](https://travis-ci.org/spotware/connect-js-codec)

Join two codecs: frame buffer and protocol

## TODO
* Fix encode bug (sometimes `message`, sometimes `data`)
* Convert to a class instead of a factory function
* Update dependency versions to latest stable (jeremyjs forks)
  * Tag new stable version of `jeremyjs/connect-protobuf-messages` (currently depending on a branch)
* Migrate to TypeScript and share types
* Add unit tests for all units and methods
* Remove subscribe callback and merge logic into the decode method
  * Discover if it's possible
