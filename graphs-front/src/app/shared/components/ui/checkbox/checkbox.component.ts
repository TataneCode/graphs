import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="checkbox">
      <input
        type="checkbox"
        [checked]="checked()"
        (change)="onCheckedChange($event)"
        [disabled]="disabled()"
        class="checkbox__input"
      />
      <span class="checkbox__label">{{ label() }}</span>
    </label>
  `,
  styles: [
    `
      .checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
        color: #333;

        &:hover {
          color: #007bff;
        }
      }

      .checkbox__input {
        width: 1rem;
        height: 1rem;
        accent-color: #007bff;
        cursor: pointer;

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      .checkbox__label {
        cursor: pointer;
      }

      .checkbox[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
      }
    `,
  ],
})
export class CheckboxComponent {
  label = input<string>('');
  checked = input<boolean>(false);
  disabled = input<boolean>(false);

  checkedChange = output<boolean>();

  onCheckedChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.checkedChange.emit(inputElement.checked);
  }
}
