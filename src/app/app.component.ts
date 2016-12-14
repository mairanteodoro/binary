import { Component } from '@angular/core';
// Moment.js
import * as moment from 'moment/moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(){};

  myPer:number = 0;
  myZp:number = 0;
  myPhase:number = 0;
  myDate:Date = new Date();
  myTime:Date = new Date();
  myDateTime:number[];
  binsys:string;
  myJD:string = this.dateToJD(this.myTime);

  onChangeDate() {
    console.log('onChangeDate() called');
    this.myDateTime = [
                       this.myDate.getFullYear(),
                       this.myDate.getMonth(),
                       this.myDate.getDate(),
                       this.myTime.getHours(),
                       this.myTime.getMinutes(),
                     ];
    this.myDate = moment(this.myDateTime).toDate();
    this.myTime = moment(this.myDateTime).toDate();
    this.myJD = this.dateToJD(this.myTime);
  }

  dateToJD(date:any) {
    // convert a Date object into JD
    // (use my implementation for Moment.js?)
    return (((+date) / 86400000) + 2440587.5).toFixed(6);
  };
  JDToDate(jd:number) {
    // convert from JD to a Date object
    // (use my implementation for Moment.js?)
    return new Date((Number(jd) - 2440587.5) * 86400000);
  }

  onChangePer(per:number) {
    console.log(per);
    // update myPer
    this.myPer = per;
    // call getPhase and pass P and ZP
    this.getPhase(this.myPer, this.myZp);
  }

  onChangeZp(zp:number) {
    console.log(zp);
    // update zp
    this.myZp = zp;
    // call getPhase and pass P and ZP
    this.getPhase(this.myPer, this.myZp);
  }

  getBinSys(event:any) {
    console.log("getBinSys() called");
    console.log(event);
    this.binsys = event.target.value;
    if (this.binsys==='etaCar') {
      this.myPer = 2022.7;
      this.myZp = 2456874.4;
      // calculate phase
      this.getPhase(this.myPer, this.myZp);
    }
  }

  getPhase(per:number, zp:number) {
    console.log("getPhase() called");
    console.log(this.dateToJD(this.myDate));
    let jd = Number(this.dateToJD(this.myDate));
    this.myPhase = (jd - zp) / per;
    console.log(this.JDToDate(jd));
    console.log(per, zp);
  };

}
