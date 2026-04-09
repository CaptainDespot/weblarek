import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс для данных страницы
interface IPage {
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._gallery = ensureElement<HTMLElement>('.gallery', container);
    }

    /**
     * Сеттер для обновления витрины (showcase).
     */
    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }
}