const express = require('express');
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

//const router = express.Router();
const app=express();

const WHATSAPP_LOGIN_URL =
  "https://web.whatsapp.com/";

//const contactInput = 'Ma Beech';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/",((req,res,next)=>{
    res.json({status:"Ok"})
}))

app.post("/sendMessage",((req,res,next)=>{
    console.log(req.body);
    let contactName = req.body.name;
    let contactNumber = req.body.number;
    let messageToSend = req.body.message;
    console.log(contactName);
    (async () => {
      console.log(contactName);
        const browser = await puppeteer.launch({userDataDir: './myUserDataDir'});
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36');
        await page.goto(WHATSAPP_LOGIN_URL, {
          waitUntil: "networkidle2",
        });
        await page.waitForNavigation();
        await page.setViewport({
          width: 1200,
          height: 2400,
        });
        const target = await page.$("div [class='_1awRl copyable-text selectable-text']");
        await target.click();
        await target.type(contactName);
        const clickContact = await page.evaluate((contactName)=>{
            let dv = document.querySelector("span[title="+"'"+contactName+"'"+"]").offsetParent.children[1];
            console.log("span[title="+"'"+contactName+"'"+"]");
            let clickEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            return dv.dispatchEvent(clickEvent);
        },contactName);
        const msgTarget = await page.$$("div[class='_1awRl copyable-text selectable-text']");
        await msgTarget[1].type(messageToSend);
        await page.keyboard.press('Enter');
      })();
    
    
    res.json({response:"Input Received"});
    
}))


app.listen(8080, () => console.log(`Listening on port 8080 `));