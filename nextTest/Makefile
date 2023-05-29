create-project: # Create project
	mkdir client
	@make up
	docker compose exec node sh -c "npx create-next-app@latest"
set-up: # Set up app after git clone
	@make up
	@make install
	@make npm-start


# Commands for container
up:
	docker compose up -d
down:
	docker compose down
start:
	@make up
	@make npm-dev


# Commands for development
npm-dev:
	docker compose exec node npm run dev
install:
	docker compose exec node npm install ${name}