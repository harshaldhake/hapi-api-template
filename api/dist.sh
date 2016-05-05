if [[ $# -eq 0 ]] ; then
    echo 'Missing APP_ENV parameter'
    exit 0
fi

rm -rf ./dist
mkdir dist
NODE_ENV=$1 npm install
zip -r dist/build-api-$1 ./ -x syn-vagrant.sh shippable.yml .eslintrc *.md *.git* ./.vagrant/**\* ./cookbooks/**\* ./dist/**\* ./test/**\*
