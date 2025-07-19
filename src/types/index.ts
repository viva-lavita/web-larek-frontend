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
}

export interface IItemsData {
	items: IItem[];
	selectItem(id: string): void;
	getItem(id: string): IItem | null;
}

export interface IItemAPI {
	getItems(): Promise<IItem[]>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrder): Promise<IOrderResponse | OrderError>;
}

export interface IBasket {
	items: IItem[];
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
}

export type ITypePayment = 'cash' | 'card';

export interface IOrder {
	payment: ITypePayment;
	email: string;
	phone: string;
	address: string;
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
	clearOrderItems(): void;
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export class OrderError extends Error {
	error: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppData {
	preview: IItem | null;
	formErrors: FormErrors;
	selectItem: (id: string) => void;
	unselectItem: (id: string) => void;
	setPreview: (item: IItem) => void;
}
