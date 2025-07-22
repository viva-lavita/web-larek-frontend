import { IItemAPI, IItem, IItemServe, IOrderData, IOrderResponse, IOrderError, IOrder } from '../types';
import { Api, ApiListResponse } from './base/api';


class OrderError extends Error implements IOrderError {
	error: string;
}

// !при получении меняется null на 0, добавляется флаг добавления в корзину пользователем
export class ItemAPI extends Api implements IItemAPI {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItems(): Promise<IItem[]> {
		return this.get('/product/').then((data: ApiListResponse<IItemServe>) =>
			data.items.map(item => ({
				...item,
				price: item.price || 0,
				image: this.cdn + item.image,
				selected: false,
			}))
		);
	}

	// в текущей реализации не используется
	getItem(id: string): Promise<IItem> {
		return this.get('/product/' + id).then((data: IItemServe) => ({
			...data,
			price: data.price || 0,
			image: this.cdn + data.image,
			selected: false,
		}));
	}

	makeOrder(order: IOrder): Promise<IOrderResponse | IOrderError> {
		return this.post('/order', order)
			.then((data: IOrderResponse) => data)
			.catch((error: any) => {
				throw new OrderError(error);
			});
	}
}
