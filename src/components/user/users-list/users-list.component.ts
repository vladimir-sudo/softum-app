import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../../services/api.service";
import {UserDeleteModalComponent} from "../../modals/user-delete-modal/user-delete-modal.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CountryType} from "../../../types/country";
import {StateType} from "../../../types/state";
import {CityType} from "../../../types/city";
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../../../models/user.model";

@Component({
  selector: 'user-index',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = [
    '_id',
    'firstName',
    'lastName',
    'birthday',
    'address',
    'pinCode',
    'email',
    'countryName',
    'stateName',
    'cityName',
    'gender',
    'actions'
  ];

  users: [] = [];
  usersLoading: boolean = false;

  countries: (CountryType)[] = [];
  isCountriesLoad: boolean = false;

  states: (StateType)[] = [];
  isStatesLoad: boolean = false;

  cities: (CityType)[] = [];
  isCitiesLoad: boolean = false;

  searchForm: FormGroup;

  usersLength: number = 0;
  pageSize: number = 5;
  pageNum: number = 0;
  search: string = '';

  sort = {
    column: null,
    type: null
  };

  genders = [
    {
      key: 'male',
      value: 'Male'
    },
    {
      key: 'female',
      value: 'Female'
    }
  ]

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.searchForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      birthDay: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      pinCode: new FormControl(''),
      gender: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
    })
  }

  deleteUser(id: string): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '250px';

    const dialogRef = this.dialog.open(UserDeleteModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.apiService.deleteUser(id)
            .subscribe((data: any) => {
              this._snackBar.open(data.message, 'Done');
              this.getUsers();
            })
        }
      }
    );
  }

  getUsers(): void {
    this.usersLoading = true;

    const user = new User(
      this.searchForm.value.firstName,
      this.searchForm.value.lastName,
      this.searchForm.value.pinCode,
      this.searchForm.value.address,
      this.searchForm.value.email,
      this.searchForm.value.birthDay,
      this.searchForm.value.gender,
      this.searchForm.value.country,
      this.searchForm.value.state,
      this.searchForm.value.city
    );

    this.apiService.getUsers(user, this.pageNum * this.pageSize, this.pageSize)
      .subscribe((data: any) => {
        this.users = data.users;
        this.usersLength = data.length;
        this.usersLoading = false;
      })
  }

  loadCountries(): void {
    this.apiService.getCountries()
      .subscribe((data: any) => {
        this.countries = data.countries;
        this.isCountriesLoad = false;
      })
  }

  loadCities(): void {
    this.cities = [];

    this.isCitiesLoad = true;
    this.apiService.getCities(this.searchForm.value.state)
      .subscribe((data: any) => {
        this.cities = data.cities;
        this.isCitiesLoad = false;
      })
  }

  loadStates(): void {
    this.states = [];

    this.isStatesLoad = true;
    this.apiService.getStates(this.searchForm.value.country)
      .subscribe((data: any) => {
        this.states = data.states;
        this.isStatesLoad = false;
      })
  }

  resetForm() {
    this.searchForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      birthDay: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      pinCode: new FormControl(''),
      gender: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.getUsers();
    this.loadCountries();
  }

  sortTable(event: any) {
    if (!event.direction) {
      this.sort.column = null;
      this.sort.type = null;
    } else {
      this.sort.column = event.active;
      this.sort.type = event.direction;
    }
  }

  paginateTable(event: any) {
    this.pageSize = event?.pageSize ?? this.pageSize;
    this.pageNum = event?.pageIndex ?? this.pageNum;

    this.getUsers();
  }

  usersTable() {
    let users = this.decorateUsers(this.users);

    if (!!this.search) {
      users = this.searchUsers(users);
    }
    if (this.sort.column !== null) {
      users = this.sortUsers(users)
    }
    return users;
  }

  private sortUsers(users: any) {
    const column: any = this.sort.column;
    const type: any = this.sort.type;

    return users.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return type === 'asc' ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return type === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  private searchUsers(users: any): [] {
    return users?.filter((u: any) => {
      let valid = false;

      for (let column of this.displayedColumns) {
        if (!valid && !!u[column]) {
          valid = !!(u[column].indexOf(this.search) + 1);
        }
      }
      return valid;
    })
  }

  private decorateUsers(users: any): [] {
    return users?.map((u: any) => {
      const user = u;

      user.countryName = user.country.name;
      user.stateName = user.state.name;
      user.cityName = user.city.name;

      return user;
    });
  }

  showErrorTooltip(condition: boolean, message: string): void {
    if (condition) {
      this._snackBar.open(message, 'Ok');
    }
  }
}
