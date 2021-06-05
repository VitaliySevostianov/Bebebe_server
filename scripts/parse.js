const fs = require('fs')
const axios = require('axios')
const request = require('request')
const unzipper = require("unzipper");

request('http://transport.orgp.spb.ru/Portal/transport/internalapi/gtfs/feed.zip')
  .pipe(fs.createWriteStream('feed.zip'))
  .on('close', function () {


    fs.createReadStream('./feed.zip')
    .pipe(unzipper.Extract({ path: './feed/' }))
    .on('close', function () {
        console.log('File written!');
        fs.readFile('./feed/operator_routes.txt', 'utf-8', async (e, data) => {
            const json = JSON.stringify(data)
            console.log(json)
            const idsArray = json.split('\\n')
            let routes = {}
            for(let i = 1; i < idsArray.length; i++){
                const data = idsArray[i].split(',')
                const operator_id = data[0].replace('"', '')

                if(operator_id !== '"' && operator_id !== ''){
                    routes[operator_id] = routes[operator_id] === undefined ? [] : routes[operator_id]
                    routes[operator_id].push(+data[1].replace('"', ''))
                }
            }
            const operators = Object.keys(routes)
            console.log(routes)
            for (const operator of operators) {
                await axios.post('http://127.0.0.1:3000/api/v1/users/carriers',{
                    "userId": operator,
                    "name": "notChoosed",
                    "companyRequisites": "notChoosed",
                    "bankRequisites": "notChoosed",
                    "routes": routes[operator],
                    "transports": [
                        0
                    ]
                })
            }
        })
    });
})

