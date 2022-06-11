/** @param {NS} ns */

// Code by Nindozzmo

//!!! FOR CORRECT WORK OF THIS SCRIPT YOU SHOULD COPY FILE hacktools.js FROM GIT TO YOUR 'home' IN THE GAME!!!
//!!! https://github.com/nindozzmo/bitburner-scripts/blob/main/hacktools.js !!!

// This is a script for purchased servers batch operations.

//////// v1.2 
//////// changelog:
//////// 1. added checks for input data type for an actions names;
//////// 2. added checks for input data type for a buy, copy and run actions arguments;
//////// 3. changed behaviour of the run function;
//////// 4. changed manual below for the run action.

//////////TODO for v1.3:
////////// 1. add choise of the range of servers for a kill, run, copy(?) and del functions;
////////// 2. get rid of the copy function;(?)
////////// 3. add delays to the run function hack, grow and weaken;
////////// 4. change behaviour of the run function (copy hacktools.js instead of any file);
////////// 5. rename the run function (name should be 'hack');
////////// 6. add global check for the hacktools.js on 'home' and autocopy from git if needed;

// How to use:
// terminal: run servs.js [action] [argument 1] [argument 2]

// Actions and arguments list:

/// buy [RAM] — buy maximum amount of servers with [RAM] amount of memory;

/// copy [file] — copy selected file on all purchased servers;

/// run [file] [attacked server] — kill all running scripts on each purchased server, copy file from your
/// home server and run it in in grow, weaken and hack modes with recommended amounts of threads (10, 2 and 1 parts) on each
/// purchased server; overall amount of threads for each server is based on each purchased server's RAM;

/// kill — stop all running scripts on each purchased server;

/// del — delete all purchased servers;

export async function main(ns) {
	const action = ns.args[0];
	const arg1 = ns.args[1];
	const arg2 = ns.args[2];

	const servs = ns.getPurchasedServers();
	const maxServs = ns.getPurchasedServerLimit();

	function buy(ram) { //buy servers
		let overallBought;

		if (!isNaN(ram) && ram != 0) { //check if ram is a number and not a 0

			for (let i = servs.length; i < maxServs; i++) { //buy loop
				if (ns.getPurchasedServerCost(ram) < ns.getServerMoneyAvailable('home')) {
					ns.purchaseServer("serv-" + i, ram);
					overallBought += 1;
				}

				else {
					ns.tprint("You don't have enough money");
					break;
				}

			}

			if (overallBought < 2 && overallBought != 0) {
				ns.tprint("You've bought " + overallBought + " server")
			}

			else {
				ns.tprint("You've bought " + overallBought + " servers")
			}

		}

		else {
			ns.tprint("RAM amount must be a number!");
		}
	}

	function kill() { //kill all scripts running on the purchased servers
		for (let i = 0; i < servs.length; i++) {
			ns.killall(servs[i]);
		}
		ns.tprint("You've killed all running scripts on every purchased server");
	}

	function del() { //delete all purchased servers
		if (servs.length != 0) {
			for (let i = 0; i < servs.length; i++) {
				ns.deleteServer(servs[i]);
			}
			ns.tprint("You've deleted all purchased servers");
		}

		else {
			ns.tprint("You don't have any purchased servers");
		}
	}

	async function copy(file) { //copy file on all purchased servers
		for (let i = 0; i < servs.length; i++) {
			if (typeof file === "string" && file !== "" && file !== " " && !ns.fileExists(file, 'home')) { //check if file exists on "home"
				ns.tprint("file '" + file + "' doesn't exist on 'home'!");
				break;
			}

			else if (typeof file !== "string" || file == "" || file == " ") { //check if file name is a string
				ns.tprint("File name should be a string");
				break;
			}

			else { //copy loop
				await ns.scp(file, "home", servs[i]);
			}
		}
	}

	async function run(file, server) { //kill all scripts, copy hacktools.js and run it on all purchased servers
		for (let i = 0; i < servs.length; i++) { //loop for all purchased servers

			if (typeof file === "string" && file !== "" && file !== " " && !ns.fileExists(file, 'home')) { //check if file exists on "home"
				ns.tprint("file '" + file + "' doesn't exist on 'home'!");
				break;
			}

			else if (typeof file !== "string" || file == " " || file == "") { //check if file name is a string
				ns.tprint("File name should be a string");
				break;
			}

			else if (typeof server !== "string" || server == " " || server == "") { //check if server name is a string
				ns.tprint("Server name should be a string");
				break;
			}

			else if (!ns.serverExists(server)) { //check if server exists
				ns.tprint("Server " + server + " doesn't exist");
				break;
			}

			else {
				const threads = (ns.getServerMaxRam(servs[i]) / ns.getScriptRam(file, servs[i])) / 13; //calculate one part of threads

				ns.killall(servs[i]);
				await ns.scp(file, "home", servs[i]);
				ns.exec(file, servs[i], threads * 10, 'grow', server); //ten parts threads with grow
				ns.exec(file, servs[i], threads * 2, 'weaken', server); //two parts threads with weaken
				ns.exec(file, servs[i], threads, 'hack', server);
			}
		}
	}

	if (typeof action !== "string" || action == " " || action == "") { //check if action type is a valid string
		ns.tprint("Action name should be a string");
	}

	else {

		if (action == "buy") {
			buy(arg1);
		}

		else if (action == "run") {
			await run(arg1, arg2);
		}

		else if (action == "kill") {
			kill();
		}

		else if (action == "copy") {
			await copy(arg1);
		}

		else if (action == "del") {
			del();
		}
	}
}
