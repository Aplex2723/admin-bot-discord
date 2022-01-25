const saveData = require('../models/db-userData')
const setRole = require('../models/db-roleData')
const saveLog = require("../models/db-logSanctions")

class DB {

    async GetRoleMute(querry, key) {

        let data = await setRole.find(querry).clone().catch(error => console.log(error))
        const roleFound = data.map(k => k[key])

        return roleFound[0]

    }

    async GetMembersDataSanctions(querry, key) {

        let data = await saveData.find(querry).clone().catch(error => console.log(error))
        const rolesFound = data.map(k => k[key])

        return rolesFound[0]

    }

    async SaveDataSactions(obj) {

        const { user_id, server_id } = obj
        try {
            const existData = await saveData.findOne({ user_id, server_id })
            
            if (!existData) {
                const data = new saveData(obj)
                data.save()
            } else {
                await saveData.findOneAndReplace({ user_id, server_id }, obj, null, (error) => console.log(error)).clone().catch(error => console.log(error))
            }

        } catch (error) {
            console.log(error)
        }

    }

    async SaveLogData( obj ) {

        try {

            let log = new saveLog( obj )
            log.save()
            
        } catch (error) {
           console.log(error) 
        }

    }

    async GetLogDataLength() {
        const dataLength = await saveLog.estimatedDocumentCount()
        return dataLength
    }

    async GetLogData( querry, skip = 0 ) {

        let data = await saveLog.find(querry, null, {sort: { '_id' : -1 }} ).clone().catch(error => console.log(error))
        return data
    }

    SetNewMuteRole(obj) {

        try {
            const data = new setRole(obj)
            data.save()
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = DB