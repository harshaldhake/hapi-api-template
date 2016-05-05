name "vagrant"

override_attributes(
    "server" => {
        "user"           => "vagrant",
        "sudoer"         => "vagrant",
        "webroot"        => "/vagrant/public",
        "docroot"        => "/vagrant",
        "stack"          => "node",       #'php' or 'node' (used to load nginx config)
        "index"          => "server.js", #entry point for node app
        "app_port"       => 9000,        #port for node app
        "supervisor_path"   => "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games" #path for supervisor to use
    },
    "nodejs" => {
        "version"  => "6",
        "registry" => "http://192.168.2.228:4873"
    },
    "psql_dbserver" => {
        "dbname" => "database_vm" #psql_dbserver[dbname] is for postgres database name. default is database_vm
    },
    "postgres" => {
        "password" => "postgres"
    },
    "kue" => {
        "ui_server" => "kue.js",
        "processor" => "node src/bin/workers/process-queue.js"
    },
    "apt_packages" => [
        "vim",
        "screen"
    ],
    "simple_commands" => [
        "./src/bin/reindex.js",
    ],
)

run_list(
    # apt-update should always be left on as other recipes may install packages
    "recipe[server_deploy::apt-update]",
    "recipe[server_deploy::supervisor]",    #installs supervisor
    "recipe[server_deploy::postgres]",      #installs postgres
    "recipe[synapse::psql_dbserver]",       #creates postgres database
    "recipe[server_deploy::nginx]",         #installs nginx
    "recipe[server_deploy::nodejs]",
    "recipe[app_deploy::npm_install]",
    "recipe[server_deploy::node-start]",    #starts node using supervisor
    "recipe[synapse::webserver]",
    "recipe[synapse::apt_packages]",
    "recipe[synapse::knex_migrations]",     #runs knex migrations (node app)
    "recipe[synapse::kue]"                 #starts kue processors and runs kue UI
)
