import './scss/styles.scss';

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
    price: number | 0;
}

export interface IBasket {
    items: IItem[];
    totalPrice: number;
}

export interface ITypePayment {
    name: "online" | "cash";
}

export interface IOrder {
    payment: ITypePayment["name"];
    email: string;
    phone: string;
    address: string;
    total: number;
    items: IItem["id"][];
}

export interface IOrderServe {
    id: string;
    total: number;
}