import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService 
{
  private tempSource = new BehaviorSubject<boolean>(false);
  currentTemp = this.tempSource.asObservable();
  private email = new BehaviorSubject<any>(null);
  currentemail = this.email.asObservable();

  updateTemp(value: boolean) 
  {
    this.tempSource.next(value);
  }
  updateProfile(value:any)
  {
      // console.log(value);
      this.email.next(value); 
  }
}
