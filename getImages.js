import { createRequire } from "module";
const require = createRequire(import.meta.url);
const weapons = require("./pages/weapons.json");
import request from "request"
import fs from "fs"
import fetch from "node-fetch"

const imageRegex = /(?<=data-thumbnail=")https:.*\.png/gmi
const headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

async function getImages({Name}) {
    const Image = Name.replace(/\W/g, '').toLowerCase()
    const url = `https://fallout.fandom.com/wiki/Special:Search?query=${Name}&scope=internal&contentType=&ns%5B0%5D=0&ns%5B1%5D=302&ns%5B2%5D=308#`;
    const html = await new Promise(r=>request.get({
        url: url,
        headers: headers,
        followAllRedirects: true,
    },(err, httpResponse, body)=>r(body)));
    const match = html.match(imageRegex);
    if (match) {
        downloadFile(match[0], `./public/images/${Image}.png`)
        return `./public/images/${Image}.png`
    }
}

const downloadFile = (async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
  });

weapons.forEach(async weapon=>{
    const image = await getImages(weapon);
    console.log(image);
})