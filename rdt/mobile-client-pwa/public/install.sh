

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
souce common/helpers/shell/shell-helpers.sh

echo "### CHECKING COMPONENTS ###"

# check if okay 
if [ "$(sudo systemctl is-enabled notipp-server)" == "enabled"] ; then 
    echo "-> Notipp-Server system service is okay"
else 
    c_echo BOLD RED "-> Notipp-Server system service is NOT okay."
fi 

if [ "$(sudo systemctl is-enabled notipp-client)" == "enabled"] ; then 
    echo "-> Notipp-Client system service is okay"
else 
    c_echo BOLD RED "-> Notipp-Client system service is NOT okay."
fi 

if [ "$(which notipp-server)" != ""] ; then 
    echo "-> Notipp-Server command is okay"
else 
    c_echo BOLD RED "-> Cannot find notipp-server command."
fi  

if [ "$(which notipp-client)" != ""] ; then 
    echo "-> Notipp-Client command is okay"
else 
    c_echo BOLD RED "-> Cannot find notipp-client command."
fi  


if [ "$(notipp-server is up)" == "YES"] ; then 
    echo "-> Notipp-Server is Up"
else 
    c_echo BOLD RED "-> Notipp-Server is Down."
fi  

