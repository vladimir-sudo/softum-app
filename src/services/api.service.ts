import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from "src/environments/environment";
import {User} from "../models/user.model";

@Injectable()
export class ApiService {
  private apiUrl: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  public getCountries() {
    return this.get('countries');
  }

  public getStates(countryId: string) {
    return this.get(`states/${countryId}`);
  }

  public getCities(stateId: string) {
    return this.get(`cities/${stateId}`);
  }

  public createUser(user: User) {
    return this.post(`users`, user.getData());
  }

  public getUser(id: string) {
    return this.get(`users/${id}`);
  }

  public updateUser(userId: string, user: User) {
    return this.put(`users/${userId}`, user.getData());
  }

  public deleteUser(userId: string) {
    return this.delete(`users/${userId}`);
  }

  public getUsers(user: User, skip: number = 0, limit: number = 5) {
    return this.get(`users?` + user.toUrlString() + `skip=${skip}&limit=${limit}`);
  }

  private get(url: string, params: object = {}){
    return this.httpClient.get(`${this.apiUrl}/${url}`, params);
  }

  private post(url: string, params: object = {}){
    return this.httpClient.post(`${this.apiUrl}/${url}`, params);
  }

  private put(url: string, params: object = {}){
    return this.httpClient.put(`${this.apiUrl}/${url}`, params);
  }

  private delete(url: string, params: object = {}){
    return this.httpClient.delete(`${this.apiUrl}/${url}`, params);
  }
}
