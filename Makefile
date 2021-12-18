composeFiles = -f docker-compose-singleton.yaml -f docker-compose-replicated.yaml

up-singleton:
	docker-compose -f docker-compose-singleton.yaml  up -d $(filter-out $@,$(MAKECMDGOALS))

up-replicated:
	docker-compose -f docker-compose-replicated.yaml up -d $(filter-out $@,$(MAKECMDGOALS))

stop:
	docker-compose ${composeFiles} stop $(filter-out $@,$(MAKECMDGOALS))

logs:
	docker-compose ${composeFiles} logs -f -t --tail 30  $(filter-out $@,$(MAKECMDGOALS))

console:
	docker-compose ${composeFiles}  exec $(filter-out $@,$(MAKECMDGOALS)) sh

console-bash:
	docker-compose ${composeFiles}  exec $(filter-out $@,$(MAKECMDGOALS)) bash

restart:
	docker-compose ${composeFiles}  restart $(filter-out $@,$(MAKECMDGOALS))

build:
	docker-compose ${composeFiles} build $(filter-out $@,$(MAKECMDGOALS))

migrate-up:
	docker-compose exec postgres psql -U postgres -d scheduler_database -f scripts/postgres/timer.sql

migrate-down:
	docker-compose exec postgres psql -U postgres -d scheduler_database -c 'drop table timer;;'


