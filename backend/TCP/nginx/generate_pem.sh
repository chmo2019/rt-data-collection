#! /usr/bin/bash

# https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl

#openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 30 -nodes -subj "/C=US/ST=MA/L=Boston/O=Student/OU=NA/CN=localhost"

KEY_PATH=$PWD/ssl

SUBJ_KEYS=("C" "ST" "L" "O" "OU" "CN")
SUBJ_VALS=($(jq -r '.[]' nginx/config.json))

SUBJ=""

make_dirs () {
    mkdir -p $KEY_PATH
}

get_subj () {
    for i in {0..5}
    do
        SUBJ+="/${SUBJ_KEYS[i]}=${SUBJ_VALS[i]}";
    done
}

gen_ca () {
    openssl genpkey -algorithm RSA -out $KEY_PATH/ca.key
    openssl req -new -x509 -key $KEY_PATH/ca.key -out $KEY_PATH/ca.crt -subj $SUBJ
}

gen_server () {
    openssl genpkey -algorithm RSA -out $KEY_PATH/server.key
    openssl req -new -key $KEY_PATH/server.key -out $KEY_PATH/server.csr -subj $SUBJ
    openssl x509 -req -in $KEY_PATH/server.csr -CA $KEY_PATH/ca.crt -CAkey $KEY_PATH/ca.key -CAcreateserial -out $KEY_PATH/server.crt
}

gen_client () {
    openssl genpkey -algorithm RSA -out $KEY_PATH/client.key
    openssl req -new -key $KEY_PATH/client.key -out $KEY_PATH/client.csr -subj $SUBJ
    openssl x509 -req -in $KEY_PATH/client.csr -CA $KEY_PATH/ca.crt -CAkey $KEY_PATH/ca.key -CAcreateserial -out $KEY_PATH/client.crt
}

echo "creating ssl certs..."

get_subj

make_dirs

gen_ca

gen_server

gen_client