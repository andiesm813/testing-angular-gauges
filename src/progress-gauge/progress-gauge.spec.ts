import { TestBed } from '@angular/core/testing';
import { ProgressGaugeComponent } from './progress-gauge';

describe('ProgressGaugeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressGaugeComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ProgressGaugeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(ProgressGaugeComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, testing-gauges');
  });
});
