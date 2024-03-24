import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createIndustry, industryResponse ,sector} from '../intefaces/industry';
import { Observable } from 'rxjs';
import { Gigs } from '../intefaces/gig.interface';

@Injectable({
  providedIn: 'root'
})
export class GigsService {
  token = localStorage.getItem('token') as string;

  constructor(private http:HttpClient) { }
  createIndustry(industry_details:createIndustry) {
    return this.http.post<{message:string, error:string}>(`http://localhost:4500/industry`,industry_details)
  }
  getIndustries(){
    return this.http.get<industryResponse> ('http://localhost:4500/industry/')
  }

  createSector(sector_details:sector) {
    return this.http.post<{message:string, error:string}>(`http://localhost:4500/sector/create`,sector_details)
  }

  getSectorsByIndustry(industryID: string) {
    return this.http.get<sector[]>(`http://localhost:4500/sector/${industryID}`);
  }


  createGig(gigData: Gigs, userID: string) {
    return this.http.post<{ message: string, error: string }>(`http://localhost:4500/gigs/create/${userID}`, gigData,{
    headers:new HttpHeaders({
      'Content-type': 'application/json',
      'token': this.token
    })
  }

  )}

  getGigs() {
    return this.http.get<{ gigs: Gigs[], error: string }>(`http://localhost:4500/gigs`, {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'token': this.token
      })
    })
  }
}
