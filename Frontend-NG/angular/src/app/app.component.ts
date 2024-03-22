import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent, throttle, throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';

//   constructor() {
//     fromEvent(window, 'scroll').pipe(throttleTime(100)).subscribe((event) =>this.onwindowScroll(event)); 
//   }
//   // @HostListener('window:scroll', ['$event'])
//   onwindowScroll(event:Event) {
//     console.log("scrolling");
//     // logic to handle scroll event
//     let scrollPosition = window.scrollY|| document.documentElement.scrollTop;
// scrollPosition = scrollPosition + 160;
//     const sections:any = document.querySelectorAll('section');

//     sections.forEach((section:HTMLElement) => {
//       if(section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
//         // section.classList.add('active');
//        var navLinks:any = document.querySelectorAll('.nav-link');
//        navLinks.forEach((link:HTMLAnchorElement) => {
//          if(link.href.includes(section.id)) {
//            link.classList.add('active');
//          }else{
//            link.classList.remove('active');
//          }
//        })
//       }
//     })
  
//   }
}
