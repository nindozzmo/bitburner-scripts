/** @param {NS} ns */

//Code by Nindozzmo

// This is a script for purchased servers batch operations.

// How to use: terminal: run servs.js [action] [arg1] [arg2]

// Actions and arguments list:

// buy [RAM] — buy maximum amount of servers with [RAM] amount of memory;

// run [file] [threads] — kill all running scripts on each purchased server, copy [file]
// from your home server and run it at the number of [threads];

// kill — stop all running scripts on each purchased server;

// del — delete all purchased servers;

export async function main(ns) {
	const choise = ns.args[0];
	const arg2 = ns.args[1];
	const arg3 = ns.args[2];

	const servs = ns.getPurchasedServers();
	const max = ns.getPurchasedServerLimit();

	function buy(ram) {
		for (let i = servs.length; i < max; i++) {
			ns.purchaseServer("serv-" + i, ram)
		}
	}

	function kill() {
		for (let i = 0; i < servs.length; i++) {
			ns.killall(servs[i]);
		}
	}

	function del() {
		for (let i = 0; i < servs.length; i++) {
			ns.deleteServer(servs[i]);
		}
	}

	async function run(file, threads) {
		const scriptram = ns.getScriptRam(file, "home");

		for (let i = 0; i < servs.length; i++) {
			let servram = ns.getServerMaxRam(servs[i]);

			if (servram > scriptram * threads) {
				ns.killall(servs[i]);
				await ns.scp(file, "home", servs[i]);
				ns.exec(file, servs[i], threads);
			}

			else {
				ns.tprint("Server " + servs[i] + " have " + servram + " RAM. ",
					"Script " + file + " at " + threads + " threads needs " + (scriptram * threads) + " of free RAM")
			}
		}
	}

	if (choise == "buy") {
		buy(arg2);
	}

	else if (choise == "run") {
		await run(arg2, arg3);
	}

	else if (choise == "kill") {
		kill();
	}

	else if (choise == "del") {
		del();
	}
}
