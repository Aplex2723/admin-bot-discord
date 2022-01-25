module.exports = async(button) => {

    if(button.id === 'button1'){
        button.channel.send("i like green")
    }

    button.defer()
}