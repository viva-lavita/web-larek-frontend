import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export class ItemView extends Component<HTMLElement> {
    protected _itemImage: HTMLImageElement;
    protected _itemTitle: HTMLElement;
    protected _itemPrice: HTMLElement;
    protected _itemCategory: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this._itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this._itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
    }

    set title(value: string) {
        this.setText(this._itemTitle, value);

    }

    set price(value: number) {
        if (value === 0) {
            this.setText(this._itemPrice, 'Бесценно');
        } else {
            this.setText(this._itemPrice, String(value));
        }
    }

    set image(src: string) {
        this.setImage(this._itemImage, src, this._itemTitle.textContent);
    }

    set category(value: string) {
        this.setText(this._itemCategory, value);
    }
}