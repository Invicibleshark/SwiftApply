const Internauth = require('../Models/Internauth');

const deleteController = async (req, res) => {
  try {
    const { userId } = req.body;

    const credentials = await Internauth.findOneAndDelete({ owner: userId });

    if (!credentials) {
      return res.status(404).json({ message: 'No credentials found to delete' });
    }

    res.json({ success: true, message: 'Intern details deleted successfully' });
  } catch (error) {
    console.error('Error deleting credentials:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = deleteController;
