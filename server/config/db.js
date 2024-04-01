const mongoose = require('mongoose');

const concentDb = () => {
    mongoose
        .connect('mongodb://127.0.0.1:27017/Zens')
        .then(() => {
            console.log('ket noi thanh cong');
        })
        .catch((err) => console.log('ket noi that bai'));
};
module.exports = concentDb;
