import { Component } from '@angular/core';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';

@Component({
  selector: 'app-gauges',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './gauges.component.html',
  styleUrls: ['../app.css']
})
export class GaugesComponent {
  linearValue = 65;
  radialValue = 75;
}
