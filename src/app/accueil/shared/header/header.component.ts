import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showLoginPopup: boolean = false;

  openLoginPopup(): void {
    this.showLoginPopup = true;
  }

  closeLoginPopup(): void {
    this.showLoginPopup = false;
  }
  scrollToFooter() {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  scrollToBlogs() {
    const blogs = document.getElementById('blogs');
    if (blogs) {
      blogs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ScrollToOffer() {
    const jobs = document.getElementById("job-post")
    if(jobs){
      jobs.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }
}
