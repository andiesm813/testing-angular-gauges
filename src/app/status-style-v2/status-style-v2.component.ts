import { Component } from '@angular/core';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';

@Component({
  selector: 'app-status-style-v2',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './status-style-v2.component.html',
  styleUrls: ['../app.css']
})
export class StatusStyleV2Component {
  linearValue = 65;
  radialValue = 75;
}
