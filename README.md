# awsBB

Serverless AWS based forum software (In-Progress)

### Directories:

* ./webpack
	* Client source.
* ./static
	* Compiled distribution to be hosted on a S3 bucket.
* ./plugin
	* General store for server side local development.
* ./plugin/aws/
	* AWS code in abstracted form to utilize local installs.
* ./plugin/route-maps
	* Lambda->HapiJS route translation.

This README and project is still highly unstable since it just began. It's being built up piece by piece.

The routes you will see also are **not** REST compliant until a more finalized version is complete; that and the API's will not be designed for 3rd party consumption. (TBD)

### Technologies & Installables:

* React (routing, hot loading, etc)
* Redux (routing, devtools, etc)
* Node (5+)
* Webpack
* HapiJS
* AWS (Anything)
* Babel
* Postcss
* Rucksack
* Bootstrap3
* FontAwesome
* ESLint
* Lot's more stuffies...

### Installation

```
git clone git@github.com:awsbb/awsbb.git
npm i
nodemon
```

If something doesn't run you may need somethings in your global packages.

Module versioning is nothing I'm worried about right now because it's all still in development. Things can and will break! :)

This package setup supports HMR of both the client and the server.

*Please Note*:
You may see items committed here and there which is just me or someone else learning something along the way.
