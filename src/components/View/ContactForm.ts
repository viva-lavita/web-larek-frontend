import { Form } from "../common/Form";
import {IOrderContactForm} from "../../types";
import {IEvents} from "../base/events";
import { ensureElement } from "../../utils/utils";

export class ContactForm extends Form<IOrderContactForm> {
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = ensureElement<HTMLInputElement>('.form__input[placeholder="Введите Email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('.form__input[placeholder="+7 ("]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', container);


        this._emailInput.addEventListener('input', () => {
            this.events.emit('contactForm:change', {
                field: 'email',
                value: this._emailInput.value,
            });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contactForm:change', {
                field: 'phone',
                value: this._phoneInput.value,
            });
        });
    }

    set phone(value: string) {
        this._phoneInput.value = value;
        this.events.emit('contactForm:change', {
            field: 'phone',
            value: value,
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
        this.events.emit('contactForm:change', {
            field: 'email',
            value: value,
        });
    }

    enableSubmitButton() {
        this._submitButton.disabled = false;
    }

    disableSubmitButton() {
        this._submitButton.disabled = true;
    }
}

