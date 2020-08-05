window.addEventListener("message", event => {
	const message = event.data;
	if (message.protocol === "from-app") {
		let args = JSON.parse(message.data);
		switch (args.action) {
			case "test":
			alert(args.msg);
			break;
			case "level-list":
		    args.list.forEach(l => {
  const o = document.createElement("option");
  o.text = l.name;
  document.getElementById("level-select").add(o);
});
			break;
		}
	}
});
function ipcSend(msg) {
	console.log(msg);
	if (typeof msg === "string") msg = JSON.parse(msg);
	window.postMessage({
		protocol: "to-app",
	data: msg});
}
ipcSend({ action: "initialize" })
function getSong() {
	ipcSend({
		action: "get-song",
		level: document.getElementById("level-select").value,
	    path: document.getElementById("gd-path").value
	});
}
function importSong() {
	ipcSend({ action: "import", path: document.getElementById("gd-path").value});
}
