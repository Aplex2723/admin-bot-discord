const saveData = require('../models/db-userData')
const setRole = require('../models/db-roleData')

class DB {

    async GetRoleMute( querry, key ){

        let data = await setRole.find(querry, error => console.log(error)).clone().catch( error => console.log(error) )
        const roleFound = data.map( k => k[key] )

        return roleFound[0]

    }

    async GetMembersData( querry, key ){

        let data = await saveData.find(querry, error => console.log(error)).clone().catch( error => console.log(error) )
        const rolesFound = data.map( k => k[key] )

        return rolesFound[0]

    }

    async SaveData( obj ){

        const { user_id, channelId } = obj
        try {
            const existData = await saveData.findOne( {user_id, channelId} )

            console.log(existData)

            if( !existData ){
                const data = new saveData( obj ) 
                data.save()    
            }else {
                await saveData.findOneAndReplace( {user_id, channelId}, obj, null, ( error ) => console.log(error) ).clone().catch( error => console.log(error) )
            }

        } catch (error) {
            console.log(error)
        }

    }

    SetNewMuteRole( obj ) {

        try {
            const data = new setRole( obj ) 
            data.save()            
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports = DB