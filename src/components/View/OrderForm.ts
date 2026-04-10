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
                this.payment = button.name;
                this.onInputChange('payment' as keyof IBuyer, button.name);
            });
        });
    }

    set address(value: string) {
        this._address.value = value;
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === name);
        });
    }
}