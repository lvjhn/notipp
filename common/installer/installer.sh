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
    sudo echo -n ""
}

# --- INSTALLATION STEPS --- #
function install {
    # check if already installed 
    check_if_already_installed

    # identify OS 
    determine_os

    # cache hostname 
    cache_hostname

    # get username from user 
    get_username_from_user

    # install node modules 
    install_node_modules 

    # self-link package 
    self_link_package

    # install binaries
    install_binaries

    # install os dependencies 
    install_os_dependencies 

    # generate server id and server secret
    generate_server_id_and_secret

    # create ca certificate 
    create_ca_certificate

    # create server-ssl certificate
    create_server_and_client_ssl_certificate

    # create system service for client 
    create_client_system_service

    # create system service for server
    create_server_system_service

    # create empty database 
    create_empty_database
    
    # generate pairing secret
    generate_pairing_secret

    # install components' node modules folder 
    install_node_modules_folders

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

function cache_hostname {
    display_header "| @ Caching hostname...\n" 

    # cache hostname 
    echo $(hostname) > ./hdt/info/hostname 
    
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
        source ./common/installer/uninstaller.sh 
        echo ""
    
    elif [ "$INSTALL_STATUS" == "INSTALLED" ] ; then
        echo -e "|\t> Already installed. Please manually uninstall before installing again."
        exit
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
    display_header "| @ Installing node modules...\n"
    echo "|"
    yarn 
    echo "|"
}

function self_link_package {
    display_header "| @ Self-linking package..." 
    yarn link 
    yarn link notipp 
    echo "|"
}

function install_binaries {
    display_header "| @ Installing binaries...\n" 
    source ~/.bashrc 
    
    echo -e "|\t> Unlinking previous binaries, if any..."
    if [ -L "$(yarn global bin)/notipp-server" ] ; then 
        unlink "$(yarn global bin)/notipp-server"
        rm -rf "$(yarn global bin)/notipp-server"
    fi 
    if [ -L "$(yarn global bin)/notipp-client" ] ; then 
        unlink "$(yarn global bin)/notipp-client"
        rm -rf "$(yarn global bin)/notipp-client"
    fi

    echo -e "|\t> Making executables..."
    chmod +x hdt/cli/index.js 
    chmod +x rdt/pc-client-cli/index.js
    
    echo -e "|\t> Linking binaries to yarn's binaries..."
    ln -s "$(pwd)/hdt/cli/index.js" "$(yarn global bin)/notipp-server"
    ln -s "$(pwd)/rdt/pc-client-cli/index.js" "$(yarn global bin)/notipp-client"

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

        emphasize "| > Installing 'redis'...\n"
        sudo apt install redis

    elif [ $OS == "fedora" ] ; then 
        emphasize "| > Installing 'openssl'...\n"
        sudo dnf install openssl

        emphasize "| > Installing 'net-tools'...\n"
        sudo dnf install net-tools
        
        emphasize "| > Installing 'libnotify-bin'...\n"
        sudo dnf install libnotify-bin
        
        emphasize "| > Installing 'imagemagick'...\n"
        sudo dnf install imagemagick

        emphasize "| > Installing 'redis'...\n"
        sudo dnf install redis
    fi  
    echo "|"
}

function create_ca_certificate {
    display_header "| @ Creating CA certificate...\n" 

    source \
        $(pwd)/common/utils/generators/generate-ca-certificate.sh \
        $USERNAME

    echo -e -n "\n"
    echo "|"
}

function create_server_and_client_ssl_certificate {
    display_header "| @ Creating server and client SSL certificate...\n" 

    source \
        $(pwd)/common/utils/generators/generate-server-and-client-ssl-certificate.sh \
    
    echo -e -n "\n"
    echo "|"
}

function create_client_system_service {
    display_header "| @ Creating system service for notipp-client...\n" 

    echo -e "|\t> Creating service file..." 
    node $NOTIPP_PATH/common/utils/generators/client-service.js 
    sudo cp $NOTIPP_PATH/utils/temp/notipp-client.service /etc/systemd/system 

    echo -e "|\t> Reloading systemd..." 
    sudo systemctl daemon-reload
    sudo systemctl start notipp-client

    rm -rf .temp

    echo "|"
}

function generate_server_id_and_secret {
    display_header "| @ Generating server id and secret...\n" 

    echo -e "|\t> Generating server id..." 
    echo $(node $NOTIPP_PATH/common/utils/generators/uuid.js) > ./hdt/info/server-id

    echo -e "|\t> Generating server secret..." 
    echo $(node $NOTIPP_PATH/common/utils/generators/secret-key.js) > ./hdt/info/server-secret

    echo "|"
}

function create_server_system_service {
    display_header "| @ Creating system service for notipp-server...\n" 
    
    echo -e "|\t> Creating service file..." 
    node $NOTIPP_PATH/common/utils/generators/server-service.js 
    sudo cp $NOTIPP_PATH/utils/temp/notipp-server.service /etc/systemd/system 

    echo -e "|\t> Reloading systemd..." 
    sudo systemctl daemon-reload
    sudo systemctl start notipp-client

    rm -rf .temp

    echo "|"
}   

function create_empty_database {
    display_header "| @ Creating empty database...\n" 
    touch hdt/data/database/notipp.db
    node utils/database/create-database.js
    echo "|"
}

function generate_pairing_secret {
    display_header "| @ Generating pairing secret...\n" 
    node common/utils/generators/generate-pairing-secret.js
    echo "|"
}

function install_node_modules_folders {
    display_header "| @ Installing node_modules/ folder of components...\n" 

    echo -e "|\t> Installing for Mobile-Client-PWA..." 
    cd rdt/mobile-client-pwa
    yarn 
    cd ../../

    echo "|"
}

function finish_installation {
    echo "INSTALLED" > ./common/installer/.install-status
}

# --- CALL MAIN --- # 
main $@


