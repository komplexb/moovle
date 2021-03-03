![moovle](https://user-images.githubusercontent.com/3874813/102837365-c0a3d680-444f-11eb-97ae-15f409a064c3.png)
# **moovle** | search the marvel universe

## What is this?
A web app for exploring Marvel Comic characters.

## Try it
Visit https://moovle-auth.herokuapp.com  
Start entering a character name and the site app will provide a filtered list of upto twenty Marvel characters **starting with** your string.

Press `ENTER` after your text and the app will provide a character with that **exact name** if one exists.

### A few things to note.
1. Public visitors (guests) can search and view characters as usual, but without the comics component.
2. Authenticated users can see comics on the `/characters` page.
3. Authenticated users with the `favourites` scope like the accounts below can visit the `/favourites` page and see a list of favourite characters stored in the DB.
 
### To see step 2 in action, create an account:
https://moovle-auth.herokuapp.com/register

### To see step 3 in action login with:  
__Account 1__  
Username: moovle.demo+f4@gmail.com  
Password: Fantastic4  

__Account 2__  
Username: moovle.demo+gotg@gmail.com  
Password: IamGr00t

### Learn more
http://bit.ly/moovle-auth


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
API_URL=https://moovle-auth.herokuapp.com
MARVEL_API_URL=https://gateway.marvel.com/v1/public
MARVEL_PRK
MARVEL_PUK
```

## Links
Marvel API Docs: https://developer.marvel.com/docs