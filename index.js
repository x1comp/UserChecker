const request = require('request');
const chalk = require('chalk');
const ProxyAgent = require('proxy-agent');
const prompt = require('prompt');
const UserAgent = require(`user-agents`);
const fs = require('fs');
const proxies = fs.readFileSync('./extra/proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
const usernames = [...new Set(fs.readFileSync('usernames.txt', 'utf-8').replace(/\r/g, '').split('\n'))];
const config = require("./extra/config.json");


process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.warn = () => {};

var available = 0;
var unavailable = 0;
var rate = 0;
var checked = 0;

function write(content, file) {
    fs.appendFile(file, content, function(err) {});
}

function pcheck(username) {
	var userAgent = new UserAgent();
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    var agent = new ProxyAgent(`${config.proxyType}://` + proxy);
    request({
        method: "HEAD",
        url: `https://www.tiktok.com/@${username}`,
		agent,
		headers: { 
			'User-Agent': userAgent.toString(),
			"accept-encoding": "gzip, deflate, br",
            'accept-language': 'en-US',
            'content-type': 'application/json'
		}
    }, (err, res, body) => {
		if(!res){ pcheck(username); }
		else{
			switch(res.statusCode){
				case 200: 
						unavailable++;
						console.log(chalk.red(`[${chalk.red('%s')}] (%s/%s/%s) [${chalk.red('Unavailable')}] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
						write(username + "\n", "usernames/unavailable.txt");
						
						break; 
				case 404: 
						available++;
						console.log(chalk.green(`[${chalk.green('%s')}] (%s/%s/%s) [${chalk.green('Available')}] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
						write(username + "\n", "usernames/available.txt");
						break; 
				case 429: 
						rate++;
						console.log(chalk.red("[${chalk.white('%s')}] (%s) Proxy: %s has been rate limited".inverse), res.statusCode, rate, proxy);
						pcheck(username);
						break; 
				default: 
						pcheck(username)
						break; 
			}
		}
        checked = available + unavailable;
        process.title = `UserChecker`;
    });
}

function check(username) {
	var userAgent = new UserAgent();
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    request({
        method: "HEAD",
        url: `https://www.tiktok.com/@${username}`,
		headers: { 
			'User-Agent': userAgent.toString(),
			"accept-encoding": "gzip, deflate, br",
            'accept-language': 'en-US',
            'content-type': 'application/json'
		}
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red(`[${chalk.red('%s')}] (%s/%s/%s) [${chalk.red('Unavailable')}] Username: %s `), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/unavailable.txt");
        } else if (res && res.statusCode === 404) {
            available++;
            console.log(chalk.green(`[${chalk.green('%s')}] (%s/%s/%s) [${chalk.green('Available')}] Username: %s `), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red(`[%s] (%s) you have been rate limited (${chalk.white('consider using a VPN while using proxyless!')})`.inverse), res.statusCode, rate);
            check(username);
        } else {
            check(username)
        }

        checked = available + unavailable;
        process.title = `UserChecker`;
    });
}

function Generate(dict, Size, Loops) {
    let Name = '';
    for (var i = 0; i < Size; i++) {
        Name = Name + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    console.log(Name);
    write(Name + "\n", "./extra/Generated.txt");
}


function printDetails() {
    console.log("");
	process.title = `UserChecker`;
    console.log(`[${chalk.green('!')}] UserChecker | Program created by ${chalk.bold.green('Diyon Shibu')}`);
}
printDetails();
console.log(chalk.magenta(`[${chalk.white('!')}] Proxied Checking is an experimental feature.`));
console.log("");
console.log(chalk.cyan("[1] Proxied Checker "));
console.log(chalk.yellow("[2] Proxyless Checker"));
console.log(chalk.cyan("[3] Username Creator"));
prompt.start();
console.log("");
prompt.get(['options'], function(err, result) {
    console.log('');
    var options = result.options;
    switch (options) {
        case "1":
            console.log(`[Tiktok Username Checker]: Started!`.inverse);
            console.log(`[Checking for %s Usernames With Proxies Enabled!]`.inverse, usernames.length, );
            for (var i in usernames) check(usernames[i]);
            break;

        case "2":
            console.log(`[Tiktok Username Checker]: Started!`.inverse);
            console.log(`[Checking for %s Usernames Without Proxies Enabled!]`.inverse, usernames.length, );
            for (var i in usernames) check(usernames[i]);
            break;
        case "3":
			console.clear();
            prompt.start()
            console.log("[?] How many  charachters would you like for each Username!");
            prompt.get(['Amount'], function(err, result) {
                var Size = result.Amount;
                console.log("[?] How many usernames would you like to generate!");
                prompt.get(['Generation'], function(err, result) {
                    var Loops = result.Generation;
                    console.log("");
                    console.log("[1] Dictionary Type | AlphaNumerical | abcdefghijklmnopqrstuvwxyz0123456789");
                    console.log("[2] Dictionary Type | Alphabet | abcdefghijklmnopqrstuvwxyz");
                    prompt.get(['Letters'], function(err, result) {
                        var Letters = result.Letters;
                        switch (Letters) {
                            case "1":
                                var dict = "abcdefghijklmnopqrstuvwxyz0123456789";
                                for (var i = 0; i < Loops; i++) {
                                    Generate(dict, Size, Loops);
                                }
                                break;
                            case "2":
                                var dict = "abcdefghijklmnopqrstuvwxyz";
                                for (var i = 0; i < Loops; i++) {
                                    Generate(dict, Size, Loops);
                                }
								console.log("[!] Usernames were generated Successfully! Look in Generated.txt to see the usernames usernames that were generated"); 
                                break;
                        }
                    })
                })
            })
            break;
    }
})