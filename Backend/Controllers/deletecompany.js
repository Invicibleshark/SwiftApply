const Company = require('../Models/company')
const deletecompany = async (req, res) => {
    try {
        const { companyName, userId } = req.body; // Get companyName and userId from the request body

        console.log(`Company Name: ${companyName}, User ID: ${userId}`);

        // Find the company by its name and owner
        const company = await Company.findOne({ companyname: companyName, owner: userId });

        if (!company) {
            console.log('Company not found or permission denied');
            return res.status(404).json({ message: 'Company not found or you do not have permission to delete it.' });
        }

        // Delete the company
        await company.deleteOne();
        res.status(200).json({ message: 'Company deleted successfully.' });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'An error occurred while deleting the company.' });
    }
};


  module.exports = deletecompany;
  