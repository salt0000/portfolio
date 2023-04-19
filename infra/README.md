# Overview
template project


# Environment
### Requirements
- Docker
### Recommend
- Intel mac
- VScode

# How to build app
1. 
```
make set-up
```
1. Edit credentials and config in the file "docker/cdk/.aws"
1. 
```
make restart
```


# How to deploy
### cdk deploy
1. 
```
make bootstrap(First time)
```
1. 
```
make deploy
```


# How to use commands for development
### Deploy stack
```
make deploy
```
### Destory stack
```
make destory
```

### Other command
See Makefile