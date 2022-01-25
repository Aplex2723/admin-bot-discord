const fetch = require('node-fetch');
module.exports = {
    async configcheck(client) {
        if (!client.config.token) {
            console.log('No token detected in config file\nexiting....');
            process.exit();
        }
        if (!client.config.prefix) {
            console.log('No prefix detected in config file\nexiting....');
            process.exit();
        }
        if (!client.config.admin_id) {
            console.log('No adminid detected in config file\nexiting....');
            process.exit();
        } 
        if (!(client.config.results_perpage > 0) || !(client.config.results_perpage < 11)) {
            console.log('Results per page must be between 1 to 10\nexiting....');
            process.exit();
        }
        if (client.config.ownerid && isNaN(client.config.ownerid)) {
            console.log('Owner id must be a number\nexiting....');
            process.exit();
        }
        if (!client.config.custom_presence) {
            client.config.custom_presence = client.config.prefix + 'help';
        }
        if (client.config.status_channel_id && isNaN(client.config.status_channel_id)) {
            console.log('Channel id must be a number\nexiting....');
            process.exit();
        }
        if (client.config.statchan_update_interval && (isNaN(client.config.statchan_update_interval) || client.config.statchan_update_interval < 60)) {
            console.log('Status channel update interval must be at least 60 seconds or more\nexiting....');
            process.exit();
        }
        if (client.config.color) {
            client.color = '#' + client.config.color.replace(/#/gi, '');
        } else
            client.color = '#007acc';
        if (client.config.footer) {
            client.footer = client.config.footer;
        } else
            client.footer = 'Admin Bot version ' + require('../package.json').version;
    },

    timeformat(uptime) {
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        return (days > 0 ? days + " days, " : "") + (hours > 0 ? hours + " hours, " : "") + (minutes > 0 ? minutes + " minutes, " : "") + (seconds > 0 ? seconds + " seconds" : "");
    },

    async execute(url, id, cookie, cmd) {
        let response = await fetch(url + '/api/server/' + id + '/execute', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookie }, body: `{"command":"` + cmd + `"}` })
            .catch(() => { console.log('\x1b[31mWarning: ' + url + ' not reachable\x1b[0m') });

        if (!response) return [404, 'Not Reachable'];
        if (response.status === 401) return [401, 'Unauthorized'];
        if (response.status === 400) return [400, await response.text()];

        let data = await response.json();

        if (data.output.length !== 0) {
            let answers = [];
            var total = data.output.length;
            for (i = 0; i < total; i++) {
                if (data.output[i]) {
                    answers[i] = data.output[i];
                }
            }
            return [response.status, data.executionTimeMs, answers];
        }
        return [response.status, data.executionTimeMs, 'Command Executed Successfully'];
    },

};