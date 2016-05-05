## Developing the template
To work on the template itself:
1. `git submodule add <cookbooks-repo> api/cookbooks`
1. Be sure not to commit .gitmodules or the cookbooks directory
1. `npm install` from `api`
1. `vagrant up` from project root
1. `vagrant ssh`
1. `npm start` from `/vagrant`

## Using the template
1. `./initialize.sh`
1. `git add -A`
1. `git commit -m "Initial commit"`
1. `git push -u origin master`
