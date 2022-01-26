const {app, BrowserWindow, globalShortcut} = require('electron');

let win, splash;
function createWindow(){
    splash = new BrowserWindow({width: 400, height: 400, transparent: true, frame: false, alwaysOnTop: true, skipTaskbar: true});
    splash.loadFile('src/splash.html');
    win = new BrowserWindow({width: 800, height: 600, show: false, frame: false, transparent: true, resizable: true, useContentSize: true, maximizable: false, x: 0, y: 0, minWidth: 400, icon: __dirname+'/assets/logo.ico', alwaysOnTop: true, title: 'Abyss Overlay', focusable: false, skipTaskbar: false, hasShadow: true, webPreferences: {nodeIntegration: true, enableRemoteModule: true, contextIsolation: false}});
    win.loadFile('src/index.html');
    win.on('closed', () => {win = null});
    setTimeout(() => {splash.destroy(); win.show(); setTimeout(() => {win.setSkipTaskbar(false);}, 1000);}, 4500);
    win.setAlwaysOnTop(true);
    win.setVisibleOnAllWorkspaces(true);
    win.setMenu(null);
}

app.whenReady().then(() => {
    createWindow();
    globalShortcut.register('CommandOrControl+Shift+A', () => {
        if (win.isVisible()) win.hide();
        else{win.showInactive(); win.moveTop();}
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});