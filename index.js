const puppeteer = require('puppeteer');
const stringify = require('csv-stringify');
const fs = require('file-system');
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');

const input = []
const tuyenConst = {
  MyDinhLaoCai: "1",
  GiaLamLaoCai: "2",
  HĐTOUR: "4",
  YenNghiaLaoCai: "5",
  MyDinhSapa: "6",
  YenNghiaSapa: "8",
  MyDinhBacHa: "10",
  SonTayLaoCai: "11",
  LaoCaiHaTinh: "13",
  HDHaNoiSapa: "15",
  HDHaNoiLaoCai: "16",
  HDHaNoiBacHa: "9999",
  HDHaNoiLaoCai: "10000",
  HDGiaiPhongSapa: "10002",
  HDGiaiPhongLaoCai: "10005",
  HDGiaiPhongADV: "10009",
  HDHaNoiADV: "10013",
}

const caConst = {
  casang: "1",
  cachieu: "2",
  catoi: "3"
}

test = (async () => {



  let bookcarUrl = 'https://hasonhaivan.vn/admin_lv2/modules/account/login.php';


  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"]
  });
  // let browser = await puppeteer.launch({
  // headless: false
  // args: ['--no-sandbox', '--disable-setuid-sandbox']
  //  });
  let page = await browser.newPage();

  await page.goto(bookcarUrl, { waitUntil: 'networkidle2' });

  await page.evaluate(() => {
    let username = document.querySelector('div[class="form-group has-feedback"] > input[name="username"]');
    let password = document.querySelector('div[class="form-group has-feedback"] > input[name="password"]');
    let submit = document.querySelector('button[type="submit"]');
    username.value = "dl.hhtravelvn";
    password.value = "Hiepnguyen12345689";

    submit.click();





  });

  await page.waitForSelector(".treeview-menu");

  await page.evaluate(() => {
    let linkToBook = document.querySelector('ul[class="treeview-menu"] > li > a');
    linkToBook.click();
  });

  await page.waitForSelector(".view_adm_search_element");
  await page.select('.form-control.bv_form_tuyen', tuyenConst.MyDinhSapa);
  await page.waitFor(4000)

  await page.select(".form-control.bvv_ca_select", caConst.casang)
  await page.$eval('.form-control.bv_form_day.hasDatepicker', el => el.value = '18-09-2020');




  const dataChuyen = await page.$eval('.bv_top_not_li', (e) => {
    const listchuyendi = e.getElementsByClassName('did_stt_1 menu_loai_xe_1 bvv_col_item_1');
    var input = [];
    for (const chuyen of listchuyendi) {
      // chuyen =
      // <span><b>13:15</b>  ← 13:15 &nbsp; MDI → SPA - 24B00569</span>
      // <span class="bvt_so_cho stt_1">&nbsp;&nbsp;<b>44/44</b></span>
      const dataChuyen = chuyen.getElementsByTagName('span');
      for (const data of dataChuyen) {
        var thongtinchuyen = data.innerText;
        input.push(thongtinchuyen);
      }


    }
    return input;
  });
  var arrayData = Array.from(dataChuyen)
  console.log(arrayData)
  stringify(arrayData, function (err, output) {
    fs.writeFile("output.csv", arrayData.join('\t'), 'utf-8');
  });
  // sendEmail(arrayData.join(','))



  console.log("ok");
  // await browser.close();
})();

async function sendEmail(text) {
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'toilahtc@gmail.com',
      pass: 'nothingmk'
    }
  }));
  let textTosend = text;

  let info = await transporter.sendMail({
    from: '"Hoang Thanh Cong" <toilahtc@gmail.com>',
    to: "hoanghai35516@gmail.com",
    subject: "My dinh- Sapa. 18-09-2020. ca sang",
    text: textTosend
  })

}