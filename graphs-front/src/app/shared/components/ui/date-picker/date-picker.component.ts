import { Component, input, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="date-picker">
      <label *ngIf="label()" class="date-picker__label">{{ label() }}</label>
      <input
        type="datetime-local"
        [value]="value()"
        (change)="onValueChange($event)"
        [disabled]="disabled()"
        class="date-picker__input"
        [class.date-picker__input--disabled]="disabled()"
      />
      @if (error()) {
        <div class="date-picker__error">{{ error() }}</div>
      }
    </div>
  `,
  styles: [
    `
      .date-picker {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .date-picker__label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #333;
      }

      .date-picker__input {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #007bff;
        }

        &--disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      }

      .date-picker__error {
        color: #dc3545;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class DatePickerComponent {
  label = input<string>('');
  value = input<string>('');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();

  onValueChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
  }
}
