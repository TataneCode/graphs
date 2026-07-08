import { Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      (click)="onClick()"
      [disabled]="disabled() || loading()"
      class="button"
      [class.button--primary]="variant() === 'primary'"
      [class.button--secondary]="variant() === 'secondary'"
      [class.button--success]="variant() === 'success'"
      [class.button--danger]="variant() === 'danger'"
      [class.button--outline]="variant() === 'outline'"
      [class.button--ghost]="variant() === 'ghost'"
      [class.button--sm]="size() === 'sm'"
      [class.button--md]="size() === 'md'"
      [class.button--lg]="size() === 'lg'"
      [class.button--loading]="loading()"
    >
      @if (loading()) {
        <span class="button__spinner"></span>
      }
      <span class="button__content">{{ label() }}</span>
    </button>
  `,
  styles: [
    `
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &--sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        &--md {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        &--lg {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        &--primary {
          background-color: #007bff;
          color: white;

          &:hover:not(:disabled) {
            background-color: #0056b3;
          }

          &:disabled {
            background-color: #cccccc;
          }
        }

        &--secondary {
          background-color: #6c757d;
          color: white;

          &:hover:not(:disabled) {
            background-color: #5a6268;
          }

          &:disabled {
            background-color: #cccccc;
          }
        }

        &--success {
          background-color: #28a745;
          color: white;

          &:hover:not(:disabled) {
            background-color: #218838;
          }

          &:disabled {
            background-color: #cccccc;
          }
        }

        &--danger {
          background-color: #dc3545;
          color: white;

          &:hover:not(:disabled) {
            background-color: #c82333;
          }

          &:disabled {
            background-color: #cccccc;
          }
        }

        &--outline {
          background-color: transparent;
          border: 1px solid #007bff;
          color: #007bff;

          &:hover:not(:disabled) {
            background-color: rgba(0, 123, 255, 0.1);
          }

          &:disabled {
            border-color: #cccccc;
            color: #cccccc;
          }
        }

        &--ghost {
          background-color: transparent;
          color: #333;

          &:hover:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.1);
          }

          &:disabled {
            color: #cccccc;
          }
        }

        &--loading {
          cursor: wait;
          opacity: 0.8;
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      .button__spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .button__content {
        white-space: nowrap;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ButtonComponent {
  label = input<string>('Button');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  click = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.click.emit();
    }
  }
}
