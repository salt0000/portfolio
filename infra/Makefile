create-project: # Create app
	mkdir cdk
	@make cp-aws-config
	@make build
	@make up
	docker compose exec cdk cdk init app --language=typescript
set-up: # Set up app after git clone
	@make cp-aws-config
	@make build
	@make up
	@make install
cp-aws-config:
	cp -r $$PWD/docker/cdk/.aws.example $$PWD/docker/cdk/.aws
	


# Commands for container
build:
	docker compose build
up:
	docker compose up -d
down:
	docker compose down
restart:
	@make down
	@make build
	@make up


# Commands for development
deploy:
	docker compose exec cdk cdk deploy
diff:
	docker compose exec cdk cdk diff
destroy:
	docker compose exec cdk cdk destroy
import:
	docker compose exec cdk cdk import
synth:
	docker compose exec cdk cdk synth
install:
	docker compose exec cdk npm install ${package}
bootstrap:
	docker compose exec cdk cdk bootstrap