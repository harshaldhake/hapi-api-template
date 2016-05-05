#!/bin/bash
declare -A env
##########     CONFIGURABLE VALUES ##########
env[APP_NAME]="app-name"
env[DB_NAME]="database_vm"
env[DB_USER]="postgres"
env[DB_PASS]="postgres"
env[DB_HOST]="localhost"
env[DB_PORT]="5432"
env[APP_ENV]="$1"
env[NODE_ENV]="$1"
env[JWT_SECRET]="JyE1cOzhqKFD6P4dV5W9NXULSO7J80m5adFZIINDWmXYActbJEknxWlMM9nadJ9"

########## DO NOT EDIT BELOW THIS LINE ##########
# appends a directive to /etc/environment param1 is the variable name, param2 is its value
function add_to_etc_env {
    echo "$1=$2" >> /etc/environment
}
# edits an existing directive in /etc/environment param1 is the variable name, param2 is its value
function remove_from_etc_env {
    sed -i -e "/^$1=.*/d" /etc/environment
}

function add_to_profile {
    echo "export $1=$2" >> ~/.profile
    echo "export $1=$2" >> /home/vagrant/.profile
}

# edits an existing directive in /etc/environment param1 is the variable name, param2 is its value
function remove_from_profile {
    sed -i -e "/^export $1=.*/d" ~/.profile
    sed -i -e "/^export $1=.*/d" /home/vagrant/.profile
}

for i in "${!env[@]}"
do

    grep -i $i /etc/environment

    # if exit code is 0, then no match was found
    if [ $? -ne 0 ]; then
        add_to_etc_env $i ${env[$i]}
    else
        remove_from_etc_env $i ${env[$i]}
        add_to_etc_env $i ${env[$i]}
    fi

    grep -i $i ~/.profile

    # if exit code is 0, then no match was found
    if [ $? -ne 0 ]; then
        add_to_profile $i ${env[$i]}
    else
        remove_from_profile $i ${env[$i]}
        add_to_profile $i ${env[$i]}
    fi
done
