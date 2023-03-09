const Admin = require('../models/admin');

const getAdmin= async (req, res) => {
    const admins = await Admin.find();
    res.send(admins);
}

const createAdmin = async (req, res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save();
        res.send(admin);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params._id,{$set: req.body});
        if (!admin) {
            return res.status(404).send({ error: 'Admin not found' });
        }
        res.send(admin);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params._id);
        if (!admin) {
            return res.status(404).send({ error: 'Admin not found' });
        }
        res.send({ message: 'Admin deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = {getAdmin,createAdmin,updateAdmin,deleteAdmin};