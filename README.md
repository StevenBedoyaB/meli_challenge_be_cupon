# MELI Challenge Coupon (BackEnd)

**Table of Contents**
- [Environment](#environment)
- [Dependency Management](#dependency-management)
- [Frameworks And Libraries](#frameworks-and-libraries)
- [Installation](#installation)
- [How To Use](#how-to-use)


----------


### Environment
* [NodeJS](https://nodejs.org/) 18+ (>= v18.16.0)\
It's recommended to install Node Version Manager to handle the [NodeJS](https://nodejs.org/) installation and keep alongside another [NodeJS](https://nodejs.org/) versions.


----------


### Dependency Management
* [npm](https://www.npmjs.com/): **[NodeJS](https://nodejs.org/)** package management. (Installed automatically with NodeJS).


----------


### Frameworks And Libraries
* [axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js.
* [cors](https://github.com/expressjs/cors): [NodeJS](https://nodejs.org/) package for providing a [Connect](https://github.com/senchalabs/connect)/[Express](https://www.npmjs.com/package/express) middleware that can be used to enable CORS (Cross-origin resource sharing) with various options.
* [dotenv](https://github.com/motdotla/dotenv): Zero-dependency module that loads environment variables from a .env file into process.env.
* [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for [NodeJS](https://nodejs.org/).
* [sequelize](https://www.npmjs.com/package/sequelize): Easy-to-use and promise-based [NodeJS](https://nodejs.org/) ORM tool for Postgres, MySQL, MariaDB, SQLite, DB2, Microsoft SQL Server, and Snowflake.
* [sqlite3](https://www.npmjs.com/package/sqlite3): Asynchronous, non-blocking SQLite3 bindings for Node.js..
* [@types/cors](https://www.npmjs.com/package/@types/cors): Type definitions for [cors](https://github.com/expressjs/cors).
* [@types/express](https://www.npmjs.com/package/@types/express): Type definitions for [express](https://www.npmjs.com/package/express).
* [nodemon](https://www.npmjs.com/package/nodemon): Tool that helps develop [NodeJS](https://nodejs.org/) based applications by automatically restarting the node application when file changes in the directory are detected.
* [ts-node](https://www.npmjs.com/package/ts-node): TypeScript execution and REPL for [NodeJS](https://nodejs.org/), with source map and native ESM support.


----------


### Installation
After [NodeJS](https://nodejs.org/) installation you can verify the correct version opening a command prompt and enter the following:
```
$ node –v
```
\
Then you can run
```
$ npm install
```
to download the [NodeJS](https://nodejs.org/) modules.

\
Then create a `.env` file at the same level (alongside) than the file package.json with the `PORT` number to run the server locally
```
// Server port
PORT = 2020
```
\
Later perform the command
```
$ npm run dev
```
to start the server (for dev purposes).


----------


### How To Use
The server has 3 endpoints.
```
PROD        =>  baseUrl: https://melichallengebecupon-production.up.railway.app
DEV (LOCAL) =>  baseUrl: http://localhost:{PORT}
```
\
The first of all is the root of url to test if server is running (ping):
```
GET {baseUrl}/
```
\
it can respond with:
```
{
    "msg": "it is alive"
}
```
\
\
The second endpoint is for send a list of favorites items and an amount, to select as many items as possible:
```
POST {baseUrl}/api/coupon/
```
with body
```
{
    "item_ids": ["MCO805528860", "MCO651764055", "MCO960661151", "MCO896227961", "MCO1220007348", "MCO839432192", "MCO593417993", "MCO940922159", "MCO648550090", "MCO605845408"],
    "amount": 500000
}
```
\
it can respond with:
```
{
    "item_ids": [
        "MCO605845408",
        "MCO960661151",
        "MCO896227961",
        "MCO940922159",
        "MCO593417993",
        "MCO839432192"
    ],
    "total": 449612
}
```
\
\
The third endpoint is to get the Top 5 of favorite items of all person want (based in multiple entries of previous endpoint)
```
GET {baseUrl}/api/coupon/
```

\
it can respond with:
```
[
    {
        "MCO605845408": 108
    },
    {
        "MCO593417993": 78
    },
    {
        "MCO839432192": 55
    },
    {
        "MCO651764055": 21
    },
    {
        "MCO805528860": 16
    }
]
```