import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
  createDb() {
    let users: User[] = [
      { id: 100, title: 'Mr', firstName: 'Aman', lastName: 'kumar', dob: '2002-05-15', email: 'asd@gmail.com', password: '123456', acceptTerms: true },
      { id: 101, title: 'Mr', firstName: 'Rman', lastName: 'singh', dob: '2015-05-26', email: 'abc@gmail.com', password: '123456', acceptTerms: true },
      { id: 102, title: 'Mr', firstName: 'Pman', lastName: 'Panday', dob: '2018-05-25', email: 'asd@gmail.com', password: '123456', acceptTerms: true },
      { id: 103, title: 'Mr', firstName: 'Karan', lastName: 'Bindra', dob: '2002-05-15', email: 'asdcd@gmail.com', password: '123456', acceptTerms: true },
      { id: 104, title: 'Mr', firstName: 'Madan', lastName: 'kumar', dob: '2020-05-05', email: 'mnbv@gmail.com', password: '123456', acceptTerms: true },

    ];
    return { users };
  }
}
