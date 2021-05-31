# Some unofficial tools for The Happy Body Program

Touching to force redeploy.

Currently there is only one tool (not tools), but I expect to add more.

The one and only tool helps calculates the different weight percentages and dumbbells required to perform the Happy Body workout, which I made just because I got tired of doing the mental math.

## RethinkDB

Backup:

```
rethinkdb dump -f backup.tar.gz
```

## Express server backend API

Run in development:

```
NODE_ENV=development node server.js
```

## Heroku notes

Requires the RethinkDB Cloud Add-on:

```
heroku addons:create rethinkdb
```

`Procfile` does migrations. Build and server start steps are in `package.json`.

Deploy:

```
git push heroku master
```

## Vue.js project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
