import { IEvents } from "../base/Events";
import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export class ContactsForm extends Form<IBuyer> {
    // Сохраняем ссылки на элементы инпутов
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Находим элементы один раз при инициализации
        this._email = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    }

    /**
     * Сеттер для поля почты.
     */
    set email(value: string) {
        this._email.value = value;
    }

    /**
     * Сеттер для поля телефона.
     */
    set phone(value: string) {
        this._phone.value = value;
    }
}