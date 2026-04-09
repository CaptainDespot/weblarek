import { IBuyer } from '../../types';
import { ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class OrderForm extends Form<IBuyer> {
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', container);

        // Слушаем клики по кнопкам оплаты
        this._paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Уведомляем систему о смене способа оплаты
                this.events.emit('order:change', {
                    payment: button.name as 'card' | 'cash'
                });
            });
        });
    }

    /**
     * Сеттер для адреса.
     */
    set address(value: string) {
        const input = this.container.querySelector<HTMLInputElement>('input[name="address"]');
        if (input) {
            input.value = value;
        }
    }

    /**
     * Сеттер для визуального переключения кнопок оплаты.
     */
    set payment(value: string) {
        this._paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }
}