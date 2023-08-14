import { Component } from "@acryps/page";

type Handler<T> = (value: T) => any | void;

export class Observable<T> extends Component {
	private hasFired = false;
	private value?: T;
	private subscribers: Handler<T>[] = [];

	constructor(
		initialValue?: T
	) {
		super();

		if (arguments.length == 1) {
			this.emit(initialValue!);
		}
	}
	
	emit(value: T) {
		this.value = value;

		for (let subscriber of this.subscribers) {
			subscriber(value);
		}
	}

	subscribe(handler: Handler<T>, fireInitialValue = true) {
		const index = this.subscribers.push(handler) - 1;

		if (fireInitialValue && this.hasFired) {
			handler(this.value!);
		}

		const observed = this;

		return {
			active: true,

			unsubscribe() {
				if (this.active) {
					observed.subscribers.splice(index);

					this.active = false;
				}
			}
		}
	}

	render() {
		return document.createTextNode(`${this.value}`);
	}
	
	map(transformer: (value: T) => any) {
		const proxy = new Component();

		proxy.render = () => {
			const rendered = transformer(this.value!);

			if (rendered instanceof Node) {
				return rendered;
			}

			return document.createTextNode(`${this.render}`);
		}
		
		this.subscribe(() => proxy.update());

		return proxy;
	}
}