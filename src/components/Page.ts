import { Component } from "./base/Component";
import { ItemPreviewView } from "./View/ItemPreviewView";
import { ItemView } from "./View/ItemView";

// ему будем передавать объект для отрисовки на странице:
// массив ItemView - готовые к отрисовке карточки
// количество товаров в корзине - number, пока не реализовано, потом.
interface IPage {
    cards: HTMLElement[]
}

export class Page extends Component<IPage> implements IPage {
    cards: HTMLElement[] = []

    constructor(container: HTMLElement) {
        super(container);
    }

    render(data: IPage): HTMLElement {
        this.container.replaceChildren(...data.cards);
        return this.container;
    }
}