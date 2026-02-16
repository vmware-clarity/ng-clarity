import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrAlertModule, ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule, ClrAlertModule],
})
export class ExampleComponent {
  submitted = false;
  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  resetForm() {
    this.exampleForm.reset();
  }

  submit() {
    this.submitted = true;

    setTimeout(() => {
      this.submitted = false;
    }, 1000);
  }
}
