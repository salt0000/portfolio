# Commands for container
up:
	docker compose up -d
down:
	docker compose down

# Commands for outputting html
redoc-cli:
	docker run --rm -v $$PWD/stoplight-studio/reference:/data --workdir /data ghcr.io/redocly/redoc/cli:latest build oas.yaml
	mv $$PWD/stoplight-studio/reference/redoc-static.html $$PWD/oas.html