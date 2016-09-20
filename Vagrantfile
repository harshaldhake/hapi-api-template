# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = '2'

Vagrant.require_version '>= 1.7.0'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  environment = ENV['APP_ENV'] || 'development'

  # CHANGEME
  app_name = ENV['APP_NAME'] || 'app-name'
  app_subdomain = 'api'

  static_ip = ENV['STATIC_IP'] || '192.168.50.111'
  # See wiki: https://github.com/synapsestudios/wiki/blob/master/developers/setup/using-vagrant.md

  config.vm.box = 'synapsestudios/syn-lmnop'
  # Change to chef/ubuntu-14.04 for building a new base vm

  # END CHANGEME

  config.vm.hostname = app_subdomain + '.' + app_name + '.vm'

  # Set the version of chef to install using the vagrant-omnibus plugin
  # NOTE: You will need to install the vagrant-omnibus plugin:
  #
  #   $ vagrant plugin install vagrant-omnibus
  #
  #if Vagrant.has_plugin?("vagrant-omnibus")
  #  config.omnibus.chef_version = 'latest'
  #end

  if File.file?('../syn-vagrant-' + app_name + '.sh')
    config.vm.provision 'shell', path: '../syn-vagrant-' + app_name + '.sh', args: "#{environment} #{app_name}"
  end

  config.vm.provision 'shell', path: './api/syn-vagrant.sh', args: "#{environment} #{app_name}"

  if environment == 'qa'
    # Sync the project directory to /vagrant on the VM
    config.vm.synced_folder "./api", "/vagrant", type: "rsync", rsync__exclude: ".git/"
    config.vm.synced_folder "./shared", "/shared", type: "rsync", rsync__exclude: ".git/"
    # Switch to following or copy following line to Vagrantfile.local in project directory to use virtualbox' folder sharing
    # config.vm.synced_folder '.', '/vagrant', owner: 'www-data', group: 'www-data', mount_options: ['dmode=777','fmode=777']

    # QA environment uses DHCP on the host-only network adapter
    config.vm.network 'private_network', ip: static_ip

    # Need this to enable DNS host resolution through NAT so our VM can access
    # the internet
    config.vm.provider 'virtualbox' do |vb|
      vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on', '--memory', '1024']
    end

    config.vm.provision 'chef_solo' do |chef|
      chef.roles_path     = './api/roles'
      chef.cookbooks_path = './api/cookbooks'
      base_domain = ENV['BASE_DOMAIN'] || 'synsit.es'
      chef.add_role 'qa'

      chef.json = {
        'lively' => {
          'server_name'    => 'lively.' + app_name + '.' + base_domain,
          'server_aliases' => []
        },
        'web_app' => {
          'server_name' => app_name + '.' + base_domain,
          'server_port' => 80,
          'APP_ENV'     => 'qa',
          'APP_NAME'    => app_name
        }
      }
    end
  else
    # NFS file share
    config.vm.synced_folder "./api", "/vagrant", type: "nfs", mount_options: ["acregmax=5"]
    config.vm.synced_folder "./shared", "/shared", type: "nfs", mount_options: ["acregmax=5"]
    config.vm.network 'private_network', ip: static_ip

    config.hostmanager.include_offline = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.manage_host = true
    config.hostmanager.aliases = [
      app_subdomain + '.' + app_name + '.vm',
      'xhgui.'  + app_name + '.vm',
      'lively.' + app_name + '.vm',
    ]

    config.vm.provider 'virtualbox' do |vb|
      vb.customize ['modifyvm', :id, '--natdnshostresolver1', 'on', '--memory', '2048']
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end

    config.vm.provision 'chef_solo' do |chef|
      chef.roles_path     = './api/roles'
      chef.cookbooks_path = ['./api/cookbooks']
      chef.add_role 'development'

      chef.json = {
        'lively' => {
          'server_name'    => 'lively.' + app_name + '.vm'
        },
        'web_app' => {
          'server_name' => app_subdomain + '.' + app_name + '.vm',
          'server_port' => 80,
          'APP_ENV'     => 'development',
          'APP_NAME'    => app_name
        }
      }
    end
  end

  if File.exists?('Vagrantfile.local')
    external = File.read 'Vagrantfile.local'
    eval external
  end
end
