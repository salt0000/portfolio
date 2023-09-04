# set up app
create-project:
	mkdir client
	@make up
	docker compose exec node sh -c "npx create-next-app@latest ."
set-up:
	cp ./client/.env.example ./client/.env.local
	@make up
	@make install
	@make run-dev


# Commands for the container
up:
	docker compose up -d
down:
	docker compose down
re-start:
	@make down
	@make up
dev:
	@make up
	@make run-dev


# Commands for development
run-dev:
	docker compose exec node npm run dev
run-lint:
	docker compose exec node npm run lint
run-format:
	docker compose exec node npm run format
run-build:
	docker compose exec node npm run build
run-start:
	docker compose exec node npm run start
install:
	docker compose exec node npm install ${name}


# Check if it can be deployed to ecs
up-prod:
	docker build -t portfolio-node --target local -f docker/node/Dockerfile .
	docker run --rm -it -p 3000:3000 portfolio-node