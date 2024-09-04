const Company = require('../Models/company')
const companylist = async (req, res) => {
    try {
      const { userId } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const companies = await Company.find({ owner: userId }).exec();
      
      res.status(200).json({ companies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
module.exports =companylist;