import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {CountryType} from "../../../types/country";
import {StateType} from "../../../types/state";
import {CityType} from "../../../types/city";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserDeleteModalComponent} from "../../modals/user-delete-modal/user-delete-modal.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  id: any;

  countries: (CountryType)[] = [];
  isCountriesLoad: boolean = false;

  states: (StateType)[] = [];
  isStatesLoad: boolean = false;

  cities: (CityType)[] = [];
  isCitiesLoad: boolean = false;

  updateUserForm: FormGroup;

  constructor(
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.id = this._activatedRoute.snapshot.paramMap.get("id");

    this.updateUserForm = new FormGroup({
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

  loadUser(): void {
    this.apiService.getUser(this.id)
      .subscribe((data: any) => {
        this.updateUserForm = new FormGroup({
          firstName: new FormControl(data.user.firstName, [Validators.required]),
          lastName: new FormControl(data.user.lastName, [Validators.required]),
          birthDay: new FormControl(data.user.birthDay, [Validators.required]),
          email: new FormControl(data.user.email, [Validators.required, Validators.email]),
          address: new FormControl(data.user.address, [Validators.required]),
          pinCode: new FormControl(data.user.pinCode, [Validators.required]),
          gender: new FormControl(data.user.gender, [Validators.required]),
          country: new FormControl(data.user.country._id, [Validators.required]),
          state: new FormControl(data.user.state._id, [Validators.required]),
          city: new FormControl(data.user.city._id, [Validators.required]),
        })

        this.loadStates(data.user.country._id)
        this.loadCities(data.user.state._id)
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

  loadCities(state: any = null, city: any = ''): void {
    this.updateUserForm.value.city = '';
    this.cities = [];

    this.isCitiesLoad = true;
    this.apiService.getCities(state ?? this.updateUserForm.value.state)
      .subscribe((data: any) => {
        this.cities = data.cities;
        this.updateUserForm.value.city = city;
        this.isCitiesLoad = false;
      })
  }

  loadStates(country: any = null, state: any = ''): void {
    this.updateUserForm.value.state = '';
    this.states = [];

    this.isStatesLoad = true;
    this.apiService.getStates(country ?? this.updateUserForm.value.country)
      .subscribe((data: any) => {
        this.states = data.states;
        this.updateUserForm.value.state = state;
        this.isStatesLoad = false;
      })
  }

  updateUser(): void {
    const user = new User(
      this.updateUserForm.value.firstName,
      this.updateUserForm.value.lastName,
      this.updateUserForm.value.pinCode,
      this.updateUserForm.value.address,
      this.updateUserForm.value.email,
      this.updateUserForm.value.birthDay,
      this.updateUserForm.value.gender,
      this.updateUserForm.value.country,
      this.updateUserForm.value.state,
      this.updateUserForm.value.city
    );

    this.apiService.updateUser(this.id, user)
      .subscribe((data: any) => {
        this._snackBar.open(data.message, 'Done');
      })
  }

  deleteUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';

    const dialogRef = this.dialog.open(UserDeleteModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.apiService.deleteUser(this.id)
            .subscribe((data: any) => {
              this._snackBar.open(data.message, 'Done');
              this.router.navigate([`/users`])
            })
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadCountries();
  }
}
