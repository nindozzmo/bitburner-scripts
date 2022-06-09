/** @param {NS} ns */
export async function main(ns) {
	let scanResult = ns.scan('home'); //initial scan of the first level servers

	for (let i = 0; i < scanResult.length; i++) { //deeper scan
	
		let add = ns.scan(scanResult[i]);

		if (add[1] != null) { //adding results to the initial array
			
			for (let i = 1; i < add.length; i++) {
				scanResult.push(add[i]);
			}

		}

	}

	let purchased = ns.getPurchasedServers(); //get purchased servers into array

	for (let i = 0; i < scanResult.length; i++) { //delete purchased servers from scan result
		let current = scanResult[i];
		let index = i;

		for (let i = 0; i < purchased.length; i++) {
			if (current == purchased[i]) {
				scanResult.splice(index, purchased.length);
			}
		}
	}

	let rooted = [];

	for (let i = 0; i < scanResult.length; i++) { //rooting loop
		
		if (!ns.hasRootAccess(scanResult[i])) { 
			let attackedServ = scanResult[i];
			let ports = ns.getServerNumPortsRequired(attackedServ);

			if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(attackedServ)) {

				const toolsFunctions = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]; //functions for ports opening

				const toolsFiles = [ns.fileExists("BruteSSH.exe", "home"), ns.fileExists("FTPCrack.exe", "home"), //check if apps
									ns.fileExists("relaySMTP.exe", "home"), ns.fileExists("HTTPWorm.exe", "home"), //exist on 'home'
									ns.fileExists("SQLInject.exe", "home")];

				for (let i = 0; i < ports; i++) { //open required ports
					
					if (toolsFiles[i]) {
						toolsFunctions[i](attackedServ);
					}
					else {
						continue;
					}

				}

				ns.nuke(attackedServ); //get root
				rooted.push(attackedServ);		
			}

			else {
				continue;
			}
		}

		else {
			continue;
		}
	}

	let allrooted = [];
	let allnotrooted = [];

	for (let i = 0; i < scanResult.length; i++) { //sort rooted and not rooted servers
		
		if (ns.hasRootAccess(scanResult[i])) {
			allrooted.push(scanResult[i]);
		}

		else {
			allnotrooted.push(scanResult[i]);
		}
		
	}

	if (allrooted != 0) { //display all rooted servers
		ns.tprint('all rooted servers: ' + allrooted.join(', '));
	}

	else {
		ns.tprint("you haven't any rooted servers");
	}
	
	if (allnotrooted != 0) { //display all not rooted servers
		ns.tprint('all not rooted servers: ' + allnotrooted.join(', '));
	}

	else {
		ns.tprint("you've rooted all servers");
	}

	if (rooted != 0) { //display just rooted servers
		ns.tprint("you've gained root access to the next servers: " + rooted.join(', '));
	}

	else if (allnotrooted != 0) {
		ns.tprint("nothing to root. you have to gain more hack xp =)");
	}
}
