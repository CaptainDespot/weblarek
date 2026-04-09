import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Типизируем компонент через интерфейс
interface IHeaderData {
    count: number;
}

export class Header extends Component<IHeaderData> {
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);

        // Вешаем слушатель на кнопку корзины
        this._basketButton.addEventListener('click', () => {
            this.events.emit('header:basket');
        });
    }

    /**
     * Сеттер для установки значения в счетчик корзины.
     */
    set count(value: number) {
        this.setText(this._counter, String(value));
    }
}