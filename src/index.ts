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
import { IItem } from './types';

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
			onClick: () => events.emit('card:select', item),
		}).render(item)
	);
	page.counter = appData.basket.length;
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
