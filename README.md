# DEEL BACKEND TASK

## Setup

Run the following command
```
npm install
```

## How to run
Run the following command to open the server, it listens to 3001 on localhost
```
npm start
```

## How to test
Run the following command to run mocha tests, it will run them automatically and you can see the details on the logs
```
npm test
```

## Folder structure
- Under `src` folder, you can find the code itself
- The endpoints are put inside controllers(routers) under `controller` folder
- `middleware` folder contains all middlewares used inside controllers
- `model.js` contains all the models and their relations
- `util` contains utility libs can be used inside the project. For now, only seed for testing purposes
- Under `test` folder, you can find the tests separated into controller names

## My reviews and notes for the task

- I liked to code this test. It took around 4 hours to finish it. 
- I wanted to do a proper branching and commiting but would be hard to fit everything in 3 hours while dealing with the problems. Also, I was confused about `everything should be sent to master` instruction. 
- The task was also educative, on the admin endpoints. I had to look at it how to use `limit` together with such a complex query because It was sending limit to inside query so discovered subQuery:false. Thanks for it.
- I believe the instructions could be a little more clear, especially about who is client/contractor and where they are gonna be determined etc. However, this wasn't a real project so we had no meetings or no one to ask questions so not a problem.

## Improvement notes for the future

- Docker support could be added if there was more time
- Joi check could be added to prevent when wrong param or query data
- Repository pattern could be used to keep the endpoints clean and increase reusability
- Models could be seperated into different files to keep it clean
- There could be more extensive testing and multiple cases could be generated
- JS Docs could be added to generate docs and endpoints more clear