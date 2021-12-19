<h1 align="center"> Scheduler </h1> <br>

<p align="center">
  Schedule webhooks to run at a specific time.
</p>

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Testing](#testing)
- [API](#requirements)

## Introduction

This microservice starts with 2 intervals: 1 every second to run the upcoming webhooks and 1 every minute to execute the missed one. Designed to start in 2 modes: singleton (deployed 1 single instance) and replicated (multi-instance with a leader-follower pattern for failover). The replicated mode uses the Etcd service to elect the leader. For the persistence it uses 2 layers:
database (Postgres)
cache (in memory if started singleton and Redis if started replicated)

## Requirements
1. Docker (tested using version 20.10.1)
2. docker-compose (tested using version 1.29.2)
3. Make for simplicity :) 


## Setup Singleton
```bash
make up-singleton # to run the application in singleton mode
```
```bash
make migrate-up # to create the table in the database
``` 
The port is set to 5000.
```bash
make logs scheduler # to see the logs
```
Curl Example for creating a webhook and getting it by id:
```bash
curl --location --request POST 'http://localhost:5000/timers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "hours": 0,
    "minutes": 0,
    "seconds": 3,
    "url": "http://localhost:3001"
}'
```
```bash
curl --location --request GET 'http://localhost:5000/timers/1'
```


## Setup Replicated
```bash 
make up-replicated # to start the application in replicated mode
```
```bash
make migrate-up # to create the table in db
``` 
When starting replicated, the traffic with pass from nginx with port 8080.

```bash
make logs scheduler1 # to see the logs
make logs scheduler2 # to see the logs
make logs scheduler3 # to see the logs
```

Curl Example for creating a webhook and getting it by id:
```bash
curl --location --request POST 'http://localhost:8080/timers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "hours": 0,
    "minutes": 0,
    "seconds": 3,
    "url": "http://localhost:3001"
}'
```
```bash
curl --location --request GET 'http://localhost:8080/timers/1'
```


## Testing
```bash
npm run test:unit # to run the unit tests
```
For e2e test be sure that db is running.
```bash
npm run test:e2e # to run the e2e tests
```


## Swagger Documentation
http://localhost:5000/api/

