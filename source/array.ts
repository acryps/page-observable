import { Observable } from ".";

export class ObservableArray<T> extends Observable<T[]> {
	push(...items: T[]) {
		this.emit([...this.currentValue, ...item]);
	}

	pop() {
		const last = this.currentValue[this.currentValue.length - 1];
		this.emit([...this.currentValue.slice(0, -1)]);

		return last;
	}

	delete(item: T) {
		const index = this.currentValue.indexOf(item);

		if (index == -1) {
			return false;
		}

		this.splice(index, 1);

		return true;
	}

	deleteAny(predicate: (item: T, index: number, array: T[]) => boolean) {
		this.emit(this.currentValue.filter((item, index) => !predicate(item, index, this.currentValue)));
	}

	find(predicate: (item: T, index: number, array: T[]) => boolean) {
		return this.currentValue.find(predicate);
	}

	findIndex(predicate: (item: T, index: number, array: T[]) => boolean) {
		return this.currentValue.findIndex(predicate);
	}

	replace(current: T, updated: T) {
		const index = this.currentValue.indexOf(current);

		if (index == -1) {
			throw new Error('Source item not found');
		}

		this.currentValue.splice(index, 1, updated);
		this.emit(this.currentValue);
	}

	filter(predicate: (item: T, index: number, array: T[]) => boolean) {
		return this.currentValue.filter(predicate);
	}

	some(predicate: (item: T, index: number, array: T[]) => boolean) {
		return this.currentValue.some(predicate);
	}

	shift() {
		const first = this.currentValue[0];
		this.emit([...this.currentValue.slice(1)]);

		return first;
	}

	unshift(item: T) {
		this.emit([item, ...this.currentValue]);
	}

	splice(start: number, length: number, ...replacement: T[]) {
		const copy = [...this.currentValue];
		const deleted = copy.splice(start, length, ...replacement);

		this.emit(copy);

		return deleted;
	}
}