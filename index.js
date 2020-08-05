const { BrowserWindow, app, dialog } = require("electron");
const ipc = require("electron").ipcMain;
const GDShare = require("./gdshare.js");
const path = require("path");
const fs = require("fs");
let w;
let GDlevels;
app.on("ready", () => {
   w = new BrowserWindow({
	  height: 600,
	  width: 800,
	  webPreferences: {
		  preload: path.join(__dirname, "preload.js"),
		  nodeIntegration: false,
		  enableRemoteModule: false,
	      contextIsolation: true
	  }
  });
  
  w.loadFile("index.html");

  w.on("closed", () => { app.quit() });
});
ipc.on("app", (event, args) => {
	args = JSON.parse(args);
	console.log(args);
	switch (args.action) {
		case "test":
		post({ action: "test", msg: "game" });
		break;
		case "initialize":
		const gpath = GDShare.getCCPath();

GDShare.decodeCCFile(gpath)
.then(leveldata => {
  const levels = GDShare.getLevels(leveldata, name => {
    /* keep the line below if you want to bloat the console */
  });
  GDlevels = levels
  post({ action: "level-list", list: levels });
})
.catch(err => {
  console.error(err);
});
		break;
		case "get-song":
		console.log(args.level);
		const l = GDlevels.find(x => x.name === args.level);
		if (l) {
			const song = GDShare.getKey(l.data, "k45", "i", 1);
			try {
  fs.accessSync(`${args.path}/${song}.mp3`);

  const save = dialog.showOpenDialogSync({
    title: "Select where to save the song",
    properties: [ "openDirectory" ]
  });

  fs.copyFileSync(`${args.path}/${song}.mp3`, `${save}/${song}.mp3`);

  console.log(`succesfully exported ${song}.mp3 from ${args.level}!`);
} catch (e) {
  console.error(e);
}
	} else {
		console.log("level not found!");
	}
		break;
		case "import":
    try {
      const song = dialog.showOpenDialogSync({
        title: "select song file",
        properties: [ "openFile" ]
      })[0].replace(/\\/g, "/");
      
      fs.accessSync(song);

      fs.copyFileSync(`${song}`, `${args.path}/${song.split("/").pop()}`);
    } catch(e) {
      console.error(e);
    }
    break;
	}
});
function post(msg) {
	w.webContents.send("app",msg);
}
