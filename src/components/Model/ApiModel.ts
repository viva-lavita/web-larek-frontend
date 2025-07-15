import { IItem, IItemServe, IOrder, IOrderServe } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export interface IApiModel {
	getItems(): Promise<IItem[]>;
	getItem(id: string): Promise<IItem>;
	makeOrder(order: IOrder): Promise<IOrderServe>;
}

// !при получении меняется null на 0
export class ApiModel extends Api implements IApiModel {
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
			}))
		);
	}

	// вроде не понадобиться
	// TODO: удалить
	getItem(id: string): Promise<IItem> {
		return this.get('/product/' + id).then((data: IItemServe) => ({
			...data,
			selected: false,
			price: data.price || 0,
			image: this.baseUrl + data.image,
		}));
	}

	makeOrder(order: IOrder): Promise<IOrderServe> {
		return this.post('/order', order).then((data: IOrderServe) => data);
	}
}
