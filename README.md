# VINZA BE

## Authors

```
- Emmanuel Guerreiro 47262
- Izuel Tomas
- Ozan Giuliana
- Garcia Zacarias
- Passera Nino
```

## How to run

`sudo docker compose -f docker-compose.local.yml up`

### If its the first time

`sudo docker compose -f docker-compose.local.yml up --build`

### If a dependency has been installed

```
sudo docker compose -f docker-compose.local.yml down
sudo docker compose -f docker-compose.local.yml build
sudo docker compose -f docker-compose.local.yml up
```

###### Template based on

https://blog.logrocket.com/express-typescript-node/
