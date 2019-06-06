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

  userName: string = "";
  password: string = "";
  haveUser: boolean = false;

  constructor(public globalService: GlobalService) { }

  ngOnInit() {
    console.log("Enter Login ngOnOnit global age verified = ", this.globalService.getAgeVerified());
    this.ageVerified = this.globalService.getAgeVerified();
  }

  setUserName() {
    console.log("in setUserName");

    if(this.userName.length > 0 && this.password.length > 0 && this.ageVerified==true) {
        console.log("have user");
        this.haveUser = true;
    }
  }

  setPassword() {
    if(this.userName.length > 0 && this.password.length > 0 && this.ageVerified==true) {
      console.log("have user");
      this.haveUser = true;
    }
  }
  
  checkAgeVerify() {
    this.ageVerified = !this.ageVerified;
    console.log("In Login - ageVerified set to ", this.ageVerified);
    this.globalService.setAgeVerified(this.ageVerified);
//    this.ageVerify = !this.ageVerified;
    this.globalService.setUserName(this.userName);
    this.globalService.setPassword(this.password);
  
    if(this.userName.length > 0 && this.password.length > 0 && this.ageVerified==true) {
      console.log("have user");
      this.haveUser = true;
    }
  }
}
