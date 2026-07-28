---
layout: post
title: "Publish your own library for Nodejs"
date: 2020-12-08
description: "A short technical note outlining the basic approach and actionable steps on Publish your own library for Nodejs."
lang: en-US
translation_key: "nodejs-kutuphanenizi-local-repoya-publish-etme-2bbc1409"
permalink: /en/2020/12/08/publish-your-own-library-for-nodejs.html
image: "http://fmarslan.com/assets/img/aWryH.png"
---

We start by assuming that nodejs, npm and ng have been installed, we will publish the Angular library in this process.

First of all, we create our library with Angular CLI. For detailed information, [click](https://angular.io/guide/creating-libraries)

```sh
ng new my-workspace --create-application=false
cd my-workspace
ng generate library my-lib
```

After making the necessary additions and improvements, we build. In this section, tests etc. are completed.

```sh
ng build my-lib
```

Afterwards, if our library is ready, we have come to the publishing stage. I am using nexus repo here. I will publish to my own repo.

First of all, let's activate the npm bearer token realm in the realm definitions in our nexus repo.

We must add publish cofngi to the library's ```package.json``` file as follows

```json
  "publishConfig": {
    "registry": "http://nexus.fmarslan.com/repository/npm-repository"
  }
```

We are adding users to npm repo
```sh
npm adduser --registry=http://nexus.fmarslan.com/repository/npm-repository/ --always-auth
```

We compile and publish.

```sh
ng build my-lib --prod
cd dist/my-lib
npm publish
```

We check and verify that it is loaded.
