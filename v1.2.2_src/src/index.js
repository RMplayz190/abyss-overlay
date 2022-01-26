const shell = require('electron').shell;
const remote = require('electron').remote;
const {app, BrowserWindow, Notification } = remote;
const fs = require('fs');
const con = remote.getGlobal('console');
const homedir = app.getPath('home');
window.$ = window.jQuery = require('jquery');
const Tail = require('tail').Tail;
const config = require('electron-json-config');
const path = require('path');
const Pickr = require('@simonwep/pickr');
const AutoGitUpdate = require('auto-git-update');


try{config.delete('players');}catch{config.set('error', 1);}
var players = [], numplayers = 0, key = config.get('key', '1'), apilink = `https://api.hypixel.net/player?key=${key}&uuid=`, playerdb = 'https://playerdb.co/api/player/minecraft/', goodkey = true, logpath = '', goodfile = true, currentWindow = '', user = undefined, sent = false, usernick = undefined, winheight = 600, inlobby = true, zoom = 1, boosters = [], gamemode = config.get('settings.gamemode', 0); gmode = config.get('settings.bwgmode', ''); guildlist = false;

$.ajax({type: 'GET', async: true, dataType: 'json', url: 'https://raw.githubusercontent.com/Chit132/abyss-overlay-stuffs/main/boosters.json', success: (data) => {
    for (let i = 0; i < data.length; i++){
        boosters.push(data[i].uuid);
    }
}});

const updater = new AutoGitUpdate({repository: 'https://github.com/Chit132/abyss-overlay', tempLocation: homedir});
async function versionCompare(){
    try{
        const versions = await updater.compareVersions();
        return versions.upToDate;
    }
    catch{return false;}
}
versionCompare().then((uptodate) => {
    if (!uptodate){
        $('#update').css('display', 'inline-block');
        const notification = {
            title: 'UPDATE AVAILABLE!',
            body: 'To update, join the Discord, click on the update button, or click on this notification!',
            icon: path.join(__dirname, '../assets/logo.ico')
        };
        const updatenotif = new Notification(notification);
        updatenotif.on('click', () => {shell.openExternal('https://discord.gg/7dexcJTyCJ'); shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');});
        updatenotif.show();
    }
});

function verifyKey(){
    $.ajax({type: 'GET', async: false, url: 'https://api.hypixel.net/key?key='+key, success: (data) => {
        if (data.success === true){
            keygot = true;
            $.ajax({type: 'GET', async: false, url: `https://api.mojang.com/user/profiles/${data.record.owner}/names`, success: (names) => {user = names[names.length-1].name;}});
        }
    }});
}

function starColor(stars){
    if (gamemode === 0){
        if (stars < 100) return `<span style="color: #AAAAAA;">[${stars}✫]</span>`;
        else if (stars < 200) return `<span style="color: #FFFFFF">[${stars}✫]</span>`;
        else if (stars < 300) return `<span style="color: #FFAA00">[${stars}✫]</span>`;
        else if (stars < 400) return `<span style="color: #55FFFF">[${stars}✫]</span>`;
        else if (stars < 500) return `<span style="color: #00AA00">[${stars}✫]</span>`;
        else if (stars < 600) return `<span style="color: #00AAAA">[${stars}✫]</span>`;
        else if (stars < 700) return `<span style="color: #AA0000">[${stars}✫]</span>`;
        else if (stars < 800) return `<span style="color: #FF55FF">[${stars}✫]</span>`;
        else if (stars < 900) return `<span style="color: #5555FF">[${stars}✫]</span>`;
        else if (stars < 1000) return `<span style="color: #AA00AA">[${stars}✫]</span>`;
        else if (stars < 1100) return `<span style="color: #FF5555">[<span style="color: #FFAA00">1</span><span style="color: #FFFF55">${Math.floor((stars%1000)/100)}</span><span style="color: #55FF55">${Math.floor((stars%100)/10)}</span><span style="color: #55FFFF">${stars%10}</span><span style="color: #FF55FF">✫</span><span style="color: #AA00AA">]</span>`;
        else if (stars < 1200) return `<span style="color: #AAAAAA">[</span><span style="color: #FFFFFF">1${stars%1000}</span><span style="color: #AAAAAA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1300) return `<span style="color: #AAAAAA">[</span><span style="color: #FFFF55">1${stars%1000}</span><span style="color: #FFAA00">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1400) return `<span style="color: #AAAAAA">[</span><span style="color: #55FFFF">1${stars%1000}</span><span style="color: #00AAAA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1500) return `<span style="color: #AAAAAA">[</span><span style="color: #55FF55">1${stars%1000}</span><span style="color: #00AA00">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1600) return `<span style="color: #AAAAAA">[</span><span style="color: #00AAAA">1${stars%1000}</span><span style="color: #5555FF">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1700) return `<span style="color: #AAAAAA">[</span><span style="color: #FF5555">1${stars%1000}</span><span style="color: #AA0000">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1800) return `<span style="color: #AAAAAA">[</span><span style="color: #FF55FF">1${stars%1000}</span><span style="color: #AA00AA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1900) return `<span style="color: #AAAAAA">[</span><span style="color: #5555FF">1${stars%1000}</span><span style="color: #0000AA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 2000) return `<span style="color: #AAAAAA">[</span><span style="color: #AA00AA">1${stars%1000}</span><span style="color: #555555">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 2100) return `<span style="color: #555555">[</span><span style="color: #AAAAAA">2</span><span style="color: #FFFFFF">0${Math.floor((stars%100)/10)}</span><span style="color: #AAAAAA">${stars%10}✪</span><span style="color: #555555">]</span>`
        else if (stars < 2200) return `<span style="color: #FFFFFF">[2</span><span style="color: #FFFF55">1${Math.floor((stars-2100)/10)}</span><span style="color: #FFAA00">${stars%10}⚝]</span>`;
        else if (stars < 2300) return `<span style="color: #FFAA00">[2</span><span style="color: #FFFFFF">2${Math.floor((stars-2200)/10)}</span><span style="color: #55FFFF">${stars%10}</span><span style="color: #00AAAA">⚝]</span>`;
        else if (stars < 2400) return `<span style="color: #AA00AA">[2</span><span style="color: #FF55FF">3${Math.floor((stars-2300)/10)}</span><span style="color: #FFAA00">${stars%10}</span><span style="color: #FFFF55">⚝]</span>`;
        else if (stars < 2500) return `<span style="color: #55FFFF">[2</span><span style="color: #FFFFFF">4${Math.floor((stars-2400)/10)}</span><span style="color: #AAAAAA">${stars%10}⚝</span><span style="color: #555555">]</span>`;
        else if (stars < 2600) return `<span style="color: #FFFFFF">[2</span><span style="color: #55FF55">5${Math.floor((stars-2500)/10)}</span><span style="color: #00AA00">${stars%10}⚝]</span>`;
        else if (stars < 2700) return `<span style="color: #AA0000">[2</span><span style="color: #FF5555">6${Math.floor((stars-2600)/10)}</span><span style="color: #FF55FF">${stars%10}⚝</span><span style="color: #AA00AA">]</span>`;
        else if (stars < 2800) return `<span style="color: #FFFF55">[2</span><span style="color: #FFFFFF">7${Math.floor((stars-2700)/10)}</span><span style="color: #555555">${stars%10}⚝]</span>`;
        else if (stars < 2900) return `<span style="color: #55FF55">[2</span><span style="color: #00AA00">8${Math.floor((stars-2800)/10)}</span><span style="color: #FFAA00">${stars%10}⚝</span><span style="color: #FF5555">]</span>`;
        else if (stars < 3000) return `<span style="color: #55FFFF">[2</span><span style="color: #00AAAA">9${Math.floor((stars-2900)/10)}</span><span style="color: #5555FF">${stars%10}⚝</span><span style="color: #0000AA">]</span>`;
        else return `<span style="color: #FFFF55">[3</span><span style="color: #FFAA00">${Math.floor((stars-3000)/10)}</span><span style="color: #FF5555">${stars%10}⚝</span><span style="color: #AA0000">]</span>`;
    }
    else if (gamemode === 1){
        if (stars < 5) return `<span style="color: #AAAAAA;">[${stars}⚔]</span>`;
        else if (stars < 10) return `<span style="color: #FFFFFF;">[${stars}✙]</span>`;
        else if (stars < 15) return `<span style="color: #FFAA00;">[${stars}❤]</span>`;
        else if (stars < 20) return `<span style="color: #55FFFF;">[${stars}☠]</span>`;
        else if (stars < 25) return `<span style="color: #00AA00;">[${stars}✦]</span>`;
        else if (stars < 30) return `<span style="color: #00AAAA;">[${stars}✌]</span>`;
        else if (stars < 35) return `<span style="color: #AA0000;">[${stars}❦]</span>`;
        else if (stars < 40) return `<span style="color: #FF55FF;">[${stars}✵]</span>`;
        else if (stars < 45) return `<span style="color: #5555FF;">[${stars}❣]</span>`;
        else if (stars < 50) return `<span style="color: #AA00AA;">[${stars}☯]</span>`;
        else if (stars < 60) return `<span style="color: #FF5555;">[${stars}✺]</span>`;
        else return `<span style="color: #FF5555;">[${stars}ಠ_ಠ]</span>`;
    }
    else if (gamemode === 2){//stars are wins for duels
        if (stars < 100) return '';
        else if (stars < 120) return `<span style="color: #AAAAAA;">[I]</span>`;
        else if (stars < 140) return `<span style="color: #AAAAAA;">[II]</span>`;
        else if (stars < 160) return `<span style="color: #AAAAAA;">[III]</span>`;
        else if (stars < 180) return `<span style="color: #AAAAAA;">[IV]</span>`;
        else if (stars < 200) return `<span style="color: #AAAAAA;">[V]</span>`;
        else if (stars < 260) return `<span style="color: #FFFFFF;">[I]</span>`;
        else if (stars < 320) return `<span style="color: #FFFFFF;">[II]</span>`;
        else if (stars < 380) return `<span style="color: #FFFFFF;">[III]</span>`;
        else if (stars < 440) return `<span style="color: #FFFFFF;">[IV]</span>`;
        else if (stars < 500) return `<span style="color: #FFFFFF;">[V]</span>`;
        else if (stars < 600) return `<span style="color: #FFAA00;">[I]</span>`;
        else if (stars < 700) return `<span style="color: #FFAA00;">[II]</span>`;
        else if (stars < 800) return `<span style="color: #FFAA00;">[III]</span>`;
        else if (stars < 900) return `<span style="color: #FFAA00;">[IV]</span>`;
        else if (stars < 1000) return `<span style="color: #FFAA00;">[V]</span>`;
        else if (stars < 1200) return `<span style="color: #00AAAA;">[I]</span>`;
        else if (stars < 1400) return `<span style="color: #00AAAA;">[II]</span>`;
        else if (stars < 1600) return `<span style="color: #00AAAA;">[III]</span>`;
        else if (stars < 1800) return `<span style="color: #00AAAA;">[IV]</span>`;
        else if (stars < 2000) return `<span style="color: #00AAAA;">[V]</span>`;
        else if (stars < 2400) return `<span style="color: #00AA00;">[I]</span>`;
        else if (stars < 2800) return `<span style="color: #00AA00;">[II]</span>`;
        else if (stars < 3200) return `<span style="color: #00AA00;">[III]</span>`;
        else if (stars < 3600) return `<span style="color: #00AA00;">[IV]</span>`;
        else if (stars < 4000) return `<span style="color: #00AA00;">[V]</span>`;
        else if (stars < 5200) return `<span style="color: #AA0000;">[I]</span>`;
        else if (stars < 6400) return `<span style="color: #AA0000;">[II]</span>`;
        else if (stars < 7600) return `<span style="color: #AA0000;">[III]</span>`;
        else if (stars < 8800) return `<span style="color: #AA0000;">[IV]</span>`;
        else if (stars < 10000) return `<span style="color: #AA0000;">[V]</span>`;
        else if (stars < 12000) return `<span style="color: #FFFF55;">[I]</span>`;
        else if (stars < 14000) return `<span style="color: #FFFF55;">[II]</span>`;
        else if (stars < 16000) return `<span style="color: #FFFF55;">[III]</span>`;
        else if (stars < 18000) return `<span style="color: #FFFF55;">[IV]</span>`;
        else if (stars < 20000) return `<span style="color: #FFFF55;">[V]</span>`;
        else if (stars < 24000) return `<span style="color: #AA00AA;">[I]</span>`;
        else if (stars < 28000) return `<span style="color: #AA00AA;">[II]</span>`;
        else if (stars < 32000) return `<span style="color: #AA00AA;">[III]</span>`;
        else if (stars < 36000) return `<span style="color: #AA00AA;">[IV]</span>`;
        else if (stars < 40000) return `<span style="color: #AA00AA;">[V]</span>`;
        else if (stars < 44000) return `<span style="color: #AA00AA;">[VI]</span>`;
        else if (stars < 48000) return `<span style="color: #AA00AA;">[VII]</span>`;
        else if (stars < 52000) return `<span style="color: #AA00AA;">[VIII]</span>`;
        else if (stars < 56000) return `<span style="color: #AA00AA;">[IX]</span>`;
        else return `<span style="color: #AA00AA;">[X]</span>`;
    }
}
function nameColor(api){
    let rank = api.newPackageRank;
    //add rankcolor for yts and staff
    let plus = api.rankPlusColor;
    if (plus !== undefined){
        if (plus === 'RED') plus = '#FF5555';
        else if (plus === 'GOLD') plus = '#FFAA00';
        else if (plus === 'GREEN') plus = '#55FF55';
        else if (plus === 'YELLOW') plus = '#FFFF55';
        else if (plus === 'LIGHT_PURPLE') plus = '#FF55FF';
        else if (plus === 'WHITE') plus = '#FFFFFF';
        else if (plus === 'BLUE') plus = '#5555FF';
        else if (plus === 'DARK_GREEN') plus = '#00AA00';
        else if (plus === 'DARK_RED') plus = '#AA0000';
        else if (plus === 'DARK_AQUA') plus = '#00AAAA';
        else if (plus === 'DARK_PURPLE') plus = '#AA00AA';
        else if (plus === 'DARK_GRAY') plus = '#555555';
        else if (plus === 'BLACK') plus = '#000000';
        else if (plus === 'DARK_BLUE') plus = '#0000AA';
    }
    else plus = '#FF5555';
    if (api.rank !== undefined){
        if (api.rank === 'YOUTUBER') return `<span style="color: #FF5555;">[</span><span style="color: #FFFFFF;">YT</span><span style="color: #FF5555;">] ${api.displayname}</span>`;
        else if (api.rank === 'ADMIN') return `<span style="color: #AA0000">[ADMIN] ${api.displayname}</span>`;
        else if (api.rank === 'MODERATOR') return `<span style="color: #00AA00">[MOD] ${api.displayname}</span>`;
        else if (api.rank === 'HELPER') return `<span style="color: #5555FF">[HELP] ${api.displayname}</span>`;
    }
    else if (rank === 'MVP_PLUS'){
        if (api.monthlyPackageRank === 'NONE' || !api.hasOwnProperty('monthlyPackageRank')) return `<span style="color: #55FFFF;">[MVP</span><span style="color: ${plus}">+</span><span style="color: #55FFFF;">] ${api.displayname}</span>`;
        else return `<span style="color: #FFAA00;">[MVP</span><span style="color: ${plus}">++</span><span style="color: #FFAA00;">] ${api.displayname}</span>`;
    }
    else if (rank === 'MVP') return `<span style="color: #55FFFF;">[MVP] ${api.displayname}</span>`;
    else if (rank === 'VIP_PLUS') return `<span style="color: #55FF55;">[VIP</span><span style="color: #FFAA00;">+</span><span style="color: #55FF55;">] ${api.displayname}</span>`;
    else if (rank === 'VIP') return `<span style="color: #55FF55;">[VIP] ${api.displayname}</span>`;
    else return `<span style="color: #AAAAAA;">${api.displayname}</span>`;
}
function getTag(api){
    try{
        if (api.inParty) return ['P', '#03C800'];
        else if (api.call) return ['CALL', '#00C2A2'];
        else if (api.partyReq) return ['PREQ', '#37B836'];
        else if (api.friendReq) return ['FREQ', '#D6D600'];
        else if (api.guildList) return ['GLD', '#36C700'];
        else if (api.id === 'df954981d7204b4d84e19d294f703868') return ['DEV', '#AA00AA'];
        else if (api.id === '6440f5d5cc30428c812deb892c5cd411') return ['QT♡', '#FFB69D'];
        else if (api.id === '2b034ebee1514b75a8a67c50d8c7fd29') return ['✨', '#E998B7'];
        else if (api.id === 'c2291b87d894461daca36be83fc51310' || api.id === '48ed8ffb95ec4647b7c1c5990d40a6f2' || api.id === '9b5aeb7e3d9b43b2b026b2e444da24ff' || api.id === '01f32cf78b1a4d2f8b15b477c65f7fb7' || api.id === '01c59560e6014b9aa84c24877c485f63' || api.id === 'a3cef65ded744b739f8e46db5d87d6a3' || api.id === '2f457183cca44a3ea923a03af37de287') return ['QT', '#E998B7'];
        else if (boosters.includes(api.id)) return ['BST⬢', '#D071DA'];
        else if ((api.achievements.bedwars_level < 15 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars > 5) || (api.achievements.bedwars_level > 15 && api.achievements.bedwars_level < 100 && api.achievements.bedwars_level/(api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars) <= 5)) return ['ALT', '#5555FF'];
        else if (api.achievements.bedwars_level < 150 && api.stats.Bedwars.final_deaths_bedwars/api.stats.Bedwars.losses_bedwars < 0.75 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars < 1.5) return ['SNPR', '#FF5555'];
        else if (api.channel === 'PARTY') return ['PRTY', '#FFB900'];
        else return ['-', '#AAAAAA'];
    }
    catch{return ['-', '#AAAAAA'];}
}
function wsColor(ws){
    try{
        if (gamemode === 0){
            if (ws < 4) return '#AAAAAA';
            else if (ws < 10) return '#FFFFFF';//100 stars
            else if (ws < 25) return '#FFAA00';//200 stars
            else if (ws < 50) return '#00AAAA';//500 stars
            else if (ws < 100) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            let nwl = ws;
            if (nwl < 50) return '#AAAAAA';
            else if (nwl < 100) return '#FFFFFF';//100 stars
            else if (nwl < 150) return '#FFAA00';//200 stars
            else if (nwl < 200) return '#00AAAA';//500 stars
            else if (nwl < 250) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (ws < 4) return '#AAAAAA';
            else if (ws < 10) return '#FFFFFF';//100 stars
            else if (ws < 25) return '#FFAA00';//200 stars
            else if (ws < 50) return '#00AAAA';//500 stars
            else if (ws < 100) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}
function fkdrColor(fkdr){
    try{
        if (gamemode === 0){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 3) return '#FFFFFF';//100 stars
            else if (fkdr < 5) return '#FFAA00';//200 stars
            else if (fkdr < 10) return '#00AAAA';//500 stars
            else if (fkdr < 25) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 2) return '#FFFFFF';//100 stars
            else if (fkdr < 3) return '#FFAA00';//200 stars
            else if (fkdr < 4) return '#00AAAA';//500 stars
            else if (fkdr < 5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 2) return '#FFFFFF';//100 stars
            else if (fkdr < 3) return '#FFAA00';//200 stars
            else if (fkdr < 5) return '#00AAAA';//500 stars
            else if (fkdr < 7.5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}
function wlrColor(wlr){
    try{
        if (gamemode === 0){
            if (wlr < 1) return '#AAAAAA';
            else if (wlr < 2) return '#FFFFFF';//100 stars
            else if (wlr < 5) return '#FFAA00';//200 stars
            else if (wlr < 7) return '#00AAAA';//500 stars
            else if (wlr < 10) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (wlr < 0.1) return '#AAAAAA';
            else if (wlr < 0.25) return '#FFFFFF';//100 stars
            else if (wlr < 0.5) return '#FFAA00';//200 stars
            else if (wlr < 0.75) return '#00AAAA';//500 stars
            else if (wlr < 1) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (wlr < 1) return '#AAAAAA';
            else if (wlr < 2) return '#FFFFFF';//100 stars
            else if (wlr < 3) return '#FFAA00';//200 stars
            else if (wlr < 5) return '#00AAAA';//500 stars
            else if (wlr < 7.5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}
function bblrColor(bblr){
    try{
        if (bblr < 1) return '#AAAAAA';
        else if (bblr < 2) return '#FFFFFF';//100 stars
        else if (bblr < 3) return '#FFAA00';//200 stars
        else if (bblr < 5) return '#00AAAA';//500 stars
        else if (bblr < 7.5) return '#AA0000';//600 stars
        else return '#AA00AA';//900 stars
    }
    catch{return '#AAAAAA';}
}
function finalsColor(finals){
    try{
        if (gamemode === 0){
            if (finals < 1000) return '#AAAAAA';
            else if (finals < 5000) return '#FFFFFF';//100 stars
            else if (finals < 10000) return '#FFAA00';//200 stars
            else if (finals < 20000) return '#00AAAA';//500 stars
            else if (finals < 30000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (finals < 1000) return '#AAAAAA';
            else if (finals < 5000) return '#FFFFFF';//100 stars
            else if (finals < 15000) return '#FFAA00';//200 stars
            else if (finals < 30000) return '#00AAAA';//500 stars
            else if (finals < 75000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (finals < 500) return '#AAAAAA';
            else if (finals < 1500) return '#FFFFFF';//100 stars
            else if (finals < 4000) return '#FFAA00';//200 stars
            else if (finals < 10000) return '#00AAAA';//500 stars
            else if (finals < 17500) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}
function winsColor(wins){
    try{
        if (gamemode === 0){
            if (wins < 500) return '#AAAAAA';
            else if (wins < 1000) return '#FFFFFF';//100 stars
            else if (wins < 3000) return '#FFAA00';//200 stars
            else if (wins < 5000) return '#00AAAA';//500 stars
            else if (wins < 10000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (wins < 100) return '#AAAAAA';
            else if (wins < 750) return '#FFFFFF';//100 stars
            else if (wins < 4000) return '#FFAA00';//200 stars
            else if (wins < 10000) return '#00AAAA';//500 stars
            else if (wins < 25000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (wins < 500) return '#AAAAAA';
            else if (wins < 1500) return '#FFFFFF';//100 stars
            else if (wins < 4000) return '#FFAA00';//200 stars
            else if (wins < 10000) return '#00AAAA';//500 stars
            else if (wins < 17500) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}
function NWL(exp){
    const base = 10000;
    const growth = 2500;
    const reversePqPrefix = -(base - 0.5 * growth) / growth;
    const reverseConst = reversePqPrefix ** 2;
    return exp < 0 ? 1 : parseFloat(Math.floor(1 + reversePqPrefix + Math.sqrt(reverseConst + (2/growth) * exp)));
}

function updateHTML(){
    let namehtml = '', taghtml = ''; wshtml = '', fkdrhtml = '', wlrhtml = '', bblrhtml = '', finalshtml = '', winshtml = '';
    //con.log('changing 1');
    if (!goodfile){namehtml += '<li style="color: #FF0000">NO CLIENT PATH FOUND</li>'; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>'; namehtml += `<li style="color: #FF0000">MISSING CLIENT LOGS FILE</li>`; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>';}
    else if (!goodkey){namehtml += '<li style="color: #FF0000">MISSING/INVALID API KEY</li>'; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>'; namehtml += `<li style="color: #FF0000">RUN COMMAND "/api new"</li>`; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>';}
    for (let i = 0; i < players.length; i++){
        //con.log(players[i].name);
        let stars = '', starsColor = '#AAAAAA'; avatar = 'https://visage.surgeplay.com/face/48/ec561538f3fd461daff5086b22154bce.png';//tagColor = '#AAAAAA';
        if (players[i].api === undefined){
            //con.log(players[i].api.stats.Bedwars.winstreak).catch;
            taghtml += '<li>-</li>'; wshtml += '<li>-</li>'; fkdrhtml += '<li>-</li>'; wlrhtml += '<li>-</li>'; bblrhtml += '<li>-</li>'; finalshtml += '<li>-</li>'; winshtml += '<li>-</li>';
            namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${players[i].namehtml}</li>`;
        }
        else if (!players[i].api){
            avatar = '../assets/questionmark.png';
            namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${players[i].name}</li>`; taghtml += '<li style="color: #F3FF00">NICK</li>'; wshtml += '<li>-</li>'; fkdrhtml += '<li>-</li>'; wlrhtml += '<li>-</li>'; bblrhtml += '<li>-</li>'; finalshtml += '<li>-</li>'; winshtml += '<li>-</li>';
        }
        else{
            if (players[i].avatar !== undefined){namehtml += players[i].namehtml; taghtml += players[i].taghtml; wshtml += players[i].wshtml; fkdrhtml += players[i].fkdrhtml; wlrhtml += players[i].wlrhtml; bblrhtml += players[i].bblrhtml; finalshtml += players[i].finalshtml; winshtml += players[i].winshtml;}
            else{
                stars = '[0✫] '; ttaghtml = '<li>-</li>'; twshtml = '<li>0</li>'; tfkdrhtml = '<li>0</li>'; twlrhtml = '<li>0</li>'; tbblrhtml = '<li>0</li>'; tfinalshtml = '<li>0</li>'; twinshtml = '<li>0</li>';
                if (players[i].api.stats === undefined){}
                else if (players[i].api.stats.Bedwars === undefined){}
                else{
                    let tfkdr = 0, twlr = 0, tbblr = 0;
                    if (players[i].api.achievements !== undefined && players[i].api.achievements.bedwars_level !== undefined){stars = `[${players[i].api.achievements.bedwars_level}✫] `; starsColor = starColor(players[i].api.achievements.bedwars_level);}
                    if (players[i].api.uuid !== undefined) avatar = `https://visage.surgeplay.com/face/48/${players[i].api.uuid}.png`;
                    if (players[i].api.stats.Bedwars.winstreak !== undefined) twshtml = `<li style="color: ${wsColor(players[i].api.stats.Bedwars.winstreak)}">${players[i].api.stats.Bedwars.winstreak}</li>`;
                    if (players[i].api.stats.Bedwars.final_kills_bedwars !== undefined && players[i].api.stats.Bedwars.final_deaths_bedwars !== undefined) tfkdr = parseFloat(players[i].api.stats.Bedwars.final_kills_bedwars/players[i].api.stats.Bedwars.final_deaths_bedwars).toFixed(2); tfkdrhtml = `<li style="color: ${fkdrColor(tfkdr)}">${tfkdr}</li>`;
                    //players[i].api.achievements.bedwars_level*Math.pow(players[i].api.stats.Bedwars.final_kills_bedwars/players[i].api.stats.Bedwars.final_deaths_bedwars, 2);
                    if (players[i].api.stats.Bedwars.wins_bedwars !== undefined && players[i].api.stats.Bedwars.losses_bedwars !== undefined) twlr = parseFloat(players[i].api.stats.Bedwars.wins_bedwars/players[i].api.stats.Bedwars.losses_bedwars).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;
                    if (players[i].api.stats.Bedwars.beds_broken_bedwars !== undefined && players[i].api.stats.Bedwars.beds_lost_bedwars !== undefined) tbblr = parseFloat(players[i].api.stats.Bedwars.beds_broken_bedwars/players[i].api.stats.Bedwars.beds_lost_bedwars).toFixed(2); tbblrhtml = `<li style="color: ${bblrColor(tbblr)}">${tbblr}</li>`;
                    if (players[i].api.stats.Bedwars.final_kills_bedwars !== undefined) tfinalshtml = `<li style="color: ${finalsColor(players[i].api.stats.Bedwars.final_kills_bedwars)}">${players[i].api.stats.Bedwars.final_kills_bedwars}</li>`;
                    if (players[i].api.stats.Bedwars.wins_bedwars !== undefined) twinshtml = `<li style="color: ${winsColor(players[i].api.stats.Bedwars.wins_bedwars)}">${players[i].api.stats.Bedwars.wins_bedwars}</li>`;
                }
                let tag = getTag(players[i].api); ttaghtml = `<li style="color: ${tag[1]}">${tag[0]}</li>`;
                namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${stars}${players[i].namehtml}</li>`; taghtml += ttaghtml; wshtml += twshtml; fkdrhtml += tfkdrhtml; wlrhtml += twlrhtml; bblrhtml += tbblrhtml; finalshtml += tfinalshtml; winshtml += twinshtml;
            }
        }
    }
    //con.log('changing 2');
    if (numplayers === 0){
        $('#playertitle').html('PLAYERS');
        $('#playertitle').css({'background': '-webkit-linear-gradient(rgb(237, 146, 255), rgb(255, 255, 255)',  'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
    }
    else if (players.length < numplayers){
        let tplength = players.length;
        if (config.get('settings.unnick', false)) tplength--;
        namehtml += '<li style="color: #FF0000">MISSING PLAYERS</li><li style="color: #FF0000">RUN COMMAND "/who"</li>';
        $('#playertitle').html(`${tplength} PLAYERS`);
        $('#playertitle').css({'background': '-webkit-linear-gradient(rgb(180, 0, 0), rgb(255, 255, 255)',  'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
    }
    else if (players.length >= numplayers){
        let tplength = players.length;
        if (config.get('settings.unnick', false)) tplength--;
        $('#playertitle').html(`${tplength} PLAYERS`);
        $('#playertitle').css({'background': '-webkit-linear-gradient(rgb(0, 180, 96), rgb(255, 255, 255)',  'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
    }
    else{
        $('#playertitle').html('PLAYERS');
        $('#playertitle').css({'background': '-webkit-linear-gradient(rgb(237, 146, 255), rgb(255, 255, 255)',  'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
    }
    $('#ign').html(namehtml); $('#tag').html(taghtml); $('#ws').html(wshtml); $('#fkdr').html(fkdrhtml); $('#wlr').html(wlrhtml); $('#bblr').html(bblrhtml); $('#finals').html(finalshtml); $('#wins').html(winshtml);
    //con.log('changing 3 ', Math.random());
}

function updateArray(){
    let obj = {};
    for (let i = 0; i < players.length; i++)
        obj[players[i]['name']] = players[i];
    let tplayers = new Array();
    for (let key in obj)
        tplayers.push(obj[key]);
    players = tplayers;
    if (players.length === 0) return updateHTML();
    if (gamemode === 0){
        for (let i = 0; i < players.length; i++){
            if (players[i].index === undefined){
                try{
                    if (!players[i].api) players[i].index = -1;
                    else{
                        players[i].index = players[i].api.achievements.bedwars_level*Math.pow(players[i].api.stats.Bedwars[`${gmode}final_kills_bedwars`]/players[i].api.stats.Bedwars[`${gmode}final_deaths_bedwars`], 2);
                        if (isNaN(players[i].index)) players[i].index = 0;
                    }
                }
                catch (e){
                    players[i].index = 0;
                }
            }
        }
        players.sort((a, b) => ((a.index < b.index) ? 1 : -1));
    }
    else if (gamemode === 1){
        for (let i = 0; i < players.length; i++){
            if (players[i].swlvl === undefined){
                try{
                    if (!players[i].api) players[i].swlvl = -1;
                    else players[i].swlvl = 0;
                }
                catch (e){
                    players[i].swlvl = 0;
                }
            }
        }
        players.sort((a, b) => (b.swlvl - a.swlvl));
    }
    else if (gamemode === 2){
        for (let i = 0; i < players.length; i++){
            if (players[i].dwins === undefined){
                try{
                    if (!players[i].api) players[i].dwins = -1;
                    else players[i].dwins = 0;
                }
                catch (e){
                    players[i].dwins = 0;
                }
            }
        }
        players.sort((a, b) => (b.dwins - a.dwins));
    }
    updateHTML(players);
    /*let  temp = '';
    for (let i = 0; i < players.length; i++) temp += players[i].index + ' ';
    con.log(temp);*/
}

function addPlayer(ign, e = 0){
    let got = false, api = '', uuid = '';
    $.ajax({type: 'GET', async: true, url: playerdb+ign, success: (data) => {
        uuid = data.data.player.raw_id; got = true; ign = data.data.player.username;
        if (got){
            $.ajax({type: 'GET', async: true, url: apilink+uuid, success: (data) => {
                //con.log(data.player.displayname);
                if (data.success === true && data.player !== null){
                    let tswlvl = -1, tdwins = -1;
                    if (data.player.displayname === ign){
                        api = data.player; api.id = uuid; config.set(`players.${ign}`, api); config.set(`players.${ign}.time`, new Date()); setTimeout(clearPlayer, 360000, ign); got = true;
                        if (gamemode === 0){
                            let stars = '<span>[0✫]</span>', ttaghtml = '<li>-</li>', twshtml = '<li>0</li>', tfkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tfinalshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                            let avatar = `https://visage.surgeplay.com/face/48/${api.id}.png`;
                            if (api.stats === undefined){}
                            else if (api.stats.Bedwars === undefined){}
                            else{
                                let tfkdr = 0, twlr = 0;//tbblr = 0;
                                if (api.achievements !== undefined && api.achievements.bedwars_level !== undefined){stars = starColor(api.achievements.bedwars_level);}
                                if (api.stats.Bedwars[`${gmode}winstreak`] !== undefined) twshtml = `<li style="color: ${wsColor(api.stats.Bedwars[`${gmode}winstreak`])}">${api.stats.Bedwars[`${gmode}winstreak`]}</li>`;
                                if (api.stats.Bedwars[`${gmode}final_kills_bedwars`] !== undefined && api.stats.Bedwars[`${gmode}final_deaths_bedwars`] !== undefined) tfkdr = parseFloat(api.stats.Bedwars[`${gmode}final_kills_bedwars`]/api.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(2); tfkdrhtml = `<li style="color: ${fkdrColor(tfkdr)}">${tfkdr}</li>`;
                                if (api.stats.Bedwars[`${gmode}wins_bedwars`] !== undefined && api.stats.Bedwars[`${gmode}losses_bedwars`] !== undefined) twlr = parseFloat(api.stats.Bedwars[`${gmode}wins_bedwars`]/api.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;
                                //if (api.stats.Bedwars.beds_broken_bedwars !== undefined && api.stats.Bedwars.beds_lost_bedwars !== undefined) tbblr = parseFloat(api.stats.Bedwars.beds_broken_bedwars/api.stats.Bedwars.beds_lost_bedwars).toFixed(2); tbblrhtml = `<li style="color: ${bblrColor(tbblr)}">${tbblr}</li>`;
                                if (api.stats.Bedwars[`${gmode}final_kills_bedwars`] !== undefined) tfinalshtml = `<li style="color: ${finalsColor(api.stats.Bedwars[`${gmode}final_kills_bedwars`])}">${api.stats.Bedwars[`${gmode}final_kills_bedwars`]}</li>`;
                                if (api.stats.Bedwars[`${gmode}wins_bedwars`] !== undefined) twinshtml = `<li style="color: ${winsColor(api.stats.Bedwars[`${gmode}wins_bedwars`])}">${api.stats.Bedwars[`${gmode}wins_bedwars`]}</li>`;
                            }
                            if (e === 1) api.inParty = true;
                            else if (e === 2) api.call = true;
                            else if (e === 3) api.partyReq = true;
                            else if (e === 4) api.friendReq = true;
                            else if (e === 5) api.guildList = true;
                            let tag = getTag(api); ttaghtml = `<li style="color: ${tag[1]}">${tag[0]}</li>`;
                            let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${stars} ${nameColor(api)}</li>`;
                            players.push({name: ign, api: api, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: twshtml, fkdrhtml: tfkdrhtml, wlrhtml: twlrhtml, finalshtml: tfinalshtml, winshtml: twinshtml});
                        }
                        else if (gamemode === 1){
                            let level = '<span>[0⚔]</span>', ttaghtml = '<li>-</li>', tnwlhtml = '<li>0</li>', tkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tkillshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                            let avatar = `https://visage.surgeplay.com/face/48/${api.id}.png`;
                            tswlvl = 0;
                            if (api.stats === undefined){}
                            else if (api.stats.SkyWars === undefined){}
                            else{
                                let tkdr = 0, twlr = 0;
                                if (api.stats.SkyWars.skywars_experience !== undefined){
                                    let xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000], xp = api.stats.SkyWars.skywars_experience, lvl = 0;
                                    if(xp >= 15000){
                                        lvl = parseFloat((xp - 15000) / 10000 + 12).toFixed(0);
                                    }
                                    else{
                                        for (let i = 0; i < xps.length; i++){
                                            if(xp < xps[i]) {
                                                lvl = parseFloat(Math.floor(1 + i + (xp - xps[i-1]) / (xps[i] - xps[i-1])));
                                                break;
                                            }
                                        }
                                    }
                                    level = starColor(lvl); tswlvl = lvl;
                                }
                                if (api.networkExp !== undefined){let tnwl = NWL(api.networkExp); tnwlhtml = `<li style="color: ${wsColor(tnwl)}">${tnwl}</li>`;}
                                if (api.stats.SkyWars.kills !== undefined && api.stats.SkyWars.deaths !== undefined) tkdr = parseFloat(api.stats.SkyWars.kills/api.stats.SkyWars.deaths).toFixed(2); tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;
                                if (api.stats.SkyWars.wins !== undefined && api.stats.SkyWars.losses !== undefined) twlr = parseFloat(api.stats.SkyWars.wins/api.stats.SkyWars.losses).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;
                                if (api.stats.SkyWars.kills !== undefined) tkillshtml = `<li style="color: ${finalsColor(api.stats.SkyWars.kills)}">${api.stats.SkyWars.kills}</li>`;
                                if (api.stats.SkyWars.wins !== undefined) twinshtml = `<li style="color: ${winsColor(api.stats.SkyWars.wins)}">${api.stats.SkyWars.wins}</li>`;
                            }
                            if (e === 1) api.inParty = true;
                            else if (e === 2) api.call = true;
                            else if (e === 3) api.partyReq = true;
                            else if (e === 4) api.friendReq = true;
                            else if (e === 5) api.guildList = true;
                            let tag = getTag(api); ttaghtml = `<li style="color: ${tag[1]}">${tag[0]}</li>`;
                            let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${level} ${nameColor(api)}</li>`;
                            players.push({name: ign, api: api, swlvl: tswlvl, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: tnwlhtml, fkdrhtml: tkdrhtml, wlrhtml: twlrhtml, finalshtml: tkillshtml, winshtml: twinshtml});
                        }
                        else if (gamemode === 2){
                            let level = '<span>[I]</span>', ttaghtml = '<li>-</li>', twshtml = '<li>0</li>', tkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tkillshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                            let avatar = `https://visage.surgeplay.com/face/48/${api.id}.png`;
                            tdwins = 0;
                            if (api.stats === undefined){}
                            else if (api.stats.Duels === undefined){}
                            else{
                                let tkdr = 0, twlr = 0;
                                if (api.stats.Duels.wins !== undefined){level = starColor(api.stats.Duels.wins); twinshtml = `<li style="color: ${winsColor(api.stats.Duels.wins)}">${api.stats.Duels.wins}</li>`; tdwins = api.stats.Duels.wins;}
                                if (api.stats.Duels.current_winstreak !== undefined) twshtml = `<li style="color: ${wsColor(api.stats.Duels.current_winstreak)}">${api.stats.Duels.current_winstreak}</li>`;
                                if (api.stats.Duels.kills !== undefined && api.stats.Duels.deaths !== undefined) tkdr = parseFloat(api.stats.Duels.kills/api.stats.Duels.deaths).toFixed(2); tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;
                                if (api.stats.Duels.wins !== undefined && api.stats.Duels.losses !== undefined) twlr = parseFloat(api.stats.Duels.wins/api.stats.Duels.losses).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;
                                if (api.stats.Duels.kills !== undefined) tkillshtml = `<li style="color: ${finalsColor(api.stats.Duels.kills)}">${api.stats.Duels.kills}</li>`;
                            }
                            if (e === 1) api.inParty = true;
                            else if (e === 2) api.call = true;
                            else if (e === 3) api.partyReq = true;
                            else if (e === 4) api.friendReq = true;
                            else if (e === 5) api.guildList = true;
                            let tag = getTag(api); ttaghtml = `<li style="color: ${tag[1]}">${tag[0]}</li>`;
                            let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${level} ${nameColor(api)}</li>`;
                            players.push({name: ign, api: api, dwins: tdwins, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: twshtml, fkdrhtml: tkdrhtml, wlrhtml: twlrhtml, finalshtml: tkillshtml, winshtml: twinshtml});
                        }
                        updateArray();
                    }
                    else{got = true; players.push({name: ign, namehtml: ign, api: null}); updateArray();}
                }
                else if (api.player == null){got = true; players.push({name: ign, namehtml: ign, api: null}); updateArray();}
            }, error: (jqXHR) => {
                got = false;
                if (config.has(`players.${ign}`)){api = config.get(`players.${ign}`); got = true; players.push({name: ign, namehtml: ign, api: api});}
                else if (jqXHR.responseJSON.cause.indexOf('API key') !== -1) goodkey = false;
                else players.push({name: ign, namehtml: ign, api: null});
                updateArray();
            }});
        }
    }, error: () => {
        players.push({name: ign, namehtml: ign, api: null});
        updateArray();
    }});
}

function showRotation(matrix){
    let values = matrix.split('(')[1]; values = values.split(')')[0]; values = values.split(',');
    return Math.round(Math.asin(values[1])*(180/Math.PI));
}

function clearPlayer(ign){
    let time = new Date();
    if (time.getTime() - config.get(`players.${ign}.time`).getTime() < 360000) setTimeout(clearPlayer, 360000, ign);
    else config.delete(`players.${ign}`);
}

function gameStartNotif(){
    if (config.get('settings.notifs', true)){
        const notification = {
            title: 'Game Started!',
            body: 'Your Hypixel game has started!',
            icon: path.join(__dirname, '../assets/logo.ico')
        };
        new Notification(notification).show();
    }
}

// function autowho(){
//     if (config.get('settings.autowho', false)){
//         robot.startJar();
//         robot.type('t')
//         .go()
//         .then(robot.stopJar);
//     }
// }

function main(event){
    currentWindow = remote.BrowserWindow.getAllWindows(); currentWindow = currentWindow[0];
    $('.clientbutton').css('display', 'none'); $('.startup').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#show').css('display', 'inline-block'); $('#settings').css('display', 'inline-block'); $('#info').css('display', 'inline-block');

    if (event.data.client === 'lunar'){logpath = `${homedir}/.lunarclient/offline/1.8/logs/latest.log`; $('#clientimg').attr('src', 'https://img.icons8.com/nolan/2x/lunar-client.png'); $('#clientimg').css({'height': '34px', 'top': '0px'});}
    else if (process.platform === 'darwin'){
        if (event.data.client === 'badlion'){logpath = `${homedir}/Library/Application Support/minecraft/logs/blclient/minecraft/latest.log`; $('#clientimg').attr('src', 'https://www.badlion.net/static/assets/images/logos/badlion-logo.png');}
        else if (event.data.client === 'vanilla'){logpath = `${homedir}/Library/Application Support/minecraft/logs/latest.log`; $('#clientimg').attr('src', 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706');}
        else if (event.data.client === 'pvplounge'){logpath = `${homedir}/Library/Application Support/.pvplounge/logs/latest.log`; $('#clientimg').attr('src', 'https://pbs.twimg.com/profile_images/1176720435309711360/ceCmf9RT.png');}
        else if (event.data.client === 'labymod'){logpath = `${homedir}/Library/Application Support/minecraft/logs/latest.log`; $('#clientimg').attr('src', 'https://www.labymod.net/page/tpl/assets/images/logo_web.png');}
    }
    else{
        if (event.data.client === 'badlion'){logpath = `${homedir}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log`; $('#clientimg').attr('src', 'https://www.badlion.net/static/assets/images/logos/badlion-logo.png');}
        else if (event.data.client === 'vanilla'){logpath = `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`; $('#clientimg').attr('src', 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706');}
        else if (event.data.client === 'pvplounge'){logpath = `${homedir}/AppData/Roaming/.pvplounge/logs/latest.log`; $('#clientimg').attr('src', 'https://pbs.twimg.com/profile_images/1176720435309711360/ceCmf9RT.png');}
        else if (event.data.client === 'labymod'){logpath = `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`; $('#clientimg').attr('src', 'https://www.labymod.net/page/tpl/assets/images/logo_web.png');}
    }
    //con.log(logpath);

    let filegot = false;
    if (fs.existsSync(logpath)) filegot = true;
    if (!filegot) goodfile = false;

    let keygot = false;
    $.ajax({type: 'GET', async: false, url: 'https://api.hypixel.net/key?key='+key, success: (data) => {
        if (data.success === true){
            keygot = true;
            $.ajax({type: 'GET', async: false, url: `https://api.mojang.com/user/profiles/${data.record.owner}/names`, success: (names) => {user = names[names.length-1].name;}});
        }
    }});
    if (!keygot) goodkey = false;
    updateHTML();

    const tail = new Tail(logpath, {/*logger: con, */useWatchFile: true, nLines: 1, fsWatchOptions: {interval: 100}});
    tail.on('line', (data) => {
        const k = data.indexOf('[CHAT]');
        if (k !== -1){
            const msg = data.substring(k+7);
            //con.log(msg);
            let changed = false;
            if (msg.indexOf('ONLINE:') !== -1 && msg.indexOf(',') !== -1){
                if (inlobby){players = [];} inlobby = false;
                let who = msg.substring(8).split(', ');
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                //con.log(who);
                for (let i = 0; i < who.length; i++){
                    if (config.get('settings.unnick', false) && who[i] === usernick){who.push(user);}
                    if (who[i].indexOf('[') !== -1) who[i] = who[i].substring(0, who[i].indexOf('[')-1);
                    let contains = false;
                    for (let j = 0; j < players.length; j++){
                        if (players[j].name === who[i]) contains = true;
                    }
                    if (!contains) addPlayer(who[i]);
                }
                for (let i = 0; i < players.length; i++){
                    if (!who.includes(players[i].name)){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (msg.indexOf('has joined') !== -1 && msg.indexOf(':') === -1){
                //con.log(msg);
                if (inlobby){players = []; sent = true; /*autowho();*/} inlobby = false;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                if (msg.indexOf('/') !== -1) numplayers = Number(msg.substring(msg.indexOf('(')+1, msg.indexOf('/')));
                let join = msg.split(' ')[0];
                let contains = false;
                for (let i = 0; i < players.length; i++){if (join === players[i].name){contains = true;}}
                if (!contains){
                    if (config.get('settings.unnick', false) && sent){usernick = join; addPlayer(user); addPlayer(join); sent = false;}
                    else addPlayer(join);
                }
            }
            else if (msg.indexOf('has quit') !== -1 && msg.indexOf(':') === -1){
                if (inlobby){players = [];} inlobby = false;
                let left = msg.split(' ')[0];
                numplayers--; inlobby = false;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                for (let i = 0; i < players.length; i++){
                    if (left === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (msg.indexOf('Sending you') !== -1 && msg.indexOf(':') === -1){players = []; numplayers = 0; changed = true; sent = true; updateArray(); currentWindow.moveTop(); /*autowho();*/ inlobby = false;}
            else if ((msg.indexOf('joined the lobby!') !== -1 || msg.indexOf('rewards!') !== -1) && msg.indexOf(':') === -1) {if (!inlobby){players = [];} inlobby = true; numplayers = 0; changed = true; updateArray(); if (msg.indexOf(user) !== -1 && config.get('settings.shrink', true)){players = []; currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true); $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');}}
            else if (msg.indexOf('joined the party') !== -1 && msg.indexOf(':') === -1 && inlobby){
                let pjoin = msg.split(' ')[0];
                if (pjoin.indexOf('[') !== -1) pjoin = msg.split(' ')[1];
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                let contains = false;
                for (let i = 0; i < players.length; i++){if (user === players[i].name){contains = true;}}
                if (!contains) addPlayer(user, 1);
                contains = false;
                for (let i = 0; i < players.length; i++){if (pjoin === players[i].name){contains = true;}}
                if (!contains) addPlayer(pjoin, 1);
            }
            else if (msg.indexOf('You left the party') !== -1 && msg.indexOf(':') === -1 && inlobby){players = []; updateArray();}
            else if (msg.indexOf('left the party') !== -1 && msg.indexOf(':') === -1 && inlobby){
                let pleft = msg.split(' ')[0];
                if (pleft.indexOf('[') !== -1) pleft = msg.split(' ')[1];
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                for (let i = 0; i < players.length; i++){
                    if (pleft === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (inlobby && (msg.indexOf('Party Leader:') === 0 || msg.indexOf('Party Moderators:') === 0 || msg.indexOf('Party Members:') === 0)){
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                let tmsg = msg.substring(msg.indexOf(':')+2);
                let who = tmsg.split(' ');
                let tplayers = [];
                for (let i = 0; i < who.length; i++){
                    if (/^[a-zA-Z]+$/.test(who[i])) tplayers.push(who[i]);
                }
                //con.log(tplayers);
                for (let i = 0; i < tplayers.length; i++){
                    let contains = false;
                    for (let j = 0; j < players.length; j++){
                        if (players[j].name === tplayers[i]) contains = true;
                    }
                    if (!contains) addPlayer(tplayers[i], 1);
                }
                for (let i = 0; i < players.length; i++){
                    if (!tplayers.includes(players[i].name)){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if ((msg.indexOf('FINAL KILL') !== -1 || msg.indexOf('disconnected') !== -1) && msg.indexOf(':') === -1){
                let left = msg.split(' ')[0];
                numplayers--;
                for (let i = 0; i < players.length; i++){
                    if (left === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (config.get('settings.call', true) && inlobby && msg.indexOf(':') !== -1 && msg.substring(msg.indexOf(':')+2).indexOf(user) !== -1 && msg.indexOf('Guild >') === -1 && msg.indexOf('Party >') === -1 && msg.indexOf('To') === -1 && msg.indexOf('From') === -1){
                let tmsg = msg.substring(0, msg.indexOf(':')+1), tmsgarray = tmsg.split(' ');
                for (let i = 0; i < tmsgarray.length; i++){
                    if (tmsgarray[i].indexOf(':') !== -1){
                        tmsgarray[i] = tmsgarray[i].substring(0, tmsgarray[i].length-3);
                        if (tmsgarray[i][1] === '7') tmsgarray[i] = tmsgarray[i].substring(2);
                        if (tmsgarray[i] !== user){
                            let contains = false;
                            for (let i = 0; i < players.length; i++){if (players[i].name === tmsgarray[i]){contains = true;}}
                            if (!contains){
                                addPlayer(tmsgarray[i], 2);
                                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                            }
                        }
                    }
                }
            }
            else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'!') !== -1 && msg.indexOf(':') === -1){
                let wsearch = msg.substring(37, msg.lastIndexOf("'"));
                let contains = false;
                if ((wsearch.toLowerCase() === 'me') || (wsearch.toLowerCase() === "i")) wsearch = user;
                for (let i = 0; i < players.length; i++){if (wsearch.toLowerCase() === players[i].name.toLowerCase()){contains = true;}}
                if (!contains){
                    addPlayer(wsearch);
                    if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                    if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                }
            }
            else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'') !== -1 && msg.indexOf(':') === -1){
                let typed = msg.substring(36, msg.lastIndexOf("'"));
                if (typed === 'c' || typed === 'cl'){players = []; updateArray();}
            }
            else if ((msg.indexOf('reconnected') !== -1) && msg.indexOf(':') === -1) sent = false;
            else if (msg.indexOf('The game starts in 1 second!') !== -1 && msg.indexOf(':') === -1){if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true); $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');} gameStartNotif();}
            else if (msg.indexOf('new API key') !== -1 && msg.indexOf(':') === -1){key = msg.substring(msg.indexOf('is ')+3); config.set('key', key); apilink = `https://api.hypixel.net/player?key=${key}&uuid=`; goodkey = true; verifyKey(); updateHTML();}
            else if (msg.indexOf('Guild Name: ') === 0 && inlobby){
                guildlist = true;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
            }
            else if (guildlist && inlobby && (msg.indexOf(' ?  ') !== -1 || msg.indexOf(' ●  ') !== -1)){
                let tmsgarray = '';
                if (msg.indexOf(' ●  ') !== -1) tmsgarray = msg.split(' ●  ');
                else tmsgarray = msg.split(' ?  ');
                for (let i = 0; i < tmsgarray.length; i++){
                    //con.log(tmsgarray[i]);
                    if (tmsgarray[i][0] === '[') addPlayer(tmsgarray[i].substring(tmsgarray[i].indexOf(' ')+1), 5);
                    else addPlayer(tmsgarray[i], 5);
                }
            }
            else if (guildlist && msg.indexOf('Total Members:') === 0) guildlist = false;
            /*con.log(msg);
            let  temp = '';
            for (let i = 0; i < players.length; i++) temp += players[i].name + ' ';
            con.log(temp);*/
        }
        else{
            let msg = data;
            if (config.get('settings.call', true) && inlobby && msg.indexOf('to join their party!') !== -1 && msg.indexOf(':') === -1){
                let tmsg = msg.substring(0, msg.indexOf('has')-1), tmsgarray = tmsg.split(' ');
                if (tmsgarray[0].indexOf('[') !== -1) addPlayer(tmsgarray[1], 3);
                else addPlayer(tmsgarray[0], 3);
            }
            else if (config.get('settings.call', true) && inlobby && msg.indexOf('Friend request from') === 0 && msg.indexOf(':') === -1){
                //con.log('hi');
                let tmsgarray = msg.split(' ');
                addPlayer(tmsgarray[tmsgarray.length-1], 4);
            }
        }
    });
    tail.on('error', (err) => {con.log('error', err); goodfile = false; updateHTML();});
}

$(() => {
    if (config.get('settings.client', -1) !== -1){
        let tevent = {data: {client: config.get('settings.client')}};
        main(tevent);
    }

    currentWindow = remote.BrowserWindow.getAllWindows(); currentWindow = currentWindow[0];
    let winPos = config.get('settings.pos', [0, 0]); let winSize = config.get('settings.size', [800, 600]);
    if (winSize[1] < 315) winSize[1] = 315;
    currentWindow.setPosition(winPos[0], winPos[1]); currentWindow.setSize(winSize[0], winSize[1]);
    currentWindow.on('resized', () => {
        let newheight = currentWindow.webContents.getOwnerBrowserWindow().getBounds().height;
        if (newheight > 65) winheight = newheight;
    });
    if (gamemode === 0){$('#ws_nwl').html('WS'); $('#kdr').html('FKDR'); $('#kills').html('FINALS');}
    if (gamemode === 1){$('#ws_nwl').html('NWL'); $('#kdr').html('KDR'); $('#kills').html('KILLS');}
    if (gamemode === 2){$('#ws_nwl').html('WS'); $('#kdr').html('KDR'); $('#kills').html('KILLS');}
    if (config.has('settings.color')){
        let bkcolor = config.get('settings.color', [2, 2, 2, 0.288]);
        $('body').css('background', `rgba(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}, ${bkcolor[3]})`);
        //$('h1').css({'background': `rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('#discord').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`});
        $('#info').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`});
        $('#settings').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`});
    }
    else{
        $('body').css('background', 'rgba(2, 2, 2, 0.288)');
        //$('h1').css({'background': '-webkit-linear-gradient(rgb(153, 0, 255), rgb(212, 0, 255))', 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('#discord').css({'-webkit-filter': '', 'filter': ''});
        $('#info').css({'-webkit-filter': '', 'filter': ''});
        $('#settings').css({'-webkit-filter': '', 'filter': ''});
    }
    $('#discord').on('click', () => {shell.openExternal('https://discord.gg/7dexcJTyCJ');});
    $('#info').on('click', () => {
        if ($('#infodiv').css('display') === 'none'){
            $('#info').css('background-image', 'url(../assets/info2.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#infodiv').css('display', 'inline-block'); $('#settingsdiv').css('display', 'none');
        }
        else{
            $('#info').css('background-image', 'url(../assets/info1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#settingsdiv').css('display', 'none');
        }
    });
    $('#settings').on('click', () => {
        if ($('#settingsdiv').css('display') === 'none'){
            $('#settings').css('background-image', 'url(../assets/settings2.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#settingsdiv').css('display', 'inline-block'); $('#infodiv').css('display', 'none'); $('#minimizeinfo').css('display', 'block'); $('#notifsbtn').prop('checked', config.get('settings.notifs', true)); $('#unnickbtn').prop('checked', config.get('settings.unnick', false)); $('#shrinkbtn').prop('checked', config.get('settings.shrink', true)); $('#callbtn').prop('checked', config.get('settings.call', true)); /*$('#whobtn').prop('checked', config.get('settings.autowho', false));*/
            let tgmode = config.get('settings.bwgmode', ''), tgamemode = config.get('settings.gamemode', 0);
            if (tgmode === '' || tgmode === undefined){$('#overall').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall');}
            else if (tgmode === 'eight_one_'){$('#solos').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Solos');}
            else if (tgmode === 'eight_two_'){$('#doubles').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Doubles');}
            else if (tgmode === 'four_three_'){$('#threes').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Threes');}
            else if (tgmode === 'four_four_'){$('#fours').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Fours');}
            if (tgamemode === 0 || tgamemode === undefined){$('#bw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Bedwars');}
            else if (tgamemode === 1){$('#sw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Skywars');}
            else if (tgamemode === 2){$('#duels').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Duels');}
        }
        else{
            $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#settingsdiv').css('display', 'none'); $('#indexdiv').css('display', 'block'); $('#infodiv').css('display', 'none');
        }
    });
    $('#update').on('click', () => {shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');});
    $('#info').on('mouseenter', () => {if ($('#infodiv').css('display') === 'none'){$('#info').css('background-image', 'url(../assets/info2.png)');}}).on('mouseleave', () => {if ($('#infodiv').css('display') === 'none'){$('#info').css('background-image', 'url(../assets/info1.png)');}})
    $('#settings').on('mouseenter', () => {if ($('#settingsdiv').css('display') === 'none'){$('#settings').css('background-image', 'url(../assets/settings2.png)');}}).on('mouseleave', () => {if ($('#settingsdiv').css('display') === 'none'){$('#settings').css('background-image', 'url(../assets/settings1.png)');}})
    $('#quit').on('click', () => {
        config.delete('players'); config.set('settings.pos', currentWindow.getPosition()); config.set('settings.size', [currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, currentWindow.webContents.getOwnerBrowserWindow().getBounds().height]);
        currentWindow.close(); currentWindow.skipTaskbar(true); app.quit();
    });
    $('#minimize').on('click', () => {currentWindow.minimize();});
    $('#show').on('click', () => {
        //con.log(showRotation($('#show').css('transform')));
        if (showRotation($('#show').css('transform')) === 0){
            currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true);
            $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');
        }
        else{
            currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true);
            $('#show').css('transform', 'rotate(0deg)'); if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
        }
    });
    currentWindow.on('resized', () => {
        if (currentWindow.webContents.getOwnerBrowserWindow().getBounds().width < 710){zoom = (currentWindow.webContents.getOwnerBrowserWindow().getBounds().width)/710; currentWindow.webContents.setZoomFactor(zoom);}
        else{zoom = 1; currentWindow.webContents.setZoomFactor(1);}
    });


    const dftcolor = config.get('settings.color', [2, 2, 2, 0.288]);
    const pickr = Pickr.create({
        el: '#color-picker',
        theme: 'nano',
        inline: true,
        position: 'top-middle',
        default: `rgba(${dftcolor[0]}, ${dftcolor[1]}, ${dftcolor[2]}, ${dftcolor[3]})`,
        defaultRepresentation: 'RGBA',
        components: {
            preview: false,
            opacity: true,
            hue: true,
            interaction: {save: true}
        }
    });
    pickr.on('change', (color) => {
        //con.log(color.toRGBA());
        color = color.toRGBA();
        $('body').css('background', `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        //$('h1').css({'background': `rgb(${color[0]}, ${color[1]}, ${color[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('#discord').css({'-webkit-filter': `opacity(0.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(0.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#info').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#settings').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
    });
    pickr.on('save', (color) => {
        color = color.toRGBA();
        $('body').css('background', `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        //$('h1').css({'background': `rgb(${color[0]}, ${color[1]}, ${color[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('#discord').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#info').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#settings').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        config.set('settings.color', color);
        pickr.hide();
    });

    $('#gamemodebtn').on('click', () => {
        $('#gamemodebtn').find('.custom-select').toggleClass('open');
    });
    $('#bw').on('click', () => {
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#bw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Bedwars');
        $('#ws_nwl').html('WS'); $('#kdr').html('FKDR'); $('#kills').html('FINALS');
        gamemode = 0; config.set('settings.gamemode', 0); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#sw').on('click', () => {
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#sw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Skywars');
        $('#ws_nwl').html('NWL'); $('#kdr').html('KDR'); $('#kills').html('KILLS');
        gamemode = 1; config.set('settings.gamemode', 1); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#duels').on('click', () => {
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#duels').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Duels');
        $('#ws_nwl').html('WS'); $('#kdr').html('KDR'); $('#kills').html('KILLS');
        gamemode = 2; config.set('settings.gamemode', 2); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });

    $('#gmbtn').on('click', () => {
        $('#gmbtn').find('.custom-select').toggleClass('open');
    });
    $('#overall').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#overall').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall');
        gmode = ''; config.set('settings.bwgmode', ''); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#solos').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#solos').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Solos');
        gmode = 'eight_one_'; config.set('settings.bwgmode', 'eight_one_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#doubles').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#doubles').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Doubles');
        gmode = 'eight_two_'; config.set('settings.bwgmode', 'eight_two_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#threes').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#threes').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Threes');
        gmode = 'four_three_'; config.set('settings.bwgmode', 'four_three_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#fours').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#fours').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Fours');
        gmode = 'four_four_'; config.set('settings.bwgmode', 'four_four_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });

    $('#notifsbtn').on('click', () => {
        config.set('settings.notifs', $('#notifsbtn').prop('checked'));
    });
    $('#unnickbtn').on('click', () => {
        config.set('settings.unnick', $('#unnickbtn').prop('checked'));
    });
    $('#shrinkbtn').on('click', () => {
        config.set('settings.shrink', $('#shrinkbtn').prop('checked'));
    });
    $('#callbtn').on('click', () => {
        config.set('settings.call', $('#callbtn').prop('checked'));
    });
    $('#changeclient').on('click', () => {
        config.delete('players'); config.set('settings.pos', currentWindow.getPosition()); config.set('settings.size', [currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, currentWindow.webContents.getOwnerBrowserWindow().getBounds().height]);
        config.set('settings.client', -1);
        currentWindow.skipTaskbar(true); app.relaunch(); app.quit();
    });
    // $('#whobtn').on('click', () => {
    //     config.set('settings.autowho', $('#whobtn').prop('checked'));
    // });
    $('#revertcolor').on('click', () => {
        pickr.setColor('rgba(2, 2, 2, 0.288)');
        //$('h1').css({'background': '-webkit-linear-gradient(rgb(153, 0, 255), rgb(212, 0, 255))', 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('#discord').css({'-webkit-filter': '', 'filter': ''});
        $('#info').css({'-webkit-filter': '', 'filter': ''});
        $('#settings').css({'-webkit-filter': '', 'filter': ''});
        config.delete('settings.color');
    });

    $('#badlion').on('click', {client: 'badlion'}, main);
    $('#lunar').on('click', {client: 'lunar'}, main);
    $('#vanilla').on('click', {client: 'vanilla'}, main);
    $('#pvplounge').on('click', {client: 'pvplounge'}, main);
    $('#labymod').on('click', {client: 'labymod'}, main);
    $('#badlion').on('click', () => {config.set('settings.client', 'badlion')});
    $('#lunar').on('click', () => {config.set('settings.client', 'lunar')});
    $('#vanilla').on('click', () => {config.set('settings.client', 'vanilla')});
    $('#pvplounge').on('click', () => {config.set('settings.client', 'pvplounge')});
    $('#labymod').on('click', () => {config.set('settings.client', 'labymod')});

});