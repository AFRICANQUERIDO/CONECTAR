import { Pipe, PipeTransform } from '@angular/core';
import { Gigs, gigDetails } from '../../intefaces/gig.interface';

@Pipe({
  name: 'searchPipe',
  standalone: true
})
export class SearchPipePipe implements PipeTransform {

  transform(gigs: Gigs[], name: string): Gigs[]{
    if (!gigs || name == '') {
      return gigs;
    }
  

    const filtered: Gigs[] = [];

    for (let gig of gigs) {
      if ((gig.Name + " "+ gig.gigDescription+" "+gig.gigName).toLowerCase().includes(name.toLowerCase())) {
        filtered.push(gig);
      } 
    }
    

    return filtered;
  }

}
