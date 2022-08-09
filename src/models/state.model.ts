export class State {
  _id: string;
  name: string;
  country: string;

  constructor(_id: string, name: string, country: string) {
    this._id = _id;
    this.name = name;
    this.country = country;
  }
}
