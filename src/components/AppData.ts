import {
	IAppData,
	FormErrors,
	IBasketData,
	IItem,
	IItemsData,
	IOrderData,
	ITypePayment,
} from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class ItemsData implements IItemsData {
	protected _items: IItem[] = [];

	set items(items: IItem[]) {
		this._items = items;
	}

	get items(): IItem[] {
		return this._items;
	}

	selectItem(id: string): void {
		const item = this._items.find((item) => item.id === id);
		if (item) {
			item.selected = !item.selected;
		}
	}

	getItem(id: string): IItem | null {
		return this._items.find((_item) => _item.id === id) || null;
	}
}

// работа с добавлением и удалением товара в корзину только через интерфейс
export class BasketData implements IBasketData {
	protected _items: IItem[] = [];
	protected _totalPrice: number = 0;

	get items(): IItem[] {
		return this._items;
	}

	get totalPrice(): number {
		return this._totalPrice;
	}

	addItem(item: IItem): void {
		this._items.push(item);
		this._totalPrice += item.price;
	}

	removeItem(item: IItem): void {
		const index = this._items.indexOf(item);
		if (index !== -1) {
			this._items.splice(index, 1);
			this._totalPrice -= item.price;
		}
	}
}


export class OrderData {
	payment: ITypePayment = 'cash';
	email: string = '';
	phone: string = '';
	address: string = '';
	protected _total: number = 0;
	protected _items: IItem['id'][] = [];

	get total(): number {
		return this._total;
	}

	get items(): IItem['id'][] {
		return this._items;
	}

	addItem(item: IItem): void {
		if (item.price === 0) return;
		if (!this._items.includes(item.id)) {
			this._items.push(item.id);
			this._total += item.price;
		}
	}

	removeItem(item: IItem): void {
		const index = this._items.indexOf(item.id);
		if (index !== -1) {
			this._items.splice(index, 1);
			this._total -= item.price;
		}
	}

	clearOrderItems(): void {
		this._items = [];
		this._total = 0;
	}
}

export class AppData extends Model<IAppData> implements IAppData {
    private static __instance: AppData;
	protected _itemsData: ItemsData;
	protected _basket: BasketData;
	protected _order: OrderData;
	preview: IItem | null = null;
	formErrors: FormErrors = {};

	private constructor(
		data: Partial<IAppData>,
		protected events: IEvents,
		itemsData: ItemsData,
		basket: BasketData,
		order: OrderData
	) {
		super(data, events);
		this._itemsData = itemsData;
		this._basket = basket;
		this._order = order;
	}

    static getInstance(
        data: Partial<IAppData>,
        events: IEvents,
        itemsData: ItemsData,
        basket: BasketData,
        order: OrderData
    ): AppData {
        if (!AppData.__instance) {
            AppData.__instance = new AppData(data, events, itemsData, basket, order);
        }
        return AppData.__instance;
    }

    get items(): IItem[] {
        return this._itemsData.items;
    }

    get basket(): IItem[] {
        return this._basket.items;
    }

	setCatalog(items: IItem[]): void {
		this._itemsData.items = items;
        this.emitChanges('items:change');
	}

	selectItem(item: IItem): void {
        this._itemsData.selectItem(item.id);
        this._basket.addItem(item);
        this._order.addItem(item);
	}

	unselectItem(item: IItem): void {
        this._itemsData.selectItem(item.id);
        this._basket.removeItem(item);
        this._order.removeItem(item);
	}

	setPreview(item: IItem): void {
		this.preview = item;
        this.emitChanges('preview:change', item);
	}

	setPayment(payment: ITypePayment): void {
		this._order.payment = payment;
	}

	setOrderField(
		field: keyof Pick<IOrderData, 'email' | 'phone' | 'address'>,
		value: string
	): void {
		this._order[field] = value;
		if (this.validateOrder()) this.emitChanges('order:valid');
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this._order.email) errors.email = 'Введите email';
		if (!this._order.phone) errors.phone = 'Введите телефон';
		if (!this._order.address) errors.address = 'Введите адрес';
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
