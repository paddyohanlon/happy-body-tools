# The Happy Body Tracker

To run locally run the following in three separate terminal tabs:

```
rethinkdb --http-port 5000
```

```
NODE_ENV=development node server.js
```

```
npm run serve
```

## RethinkDB

Backup:

```
rethinkdb dump -f backup.tar.gz
```

Run in development:

```
rethinkdb --http-port 5000
```

Set port other than `8080` because I usually have something already running on 8080.

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
