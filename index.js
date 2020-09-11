const puppeteer = require('puppeteer');
test = (async() => {

    let bookcarUrl = 'https://hasonhaivan.vn/admin_lv2/modules/account/login.php';


    // let browser = await puppeteer.launch({ headless: false });
    let browser = await puppeteer.launch();
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
    await page.select('.form-control.bv_form_tuyen', "6");
    await page.waitFor(4000)

    let dataCa = await page.evaluate(async() => {
        let ca = document.querySelector('div[class="view_adm_search_element"] > select[class="form-control bvv_ca_select"]');
        let ngay = document.querySelector('div[class="view_adm_search_element"] > input[class="form-control bv_form_day hasDatepicker"]');
        ca.value = 1;
        ngay.value = "12-09-2020";
    });
    var gioDi = await page.evaluate(async() => {

        return $(`li.bv_top_not_li`)[0].innerHTML
    });
    console.log(gioDi)
        // await browser.close();
})();