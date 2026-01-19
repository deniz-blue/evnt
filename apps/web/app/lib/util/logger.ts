export type Printer = (...args: any[]) => void;

export class Logger {
	static main: Logger = Logger.console();

	public constructor(public print: Printer) { }

	child(...args: any[]): Logger {
		return new Logger((...data: any[]) => {
			this.print(...args, ...data);
		});
	}

	styledChild(name: string, color: string): Logger {
		return new Logger((...args: any[]) => {
			this.print(`%c ${name} `, `background-color: ${color}; color: white; font-weight: bold; border-radius: 5px;`, ...args);
		});
	}

	log(...args: any[]) {
		this.print(...args);
	}

	static console(): Logger {
		return new Logger(console.log.bind(console));
	}
}
