const express = require('express');
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const router = express.Router();
const app=express();

const WHATSAPP_LOGIN_URL =
  "https://web.whatsapp.com/";

const contactInput = 'Ma Beech';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/",((req,res,next)=>{
    res.json({status:"Ok"})
}))

app.post("/sendMessage",((req,res,next)=>{
    console.log(req.body);
    (async () => {
        const browser = await puppeteer.launch({headless: false });
        const page = await browser.newPage();
        await page.goto(WHATSAPP_LOGIN_URL, {
          waitUntil: "networkidle2",
        });
        await page.waitForNavigation();
        await page.setViewport({
          width: 1200,
          height: 2400,
        });
        const target = await page.$("div [class='_3FRCZ copyable-text selectable-text']");
        await target.click();
        await target.type(contactInput);
        const clickContact = await page.evaluate(()=>{
            let dv = document.querySelector("span[title='Ma Beech']").offsetParent.children[1]
            let clickEvent = new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            return dv.dispatchEvent(clickEvent);
        })
        const msgTarget = await page.$$("div[class='_3FRCZ copyable-text selectable-text']");
        await msgTarget[1].type("Hello");
        await page.keyboard.press('Enter');
      })();
    
    
    res.json({response:"Input Received"});
    
}))


app.listen(8080, () => console.log(`Listening on port 8080 `));