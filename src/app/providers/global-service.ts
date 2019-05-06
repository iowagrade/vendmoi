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
    return this.ageVerified;
  }
  setAgeVerified(v: boolean) {
    this.ageVerified = v;
  }

  getUserName() {
    return this.userName;
  }
  setUserName(n: string) {
    this.userName = n;
  }

  getPassword() {
    return this.password;
  }
  setPassword(p: string) {
    this.password = p;
  }
}
