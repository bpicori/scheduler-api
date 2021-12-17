up:
	docker-compose up -d $(filter-out $@,$(MAKECMDGOALS))

stop:
	docker-compose stop $(filter-out $@,$(MAKECMDGOALS))

logs:
	docker-compose logs -f -t --tail 30  $(filter-out $@,$(MAKECMDGOALS))

console:
	docker-compose  exec $(filter-out $@,$(MAKECMDGOALS)) sh

console-bash:
	docker-compose  exec $(filter-out $@,$(MAKECMDGOALS)) bash

restart:
	docker-compose  restart $(filter-out $@,$(MAKECMDGOALS))

build:
	docker-compose  build $(filter-out $@,$(MAKECMDGOALS))

