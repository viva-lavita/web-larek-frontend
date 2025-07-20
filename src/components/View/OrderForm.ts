import { Form } from '../common/Form';
import { IOrderForm, ITypePayment } from '../../types/index';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IOrderForm> {
    protected _btnPaymentOnline: HTMLButtonElement;
    protected _btnPaymentCash: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._btnPaymentOnline = ensureElement<HTMLButtonElement>(
            '.order__buttons button:nth-child(1)',
            container
        );

        this._btnPaymentCash = ensureElement<HTMLButtonElement>(
            '.order__buttons button:nth-child(2)',
            container
        );
        
        this._addressInput = ensureElement<HTMLInputElement>('input', container);

        this._btnPaymentOnline.addEventListener('click', () => {
            this.setPaymentMethod('online');
        });

        this._btnPaymentCash.addEventListener('click', () => {
            this.setPaymentMethod('cash');
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('orderForm:change', {
                field: 'address',
                value: this._addressInput.value
            });
        });
        this.setPaymentMethod('online');
    }

    protected setPaymentMethod(method: ITypePayment) {
        this.toggleClass(this._btnPaymentOnline, 'button_alt-active', method === 'online');
        this.toggleClass(this._btnPaymentCash, 'button_alt-active', method === 'cash');
        this.events.emit('orderForm:change', {
            field: 'payment',
            value: method
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: ITypePayment) {
        this.setPaymentMethod(value);
    }
}