import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ItemView } from "./ItemView";


export class ItemPreviewView extends ItemView {
    protected _itemDescription: HTMLElement;
    protected _itemBtn: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this._itemBtn = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this._itemDescription = ensureElement<HTMLElement>('.card__text', this.container);
    }

    set description(value: string) {
        this.setText(this._itemDescription, value);
    }

    set button(value: string) {
        this.setText(this._itemBtn, value);
    }

    set disabled(state: boolean) {
        this.setDisabled(this._itemBtn, state);
    }
}