import { Component } from "@acryps/page";

type Handler<T> = (value: T) => any | void;

export class Observable<T> extends Component {
	fired = false;
	
	private value?: T;
	private subscribers: Handler<T>[] = [];

	get currentValue() {
		return this.value;
	}

	/**
	 * @param initialValue An initial value for the observable, use `provide` to provide an async value
	 */
	constructor(
		initialValue?: T
	) {
		super();

		if (arguments.length == 1) {
			this.emit(initialValue!);
		}
	}
	
	/**
	 * Update all subscribers and rendered outputs with the new value
	 * 
	 * @param value Updated value
	 */
	emit(value: T) {
		this.fired = true;
		this.value = value;

		for (let subscriber of this.subscribers) {
			subscriber(value);
		}
	}

	/**
	 * Listen for new values published with `emit`.
	 * 
	 * @param handler The function called when a new value is provided
	 * @param fireInitialValue The handler will immediately be called if a value has been emitted before, set this to `false` to prevent the immediate call
	 */
	subscribe(handler: Handler<T>, fireInitialValue = true) {
		const index = this.subscribers.push(handler) - 1;

		if (fireInitialValue && this.fired) {
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

	/**
	 * Provide a promise that will emit an initial value when resolved
	 * Passing a function will make it execute as soon as possible
	 * 
	 * @param resolver The promise that should be awaited
	 */
	provide(resolver: Promise<T>) {
		(async () => {
			const value = await resolver;
			
			this.emit(value);
		})();

		return this;
	}

	/**
	 * Update the current value.
	 * 
	 * Will only execute if either a `defaultValue` or a value has been emitted before.
	 * 
	 * @param updater Transformer
	 * @param defaultValue A default value if no initial value is present
	 */
	transform(updater: (value: T) => T, defaultValue?: T) {
		if (this.fired) {
			this.emit(updater(this.value));
		} else if (arguments.length == 2) {
			this.emit(updater(defaultValue));
		}

		return this;
	}

	/**
	 * Render the value automatically in a component
	 * 
	 * Recommended only for primitives or objects with a `toString` function.
	 */
	render() {
		const node = document.createTextNode('');

		this.subscribe(() => {
			node.textContent = `${this.currentValue}`;
		});

		return node;
	}
	
	/**
	 * Render value in component
	 * 
	 * Will wrap in `TextNode` if the transformed value is not a `Node`
	 * 
	 * @param transformer Converter from value to the element which should be rendered
	 */
	map(transformer: (value: T) => any) {
		const proxy = new Component();

		proxy.render = () => {
			if (this.fired) {
				const rendered = transformer(this.currentValue);

				if (rendered instanceof Node) {
					return rendered;
				}

				return document.createTextNode(`${rendered}`);
			}

			return document.createComment('');
		}
		
		this.subscribe(() => proxy.update());

		return proxy;
	}
}