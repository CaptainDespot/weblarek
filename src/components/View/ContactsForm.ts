import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { IBuyer } from "../../types";

export class ContactsForm extends Form<IBuyer> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    /**
     * Сеттер для поля почты.
     */
    set email(value: string) {
        const element = this.container.querySelector<HTMLInputElement>('input[name="email"]');
        if (element) {
            element.value = value;
        }
    }

    /**
     * Сеттер для поля телефона.
     */
    set phone(value: string) {
        const element = this.container.querySelector<HTMLInputElement>('input[name="phone"]');
        if (element) {
            element.value = value;
        }
    }
}