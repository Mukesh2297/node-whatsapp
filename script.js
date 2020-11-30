const express = require('express');
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const QRCode = require('qrcode');
const path = require('path');

//const router = express.Router();
const app=express();

const port = process.env.PORT || 8080;

const WHATSAPP_LOGIN_URL =
  "https://web.whatsapp.com/";

//const contactInput = 'Ma Beech';
// app.set('view engine','ejs');
// app.set('views','views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/",((req,res,next)=>{
    res.json({status:"Ok"})
}))


app.get("/handshake",((req,res,next)=>{
  console.log(req.body);

  (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36');
      await page.goto(WHATSAPP_LOGIN_URL, {
        waitUntil: "networkidle2",
      });
      await page.setViewport({
        width: 1024,
        height: 800,
      });
      // const dataref = await page.evaluate(()=>{
      //   return document.getElementsByClassName('_1yHR2')[0].dataset.ref;
      // })
      // console.log(dataref);
      const qrElement = await page.$("#app > div > div > div.landing-window > div.landing-main > div > div._3l6Cf > div");
      await qrElement.screenshot({path:"./whatsapp.jpg",type:"jpeg"});
      await browser.close();
      // res.render('index',{data:dataref})
      // //res.sendFile(path.join(__dirname+'/index.html'));
      // let code = qr.image(dataref, { type: 'png',size:7 });
      // res.type('png');
      // code.pipe(res);
      res.sendFile("./whatsapp.jpg",{root:__dirname});

      // res.send(QRCode.toString(dataref,{type:"png"},function(err,url){
      //   console.log(url)

      // }))

    })()

  }))



  // var code = qr.image('hello world', { type: 'svg' });
  // res.type('svg');
  // code.pipe(res);

  // const url =  QRCode.toDataURL('Hello world',(err,url)=>{
  //   console.log(url);
  // });
  // //res.setHeader('content-type','image/png');
  // res.send(url)

  // (async () => {
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  //     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3641.0 Safari/537.36');
  //     await page.goto(WHATSAPP_LOGIN_URL, {
  //       waitUntil: "networkidle2",
  //     });
  //     await page.setViewport({
  //       width: 1024,
  //       height: 800,
  //     });
  //     await page.screenshot({path:"./whatsapp.jpg",type:"jpeg",fullPage:true});
  //     await browser.close();
  //     res.sendFile("./whatsapp.jpg",{root:__dirname});
  //   })()
  


app.post("/sendMessage",((req,res,next)=>{
    console.log(req.body);
    let contactName = req.body.name;
    let contactNumber = req.body.phone_number;
    let messageToSend = req.body.message;
    (async () => {
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


app.listen(port, () => console.log(`Listening on port ${port} `));