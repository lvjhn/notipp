#################
# SHELL HELPERS #
#################

#
# Description: 
#   A small collection of utility functions for bash scripts.
# 

HEADER_COLOR=CYAN

FILENAME=$0 

function c_echo {
    BLACK=30
    RED=31
    GREEN=32	
    YELLOW=33	
    BLUE=34	
    MAGENTA=35	
    CYAN=36	
    LIGHT_GRAY=37	
    GRAY=90	
    LIGHT_RED=91	
    LIGHT_GREEN=92	
    LIGHT_YELLOW=93	
    LIGHT_BLUE=94	
    LIGHT_MAGENTA=95	
    LIGHT_CYAN=96	
    WHITE=97	
    
    RESET=0
    BOLD=1
    FAINT=2
    ITALIC=3
    UNDERLINE=4

    echo -e -n "\033[${!1};${!2}m$3\033[0m"
}

function emphasize {
    c_echo BOLD WHITE "$1"
}

function display_header {
    c_echo BOLD $HEADER_COLOR "$1"
}

function print_program_header {
    echo "| " 
    c_echo BOLD GREEN "$1 v$2\n"
    echo -n "| "
    c_echo ITALIC GRAY "$FILENAME $ARGUMENTS\n"
}

function identify_os {
    if [ "$(which apt)" != "" ] ; then 
        echo "ubuntu"
    elif [ "$(which apt)" != "" ] ; then 
        echo "fedora"
    else        
        echo "Unknown OS type, cannot identify package manager..."
        exit 
    fi 
}

# source: https://stackoverflow.com/a/20460402
function string_contains  { 
    case $2 in *$1* ) return 1;; *) return 0;; esac ;
}
