![moovle](https://user-images.githubusercontent.com/3874813/102837365-c0a3d680-444f-11eb-97ae-15f409a064c3.png)
# **moovle** | search the marvel universe

## What is this?
A web app for exploring Marvel Comic characters.

## Try it
Visit https://moovle.netlify.app  
Start entering a character name and the site app will provide a filtered list of upto twenty Marvel characters **starting with** your string.

Press `ENTER` after your text and the app will provide a character with that **exact name** if one exists.

## Build Setup

### Pre-requisites
- Obtain a Marvel **public key** and **private key** @ https://developer.marvel.com/account 
- Create an `.env` file in the root folder, and add them as environment variables
```
MARVEL_PUK=public key
MARVEL_PRK=private key
```
### Then
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# watch e2e tests
$ npm run dev:e2e

# run e2e tests
$ npm run test:e2e
```

## Deploy on Heroku
- Follow this: https://nuxtjs.org/docs/2.x/deployment/heroku-deployment
- Update `Procfile` to `web: nuxt-ts start`
- Use `heroku config:set VARIABLE=value` or the Heroku Dashboard to add the following variables:
```
# https://http.nuxtjs.org/options#browserbaseurl
API_URL=https://moovle-search.herokuapp.com
MARVEL_API_URL=https://gateway.marvel.com/v1/public
MARVEL_PRK
MARVEL_PUK

```

[![Netlify Status](https://api.netlify.com/api/v1/badges/bd6b82d3-d88b-4a62-9c3b-048c5af9ac2e/deploy-status)](https://app.netlify.com/sites/moovle/deploys)
