export class User {
  constructor(
    public firstName: string|null = null,
    public lastName: string|null = null,
    public pinCode: string|null = null,
    public address: string|null = null,
    public email: string|null = null,
    public birthDay: string = '',
    public gender: string|null = null,
    public country: string|null = null,
    public state: string|null = null,
    public city: string|null = null
  ) {
  }

  getData(): object {
    let birthDay = '';

    if (!!this.birthDay) {
      const date = new Date(this.birthDay);

      const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();

      birthDay = `${date.getFullYear()}-${month}-${day}`;
    }

    return {
      firstName: this.firstName,
      lastName: this.lastName,
      pinCode: this.pinCode,
      address: this.address,
      email: this.email,
      birthDay,
      gender: this.gender,
      country: this.country,
      state: this.state,
      city: this.city,
    }
  }

  toUrlString() {
    const userData: any = this.getData();

    let urlString = '';
    for (let key in userData) {
      urlString += `${key}=${userData[key]}&`;
    }
    return urlString;
  }
}
