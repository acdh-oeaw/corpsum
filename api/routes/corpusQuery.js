const express = require('express');
const fs = require('fs');

const router = express.Router();

function saveLocalCache(body, callback) {
  let newEntry = {
    queryTerm: body.queryTerm,
    corpus: body.corpus,
    subcorpus: body.subcorpus,
    result: body.queryResponse,
  };
  // The absolute path of the file
  const filePath = 'api/localCache/amc.json';
  fs.readFile(filePath, (err, data) => {
    const fileContent = JSON.parse(data);
    fileContent.push(newEntry);
    fs.writeFile(filePath, JSON.stringify(fileContent), callback);
    if (err) throw err;
  });
}

// corpusQuery POST request
router.post('/', async (req, res) => {
  saveLocalCache(req.body, (err) => {
    if (err) {
      res.status(404).send('Error');
      return;
    }
    res.send('OK');
  });
});

// corpusQuery GET request
router.get('/', async (req, res) => {
  fs.readFile('api/localCache/amc.json', 'utf8', (err, data) => {
    if (err) throw err;
    let fileContent = JSON.parse(data);
    if (!fileContent) fileContent = [];
    let result;
    for (let i = 0; i < fileContent.length; i += 1) {
      if (JSON.stringify(fileContent[i].queryTerm) === req.query.queryTerm && fileContent[i].corpus === req.query.corpus && fileContent[i].subcorpus === req.query.subcorpus) {
        result = fileContent[i].result;
        break;
      }
    }
    if (result) {
      res.send(result);
    } else {
      res.send('Error');
    }
  });
});

module.exports = router;
