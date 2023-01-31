const { env } = require('node:process');

const express = require('express')
const app = express()
const port = 12345

let url = env.REPO_URL;
let branch = env.REPO_BRANCH;

function getOwnerAndRepo(url) {
    // example URL = https://github.com/reactjs/reactjs.org
    if ( ! /^https:\/\/github.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/.test(url) ) {
        return false;
    }
    let path = url.slice(19);
    if ( ! path.includes('/') ) {
        return false;
    }
    let pathArr = path.split('/');
    if ( ! (pathArr.length == 2)) {
        return false;
    }
    return pathArr;
}

let parameters = getOwnerAndRepo(url);

async function getFiles(owner, repo, branch) {
    let response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=0`);
    let data;
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        data = await response.json();
        data = data["tree"];
    } else {
        data = false
    }
    return data;
}

function getRootFilesCount(data) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        let path = data[i]["path"];
        if( ! path.includes("/") ) {
            count++;
        }
    }
    // count = data.length;
    return count;
}

app.get('/', async (req, res) => {
    if (! parameters) {
        res.send(`Invalid Github URL was provided`);
        return
    }
    if ( ! /(^main$)|(^master$)/.test(branch) ) {
        res.send(`Only main or master branch supported`);
        return
    }
    let data = await getFiles(parameters[0], parameters[1], branch);
    // res.send(data);
    let filesCount = getRootFilesCount(data)
    res.send(`The number of files at the root directory of ${url} are ${filesCount}`);
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
})