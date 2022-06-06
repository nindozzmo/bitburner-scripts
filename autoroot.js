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

	let rooted = [];

	for (let i = 0; i < scanResult.length; i++) { //rooting loop
		
		if (!ns.hasRootAccess(scanResult[i])) { 
			let attackedServ = scanResult[i];
			let ports = ns.getServerNumPortsRequired(attackedServ);

			if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(attackedServ)) {

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

	if (rooted != 0) {
		ns.tprint("you've gained root access on the next servers: " + rooted);
	}

	else {
		ns.tprint("nothing to root. you have to gain more hack xp =)");
	}

}
