import { Form } from "./Form";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class OrderForm extends Form<IBuyer> {
    protected _address: HTMLInputElement;
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.onInputChange('payment' as keyof IBuyer, button.name);
            });
        });
    }

    protected onInputChange(field: keyof IBuyer, value: string) {
        this.events.emit('order:change', { [field]: value });
    }

    /**
     * Сеттер для адреса.
     */
    set address(value: string) {
        if (this._address && this._address.value !== value) {
            this._address.value = value || '';
        }
    }

    /**
     * Сеттер для кнопок.
     * Управляет классом активности, основываясь на данных из модели.
     */
    set payment(name: string) {
        this._buttons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === name);
        });
    }
}