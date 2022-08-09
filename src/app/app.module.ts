import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UsersListComponent} from "../components/user/users-list/users-list.component";
import {CreateUserComponent} from "../components/user/create-user/create-user.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ApiService} from "../services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {EditUserComponent} from "../components/user/edit-user/edit-user.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserDeleteModalComponent} from "../components/modals/user-delete-modal/user-delete-modal.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    CreateUserComponent,
    EditUserComponent,
    UserDeleteModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'users',
        children: [
          {path: '', component: UsersListComponent},
          {path: 'add', component: CreateUserComponent},
          {path: ':id', component: EditUserComponent}
        ]
      },
    ]),
    MatTableModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSelectModule,
    MatToolbarModule,
    HttpClientModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    MatDatepickerModule,
    ApiService,
    MatSnackBar,
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    UserDeleteModalComponent
  ]
})
export class AppModule {
}
