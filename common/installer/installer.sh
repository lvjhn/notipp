#############
# INSTALLER # 
#############

#
# Description: 
#   Installs notipp and its components.
# 

function main {
    # print program header
    print_program_header "| NOTIPP-INSTALLER" "1.0.0"
    echo "|" 

    # main program flow
    elevate_privileges
    install
}

function elevate_privileges {
    sudo echo
}

# --- INSTALLATION STEPS --- #
function install {
    # check if already installed 
    check_if_already_installed

    # identify OS 
    determine_os

    # get username from user 
    get_username_from_user

    # install node modules 
    install_node_modules 

    # self-link package 
    self_link_package

    # self-install package
    self_install_package

    # install os dependencies 
    install_os_dependencies 

    # create ca certificate 
    create_ca_certificate

    # create server-ssl certificate
    create_server_ssl_certificate

    # create system service for client 
    create_client_system_service

    # generate server id and server secret
    generate_server_id_and_secret

    # create system service for server
    create_server_system_service

    # finish installation 
    finish_installation

    c_echo BOLD GREEN "| @ Done.\n"
}

function determine_os {
    display_header "| @ Identifying operating system...\n"

    # identify which operating system is being used
    OS="$(identify_os)"
    echo -e "|\t> OS has been identified as [$OS]."

    # update info:os
    echo $OS > ./hdt/info/os

    echo "|"
}


function check_if_already_installed {   
    display_header "| @ Determining installation status...\n" 

    INSTALL_STATUS="$(cat ./common/installer/.install-status)"
    
    if [ "$INSTALL_STATUS" == "FACTORY" ] || 
       [ "$INSTALL_STATUS" == "UNINSTALLED" ] ; 
    then
        echo -e "|\t> Not yet installed, continuing." 
        echo "INSTALLING" > ./common/installer/.install-status 
    elif [ "$INSTALL_STATUS" == "INSTALLING" ] ; then
        echo -e "|\t> Last install was interrupted, reinstalling."
        echo ""
        bash ./common/installer/uninstaller.sh 
        echo ""
    
    elif [ "$INSTALL_STATUS" == "INSTALLED" ] ; then
        echo -e "|\t> Already installed. Please manually uninstall before installing again."
    
    else    
        echo -e "|\t> Unknown installation status [$INSTALL_STATUS]"

    fi

    echo "|"
}

function get_username_from_user {
    while [ true ] ; do 
        c_echo BOLD WHITE "| @ Please enter username: "
        read USERNAME 

        if [[ "$USERNAME" =~ ^[a-zA-Z0-9]+$ ]]; then
            c_echo NORMAL GREEN "| " 
            c_echo ITALIC GREEN " \t(OK) Valid username detected.\n"
            break
        else 
            c_echo NORMAL WHITE "| "
            c_echo ITALIC RED "\t(!) Username must only contain numbers, letters, and underscores \n"
            get_username_from_user
            continue 
        fi    
    done 
    
    # update info:username
    echo $USERNAME > ./hdt/info/username

    echo "| "
}

function install_node_modules {
    display_header "| @ Installing node modules..."
    yarn
    echo "|"
}

function self_link_package {
    display_header "| @ Self-linking package..." 
    yarn link 
    yarn link notipp 
    echo "|"
}

function self_install_package {
    display_header "| @ Self-install package (globally)..." 
    yarn global add $(pwd) 
    echo "|"
}

function install_os_dependencies {
    display_header "| @ Installing OS dependencies [$OS]...\n" 

    if [ $OS == "ubuntu" ] ; then 
        emphasize "| > Installing 'openssl'...\n"
        sudo apt install openssl

        emphasize "| > Installing 'net-tools'...\n"
        sudo apt install net-tools
        
        emphasize "| > Installing 'libnotify-bin'...\n"
        sudo apt install libnotify-bin
        
        emphasize "| > Installing 'imagemagick'...\n"
        sudo apt install imagemagick

    elif [ $OS == "fedora" ] ; then 
        emphasize "| > Installing 'openssl'...\n"
        sudo dnf install openssl

        emphasize "| > Installing 'net-tools'...\n"
        sudo dnf install net-tools
        
        emphasize "| > Installing 'libnotify-bin'...\n"
        sudo dnf install libnotify-bin
        
        emphasize "| > Installing 'imagemagick'...\n"
        sudo dnf install imagemagick
    fi  
    echo "|"
}

function create_ca_certificate {
    display_header "| @ Creating CA certificate...\n" 

    CA_FILENAME="$USERNAME.notipp"

    CA_KEY_FILE="./common/certificates/host/$CA_FILENAME.key"
    CA_CERT_FILE="./common/certificates/host/$CA_FILENAME.pem"

    CA_CONF_FILE="./common/utils/templates/ca.openssl.conf"


    echo -e "|\t> Generating CA's private key..."
    openssl genrsa -out $CA_KEY_FILE  4096

    echo -e "|\t> Generating root certificate..."
    {
        echo "PH";
        echo "Camarines Sur"; 
        echo "Naga";
        echo "Notipp";
        echo "Notipp";
        echo "Notipp";
        echo "notipp@gmail.com";
    } | openssl req -new -x509 \
        -key $CA_KEY_FILE \
        -out $CA_CERT_FILE \
        -days 3650 \
        -set_serial 0 \
        -config $CA_CONF_FILE

    echo -e -n "\n"
    echo "|"
}

function create_server_ssl_certificate {
    display_header "| @ Creating server's SSL certificate...\n" 

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
        echo "Notipp";
        echo "Notipp";
        echo "Notipp";
        echo "notipp@gmail.com";
        echo "$SERVER_CERT_PASSWORD"
        echo "Notipp";
    } | openssl req -sha256 -new \
        -key $SERVER_CERT_KEY_FILE \
        -out $SERVER_CERT_CSR_FILE \
        -config $SERVER_CERT_CONF_FILE
    
    echo 

    echo -e "|\t> Generate child certificate and sign with RootCA..." 
    openssl x509 -req -days 3650 \
        -in $SERVER_CERT_CSR_FILE \
        -CA $CA_CERT_FILE \
        -CAkey $CA_KEY_FILE \
        -set_serial 01 \
        -out $SERVER_CERT_PEM_FILE

    echo "|"
}

function create_client_system_service {
    display_header "| @ Creating system service for notipp-client...\n" 

    echo -e "|\t> Creating service file..." 
    node ./common/utils/generators/client-service.js 
    sudo cp ./utils/temp/notipp-client.service /etc/systemd/system 

    echo -e "|\t> Reloading systemd..." 
    sudo systemctl daemon-reload
    sudo systemctl start notipp-client

    rm -rf .temp

    echo "|"
}

function generate_server_id_and_secret {
    display_header "| @ Generating server id and secret...\n" 

    echo -e "|\t> Generating server id..." 
    echo $(node ./common/utils/generators/uuid.js) > ./hdt/info/server-id

    echo -e "|\t> Generating server secret..." 
    echo $(node ./common/utils/generators/secret-key.js) > ./hdt/info/server-secret

    echo "|"
}

function create_server_system_service {
    display_header "| @ Creating system service for notipp-server...\n" 
    
    echo -e "|\t> Creating service file..." 
    node ./common/utils/generators/server-service.js 
    sudo cp ./utils/temp/notipp-server.service /etc/systemd/system 

    echo -e "|\t> Reloading systemd..." 
    sudo systemctl daemon-reload
    sudo systemctl start notipp-client

    rm -rf .temp

    echo "|"
}   

function finish_installation {
    echo "INSTALLED" > ./common/installer/.install-status
}

# --- CALL MAIN --- # 
main $@


