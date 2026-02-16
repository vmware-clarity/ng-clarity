import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  // Load all components for demo purposes.
  // Don't do this in a real application. Load just the components you need so that your bundle is smaller.
  imports: [ClarityModule],
})
export class ExampleComponent {}
