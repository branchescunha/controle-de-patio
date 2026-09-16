import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Vehicle {
  id: string;
  ownerName: string;
  plate: string;
  model: string;
  entryDate: string;
}

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly storageKey = 'parking-control-vehicles';

  isVehicleModalOpen = false;
  formSubmitted = false;
  viewMode: 'cards' | 'table' = 'cards';

  vehicles: Vehicle[] = [];

  vehicleForm = new FormGroup({
    ownerName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    model: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    entryDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.loadVehicles();
  }

  setViewMode(viewMode: 'cards' | 'table'): void {
    this.viewMode = viewMode;
  }

  openVehicleModal(): void {
    this.isVehicleModalOpen = true;
  }

  closeVehicleModal(): void {
    this.isVehicleModalOpen = false;
    this.formSubmitted = false;
    this.vehicleForm.reset();
  }

  submitVehicle(): void {
    this.formSubmitted = true;

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehicleForm.getRawValue();

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      ownerName: formValue.ownerName.trim(),
      plate: formValue.plate.trim().toUpperCase(),
      model: formValue.model.trim(),
      entryDate: formValue.entryDate,
    };

    this.vehicles.push(vehicle);

    this.saveVehicles();
    this.closeVehicleModal();
  }

  removeVehicle(vehicleId: string): void {
    this.vehicles = this.vehicles.filter((vehicle) => vehicle.id !== vehicleId);

    this.saveVehicles();
  }

  private saveVehicles(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.vehicles));
  }

  private loadVehicles(): void {
    const storedVehicles = localStorage.getItem(this.storageKey);

    if (!storedVehicles) {
      return;
    }

    try {
      this.vehicles = JSON.parse(storedVehicles) as Vehicle[];
    } catch {
      this.vehicles = [];
    }
  }

  isFieldInvalid(controlName: 'ownerName' | 'plate' | 'model' | 'entryDate'): boolean {
    const control = this.vehicleForm.controls[controlName];

    return control.invalid && (control.touched || this.formSubmitted);
  }
}
