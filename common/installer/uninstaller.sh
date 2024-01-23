###############
# UNINSTALLER # 
###############

#
# Description: 
#   Uninstalls notipp and its components.
# 
source ./utils/preload.sh

# display script header
display_header "### Uninstalling... ###\n" 

# remove node modules folder
emphasize "> Removing node_modules folder...\n" 
rm -rf node_modules/ 

# clear dist/* folder
emphasize "> Removing node_modules folder...\n" 
rm -rf dist/*

# clear hdt info directory 
emphasize "> Clearing hdt/info directory...\n"
rm -rf hdt/info/* 
touch hdt/info/.gitignore

# remove ca certificates
emphasize "> Removing CA certificate related files...\n" 

rm -rf common/ca/*
touch common/ca/.gitignore

# remove server-ssl certificates
emphasize "> Removing CA certificate related files...\n" 
rm -rf hdt/data/certificate/*
touch hdt/data/certificate/.gitignore

# remove system services
emphasize "> Removing system services...\n" 
sudo rm -rf /etc/systemd/system/notipp-client.service
sudo rm -rf /etc/systemd/system/notipp-server.service
sudo systemctl daemon-reload 

# set uninstalled status
echo "UNINSTALLED" > ./common/installer/.install-status

echo "> Done."