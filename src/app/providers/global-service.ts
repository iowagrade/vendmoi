import { Injectable } from '@angular/core';
//import { BehaviorSubject } from 'rxjs';
//import { injectTemplateRef } from '@angular/core/src/render3/view_engine_compatibility';

@Injectable()
export class GlobalService {

  public ageVerified: boolean = false;

  constructor() {}

  getAgeVerified() {
    return this.ageVerified;
  }

  setAgeVerified(v: boolean) {
    this.ageVerified = v;
  }
}
