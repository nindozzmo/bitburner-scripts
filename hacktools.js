/** @param {NS} ns */
export async function main(ns) {
	const action = ns.args[0];
	const server = ns.args[1];

	while(true) {

		if (action == 'hack') {
			await ns.hack(server);
		}

		else if (action == 'grow') {
			await ns.grow(server);
		}
		
		else if (action == 'weaken') {
			await ns.weaken(server);
		}
	}
}
