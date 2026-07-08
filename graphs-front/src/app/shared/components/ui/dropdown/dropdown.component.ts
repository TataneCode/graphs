import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="dropdown">
      <label *ngIf="label()" class="dropdown__label">{{ label() }}</label>
      <select
        [value]="value()"
        (change)="onValueChange($event)"
        [disabled]="disabled()"
        class="dropdown__select"
        [class.dropdown__select--disabled]="disabled()"
      >
        @if (placeholder()) {
          <option value="" disabled>{{ placeholder() }}</option>
        }
        @for (option of options(); track option.value) {
          <option [value]="option.value" [disabled]="option.disabled">{{ option.label }}</option>
        }
      </select>
      @if (error()) {
        <div class="dropdown__error">{{ error() }}</div>
      }
    </div>
  `,
  styles: [
    `
      .dropdown {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .dropdown__label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #333;
      }

      .dropdown__select {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        font-size: 1rem;
        background-color: white;
        cursor: pointer;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #007bff;
        }

        &--disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        &::placeholder {
          color: #999;
        }
      }

      .dropdown__error {
        color: #dc3545;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
    `,
  ],
})
export class DropdownComponent {
  label = input<string>('');
  value = input<string | number>('');
  options = input<DropdownOption[]>([]);
  placeholder = input<string>('Select an option');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string | number>();

  onValueChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.valueChange.emit(selectElement.value);
  }
}
