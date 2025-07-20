import { IEvents } from "../components/base/events";

type categoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хардскил';

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
    index?: number;
}

export interface IItemsData {
	items: IItem[];
	selectItem(id: string): void;
	getItem(id: string): IItem | null;
}

export interface IItemAPI {
	getItems(): Promise<IItem[]>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrderData): Promise<IOrderResponse | OrderError>;
}

export interface IBasketData {
	items: IItem[];
    totalPrice: number;
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
    clearBasket(): void;
}

export type ITypePayment = 'cash' | 'online';

export interface IOrderForm {
    payment: ITypePayment;
    address: string;
}

export interface IOrderContactForm extends IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm, IOrderContactForm {
    total: number;
    items: IItem['id'][];
}

export interface IOrderData extends IOrder {
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
	clearOrder(): void;
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export class OrderError extends Error {
	error: string;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IAppData {
    items: IItem[];
	preview: IItem | null;
	formErrors: FormErrors;
	selectItem: (item: IItem) => void;
	setPreview: (item: IItem) => void;
    setPayment: (payment: ITypePayment) => void;
    getOrder: () => IOrder;
    setOrderField: (field: keyof Pick<IOrderData, 'payment' |'address'>, value: string) => void;
    setOrderFieldContacts: (field: keyof Pick<IOrderData, 'email' | 'phone'>, value: string) => void;
    validateOrder: () => boolean;
}
