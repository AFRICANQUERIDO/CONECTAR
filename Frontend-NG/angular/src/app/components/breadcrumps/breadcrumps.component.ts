import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { Breadcrumb } from '../../intefaces/breadcrumps';

@Component({
  selector: 'app-breadcrumps',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumps.component.html',
  styleUrl: './breadcrumps.component.css'
})
export class BreadcrumpsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(() => this.buildBreadcrumbs())
      )
      .subscribe((breadcrumbs: Breadcrumb[]) => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  private buildBreadcrumbs(): Breadcrumb[] {
    let route = this.activatedRoute.root;
    const breadcrumbs: Breadcrumb[] = [];
    let url = '';

    while (route.children.length > 0) {
      const childRoute = route.children[0];
      if (!childRoute.snapshot.data.hasOwnProperty('breadcrumb')) {
        break;
      }

      const path = childRoute.snapshot.url.map(segment => segment.path).join('/');
      url += `/${path}`;

      const breadcrumb: Breadcrumb = {
        label: childRoute.snapshot.data[breadcrumb],
        url: url
      };
      breadcrumbs.push(breadcrumb);

      route = childRoute;
    }

    return breadcrumbs;
  }
}
