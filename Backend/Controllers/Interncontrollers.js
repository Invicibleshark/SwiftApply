const Internauth = require('../Models/Internauth') // Ensure the path is correct

const Interncontrollers = async (req, res) => {
    try {
        const owner = req.user._id; 
        const existingApplication = await Internauth.findOne({ owner });

        if (existingApplication) {
            return res.status(400).json({ message: 'Details of the user already Exists' });
        }

        const { Internemail, Internpassword,coverletter } = req.body;

        // Validate input
        if (!Internemail || !Internpassword) {
            return res.status(400).json({ message: "Internemail , Internpassword and Cover Letter are required" });
        }

        const newInternauth = new Internauth({
            Internemail,
            Internpassword,
            coverletter,
            owner // Use owner directly, as it's already set correctly
        });

        await newInternauth.save();
        res.status(201).json({ message: "Intern details saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving intern auth details", error });
    }
};

module.exports = Interncontrollers;
