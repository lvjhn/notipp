

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
nvm install --lts
nvm use --lts

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

source ~/.bashrc

echo 
echo


