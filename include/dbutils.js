const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const db = new JsonDB(new Config("./database/db", false, false, '/'));
module.exports = {
    insertData: function (userId, reason, type, active = true) {
        db.push(`/${userId}`, {
            reason: reason,
            type: type,
            active
        }, true)

        db.save()
    },

    getData: function (userId) {
        try {
            return db.getData(`/${userId}`)
        } catch (error) {
            return null;
        }
    },

    deleteData: function (userId) {
        db.delete(`/${userId}`)

        db.save()
    },

    appendData: function (chan, ids) {
        db.push(`/${chan}`, {
            msgids: ids
        }, true)

        db.save()
    },

    fetchData: function (chan) {
        try {
            return db.getData(`/${chan}`)
        } catch (error) {
            return null;
        }
    }
};