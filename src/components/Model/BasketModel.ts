import { IItem } from "../../types";
import { IEvents } from "../base/events";

// параметры есть список объектов(данные) в корзине и общая стоимость 
// пишем методы добавления и удаления товара, 
// на метод добавления-удаления товара можно поставить события изменения корзины
class BasketModel {
    protected _items: IItem[] = [];
    protected _totalPrice: number = 0;

    constructor(protected events: IEvents) {}

    setItems(items: IItem[]) {
        this._items = items;
        this.events.emit("backet:change");
    }

    addItem(item: IItem) {
        this._items.push(item);
        this.events.emit("backet:change");
    }

    removeItem(id: string) {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit("backet:change");
    }
}