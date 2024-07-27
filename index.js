const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  // Navigate to Internshala
  await page.goto('https://internshala.com/');

  // Wait and click the login button
  await page.waitForSelector('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
  await page.click('button[data-toggle="modal"][data-target="#login-modal"].login-cta');

  // Login
  await page.waitForSelector("#modal_email");
  await page.type("#modal_email", "keshav.narkudi@gmail.com");
  await page.type("#modal_password", "Keshav#18");
  await page.click('button#modal_login_submit');
  await page.waitForNavigation();

  // Navigate to the internship page and apply filters
  await page.waitForSelector('.nav-link.dropdown-toggle.internship_link');
  await page.click('.nav-link.dropdown-toggle.internship_link');

  // Wait for and click the filter checkbox
  await page.waitForSelector('input#matching_preference[name="matching_preference"]');
  await page.click('input#matching_preference[name="matching_preference"]');

  // Wait for the filter results to update
  console.log('Waiting for filter results to update...');
  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 10000);
});
  // Extract internship details
  const internships = await page.evaluate(() => {
    const internshipElements = Array.from(document.querySelectorAll('#internship_list_container_1 .individual_internship'));
    return internshipElements.slice(0, 1).map(el => {
      const id = el.getAttribute('id');
      const name = el.querySelector('.job-internship-name')?.innerText.trim();
      const company = el.querySelector('.company-name')?.innerText.trim();
      const stipend = el.querySelector('.stipend')?.innerText.trim();
      return { id, name, company, stipend };
    });
  });

  console.log('Internships to apply for:', internships);

  for (const internship of internships) {
    console.log(`Applying for internship: ${internship.name}`);

    // Click on the internship to view details and apply
    await page.click(`#${internship.id}`);
    await new Promise(function (resolve, reject) {
      return setTimeout(resolve, 2000);
  });
    // Apply for the internship
    await page.waitForSelector('.continue_container')
    await page.click('#continue_button');
    try{
      await page.waitForSelector(".application-form")
    await page.waitForSelector('#cover_letter_holder')
    await page.type(".ql-editor" , 
      "Dear Sir/Mam ,I am excited to apply for a position at Your Company. With a solid foundation in Computer Science and hands-on experience in Web Development, I am eager to contribute to your team. I am particularly impressed by Company's   projects, and I am confident that my skills and enthusiasm will make a positive impact. Thank you for considering my application.Sincerely,Keshav Vardhan")
      try {
        await page.waitForSelector('input#check[name="location_single"]', { visible: true, timeout: 5000 });
        await page.click('input#check[name="location_single"]');
      } catch (error) {
        console.log('Checkbox not found or not visible');
      }
    }
    catch(e){
      console.log(e);
    }
    await page.click("#submit")
    await new Promise(function (resolve, reject) {
      return setTimeout(resolve, 3000);
  });
  await page.click(".application_submit_success")
    console.log(`Applied for: ${internship.name}`);
  }
  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 2000);
});
 await page.goto("https://internshala.com/internships/matching-preferences/")
 await browser.close();
})();