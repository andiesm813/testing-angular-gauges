import { Component } from '@angular/core';
import { IgxLinearGaugeModule } from 'igniteui-angular-gauges';
import { IgxRadialGaugeModule } from 'igniteui-angular-gauges';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';

@Component({
  selector: 'app-root',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  linearValue = 65;
  radialValue = 75;
}
