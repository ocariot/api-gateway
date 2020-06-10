#!/usr/bin/env bash

# Define where to store the generated certs and metadata.
DIR=".certs"

# load environment variables from the .env file
source .env

# Checks whether the API_IOT_HOSTNAME environment variable has been set
if [ -z "$API_GATEWAY_HOSTNAME" ]; then echo 'The environment variable "API_GATEWAY_HOSTNAME" is required in the .env file!'; exit
elif [ -z "$API_IOT_HOSTNAME" ]; then echo 'The environment variable "API_IOT_HOSTNAME" is required in the .env file!'; exit
elif [ -z "$RABBIT_MGT_HOSTNAME" ]; then echo 'The environment variable "RABBIT_MGT_HOSTNAME" is required in the .env file!'; exit
fi

# Optional: Ensure the target directory exists and is empty.
rm -rf "${DIR}"
mkdir -p "${DIR}"

# Create the openssl configuration file. This is used for both generating
# the certificate as well as for specifying the extensions. It aims in favor
# of automation, so the DN is encoding and not prompted.
cat > "${DIR}/template_openssl.cnf" << EOF
[req]
default_bits = 2048
encrypt_key  = no # Change to encrypt the private key using des3 or similar
default_md   = sha256
prompt       = no
utf8         = yes

# Speify the DN here so we aren't prompted (along with prompt = no above).
distinguished_name = req_distinguished_name

# Extensions for SAN IP and SAN DNS
req_extensions = v3_req

# Be sure to update the subject to match your organization.
[req_distinguished_name]
C  = UE
ST = Bruxelas
L  = OCARIoT
O  = OCARIoT
CN = "$API_GATEWAY_HOSTNAME"

# Allow client and server auth. You may want to only allow server auth.
# Link to SAN names.
[v3_req]
basicConstraints     = CA:FALSE
subjectKeyIdentifier = hash
keyUsage             = digitalSignature, keyEncipherment
extendedKeyUsage     = clientAuth, serverAuth
subjectAltName       = @alt_names

# Alternative names are specified as IP.# and DNS.# for IP addresses and
# DNS accordingly.
[alt_names]
IP.1  = 127.0.0.1
DNS.2 = "$API_IOT_HOSTNAME"
DNS.3 = "$RABBIT_MGT_HOSTNAME"
EOF

# Create the certificate authority (CA). This will be a self-signed CA, and this
# command generates both the private key and the certificate. You may want to
# adjust the number of bits (4096 is a bit more secure, but not supported in all
# places at the time of this publication).
#
# To put a password on the key, remove the -nodes option.
#
# Be sure to update the subject to match your organization.
openssl req \
  -new \
  -newkey rsa:2048 \
  -days 3600 \
  -nodes \
  -x509 \
  -subj "/C=UE/ST=UE/L=UE/O=OCARIoT CA/CN=ocariot.com" \
  -keyout "${DIR}/ca.key" \
  -out "${DIR}/ca.crt"
# For each server/service you want to secure with your CA, repeat the
# following steps:

generate_certificates()
{
        cat ${DIR}/template_openssl.cnf > ${DIR}/openssl.cnf

        # Generate the private key for the service. Again, you may want to increase
        # the bits to 4096.
        openssl genrsa -out "$1/$2.key" 2048

        # Generate a CSR using the configuration and the key just generated. We will
        # give this CSR to our CA to sign.
        openssl req \
          -new -key "$1/$2.key" \
          -out "$1/$2.csr" \
          -config "${DIR}/openssl.cnf"

        # Sign the CSR with our CA. This will generate a new certificate that is signed
        # by our CA.
        openssl x509 \
          -req \
          -days 365 \
          -in "$1/$2.csr" \
          -CA "${DIR}/ca.crt" \
          -CAkey "${DIR}/ca.key" \
          -CAcreateserial \
          -extensions v3_req \
          -extfile "${DIR}/openssl.cnf" \
          -out "$1/$2.crt"

        # (Optional) Verify the certificate.
        # openssl x509 -in "$1/$2.crt" -noout -text
}

generate_certificates ${DIR} "iot_client"

generate_certificates ${DIR} "iot_server"

generate_certificates  ${DIR} "server"

# (Optional) Remove unused files at the moment
rm -rf "${DIR}/ca.key" ${DIR}/*.srl ${DIR}/*.csr ${DIR}/*.cnf
