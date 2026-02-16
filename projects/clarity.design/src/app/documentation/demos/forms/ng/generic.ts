import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClrFormsModule],
})
export class ExampleComponent {
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab', disabled: true },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
    { id: 'custom', name: 'Custom' },
  ];

  model = {
    basic: '',
    container: '',
    required: '',
    cars: [3],
  };

  reactiveModel: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reactiveModel = this.fb.group({
      basic: new FormControl(),
      container: new FormControl(),
      required: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/asdfasdf/)]),
      cars: new FormControl([3], [Validators.required]),
    });
  }
}
