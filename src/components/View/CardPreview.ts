import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardImage } from "./CardImage";

export class CardPreview extends CardImage {
    protected _text: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._text = ensureElement<HTMLElement>(".card__text", container);
        this._button = ensureElement<HTMLButtonElement>(".card__button", container);

        this._button.addEventListener("click", () => {
            this.events.emit("card:toggle");
        });
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
        
        if (value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, "Недоступно");
        } else {
            this.setDisabled(this._button, false);
        }
    }

    // Сеттер для изменения текста кнопки в зависимости от состояния корзины
    set inBasket(value: boolean) {
        if (!this._button.disabled) { // Меняем текст только если товар продается
            this.setText(this._button, value ? "Удалить из корзины" : "В корзину");
        }
    }
}