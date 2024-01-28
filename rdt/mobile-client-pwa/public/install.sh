

sudo echo -n ""

set -e 

echo "@ Removing previous installation..."
if [ -d "~/.notipp" ] ; then 
    cd ~/.notipp 
    bash uninstall.sh 
    cd -
fi

rm -rf ~/.notipp

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
git clone https://github.com/lvjhn/notipp ~/.notipp 
cd ~/.notipp

# run install script
echo "@ Running install script..." 
bash uninstall.sh
bash install.sh 
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

