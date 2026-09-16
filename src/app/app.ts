import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Vehicle {
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
  duplicatePlateError = false;
  viewMode: 'cards' | 'table' = 'cards';

  vehicles: Vehicle[] = [];

  vehicleForm = new FormGroup({
    ownerName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    plate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    model: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
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
    this.duplicatePlateError = false;
    this.vehicleForm.reset();
  }

  submitVehicle(): void {
    this.formSubmitted = true;
    this.duplicatePlateError = false;

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehicleForm.getRawValue();
    const normalizedPlate = formValue.plate.trim().toUpperCase();

    const plateAlreadyExists = this.vehicles.some(
      (vehicle) => vehicle.plate.trim().toUpperCase() === normalizedPlate,
    );

    if (plateAlreadyExists) {
      this.duplicatePlateError = true;
      return;
    }

    const vehicle: Vehicle = {
      ownerName: formValue.ownerName.trim(),
      plate: normalizedPlate,
      model: formValue.model.trim(),
      entryDate: formValue.entryDate,
    };

    this.vehicles.push(vehicle);

    this.saveVehicles();
    this.closeVehicleModal();
  }

  removeVehicle(vehiclePlate: string): void {
    const normalizedPlate = vehiclePlate.trim().toUpperCase();

    this.vehicles = this.vehicles.filter(
      (vehicle) => vehicle.plate.trim().toUpperCase() !== normalizedPlate,
    );

    this.saveVehicles();
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  clearDuplicatePlateError(): void {
    this.duplicatePlateError = false;
  }

  isFieldInvalid(controlName: 'ownerName' | 'plate' | 'model' | 'entryDate'): boolean {
    const control = this.vehicleForm.controls[controlName];

    return control.invalid && (control.touched || this.formSubmitted);
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
}
