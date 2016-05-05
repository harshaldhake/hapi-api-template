#!/bin/bash
app_name_pattern=^[0-9a-z][0-9a-z\-]*$
number_pattern=^[0-9]+$
protocol_pattern=\/\/
ssh_pattern=^.*@.*\..*:.*$

# Check for git
git --version > /dev/null 2>&1
GIT_INSTALLED=$?

[[ $GIT_INSTALLED -ne 0 ]] && { echo "Install git before executing this script."; exit 0; }

test_init=false
while getopts ":t" opt; do
    case $opt in
        \?) echo "Invalid option: -$OPTARG" >&2; exit 1;;
    esac
done

# Get input for Git
repo_url=""
while [[ ! $repo_url =~ $ssh_pattern ]]; do
    if [[ $repo_url != "" ]]; then
        echo "Invalid Git SSH URL"
    fi
    read -p "Enter Project Git SSH URL: " repo_url
done

cookbooks_repo_url=""
while [[ ! $cookbooks_repo_url =~ $ssh_pattern ]]; do
    if [[ $cookbooks_repo_url != "" ]]; then
        echo "Invalid Git SSH URL"
    fi
    read -p "Enter Cookbooks Git SSH URL: " cookbooks_repo_url
done

# Get input for Vagrantfile
app_name=""
while [[ ! $app_name =~ $app_name_pattern ]]; do
	if [[ $app_name != "" ]]; then
        echo "Invalid App Name. Use lowercase alpha and numeric characters and hyphens."
    fi
    read -p "Enter App Name: " app_name
done

dev_ip_block=""
while [[ ! $dev_ip_block =~ $number_pattern ]] || (($dev_ip_block < 1)) || (($dev_ip_block > 254)); do
    read -p "Enter Dev IP Block [1-254]: " dev_ip_block
done

# Confirm settings are correct
echo -e "\n"
echo -e "Project Git URL\t\t$repo_url"
echo -e "Cookbooks Git URL\t$cookbooks_repo_url"
echo -e "App Name\t\t$app_name"
echo -e "Dev IP Block\t\t$dev_ip_block"
echo -e "\n"

read -p "Are these settings correct? " confirm
if [[ $confirm =~ ^[yY] ]]; then

    # Intialize new git repo
    set -e
    rm -rf .git
    git init

    git remote add origin $repo_url

    echo "Updating cookbooks submodule"
    git submodule add $cookbooks_repo_url api/cookbooks 2>&1 >/dev/null
    git submodule update --init --recursive 2>&1 >/dev/null

    echo "Updating Vagrantfile"
	sed -i "" s/app-name/$app_name/g Vagrantfile
	sed -i "" s/192.168.50.111/192.168.50.${dev_ip_block}/g Vagrantfile
	rm initialize.sh

else
    echo "Initialization cancelled"
fi
