import { TestBed } from '@angular/core/testing';
import { StatusGaugeComponent } from './status-gauge.component';

describe('StatusGaugeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusGaugeComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(StatusGaugeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render panel title', async () => {
    const fixture = TestBed.createComponent(StatusGaugeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Ignite UI Linear Gauges');
  });
});
