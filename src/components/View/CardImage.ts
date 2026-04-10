import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export abstract class CardImage extends Card {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
    }

    /**
     * Сеттер для категории.
     */
    set category(value: string) {
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || '';
        this.setText(this._category, value);
        
        // Сбрасываем классы и добавляем нужный
        this._category.className = 'card__category';
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

    /**
     * Сеттер для изображения.
     */
    set image(value: string) {
        this.setImage(this._image, `${CDN_URL}${value}`, this._title.textContent);
    }
}