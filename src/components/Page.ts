import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { CatalogView } from './View/CatalogView';

interface IPage {
	cards: HTMLElement[];
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPage> implements IPage {
	protected _gallery: HTMLElement;
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set cards(value: HTMLElement[]) {
		this._gallery.replaceChildren(...value);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}

	render(data: IPage): HTMLElement {
		this.container.replaceChildren(...data.cards);
		return this.container;
	}
}
