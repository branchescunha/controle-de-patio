import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the parking control title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Controle de Pátio');
  });

  it('should render the workshop name', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Oficina Central');
  });

  it('should open the vehicle form modal', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('button'));

    const registerButton = buttons.find((button) =>
      button.textContent?.includes('Registrar Nova Entrada'),
    );

    expect(compiled.querySelector('[data-testid="vehicle-modal"]')).toBeNull();

    registerButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="vehicle-modal"]')).not.toBeNull();
  });

  it('should require all vehicle form fields', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.vehicleForm.invalid).toBe(true);

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    expect(app.vehicleForm.valid).toBe(true);
  });
});
