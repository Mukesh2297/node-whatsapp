const puppeteer = require("puppeteer");


const WHATSAPP_LOGIN_URL =
  "https://web.whatsapp.com/";

const contactInput = 'Ma Beech';

  (async () => {
    const browser = await puppeteer.launch({userDataDir: './myUserDataDir',headless: false });
    const page = await browser.newPage();
    await page.goto(WHATSAPP_LOGIN_URL, {
      waitUntil: "networkidle2",
    });
    await page.waitForNavigation();
    await page.setViewport({
      width: 1200,
      height: 2400,
    });
   
    //await page.waitForSelector("div [class='_3FRCZ copyable-text selectable-text']");
    const target = await page.$("div [class='_3FRCZ copyable-text selectable-text']");
    await target.click();
    await target.type(contactInput);

    // const contact = await page.$("span[title='Ma Beech']");
    // contact.offsetParent.click();
    // console.log(contact);

    const clickContact = await page.evaluate(()=>{
        let dv = document.querySelector("span[title='Ma Beech']").offsetParent.children[1]
        let clickEvent = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        return dv.dispatchEvent(clickEvent);
    })

    //await page.waitForSelector("div[class='_3FRCZ copyable-text selectable-text']");


    // const msgTarget = await page.evaluate(()=>{
    //    document.getElementsByClassName('_3FRCZ copyable-text selectable-text')[1].innerHTML="Hello";
    //     let sendButton = document.get('._1U1xa')[0];
    //     let clickEvent = new MouseEvent('mousedown', {
    //         view: window,
    //         bubbles: true,
    //         cancelable: true
    //     });
    //     return sendbutton.dispatchEvent(clickEvent);

    // })

    const msgTarget = await page.$$("div[class='_3FRCZ copyable-text selectable-text']");
    console.log(msgTarget);
    await msgTarget[1].type("Hello");
    await page.keyboard.press('Enter');

    // const sendbutton = await page.evaluate(()=>{
    //     let sendButton = document.getElementsByClassName('_1U1xa')[0];
    //         let clickEvent = new MouseEvent('mousedown', {
    //             view: window,
    //             bubbles: true,
    //             cancelable: true
    //         });
    //         return sendButton.dispatchEvent(clickEvent);
    // })  

  })();


  