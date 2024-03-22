import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createIndustry } from '../intefaces/industry';

@Injectable({
  providedIn: 'root'
})
export class GigsService {
 

  constructor(private http:HttpClient) { }
  createIndustry(industry_details:createIndustry) {
    return this.http.post<{message:string, error:string}>(`http://localhost:4500/industry`,industry_details)
  }

  createSector(sector_details:createIndustry) {
    return this.http.post<{message:string, error:string}>(`http://localhost:4500/sector/create`,sector_details)
  }
}
