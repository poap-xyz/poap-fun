WEB=`docker-compose ps | grep gunicorn | cut -d\  -f 1 | head -n 1`
NODE=poap-fun-node
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

reboot-db:
	docker exec poap-fun-postgres /bin/sh -c "dropdb -U postgres postgres"
	docker exec poap-fun-postgres /bin/sh -c "createdb -U postgres postgres"

########
#SHELLS#
########

shell-nginx:
	docker exec -ti poap-fun-nginx bash

shell-web:
	docker exec -ti $(WEB) bash

shell-db:
	docker exec -ti poap-fun-postgres bash

shell-node:
	docker exec -ti $(NODE) bash

shell-celeryw:
	docker exec -ti poap-fun-celeryworker bash

shell-celeryb:
	docker exec -ti poap-fun-celerybeat bash

######
#LOGS#
######

log-nginx:
	docker-compose logs nginx

log-web:
	docker-compose logs web

log-web-live:
	docker logs --tail 50 --follow --timestamps $(WEB)

log-node:
	docker-compose logs node

log-node-live:
	docker logs --tail 50 --follow --timestamps $(NODE)

log-db:
	docker-compose logs db

log-celeryw:
	docker-compose logs celeryworker

log-celeryb:
	docker-compose logs celerybeat

log-celeryw-live:
	docker-compose logs --tail 50 --follow --timestamps celeryworker

log-celeryb-live:
	docker-compose logs --tail 50 --follow --timestamps celerybeat

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
	@echo "Running all tests in frontend"
	docker exec $(NODE) /bin/sh -c "./node_modules/.bin/eslint ."

eslint:
	@echo "Running eslint"
	docker exec $(NODE) /bin/sh -c "./node_modules/.bin/eslint ."

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

compilemessages:
	@echo $(shell for container in $(WEBS); do\
		docker exec $$container /bin/sh -c "python manage.py compilemessages" ;\
	done)

set-django: collectstatic migrate compilemessages
	@echo "Django environment setup complete."

#########
#BACKUPS#
#########

backup-db:
	if [ ! -d $(BACKUPS_DIR) ] ; then mkdir $(BACKUPS_DIR) ; fi
	$(eval DUMP_NAME = $(BACKUPS_DIR)/`date +%Y%m%d`$(ENV_STAGE)_db_dump_.gz)
	docker exec -t poap-fun-postgres pg_dumpall -c -U postgres | gzip > $(DUMP_NAME)

azure-backup:
	docker exec $(WEB) /bin/sh -c "python manage.py azure_backup_process"

clean-backups:
	find $(BACKUPS_DIR)/*.gz -mtime +2 -type f -delete

daily-backup-process: backup-db azure-backup clean-backups

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

