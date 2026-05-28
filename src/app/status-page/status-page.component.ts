import { Component } from '@angular/core';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';

@Component({
  selector: 'app-status-page',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './status-page.component.html',
  styleUrls: ['../app.css']
})
export class StatusPageComponent {
  linearValue = 65;
  radialValue = 75;
}
