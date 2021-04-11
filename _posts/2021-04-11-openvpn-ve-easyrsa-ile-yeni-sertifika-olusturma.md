---
layout: post
title: "OpenVPN ve Easyrsa ile yeni sertifika oluşturma"
categories: easyrsa
---

Lazım olduğunda hatırlamak adına küçük bi not ca dosyası hazır olmalı siteminiz kurulu olmalı

Sertifika İsteği Oluşturma

```sh
./easyrsa gen-req {name} nopass

Note: using Easy-RSA configuration from: ./vars

Using SSL: openssl OpenSSL 1.1.1c FIPS  28 May 2019
Generating a RSA private key
..........+++++
..........+++++
writing new private key to '[easyrsapath]/pki/private/[name].key.[key]'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Common Name (eg: your user, host, or server name) [name]:

Keypair and certificate request completed. Your files are:
req: [easyrsapath]/pki/reqs/[name].req
key: [easyrsapath]/pki/private/[name].key

 ```
İmzalama

```sh
./easyrsa sign-req client {name}

Note: using Easy-RSA configuration from: ./vars

Using SSL: openssl OpenSSL 1.1.1c FIPS  28 May 2019


You are about to sign the following certificate.
Please check over the details shown below for accuracy. Note that this request
has not been cryptographically verified. Please be sure it came from a trusted
source or that you have verified the request checksum with the sender.

Request subject, to be signed as a client certificate for 365 days:

subject=
    commonName                = [name]


Type the word 'yes' to continue, or any other input to abort.
  Confirm request details: yes
Using configuration from [easyrsapath]/pki/safessl-easyrsa.cnf
Enter pass phrase for [easyrsapath]/pki/private/ca.key:
Check that the request matches the signature
Signature ok
The Subject's Distinguished Name is as follows
commonName            :ASN.1 12:'[name]'
Certificate is to be certified until Apr 11 12:31:49 2022 GMT (365 days)

Write out database with 1 new entries
Data Base Updated

Certificate created at: [easyrsapath]/pki/issued/[name].crt

```
Doğrulama

```sh
openssl verify -CAfile pki/ca.crt pki/issued/{name}.crt

pki/issued/[name].crt: OK

```

Sertifikaları Open vpn e kopyalama

```sh

cp pki/issued/{name}.crt {openvpnpath}/client/.
cp pki/private/{name}.key {openvpnpath}/client/.

```

Eğer client için özel ip adresi tanımlayacak isek ccd klasöründe {name} adında bir file oluşturup içine aşağıdaki gibi kurallarımızı ekliyoruz

```sh
ifconfig-push 10.10.10.200 255.255.255.0
```
