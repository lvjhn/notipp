######################################
# generate-server-ssl-certificate.sh #
###################################### 

#
# Description: 
#   Generate SSL certificate for the server.
# 


# build certificate
NOTIPP_PATH=$(notipp-server base-path)

cd $NOTIPP_PATH

CA_KEY_FILE="./common/ca/hdt-ca.key"
CA_CERT_FILE="./common/ca/hdt-ca.pem"

SERVER_CERT_KEY_FILE="./hdt/data/certificate/server-ssl.key"
SERVER_CERT_PEM_FILE="./hdt/data/certificate/server-ssl.pem"
SERVER_CERT_CSR_FILE="./hdt/data/certificate/server-ssl.csr"
SERVER_CERT_PASSWORD_FILE="./hdt/data/certificate/server-ssl.pw"
SERVER_CERT_CONF_FILE="./common/utils/templates/server-ssl.openssl.conf"


echo -e "|\t> Removing previous files, if any..." 
if [ -f $SERVER_CERT_KEY_FILE ] ; then 
    rm -rf $SERVER_CERT_KEY_FILE
fi 

if [ -f $SERVER_CERT_PEM_FILE ] ; then 
    rm -rf $SERVER_CERT_PEM_FILE
fi 

if [ -f $SERVER_CERT_CSR_FILE ] ; then 
    rm -rf $SERVER_CERT_CSR_FILE
fi 

if [ -f $SERVER_CERT_PASSWORD_FILE ] ; then 
    rm -rf $SERVER_CERT_PASSWORD_FILE
fi 

echo -e "|\t> Generating server certificate's password..." 
SERVER_CERT_PASSWORD="$(node ./common/utils/generators/strong-password.js)"
echo $SERVER_CERT_PASSWORD > $SERVER_CERT_PASSWORD_FILE

echo -e "|\t> Generate SSL certificate's private .key file..." 
openssl genrsa -out $SERVER_CERT_KEY_FILE 4096

echo -e "|\t> Generate SSL certificate's .csr file..." 
{ 
    echo "PH";
    echo "Camarines Sur";
    echo "Naga"; 
    echo "Notipp-Server";
    echo "Notipp-Server::$(cat ./hdt/info/server-id)";
    echo "Notipp";
    echo "notipp@gmail.com";
    echo "$SERVER_CERT_PASSWORD";
    echo "Notipp";
} | openssl req -new -nodes \
    -key $SERVER_CERT_KEY_FILE \
    -out $SERVER_CERT_CSR_FILE 
   
echo -e "|\t> Generate child certificate and sign with RootCA..." 
SANS=$(node ./common/utils/generators/sans.js)


openssl x509 -req -days 3650 \
    -in $SERVER_CERT_CSR_FILE \
    -CA $CA_CERT_FILE \
    -CAkey $CA_KEY_FILE \
    -set_serial 01 \
    -out $SERVER_CERT_PEM_FILE \
    -extfile <(printf "subjectAltName=$SANS")
