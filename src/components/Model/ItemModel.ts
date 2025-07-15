import { IItem } from '../../types';
import { IEvents } from '../base/events';


export class ItemModel {
    protected items: IItem[] = [];

    constructor(protected events: IEvents) {}

    setItems(items: IItem[]) {
        this.items = items;
        this.events.emit("items:change");
    }

    addItem(item: IItem) {
        this.items.push(item);
        this.events.emit("items:change");
    }

    removeItem(id: string) {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit("items:change");
    }

    getItems() {
        return this.items;
    }
}