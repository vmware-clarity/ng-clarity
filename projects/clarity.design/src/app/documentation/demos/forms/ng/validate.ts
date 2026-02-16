import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrAlertModule, ClrForm, ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule, ClrAlertModule],
})
export class ExampleComponent {
  submitted = false;
  error = false;
  @ViewChild(ClrForm, { static: true }) clrForm: ClrForm | undefined;

  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  submit() {
    if (this.exampleForm.invalid) {
      this.clrForm?.markAsTouched();

      // Do error logic
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 1000);
    } else {
      // Do submit logic
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
      }, 1000);
    }
  }
}
