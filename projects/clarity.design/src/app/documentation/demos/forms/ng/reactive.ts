import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule],
})
export class ExampleComponent {
  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });
}
