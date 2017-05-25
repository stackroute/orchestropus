# Instructions for Dev Environment Setup

## Install Ansible
```
$ sudo apt-get install ansible
```

## Provision Dependencies
```
$ ansible-galaxy install -r roles.yml -p roles
$ ansible-playbook -K dev-dependencies.yml
```
