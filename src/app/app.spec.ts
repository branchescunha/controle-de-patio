import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

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

  it('should add a vehicle when submitting a valid form', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.openVehicleModal();

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();

    expect(app.vehicles.length).toBe(1);
    expect(app.vehicles[0]).toEqual(
      expect.objectContaining({
        ownerName: 'André Vinícius',
        plate: 'ABC1D23',
        model: 'Mitsubishi Lancer GT',
        entryDate: '2026-09-15',
      }),
    );

    expect(app.isVehicleModalOpen).toBe(false);
  });

  it('should persist vehicles in localStorage', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();

    const storedVehicles = JSON.parse(localStorage.getItem('parking-control-vehicles') ?? '[]');

    expect(storedVehicles).toHaveLength(1);
    expect(storedVehicles[0]).toEqual(
      expect.objectContaining({
        ownerName: 'André Vinícius',
        plate: 'ABC1D23',
        model: 'Mitsubishi Lancer GT',
        entryDate: '2026-09-15',
      }),
    );
  });

  it('should load vehicles from localStorage on initialization', () => {
    localStorage.setItem(
      'parking-control-vehicles',
      JSON.stringify([
        {
          id: '1',
          ownerName: 'André Vinícius',
          plate: 'ABC1D23',
          model: 'Mitsubishi Lancer GT',
          entryDate: '2026-09-15',
        },
      ]),
    );

    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app.vehicles).toHaveLength(1);
    expect(app.vehicles[0]).toEqual(
      expect.objectContaining({
        ownerName: 'André Vinícius',
        plate: 'ABC1D23',
        model: 'Mitsubishi Lancer GT',
        entryDate: '2026-09-15',
      }),
    );
  });

  it('should update the vehicle counter after registration', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Veículos no Pátio: 1');
  });

  it('should render registered vehicles in card view', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const vehicleCard = compiled.querySelector('[data-testid="vehicle-card"]');

    expect(vehicleCard).not.toBeNull();
    expect(vehicleCard?.textContent).toContain('André Vinícius');
    expect(vehicleCard?.textContent).toContain('ABC1D23');
    expect(vehicleCard?.textContent).toContain('Mitsubishi Lancer GT');
  });

  it('should switch between card and table views', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-testid="vehicle-card"]')).not.toBeNull();

    const tableButton = Array.from(compiled.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Tabela'),
    );

    expect(tableButton).toBeDefined();

    tableButton?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('[data-testid="vehicle-table"]')).not.toBeNull();
    expect(compiled.querySelector('[data-testid="vehicle-card"]')).toBeNull();
  });

  it('should remove a vehicle and update localStorage', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.vehicleForm.setValue({
      ownerName: 'André Vinícius',
      plate: 'ABC1D23',
      model: 'Mitsubishi Lancer GT',
      entryDate: '2026-09-15',
    });

    app.submitVehicle();

    expect(app.vehicles).toHaveLength(1);

    const vehicleId = app.vehicles[0].id;

    app.removeVehicle(vehicleId);

    expect(app.vehicles).toHaveLength(0);

    const storedVehicles = JSON.parse(localStorage.getItem('parking-control-vehicles') ?? '[]');

    expect(storedVehicles).toHaveLength(0);
  });
});
