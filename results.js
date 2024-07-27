const axios = require('axios');
const fs = require('fs');

const fetchInternships = async () => {
  try {
    const response = await axios.get('https://internshala.com/internships_ajax/matching-preferences/');
    // Extract the internship list from the response
    const internshipData = response.data.rich_text_item_list;
    // const internships = internshipData.slice(0, 10); // Get the first 10 internships
    console.log(internshipData);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return [];
  }
};
// const saveInternshipsToFile = async (filename) => {
//   const internships = await fetchInternships();
//   fs.writeFileSync(filename, JSON.stringify(internships, null, 2));
// };

// saveInternshipsToFile('internships.json');
