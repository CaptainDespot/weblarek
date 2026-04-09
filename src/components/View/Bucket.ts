import { IProduct } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CardBasket } from "./CardBucket";

export class Bucket extends Component<{ items: HTMLElement[]; total: number }> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>(".basket__list", container);
        this._total = ensureElement<HTMLElement>(".basket__price", container);
        this._button = ensureElement<HTMLButtonElement>(".basket__button", container);

        this._button.addEventListener("click", () => {
            this.events.emit("basket:order");
        });

        // Инициализируем корзину (по умолчанию пуста)
        this.items = [];
    }

    /**
     * Сеттер для управления состоянием кнопки
     */
    set disabled(value: boolean) {
        this.setDisabled(this._button, value);
    }

    /**
     * Сеттер для обновления списка товаров
     */
    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._list.replaceChildren(...items);
            this.disabled = false;
        } else {
            // Если список пуст, просто очищаем его. 
            // Надпись 'Корзина пуста' появится сама благодаря CSS.
            this._list.replaceChildren(); 
            this.disabled = true;
        }
    }

    /**
     * Сеттер для обновления итоговой стоимости
     */
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}