import {
	IAppData,
	FormErrors,
	IBasket,
	IItem,
	IItemsData,
	IOrder,
    ITypePayment,
} from '../types';
import { Api } from './base/api';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class ItemsData extends Model<{ items: IItem[] }> implements IItemsData {
	protected items: IItem[] = [];

	setItems(items: IItem[]): void {
		this.items = items;
		this.events.emit('items:change');
	}

	getItems() {
		return this.items;
	}

	selectItem(id: string): void {
		this.items.forEach((item) => {
			if (item.id === id) {
				item.selected = !item.selected;
			}
		});
		this.events.emit('items:select');
	}
}

export class Basket extends Model<IBasket> implements IBasket {
    protected items: IItem[] = [];
    protected totalPrice: number = 0;

    addItem(item: IItem) {
        this.items.push(item);
        this.totalPrice += item.price;
        this.events.emit('basket:change');
    }

    removeItem(item: IItem) {
        this.items = this.items.filter((i) => i.id !== item.id);
        this.totalPrice -= item.price;
        this.events.emit('basket:change');
    }

    inBasket(item: IItem): boolean {
        return this.items.find((i) => i.id === item.id) ? true : false;
    }
}


export class Order extends Model<IOrder> implements IOrder {
    protected payment: ITypePayment = 'cash';
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';
    protected total: number = 0;
    protected items: IItem["id"][] = [];

    // TODO: дописать методы возврата данных
}

class appState extends Model<IAppData> implements IAppData {
	preview: IItem | null = null;
	formErrors: FormErrors = {};

	constructor(
		data: Partial<IAppData>,
		protected events: IEvents,
		protected items: IItemsData,
		protected api: Api,
        protected basket: Basket,
        protected order: Order,
	) {
		super(data, events);
	}

    // обновление корзины после перехода в корзину
    updateBasket() {
        this.items.getItems().forEach((item) => {
            // товар выбран, и товара нет в корзине добавляем в список
            if (item.selected && !this.basket.inBasket(item)) {
                this.basket.addItem(item);
                // если у товара есть цена true, то увеличиваем:
                // общую цену, общую цену в форме заказа
                // список id для отправке в форме заказа
                // TODO: подумать над реализацией
            } // товар не выбран, и товара нет в корзине удаляем из списка
            else if (!item.selected && !this.basket.inBasket(item)) {
                this.basket.removeItem(item);
                // если у товара есть цена true, то уменьшаем:
                // общую цену, общую цену в форме заказа
                // список id для отправке в форме заказа
                // TODO: подумать над реализацией выше
            }
        });
        this.events.emit('basket:change');
    }
}
