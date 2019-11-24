const CosmosClient = require('@azure/cosmos').CosmosClient;
const express = require('express');

const config = require('./config');

const endpoint = config.endpoint;
const key = config.key;

const client = new CosmosClient({ endpoint, key });

const HttpStatusCodes = { NOTFOUND: 404 };

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/agent"] };

/**
* Read the database definition
*/
async function readDatabase() {
    const { resource: databaseDefinition } = await client.database(databaseId).read();
    console.log(`Reading database:\n${databaseDefinition.id}\n`);
 }

 /**
 * Read the container definition
 */
async function readContainer() {
    const { resource: containerDefinition } = await client
      .database(databaseId)
      .container(containerId)
      .read()
    console.log(`Reading container:\n${containerDefinition.id}\n`)
  }

function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
 };


  /**
 * Query the container using SQL
 */
async function queryContainer() {
    console.log(`Querying container:\n${config.container.id}`)
  
    // query to return all children in a family
    const querySpec = {
      query: 'SELECT * from c'      
    }
  
    const { resources: results } = await client
      .database(databaseId)
      .container(containerId)
      .items.query(querySpec)
      .fetchAll();
    // for (var queryResult of results) {
    //   let resultString = JSON.stringify(queryResult)
    //   //console.log(`\tQuery returned ${resultString}\n`)
    // }
    return results;
  }

  
  


  var app = express();

  app.listen(process.env.PORT ,()=>{
    console.log("Server running on port 3000");
  });

  app.get("/getagents", (req, res, next) => {
   // res.json(["Tony","Lisa","Michael","Ginger","Food"]);
    readDatabase().
    then(()=>readContainer())
    .then(()=>queryContainer())
    .then((results)=>{res.json(results)})
    .then(() => { exit(`Completed successfully`); })
    .catch((error) => { exit(`Completed with error \${JSON.stringify(error)}`) });
   });

app.get("/getagents", (req, res, next) => {
    res.send("Hello World!");
   });
