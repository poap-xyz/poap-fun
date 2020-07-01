# 🎉 POAP.fun 🎉

<div align="center">
  <img src="https://img.shields.io/github/issues/poap/poap-fun?style=for-the-badge">
  <img src="https://img.shields.io/github/issues-pr/poap/poap-fun?style=for-the-badge">
  <a href="https://t.me/poapxyz">
    <img src="https://img.shields.io/badge/Telegram-POAP-blue?style=for-the-badge&logo=telegram&message=Telegram&color=blue" alt="Chat on Telegram">
  </a>
</div>

## Intro
Add project description

## Features
Add project features

## Deployment
### Prerequisites
To deploy the project you need both docker and docker compose. Please refer to their respective documentations regarding how to install them.
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
