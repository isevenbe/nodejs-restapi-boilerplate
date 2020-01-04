var fs = require("fs");

class Logger {
    constructor() {}

    async createFile(fileName) {
        try {
            if (fs.existsSync(fileName)) {
                return true
            } else {
                const initFile = [{
                    fileDate: new Date().toISOString()
                }];
                fs.writeFile(`./logs/LOG_${fileName}.json`, JSON.stringify(initFile, null, 4), (err) => {
                    if (err) throw err
                });
            }
        } catch (err) {
            console.error(err)
            return false
        }
    }

    async writeLog({}) {
        const log = {
            ...arguments
        };
        try {
            let fileName = new Date().toLocaleDateString();
            fileName = fileName.split("/").join("-");

            if (fs.existsSync(`./logs/LOG_${fileName}.json`)) {
                fs.readFile(`./logs/LOG_${fileName}.json`, 'utf-8',  (err, data) => {
                    if (err) throw err
                    let arrayOfObjects = JSON.parse(data);
                    arrayOfObjects.push(log['0']);
                    fs.writeFile(`./logs/LOG_${fileName}.json`, JSON.stringify(arrayOfObjects), 'utf-8',  (err) => {
                        if (err) throw err
                    })
                });
            } else {
                await this.createFile(fileName);
                fs.readFile(`./logs/LOG_${fileName}.json`, 'utf-8',  (err, data) => {
                    if (err) throw err
                    let arrayOfObjects = JSON.parse(data);
                    arrayOfObjects.push(log['0'])
                    fs.writeFile(`./logs/LOG_${fileName}.json`, JSON.stringify(arrayOfObjects), 'utf-8',  (err) => {
                        if (err) throw err
                    })
                });
            }
        } catch (error) {

        }
    }

}

module.exports = Logger;