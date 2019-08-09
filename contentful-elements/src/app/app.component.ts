import { Component } from '@angular/core';
import { init } from 'contentful-ui-extensions-sdk';

@Component({
  selector: 'contentful-form-generator',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'contentful-elements';

  constructor() {
    init( (extension) => {
      console.log('constructor extension', extension);
    });
  }
}
