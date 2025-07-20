import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class ItemView extends Component<HTMLElement> {
	protected _index?: HTMLElement | null; // порядковый номер в корзине
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _btn?: HTMLButtonElement;
	protected _category?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._index = container.querySelector('.basket__item-index');
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._description = container.querySelector('.card__text');
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._category = container.querySelector('.card__category');
		this._btn = container.querySelector('.card__button') as HTMLButtonElement;

		if (actions?.onClick) {
			if (this._btn) {
				this._btn.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === 0) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${String(value)} синапсов`);
		}
	}

	set image(src: string) {
		this.setImage(this._image, src, this._title.textContent);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}

	set btnDisabled(value: boolean) {
		if (this._btn) {
			this._btn.disabled = value;
		}
	}

	set btnText(value: string) {
		if (this._btn) {
			this.setText(this._btn, value);
		}
	}
}
