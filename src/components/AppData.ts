import {
	IAppData,
	FormErrors,
	IBasket,
	IItem,
	IItemsData,
	IOrder,
	ITypePayment,
} from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class ItemsData extends Model<{ items: IItem[] }> implements IItemsData {
	protected _items: IItem[] = [];

	set items(items: IItem[]) {
		this._items = items;
		this.events.emit('items:change');
	}

	get items(): IItem[] {
		return this._items;
	}

	selectItem(id: string): void {
		this._items.forEach((_item) => {
			if (_item.id === id) {
				_item.selected = !_item.selected;
			}
		});
		this.events.emit('items:select');
	}

	getItem(id: string): IItem | null {
		return this._items.find((_item) => _item.id === id) || null;
	}
}

export class Basket extends Model<IBasket> implements IBasket {
	protected _items: IItem[] = [];
	protected totalPrice: number = 0;

	addItem(item: IItem) {
		this._items.push(item);
		this.totalPrice += item.price;
		this.events.emit('basket:change');
	}

	removeItem(item: IItem) {
		this._items = this._items.filter((i) => i.id !== item.id);
		this.totalPrice -= item.price;
		this.events.emit('basket:change');
	}

	get items(): IItem[] {
		return this._items;
	}
}

export class Order extends Model<IOrder> implements IOrder {
	_payment: ITypePayment = 'cash';
	email: string = '';
	phone: string = '';
	address: string = '';
	protected total: number = 0;
	protected items: IItem['id'][] = [];

	set payment(payment: ITypePayment) {
		this._payment = payment;
		this.events.emit('order:payment');
	}

	addItem(item: IItem) {
		if (item.price === 0) return;
		if (this.items.includes(item.id)) return;
		this.items.push(item.id);
		this.total += item.price;
		this.events.emit('order:items');
	}

	removeItem(item: IItem) {
		if (item.price === 0) return;
		if (!this.items.includes(item.id)) return;
		this.items = this.items.filter((i) => i !== item.id);
		this.total -= item.price;
		this.events.emit('order:items');
	}

	clearOrderItems() {
		this.items = [];
		this.total = 0;
		this.events.emit('order:items');
	}
}

// TODO: не забыть про ситуацию, когда в корзине удалили товар
class appData extends Model<IAppData> implements IAppData {
	preview: IItem | null = null;
	formErrors: FormErrors = {};

	constructor(
		data: Partial<IAppData>,
		protected events: IEvents,
		protected items: IItemsData,
		protected basket: Basket,
		protected order: Order
	) {
		super(data, events);
	}

	setCatalog(items: IItem[]) {
		this.items.items = items;
	}

	selectItem(id: string) {
		const item = this.items.getItem(id);
		if (!item) return;
		this.items.selectItem(item.id);
		this.basket.addItem(item);
		this.order.addItem(item);
	}

	unselectItem(id: string) {
		const item = this.items.getItem(id);
		if (!item) return;
		this.items.selectItem(item.id);
		this.basket.removeItem(item);
		this.order.removeItem(item);
	}

	setPreview(item: IItem) {
		this.preview = item;
		this.emitChanges('preview:change', item);
	}

	setPayment(payment: ITypePayment) {
		this.order.payment = payment;
	}

	setOrderField(
		field: keyof Pick<IOrder, 'email' | 'phone' | 'address'>,
		value: string
	) {
		this.order[field] = value;
		if (this.validateOrder()) this.emitChanges('order:valid');
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) errors.email = 'Введите email';
		if (!this.order.phone) errors.phone = 'Введите телефон';
		if (!this.order.address) errors.address = 'Введите адрес';
		this.formErrors = errors;
		return Object.keys(errors).length === 0;
	}
}
