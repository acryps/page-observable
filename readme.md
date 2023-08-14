[![npm version](https://badge.acryps.com/npm/@acryps%2Fpage-observable)](http://badge.acryps.com/go/npm/@acryps%2Fpage-observable)
# @acryps/page observables
Adds observables to page!

Creating an observable
```
const magicNumber = new Observable<number>();
```

Listening for changes
```
magicNumber.subscribe(value => console.log(value));
```

Pushing new changes
```
magicNumber.emit(1);
```

Embedding value into component
```
class ItemsComponent extends Component {
	render() {
		return <section>
			Mapped to a string: {magicNumber.map(value => value.toFixed(3))}

			Mapped to an element: {magicNumber.map(value => <em>
				{value}
			</em>)}

			Automatically mapped: {magicNumber} (only recommended for strings & numbers)
		</section>;
	}
}
```

## Example
```

class PageComponent {
	render(child) {
		return <main>
			<nav>
				Shop

				<a ui-href='/cart'>
					Cart ({CartComponent.items.map(items => items.length)})
				</a>
			</nav>

			{child}
		</main>;
	}
}

class CartComponent {
	static items = new Observable<string[]>();

	items = [
		'carrots',
		'apples'
	];

	render() {
		return <section>
			<button ui-click={() => {
				items.push('bananas');

				CartComponent.items.emit(items);
			}}>
		</section>;
	}
}
```
