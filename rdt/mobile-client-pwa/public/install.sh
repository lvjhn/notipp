

sudo echo -n ""
set -e 

if [ ! -d "$HOME/.notipp" ] ; then 
    mkdir "$HOME/.notipp"
fi

cd ~/.notipp

echo "@ Removing previous installation..."
if [ -d "$HOME/.notipp" ] && [ -f "uninstall.sh" ]; then 
    source uninstall.sh 
fi

rm -rf *


# install nvm
echo "@ Installing NVM..."
curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
bash install_nvm.sh
export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
source ~/.bashrc

# install yarn 
echo "@ Installing yarn..."
npm install -g yarn 

# install git
echo "@ Installing git..." 
if [ "$(which apt)" != "" ] ; then 
    sudo apt install git 
else 
    sudo dnf install git
fi 

# cloning project repository 
echo "@ Cloning project repository..."
PWD="$(pwd)"
rm -rf "$PWD" 
mkdir "$PWD"
cd $PWD
git clone https://github.com/lvjhn/notipp $PWD

# run install script
echo "@ Running install script..." 
source uninstall.sh
source install.sh 
source common/helpers/shell/shell-helpers.sh

echo 
echo

display_header "### CHECKING COMPONENTS ###\n"

# check if okay 
if [ "$(sudo systemctl is-enabled notipp-server)" == "enabled" ] ; then 
    c_echo BOLD GREEN "-> Notipp-Server system service is okay\n"
else 
    c_echo BOLD RED "-> Notipp-Server system service is NOT okay.\n"
fi 

if [ "$(sudo systemctl is-enabled notipp-client)" == "enabled" ] ; then 
    c_echo BOLD GREEN "-> Notipp-Client system service is okay\n"
else 
    c_echo BOLD RED "-> Notipp-Client system service is NOT okay.\n"
fi 

if [ "$(which notipp-server)" != "" ] ; then 
    c_echo BOLD GREEN "-> Notipp-Server command is okay\n"
else 
    c_echo BOLD RED "-> Cannot find notipp-server command.\n"
fi  

if [ "$(which notipp-client)" != "" ] ; then 
    c_echo BOLD GREEN "-> Notipp-Client command is okay\n"
else 
    c_echo BOLD RED "-> Cannot find notipp-client command.\n"
fi  


if [ "$(notipp-server is:up)" == "YES" ] ; then 
    c_echo BOLD GREEN "-> Notipp-Server is up\n"
else 
    c_echo BOLD RED "-> Notipp-Server is down.\n"
fi  

