import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс состояния формы
interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<IFormState & T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name || 'form'}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name || 'form'}:change`, {
            [field]: value
        } as any);
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors(value: string[]) {
        this.setText(this._errors, value.join(', '));
    }

    render(state: Partial<IFormState & T>) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors } as any);
        Object.assign(this, inputs);
        return this.container;
    }
}