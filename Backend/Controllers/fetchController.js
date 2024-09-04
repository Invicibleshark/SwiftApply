const Internauth = require('../Models/Internauth');
const fetchController = async (req, res) => {
  try {
    const { userId } = req.body;
    const credentials = await Internauth.findOne({ owner: userId });

    if (!credentials) {
      return res.status(404).json({ message: 'No credentials found' });
    }

    res.json({ Internemail: credentials.Internemail, Internpassword: credentials.Internpassword ,coverletter:credentials.coverletter });
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = fetchController;
