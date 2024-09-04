const puppeteer = require('puppeteer');
const Company = require('../Models/company');

const applyInternship = async (req, res) => {
  console.log("Starting applyInternship function");
  let companyName = '';
  let userId = '';

  try {
    // Extract data from request body
    const { email, password, coverletter, userId: reqUserId } = req.body;
    userId = reqUserId; // Assign userId separately
    console.log(`Using email: ${email} and userId: ${userId}`);

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });

    // Navigate to Internshala and log in
    await page.goto('https://internshala.com/');
    await page.waitForSelector('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
    await page.click('button[data-toggle="modal"][data-target="#login-modal"].login-cta');

    await page.waitForSelector("#modal_email");
    await page.type("#modal_email", email);
    await page.type("#modal_password", password);
    await page.click('button#modal_login_submit');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Navigate to internship listings and apply filters
    await page.waitForSelector('a.nav-link.dropdown-toggle.job_link', { timeout: 60000 }); // Increased timeout
    await page.click('a.nav-link.dropdown-toggle.job_link');

    // // Wait for the matching preference input
    // await page.waitForSelector('input#matching_preference[name="matching_preference_job"]');
    // await page.click('input#matching_preference_job[name="matching_preference_job"]');

    await page.waitForSelector('.chosen-container');
    console.log('Waiting for filter results to update...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Extract internship details
    const internship = await page.evaluate(() => {
      const internshipElement = document.querySelector('#internship_list_container_1 .individual_internship');
      if (internshipElement) {
        const id = internshipElement.getAttribute('id');
        const name = internshipElement.querySelector('.job-internship-name')?.innerText.trim();
        const company = internshipElement.querySelector('.company-name')?.innerText.trim();
        const stipend = internshipElement.querySelector('.stipend')?.innerText.trim();
        return { id, name, company, stipend };
      }
      return null;
    });

    if (!internship) {
      console.log('No internship found');
      await browser.close();
      return res.status(404).json({ success: false, message: 'No internship found' });
    }

    companyName = internship.company;

    console.log(`Applying for internship: ${internship.name}`);

    // Apply for the internship
    await page.click(`#${internship.id}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.waitForSelector('.continue_container');
    await page.click('#continue_button');

    try {
      await page.waitForSelector('.application-form');
      const coverLetterExists = await page.$('#cover_letter_holder') !== null;

      if (coverLetterExists) {
        await page.waitForSelector('#cover_letter_holder');
        await page.type('.ql-editor', coverletter);

        try {
          await page.waitForSelector('input#check[name="location_single"]', { visible: true, timeout: 5000 });
          await page.click('input#check[name="location_single"]');
        } catch (error) {
          console.log('Checkbox not found or not visible:', error.message);
        }
      } else {
        console.log('Cover letter section not found, skipping this step.');
      }
    } catch (e) {
      console.log('Error filling out the application form:', e.message);
      await browser.close();
      return res.status(500).json({ success: false, company: companyName, message: 'Error occurred while filling out the application', error: e.message });
    }

    await page.click("#submit");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.click(".application_submit_success");
    console.log(`Applied for: ${internship.name}`);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.goto("https://internshala.com/internships/matching-preferences/");
    await browser.close();

   
    try {
       // Save successful application to database
    const newCompany = new Company({
      companyname: companyName,
      status: 'Success',
      owner: userId,
    });
      await newCompany.save();
  } catch (error) {
      if (error.code === 11000) {
          console.log('Duplicate entry detected, skipping save.');
      } else {
          console.error('Error saving to database:', error.message);
      }
  }
  console.log(`Application result saved to database: ${companyName}`);
  res.json({ success: true, company: companyName, message: 'Applied successfully' });
  } catch (error) {
    console.log('Error in applyInternship function:', error.message);
    
    // Save failed application to database
    if (companyName) {
      const failedCompany = new Company({
        companyname: companyName,
        status: 'Failure',
        owner: userId,
      });
      try {
      await failedCompany.save();
   } catch (error) {
       if (error.code === 11000) {
           console.log('Duplicate entry detected, skipping save.');
       } else {
           console.error('Error saving to database:', error.message);
       }
   }
    }

    res.status(500).json({ success: false, company: companyName, message: 'Error occurred while filling out the application', error: error.message });
  }
};

module.exports = applyInternship;
