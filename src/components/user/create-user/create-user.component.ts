import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {CountryType} from "../../../types/country";
import {StateType} from "../../../types/state";
import {CityType} from "../../../types/city";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../../models/user.model";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  countries: (CountryType)[] = [];
  isCountriesLoad: boolean = false;

  states: (StateType)[] = [];
  isStatesLoad: boolean = false;

  cities: (CityType)[] = [];
  isCitiesLoad: boolean = false;

  createUserForm: FormGroup;


  constructor(
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private router: Router
  ) {
    this.createUserForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthDay: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      pinCode: new FormControl('', [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
    })
  }

  loadCountries(): void {
    this.isCountriesLoad = true;
    this.apiService.getCountries()
      .subscribe((data: any) => {
        this.countries = data.countries;
        this.isCountriesLoad = false;
      })
  }

  loadCities(): void {
    this.createUserForm.value.city = '';
    this.cities = [];

    this.isCitiesLoad = true;
    this.apiService.getCities(this.createUserForm.value.state)
      .subscribe((data: any) => {
        this.cities = data.cities;
        this.isCitiesLoad = false;
      })
  }

  loadStates(): void {
    this.createUserForm.value.state = '';
    this.states = [];

    this.isStatesLoad = true;
    this.apiService.getStates(this.createUserForm.value.country)
      .subscribe((data: any) => {
        this.states = data.states;
        this.isStatesLoad = false;
      })
  }

  createUser(): void {
    const user = new User(
      this.createUserForm.value.firstName,
      this.createUserForm.value.lastName,
      this.createUserForm.value.pinCode,
      this.createUserForm.value.address,
      this.createUserForm.value.email,
      this.createUserForm.value.birthDay,
      this.createUserForm.value.gender,
      this.createUserForm.value.country,
      this.createUserForm.value.state,
      this.createUserForm.value.city
    );

    this.apiService.createUser(user)
      .subscribe((data: any) => {
        this._snackBar.open(data.message, 'Done');
        this.router.navigate([`/users/${data.user._id}`])
      })
  }

  ngOnInit(): void {
    this.loadCountries();
  }
}
