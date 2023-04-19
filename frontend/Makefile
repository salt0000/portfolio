create-project: # Create project
	mkdir client
	@make up
	docker compose exec node sh -c "npx --yes create-react-app . --template typescript"
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
	@make npm-start


# Commands for development
npm-start:
	docker compose exec node npm start
install:
	docker compose exec node npm install ${name}