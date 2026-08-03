---
layout: post
title: "Using S3 Server and Providing Connection"
date: 2020-11-13
description: "A short technical note outlining the basic approach and applicable steps in Using and Connecting to S3 Server."
lang: en-US
translation_key: "s3-fileserver-connect-on-cli-cd748043"
permalink: /en/2020/11/13/using-s3-server-and-providing-connection.html
---

### S3 Server How it works.

S3 server works with git logic, we can call it a bucket for each repo. Likewise, imagine creating as many folders as you want (it's just for display). This part only works as a prefix. For example, you created a mys3 bucket, created 10 folders under it and added a file to each, there are 10 files in the bucket. 

```
mys3/a/1
mys3/b/2
mys3/c/3
mys3/d/4
mys3/e/5
mys3/f/6
mys3/g/7
mys3/g/8
mys3/g/9
mys3/g/10
```
this impression

```
mys3/a-1
mys3/b-2
mys3/c-3
mys3/d-4
mys3/e-5
mys3/f-6
mys3/g-7
mys3/g-8
mys3/g-9
mys3/g-10
```

It means the same thing. When we say how many files are in mys3, there are 10 files, but if you look at the display, it looks like there are 7 folders. The next point after this information is this: If you have such a need, especially if you are going to get the entire file list with prefix or in the bucket, it is useful to keep the number of files in the bucket low for performance. The number of buckets is not very important. 

If you think of each bucket as a table, the fewer records there are in the table when you select, the more performance you will get.


### Link

There are more than one S3 client for connection, you can use whatever you want, my choice was Minio mc. You can see the installation [here](https://docs.min.io/docs/minio-client-quickstart-guide.html)


```sh
$ wget https://dl.min.io/client/mc/release/linux-amd64/mc
# chmod +x mc
$ ./mc --version
  mc version RELEASE.2020-10-03T02-54-56Z

```

After installation, we can define aliases for easy use of configs.

mc alias set <ALIAS> <YOUR-S3-ENDPOINT> <YOUR-ACCESS-KEY> <YOUR-SECRET-KEY> --api <API-SIGNATURE> --path <BUCKET-LOOKUP-TYPE>

```sh
$ mc alias set mys3 https://s3.fmarslan.com
```

bucket create ***mb*** command

```sh
./mc mb mys3/firstBucket
```
file upload ***cp*** command

```sh
$ ./mc cp ./{uploadfilepath} mys3/firstbucket
```

file list ***ls*** command

```sh
$ ./mc ls mys3/firstbucket
```

file remove ***rm*** command

```sh
$  ./mc rm mys3/firstbucket/mc
```

bucket remove ***rb*** command

```sh
$  ./mc rb mys3/firstbucket/
```
