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
