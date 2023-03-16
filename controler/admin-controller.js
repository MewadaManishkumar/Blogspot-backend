const Users = require('../models/users')
const enumRole = require('../models/enumRole');

const getAdmin = async (req, res) => {
    const admins = await Users.find({ $or: [{ role: enumRole.admin }, { role: enumRole.masterAdmin }] }    );
    res.send(admins);
}

const createAdmin = async (req, res) => {
    const adminData = req.body;
    const fieldsToSave = {
        name: adminData.name,
        email: adminData.email,
        username: adminData.username,
        password: adminData.password,
        role: adminData.role
    }
    const admin = new Users(fieldsToSave);
    try {
        await admin.save();
        res.send(admin);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const updateAdmin = async (req, res) => {
    try {
        const admin = await Users.findByIdAndUpdate(req.params._id, { $set: req.body });
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
        const admin = await Users.findByIdAndDelete(req.params._id);
        if (!admin) {
            return res.status(404).send({ error: 'Admin not found' });
        }
        res.send({ message: 'Admin deleted' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getAdmin, createAdmin, updateAdmin, deleteAdmin };
// { $and: [{ role: enumRole.admin }, { role: enumRole.masterAdmin }] }