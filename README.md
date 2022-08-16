# 🎉 POAP.fun 🎉

<div align="center">
  <img src="https://img.shields.io/github/issues/poap-xyz/poap-fun?style=for-the-badge">
  <img src="https://img.shields.io/github/issues-pr/poap-xyz/poap-fun?style=for-the-badge">
  <a href="https://t.me/poapxyz">
    <img src="https://img.shields.io/badge/Telegram-POAP-blue?style=for-the-badge&logo=telegram&message=Telegram&color=blue" alt="Chat on Telegram">
  </a>
</div>

## Intro
Poap Fun is a raffle Web App supported by the Proof of Attendance Protocol (POAP)

## Features
Add project features

## Container Architecture
The project is built with docker containers, maintaining different parts of the application independent of eachother. In the following sections each container will be briefely described. If your are looking to run the containers please see the deployment section.
### Nginx
Provides a simple web proxy to distinguish subdomains and route to appropriate servers.
### Web
Django application running the API
### Node
Contains Node app serving the React frontend.
### postgres
Contains the database which backs the Django application
### redis
Used as a message broker for celery queues
### celeryworker
Runs the celery tasks dispatched from the Django application
### celerybeat
Runs the beat schedule configured by the Django application

## Deployment
### Prerequisites
To deploy the project you need both docker and docker compose. Please refer to their respective documentations regarding how to install them.

Also, for testing and production server, make sure `node` 12.x and `yarn` are installed.

```sh
# Using Ubuntu to update node
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

### Deploying the app
The project comes with a convenience makefile that will help you get up and running quickly.

Some Make commands will optionally accept a `COMPOSE_ENV` argument to specify which yml to run. For example to build the app we run:

`make build COMPOSE_ENV=env_name`

where `env_name` is one of the following: 
- `override` for local development
- `testing` for testing environment
- `production` for production environment

by default `COMPOSE_ENV` is set to override so for local development you can just run `make build`

This holds true for
- `make build`
- `make up`
- `make stop`
- `make start`
- `make ps`

Now, to deploy the app, simply build it with `make build` and run the containers with `make up`


## Development
### Installation
### Developing

### License

MIT © **[`POAP`](https://poap.xyz)**
