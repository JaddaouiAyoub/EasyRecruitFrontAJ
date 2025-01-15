import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // Exemple de données dynamiques pour le footer
  contactInfo = {
    address: 'Morocco, Casablanca',
    phone: '(212) 354 645 999',
    email: 'easyrecruit@job.com',
  };

  usefulLinks = [
    { text: 'Add Job', url: '/post-job' },
    { text: 'Blog', url: '/blog' },
    { text: 'Find Jobs', url: '/search-jobs' },
    { text: 'FAQ', url: '/faq' },
    { text: 'Login', url: '/login' },
    { text: 'Privacy Policy', url: '/privacy-policy' },
    { text: 'Register', url: '/register' },
    { text: 'Shop', url: '/shop' },
    { text: 'Submit Resume', url: '/submit-resume' },
  ];

  blogPosts = [
    { title: 'Blog Post 1', url: '/blog-post-1', thumbnail: 'assets/images/blog/blog1.jpg', date: '1 day ago' },
    { title: 'Blog Post 2', url: '/blog-post-2', thumbnail: 'assets/images/blog/blog2.jpg', date: '2 days ago' },
    { title: 'Blog Post 3', url: '/blog-post-3', thumbnail: 'assets/images/blog/blog3.jpg', date: '4 days ago' },
  ];

  socialMediaLinks = [
    { icon: 'fa-facebook', url: '#' },
    { icon: 'fa-twitter', url: '#' },
    { icon: 'fa-google-plus', url: '#' },
    { icon: 'fa-instagram', url: '#' },
    { icon: 'fa-linkedin', url: '#' },
    { icon: 'fa-rss', url: '#' },
  ];
}
