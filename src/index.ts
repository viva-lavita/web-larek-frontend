import { ItemAPI } from './components/ItemAPI';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';
import { Page } from './components/Page';
import { IEvents, EventEmitter } from './components/base/events';
import {
	AppData,
	BasketData,
	ItemsData,
	OrderData,
} from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactForm } from './components/View/ContactForm';
import { ItemView } from './components/View/ItemView';
import {
	FormErrors,
	IItem,
	IOrderContactForm,
	IOrderData,
	IOrderForm,
	IOrderResponse,
	ITypePayment,
} from './types';
import { Success } from './components/common/Succes';

const api = new ItemAPI(API_URL, CDN_URL);
const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = AppData.getInstance(
	{},
	events,
	new ItemsData(),
	new BasketData(),
	new OrderData()
);

// Глобальные контейнеры
const page = new Page(ensureElement('.page'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);

events.on('items:change', () => {
	page.cards = appData.items.map((item) =>
		new ItemView(cloneTemplate(cardCatalogTemplate), {
			// слушатель на карточку
			onClick: () => events.emit('card:select', item),
		}).render(item)
	);
	page.counter = appData.basket.length;
	console.log(appData.items);
});

// Открытие модалки
events.on('card:select', (item: IItem) => {
	appData.setPreview(item);
});

// Отрисовка модалки
events.on('preview:change', (item: IItem) => {
	const card = new ItemView(cloneTemplate(cardPreviewTemplate), {
		// слушатель на кнопку
		onClick: () => {
			if (!item.price) return;
			if (item.selected) {
				appData.unselectItem(item);
			} else {
				appData.selectItem(item);
			}
			// перерисовка текущей страницы и главной страницы
			events.emit('preview:change', item);
			events.emit('items:change', item);
		},
	});

	card.btnDisabled = !item.price;
	if (!item.price) {
		card.btnText = 'Недоступно';
	} else if (item.selected) {
		card.btnText = 'В корзине';
	} else {
		card.btnText = 'Купить';
	}

	modal.content = card.render(item);
	modal.open();
});

events.on('basket:open', () => {
	const items = appData.basket.map((item) =>
		new ItemView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:unselect', item),
		}).render(item)
	);
	const total = appData.totalPrice;
	modal.content = basket.render({ items, total });
	modal.open();
});

events.on('card:unselect', (item: IItem) => {
	appData.unselectItem(item);
	events.emit('basket:open');
});

events.on('order:open', () => {
	modal.content = order.render({
		valid: false,
		errors: [],
	});
	modal.open();
});

events.on(
	'orderForm:change',
	(changedField: {
		field: keyof Pick<IOrderData, 'payment' | 'address'>;
		value: string;
	}) => {
		appData.setOrderField(changedField.field, changedField.value);
	}
);

events.on(
	'contactForm:change',
	(changedField: {
		field: keyof Pick<IOrderData, 'email' | 'phone'>;
		value: string;
	}) => {
		appData.setOrderFieldContacts(changedField.field, changedField.value);
	}
);

events.on('order:valid', () => {
	modal.content = order.render({
		valid: true,
		errors: [],
	});
	modal.open();
});

events.on('contacts:valid', () => {
	modal.content = contacts.render({
		valid: true,
		errors: [],
	});
	modal.open();
});

events.on('order:submit', () => {
	modal.content = contacts.render({
		valid: false,
		errors: [],
	});
	modal.open();
});

events.on('contacts:submit', () => {
	const orderData = appData.getOrder();

	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => modal.close(),
	});

	api
		.makeOrder(orderData)
		.then((result: IOrderResponse) => {
			success.total = result.total.toString();
			modal.render({ content: success.render({}) });
			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('formErrorsOrder:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrorsContacts:change', (errors: Partial<IOrderContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

api
	.getItems()
	.then((items) => appData.setCatalog(items))
	.catch((err) => console.log(err));
