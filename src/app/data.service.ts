import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FilterComponent } from './filter/filter.component';
@Injectable({
  providedIn: 'root'
})
export class DataService 
{
  private apiUrl = 'http://localhost:3000/data'; 
  private apiUrl2 = 'http://localhost:3000/api/colleges';
  private apiUrl3 = 'http://localhost:3000/api/jee';
  

  constructor(private http: HttpClient) {}
  getData(): Observable<any> 
  {
    return this.http.get<any>(this.apiUrl);
  }
  getFilteredColleges(caste: string, percentile: number, branch:string[],locations: string[],minority:string[]): Observable<any[]> 
  {
    return this.http.post<any[]>(this.apiUrl2, { caste, percentile, branch,locations,minority });
  }
  getFilteredCollegesj(percentile: any, branch:string[],locations: string[]): Observable<any[]> 
  {
    return this.http.post<any[]>(this.apiUrl3, {  percentile, branch,locations, });
  }
  
}
