import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

// Интерфейс для действий
interface ICardBasketActions {
    onDelete: (event: MouseEvent) => void;
}

export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents, actions?: ICardBasketActions) {
        super(container, events);

        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._button = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

        if (actions?.onDelete) {
            this._button.addEventListener("click", actions.onDelete);
        }
    }

    // Сеттер для индекса. Если setText не работает, используем textContent
    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }
}