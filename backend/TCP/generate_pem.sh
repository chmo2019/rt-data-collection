#! /usr/bin/bash

# https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 30 -nodes -subj "/C=US/ST=MA/L=Boston/O=Student/OU=NA/CN=localhost"