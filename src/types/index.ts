type categoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хардскил';

export type IItemServe = {
	id: string;
	title: string;
	price: number | null;
	description: string;
	image: string;
	category: categoryType;
};

export type IItem = IItemServe & {
	price: number;
	selected: boolean;
	index?: number;
};

export interface IItemsData {
	items: IItem[];
	selectItem(id: string): void;
	getItem(id: string): IItem | null;
}

export interface IItemAPI {
	getItems(): Promise<IItem[]>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrderData): Promise<IOrderResponse | IOrderError>;
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

export interface IOrderContactForm {
	email: string;
	phone: string;
}

export type IOrder = IOrderForm &
	IOrderContactForm & {
		total: number;
		items: IItem['id'][];
	};

export interface IOrderData extends IOrder {
	addItem(item: IItem): void;
	removeItem(item: IItem): void;
	clearOrder(): void;
	getOrder(): IOrder;
}

export type IOrderResponse = {
	id: string;
	total: number;
};

export interface IOrderError extends Error {
	error: string;
}

export type FormErrors = Record<string, string>;

export interface IAppData {
	items: IItem[];
	basket: IItem[];
	totalPrice: number;
	preview: IItem | null;
	formErrors: FormErrors;
	getOrder: () => IOrder;
	setCatalog: (items: IItem[]) => void;
	selectItem: (item: IItem) => void;
	unselectItem: (item: IItem) => void;
	setPreview: (item: IItem) => void;
	setPayment: (payment: ITypePayment) => void;
	setOrderField: (
		field: keyof Pick<IOrderData, 'payment' | 'address'>,
		value: string
	) => void;
	setOrderFieldContacts: (
		field: keyof Pick<IOrderData, 'email' | 'phone'>,
		value: string
	) => void;
	validateOrder: () => boolean;
	validateContacts: () => boolean;
	clearBasket: () => void;
}
