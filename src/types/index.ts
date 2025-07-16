type categoryType = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хардскил';

export interface IItemServe {
    id: string;
    title: string;
    price: number | null;
    description: string;
    image: string;
    category: categoryType;
}

export interface IItem extends IItemServe {
    price: number;
    selected: boolean;
}

export interface IItemsData {
    setItems(items: IItem[]): void;
    getItems(): IItem[];
    selectItem(id: string): void;
}

export interface IApiItems {
    getItems(): Promise<IItem[]>;
    getItem(id: string): Promise<IItem>;
    makeOrder(order: IOrder): Promise<IOrderServe | OrderError>;
}

export interface IBasket {
    addItem(item: IItem): void;
    removeItem(item: IItem): void;
}

export type ITypePayment = 'cash' | 'card';

export interface IOrder {
}

export interface IOrderServe {
    id: string;
    total: number;
}

export class OrderError extends Error {
    error: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>

export interface IAppData {
    preview: IItem | null;
    formErrors: FormErrors;
}

