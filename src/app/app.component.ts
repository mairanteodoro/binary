import { Component, OnInit } from '@angular/core';
// Moment.js
import * as moment from 'moment/moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  myPer:number = 0;
  myZp:number = 0;
  myPhase:number = 0;
  myDate:Date; //= (moment.utc()).toDate();
  myTime:Date; //= (moment.utc()).toDate();
  myCurrTime:Date; //= (moment.utc()).toDate();;
  myCurrTimeString:string; //= this.myCurrTime.toUTCString();
  myDateTime:number[];
  binsys:string;
  myJD:string; //= this.dateToJD(this.myTime);;

  constructor(){
    // initial values
    this.myDate = (moment.utc()).toDate();
    this.myTime = (moment.utc()).toDate();
    // create UTC Date() object from selected
    // and displayed date and time
    this.myCurrTime = (moment.utc(
      [
        this.myDate.getFullYear(),
        this.myDate.getMonth(),
        this.myDate.getDate(),
        this.myTime.getHours(),
        this.myTime.getMinutes(),
        this.myTime.getSeconds()
      ]
    )).toDate();
    this.myCurrTimeString = this.myCurrTime.toUTCString();
    this.myJD = this.dateToJD(moment(this.myTime));
  };

  ngOnInit() {}

  onClickDate() {
    console.log('onClickDate() called');
    /*
      set the date and time displayed on date and timepicker as the UTC time, which in turn will change the user's local time according to its timezone (i.e. the local time will be set so as to have UTC = datepicker selected date and timepicker displayed time). This procedure takes DST into account too.
    */

    // create UTC Date() object from selected
    // and displayed date and time
    this.myCurrTime = (moment.utc(
      [
        // from datepicker
        this.myDate.getFullYear(),
        this.myDate.getMonth(),
        this.myDate.getDate(),
        // from timepicker
        this.myTime.getHours(),
        this.myTime.getMinutes(),
        // this.myTime.getSeconds()
      ]
    )).toDate();

    this.myCurrTimeString = this.myCurrTime.toUTCString();
    // dateToJD() expects a Moment.js object
    this.myJD = this.dateToJD(moment(this.myCurrTime));

    this.getPhase(this.myPer, this.myZp, this.myJD);
  }

  onClickJD(jd:number) {
    console.log('onClickJD() called');
    // update jd
    this.myJD = jd.toString();
    // call JDToDate()
    this.myCurrTime = this.JDToDate(jd);
    // update myCurrTimeString
    this.myCurrTimeString = this.JDToDate(jd).toUTCString();

    this.getPhase(this.myPer, this.myZp, this.myJD);
  }

  onChangePer(per:number) {
    console.log('%c period = '+per, 'color: red; font-weight: bold');
    // update myPer
    this.myPer = per;
    // call getPhase and pass P and ZP
    this.getPhase(this.myPer, this.myZp, this.myJD);
  }

  onChangeZp(zp:number) {
    console.log('%c zp = '+zp, 'color: red; font-weight: bold');
    console.log(zp);
    // update zp
    this.myZp = zp;
    // call getPhase and pass P and ZP
    this.getPhase(this.myPer, this.myZp, this.myJD);
  }

  getBinSys(event:any) {
    console.log("getBinSys() called");
    console.log(event);
    this.binsys = event.target.value;
    if (this.binsys==='etaCar') {
      this.myPer = 2022.7;
      this.myZp = 2456874.4;
      // calculate phase
      this.getPhase(this.myPer, this.myZp, this.myJD);
    }
  }

  getPhase(per:number, zp:number, jd:string) {
    console.log("getPhase() called");
    console.log(per, zp, jd);
    let currJD = Number(jd);
    // define phase between 0 and 1
    this.myPhase = ((currJD - zp) / per) % 1 < 0 ?
      ((currJD - zp) / per) % 1 + 1 :
      ((currJD - zp) / per) % 1;
  };

  dateToJD(date:any):string {
    /*
    JD is the Julian Day that starts at noon UTC.
    JDN is JD + fraction of day (time) from noon UTC.

    Implemented from http://www.tondering.dk/claus/cal/julperiod.php

    "The algorithm below works fine for AD dates. If you want to use it for BC dates, in order to comply with ISO-8601, you must first convert the BC year to a negative year (e.g., 10 BC = -9). The algorithm works correctly for all dates after 4800 BC, i.e. at least for all positive Julian Day."
    */

    var year = date.year() < 0 ? date.year() + 1 : date.year();

    if (year === 1582 && date.month() === 9 && (date.date() <= 14 && date.date() >= 5)) {
      // 1582 Oct 05 - 14
      console.log('NO JD DEFINED BETWEEN 1582 Oct 05 - 14')
    } else {
      // Julian calendar begins on:
      // 1582 Oct 05 = 1582.994623655914
      var julCalDecYear = 1582.994623655914;
      var currDecYear = date.year() +
                        (date.month()+1) / 12 +
                        date.date() / date.daysInMonth();

      if (currDecYear < julCalDecYear) {
        // Julian calendar
        var a = Math.floor((14 - (date.month()+1)) / 12);
        var y = year + 4800 - a;
        var m = (date.month()+1) + 12 * a - 3;
        var jdn = date.date() +
                  Math.floor((153 * m + 2) / 5) +
                  365 * y +
                  Math.floor(y / 4) -
                  32083;
        var jd = jdn +
                // validate UTC (JD is always in UTC)
                ((date._isUTC ? date.hour() : date.hour() - date.utcOffset() / 60) - 12) / 24 +
                date.minute() / 1440 +
                date.second() / 86400;
      } else {
        // Gregorian calendar
        var a = Math.floor((14 - (date.month()+1)) / 12);
        var y = year + 4800 - a;
        var m = (date.month()+1) + 12 * a - 3;
        var jdn = date.date() +
                  Math.floor((153 * m + 2) / 5) +
                  365 * y +
                  Math.floor(y / 4) -
                  Math.floor(y / 100) +
                  Math.floor(y / 400) -
                  32045;
        var jd = jdn +
                // validate UTC (JD is always in UTC)
                ((date._isUTC ? date.hour() : date.hour() - date.utcOffset() / 60) - 12) / 24 +
                date.minute() / 1440 +
                date.second() / 86400;
      }
    }
    return jd.toString();
  };

  JDToDate(myJD:number):Date {
    // convert from JD to a Date object
    if (myJD <= 2299160.5) {
      // Julian calendar
      var b:number = 0;
      var c:number = Number(myJD) + 32082;
    } else {
      // Gregorian calendar
      var a:number = Number(myJD) + 32044;
      var b:number = Math.floor((4 * a + 3) / 146097);
      var c:number = a - Math.floor((146097 * b) / 4);
    }
    var d:number = Math.floor((4 * c) / 1461);
    var e:number = c - Math.floor((1461 * d) / 4);
    var m:number = Math.floor((5 * e + 2) / 153);
    var myDay:number = e - Math.floor((153 * m + 2) / 5) + 1;
    var myMonth:number = m + 3 - 12 * Math.floor(m / 10);
    var myYear:number = 100 * b + d - 4800 + Math.floor(m / 10);
    // deal with time
    var myHour:number, myMinute:number, mySecond:number, myMillisecond:number;
    if (myDay % 1 !== 0) {
      //
      // using 24 h format (00:00:00)
      //
      if (myDay % 1 === 0.5) {
        // it is midnight; bubble up the day
        myDay = Math.floor(myDay) + 1;
        myHour = 0;
        myMinute = 0;
        mySecond = 0;
      } else {
        myHour = Math.floor((myDay % 1) < 0.5 ?
        // (myDay % 1) <= 0.5 corresponds to afternoon + night (i.e. 12:00:01-23:59:59)
                            (myDay % 1) * 24 + 12 :
        // (myDay % 1) > 0.5 corresponds to the "wee" hours + morning (i.e. 00:00:01-11:59:59)
                            (myDay % 1) * 24 - 12);
        myMinute = ((myDay % 1) * 1440 - ((myDay % 1) * 1440) % 1) % 60;
        mySecond = ((myDay % 1) * 86400 - ((myDay % 1) * 86400) % 1) % 60;
        myDay = myDay - myDay % 1;
      }
    } else {
      // it is noon
      myHour = 12;
      myMinute = 0;
      mySecond = 0;
    }

    // console.log('%cpassed JD: ' + myJD, 'color: red');
    // console.log('%cJDToDate() result array: ' +                       [myYear <= 0 ? Math.abs(myYear) + 1 + ' BCE': myYear + ' CE',
    //                       // keep Moment.js format for
    //                       // months, i.e., 0->Jan; 1->Feb...
    //                       myMonth - 1,
    //                       myDay,
    //                       myHour,
    //                       myMinute,
    //                       mySecond], 'font-weight: bold');

    return (moment.utc(
                      // there's no year 0; 1 BCE = "year 0"
                      [myYear,
                      // keep Moment.js format for
                      // months, i.e., 0->Jan; 1->Feb...
                      myMonth - 1,
                      myDay,
                      myHour,
                      myMinute,
                      mySecond]
                    )).toDate();
  }

}
