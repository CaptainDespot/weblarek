import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
    this.setText(this._title, value);
}

set price(value: number | null) {
    if (value === null) {
        this.setText(this._price, 'Бесценно');
    } else {
        this.setText(this._price, `${value} синапсов`);
    }
}
}