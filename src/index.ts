import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ItemView } from './components/View/ItemView';
import { ItemModel } from './components/Model/ItemModel';
import { ApiModel } from './components/Model/ApiModel';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/Page';
import { ItemPreviewView } from './components/View/ItemPreviewView';


const events = new EventEmitter();


const api = new ApiModel(API_URL, CDN_URL);
const model = new ItemModel(events);
const pageTemplate = document.querySelector('#page') as HTMLTemplateElement;
const galleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const gallery = ensureElement<HTMLElement>('.gallery'); 
const page = new Page(gallery);
api.getItems()
.then(data => {
    model.setItems(data)
    console.log(data);
}).catch(error => console.error(error));


// при изменении модели данных (первичная установка из api)
events.on("items:change", () => {
    const itemElements = model.getItems().map(item => new ItemView(cloneTemplate(galleryTemplate), events).render(item));
    // const previewElements = model.getItems().map(item => new ItemPreviewView(cloneTemplate(previewTemplate), events).render(item));
    page.render({cards: itemElements});
});
