import { Component } from '@angular/core';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';

@Component({
  selector: 'app-second-page',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './second-page.component.html',
  styleUrls: ['../app.css']
})
export class SecondPageComponent {
  linearValue = 65;
  radialValue = 75;
}
