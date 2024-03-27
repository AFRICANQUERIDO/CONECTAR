import { Pipe, PipeTransform } from '@angular/core';
import { ViewUsers } from '../../intefaces/user.interface';

@Pipe({
  name: 'filterRole',
  standalone: true
})
export class FilterRolePipe implements PipeTransform {
  transform(users: ViewUsers[], name: string): ViewUsers[] {
    if (!users || name == '') {
      return users;
    }


    const filtered: ViewUsers[] = [];

    for (let user of users) {
      if ((user.role).toLowerCase().includes(name.toLowerCase())) {
        filtered.push(user);
      }
    }

    return filtered;
  }

}
