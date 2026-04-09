import { IEvents } from "../base/Events";
import { CardImage } from "./CardImage";

// 1. Интерфейс для действий с карточкой
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends CardImage {
    constructor(container: HTMLElement, events: IEvents, actions?: ICardActions) {
        super(container, events);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
}