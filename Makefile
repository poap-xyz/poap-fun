WEB=`docker-compose ps | grep gunicorn | cut -d\  -f 1 | head -n 1`
WEBS=`docker-compose ps | grep gunicorn | cut -d\  -f 1 `
COMPOSE_ENV=override
BACKUPS_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/backups/)
ENV_STAGE = ``

#########
#ACTIONS#
#########

build:
	docker-compose -f docker-compose.yml -f docker-compose.$(COMPOSE_ENV).yml build

up:
	docker-compose -f docker-compose.yml -f docker-compose.$(COMPOSE_ENV).yml up -d

start:
	docker-compose -f docker-compose.yml -f docker-compose.$(COMPOSE_ENV).yml start

stop:
	docker-compose -f docker-compose.yml -f docker-compose.$(COMPOSE_ENV).yml stop

ps:
	docker-compose -f docker-compose.yml -f docker-compose.$(COMPOSE_ENV).yml ps
	@echo "---------------------------"
	@echo "Web:     `ps aux | grep /usr/local/bin/gunicorn | grep -v grep | wc -l` threads running"

clean: stop
	docker-compose rm -f

restart: clean build up ps
	@echo "Restarted all containers"

########
#SHELLS#
########

shell-nginx:
	docker exec -ti poap-fun-nginx bash

shell-web:
	docker exec -ti $(WEB) bash

######
#LOGS#
######

log-nginx:
	docker-compose logs nginx

log-web:
	docker-compose logs web

log-web-live:
	docker logs --tail 50 --follow --timestamps $(WEB)

#######
#Tests#
#######

pdb:
	@echo "PDB (Exit: CONTROL + P + CONTROL + Q)"
	docker attach $(WEB)

pylint:
	@echo "Running Pylint"
	docker exec $(WEB) /bin/sh -c "pylint *"

py-tests:
	@echo "Running python tests"
	docker exec $(WEB) /bin/sh -c "coverage run --source='.' manage.py test"

test-all:
	@echo "Running all tests"
	@echo "Running all tests in backend"
	docker exec $(WEB) /bin/sh -c "coverage run --source='.' manage.py test"
	docker exec $(WEB) /bin/sh -c "pylint *"
	docker exec $(WEB) /bin/sh -c "coverage report -m"

coverage:
	docker exec $(WEB) /bin/sh -c "coverage report -m"



############
#DJANGO OPS#
############

collectstatic:
	@echo $(shell for container in $(WEBS); do\
		docker exec $$container /bin/sh -c "python manage.py collectstatic --noinput" ;\
	done)

migrate:
	docker exec $(WEB) /bin/sh -c "python manage.py migrate"

makemigrations:
	docker exec $(WEB) /bin/sh -c "python manage.py makemigrations"

clear-cache:
	docker exec $(WEB) /bin/sh -c "python manage.py invalidate all"

set-django: collectstatic migrate clear-cache
	@echo "Django environment setup complete."

#########
#BACKUPS#
#########


azure-backup:
	docker exec $(WEB) /bin/sh -c "python manage.py azure_backup_process"

daily-backup-process: azure-backup

############
#DEPLOYMENT#
############

clean-nginx-conf:
	rm -f nginx/sites-enabled/nginx.conf

deploy:clean-nginx-conf
	make clean build up set-django

build-frontend:
	yarn --cwd ./frontend install
	yarn --cwd ./frontend build

