const Users = require('../models/users')
const enumRole = require('../models/enumRole');
const bcrypt = require('bcrypt')

const getAdmin = async (req, res) => {
    try {
        const admins = await Users.find({ $or: [{ role: enumRole.admin }, { role: enumRole.masterAdmin }] });
        res.send(admins);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const getSelectAdmin = async (req, res) => {
    try {
        const selectedAdmin = await Users.findById(req.params._id);
        res.send(selectedAdmin);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

const createAdmin = async (req, res) => {
    const adminData = req.body;
    const fieldsToSave = {
        name: adminData.name,
        email: adminData.email,
        username: adminData.username,
        password: await bcrypt.hash(adminData.password, 10),
        role: adminData.role
    }
    if (adminData.name !== adminData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (adminData.name.length < 3 || adminData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(adminData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (adminData.username !== adminData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (adminData.username.length < 5 || adminData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    }
    else if (adminData.password.length < 6 || adminData.password.length > 20) {
        res.status(400).send({ message: 'Password must be 6-20 character long' })
    }
    else if (adminData.password !== adminData.password.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in password' })
    }
    else {
        const admin = new Users(fieldsToSave);
        try {
            await admin.save();
            res.send(admin);
        } catch (err) {
            res.status(400).send({ message: "This email is already exist!" });
        }
    }
}

const updateAdmin = async (req, res) => {
    const updateAdminData = req.body;
    const fieldsToSave = {
        name: updateAdminData.name,
        email: updateAdminData.email,
        username: updateAdminData.username,
        role: updateAdminData.role
    }
    if (updateAdminData.name !== updateAdminData.name.trim()) {
        res.status(400).send({ message: 'Spcearound of name is not allowed' })
    }
    else if (updateAdminData.name.length < 3 || updateAdminData.name.length > 20) {
        res.status(400).send({ message: 'Name must be 3-20 character long' })
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(updateAdminData.email)) {
        res.status(400).send({ message: 'Email format is invalid' })
    }
    else if (updateAdminData.username !== updateAdminData.username.replace(/ +/g, "")) {
        res.status(400).send({ message: 'Whitespace is not allowed in username' })
    }
    else if (updateAdminData.username.length < 5 || updateAdminData.username.length > 20) {
        res.status(400).send({ message: 'Username must be 5-20 character long' })
    } else {
        try {
            const admin = await Users.findByIdAndUpdate(req.params._id, { $set: fieldsToSave });
            if (!admin) {
                return res.status(404).send({ error: 'Admin not found' });
            }
            res.send(admin);
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
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

module.exports = { getAdmin, getSelectAdmin, createAdmin, updateAdmin, deleteAdmin };