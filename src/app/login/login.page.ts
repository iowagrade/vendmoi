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

  userName: string = "John Doe";
  password: string = "password_"

  constructor(public globalService: GlobalService) { }

  ngOnInit() {
    console.log("global age verified = ", this.globalService.getAgeVerified());
    this.ageVerified = this.globalService.getAgeVerified();
  }

  checkAgeVerify() {
    //this.ageVerified = !this.ageVerified;
    this.globalService.setAgeVerified(this.ageVerified);
//    this.ageVerify = !this.ageVerified;
    this.globalService.setUserName(this.userName);
    this.globalService.setPassword(this.password);
  }

}
