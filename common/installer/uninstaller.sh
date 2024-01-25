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
rm -rf rft/mobile-client-pwa/node_modules

# back up dists/ folder 
emphasize "> Backing up dists folder..." 
BACKUP_FOLDER="backup/$(date '+%Y-%m-%d %H:%M:%S')"
mkdir "$BACKUP_FOLDER"
cp -r "./dist/" "$BACKUP_FOLDER"

# clear dist/* folder
emphasize "> Removing node_modules folder...\n" 
rm -rf dist/*

# clear dist/* folder
emphasize "> Removing binaries...\n" 
rm -rf "$(yarn global bin)/notipp-server"
rm -rf "$(yarn global bin)/notipp-client"

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

# reset database 
rm -rf /hdt/data/database/notipp.db

# set uninstalled status
echo "UNINSTALLED" > ./common/installer/.install-status

echo "> Done."