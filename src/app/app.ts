import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isVehicleModalOpen = false;
  formSubmitted = false;

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
  }

  isFieldInvalid(controlName: 'ownerName' | 'plate' | 'model' | 'entryDate'): boolean {
    const control = this.vehicleForm.controls[controlName];

    return control.invalid && (control.touched || this.formSubmitted);
  }
}
