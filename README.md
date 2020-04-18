# React Socket IO Chat-app Example
A simple real-time chat application implementation using Socket.io, Node and React.

![Screenshot of demo](./screenshot.png)

see a live demo [here](https://evening-coast-74033.herokuapp.com/)

## Setup and run
* Make sure you have port 3000 and 8002 free in your machine.
* Run `npm i` in both /backend and /react-app directories.
* Open two terminal windows and navigate to both of these directories and run `npm start`

## Instructions to run this app
For signing in differently in the app, you can use two different browser tabs opening the same application and can chat in real-time. There is no session maintained so on every page visit it will ask for signing-in. ( For example you can select Alexa in one tab to sign in and TARS in second tab and then you can send message to TARS from Alexa's tab and you should see an unread message on TARS tab ).

Messages are stored in browser memory so on subsequent refreshes messages will be lost. we could've stored messages on server' DB though, but DB is not in the scenario.
