import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidators {
  static minlength(control: AbstractControl): ValidationErrors | null {
    return control.value.length >= 8 ? null : { minlength: true };
  }

  static uppercase(control: AbstractControl): ValidationErrors | null {
    return /[A-Z]/.test(control.value) ? null : { uppercase: true };
  }

  static lowercase(control: AbstractControl): ValidationErrors | null {
    return /[a-z]/.test(control.value) ? null : { lowercase: true };
  }

  static specialChar(control: AbstractControl): ValidationErrors | null {
    return /[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { specialChar: true };
  }

  static consecutiveNumbers(control: AbstractControl): ValidationErrors | null {
    return /(\d)\1/.test(control.value) ? { consecutiveNumbers: true } : null;
  }

  static consecutiveLetters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    for (let i = 0; i < value.length - 1; i++) {
      if (value.charCodeAt(i) + 1 === value.charCodeAt(i + 1)) {
        return { consecutiveLetters: true };
      }
    }
    return null;
  }
}
