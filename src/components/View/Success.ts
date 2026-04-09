import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для данных окна успеха
interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._description = ensureElement<HTMLElement>('.order-success__description', container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

        // Уведомляем систему, что пользователь нажал "За новыми покупками!"
        this._button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    /**
     * Сеттер для обновления стоимости заказа.
     */
    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}