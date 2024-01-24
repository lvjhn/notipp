##############################
# generate-ca-certificate.sh #
##############################

#
# Description: 
#   Generates/regenerates CA certificate for the sytem.
# 

# extract arguments
USERNAME=$1

# build output paths 
CA_DIST_FILENAME="$USERNAME.notipp"
CA_KEY_FILE="./common/ca/hdt-ca.key"
CA_CERT_FILE="./common/ca/hdt-ca.pem"
CA_CONF_FILE="./common/utils/templates/ca.openssl.conf"


echo -e "|\t> Generating CA's private key..."
openssl genrsa -out $CA_KEY_FILE  4096

echo -e "|\t> Generating root certificate..."

{
    echo "PH";
    echo "Camarines Sur"; 
    echo "Naga";
    echo "Notipp-CA";
    echo "$USERNAME";
    echo "$USERNAME.notipp";
    echo "notipp@gmail.com";
} | openssl req -new -x509 \
    -key $CA_KEY_FILE \
    -out $CA_CERT_FILE \
    -days 3650 \
    -set_serial 0 \
    -config $CA_CONF_FILE

echo "" 

echo -e "|\t> Copying root certificate to dists/ folder..."
cp $CA_CERT_FILE dist/$CA_DIST_FILENAME.pem