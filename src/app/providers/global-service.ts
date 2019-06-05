import { Injectable } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';
//import { injectTemplateRef } from '@angular/core/src/render3/view_engine_compatibility';

@Injectable()
export class GlobalService {

  public ageVerified: boolean = false;
  public userName: string = "";
  public password: string = "";

  constructor() {}

  getAgeVerified() {
    console.log("in global service - get ageVerified = ", this.ageVerified);
    return this.ageVerified;
  }
  setAgeVerified(v: boolean) {
    console.log("in global service - set ageVerified = ", v);
    this.ageVerified = v;
  }

  getUserName() {
    return this.userName;
  }
  setUserName(n: string) {
    console.log("in global service - set userName = ", this.ageVerified);
    this.userName = n;
  }

  getPassword() {
    return this.password;
  }
  setPassword(p: string) {
    console.log("in global service - set password = ", this.ageVerified);
    this.password = p;
  }
}
