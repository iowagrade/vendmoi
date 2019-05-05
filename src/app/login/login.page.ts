import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../providers/global-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ageVerify: boolean = false;
  ageVerified: boolean = false;

  constructor(public globalService: GlobalService) { }

  ngOnInit() {
    console.log("global age verified = ", this.globalService.getAgeVerified());
    this.ageVerified = this.globalService.getAgeVerified();
  }

  checkAgeVerify() {
    this.ageVerified = !this.ageVerified;
    this.globalService.setAgeVerified(this.ageVerified);
//    this.ageVerify = !this.ageVerified;
  }

}
