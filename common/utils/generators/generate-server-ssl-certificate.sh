######################################
# generate-server-ssl-certificate.sh #
###################################### 

#
# Description: 
#   Generate SSL certificate for the server.
# 

# extract arguments
USERNAME=$1

# build certificate
CA_KEY_FILE="./common/certificates/host/$USERNAME.notipp.key"
CA_CERT_FILE="./common/certificates/host/$USERNAME.notipp.pem"

SERVER_CERT_KEY_FILE="./hdt/data/certificate/server-ssl.key"
SERVER_CERT_PEM_FILE="./hdt/data/certificate/server-ssl.pem"
SERVER_CERT_CSR_FILE="./hdt/data/certificate/server-ssl.csr"
SERVER_CERT_CONF_FILE="./common/utils/templates/server-ssl.openssl.conf"

echo -e "|\t> Generating server certificate's password..." 
SERVER_CERT_PASSWORD="$(node ./common/utils/generators/strong-password.js)"
echo $SERVER_CERT_PASSWORD > "./hdt/data/certificate/server-ssl.pw"

echo -e "|\t> Generate SSL certificate's private .key file..." 
openssl genrsa -out $SERVER_CERT_KEY_FILE 4096

echo -e "|\t> Generate SSL certificate's .csr file..." 
{ 
    echo "PH";
    echo "Camarines Sur";
    echo "Naga"; 
    echo "Notipp-Server";
    echo "$(cat ./info/hdt/server-id)";
    echo "Notipp";
    echo "notipp@gmail.com";
    echo "$SERVER_CERT_PASSWORD"
echo "Notipp";
} | openssl req -sha256 -new \
-key $SERVER_CERT_KEY_FILE \
    -out $SERVER_CERT_CSR_FILE \
    -config $SERVER_CERT_CONF_FILE

echo -e "|\t> Generate child certificate and sign with RootCA..." 
openssl x509 -req -days 3650 \
    -in $SERVER_CERT_CSR_FILE \
    -CA $CA_CERT_FILE \
    -CAkey $CA_KEY_FILE \
    -set_serial 01 \
    -out $SERVER_CERT_PEM_FILE