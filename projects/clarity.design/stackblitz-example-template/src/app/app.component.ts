import { Component } from '@angular/core';

import { ExampleComponent } from './example.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ExampleComponent],
})
export class AppComponent {}
