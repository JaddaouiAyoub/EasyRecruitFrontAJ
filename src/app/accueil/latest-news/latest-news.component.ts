import { Component } from '@angular/core';

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.css']
})
export class LatestNewsComponent {
  blogPosts = [
    {
      image: 'assets/images/blog/blog1.jpg',
      title: 'Top 10 Tips for Web Developers',
      date: 'September 7, 2016',
      comments: 0,
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
      link: '/blog-post/1'
    },
    {
      image: 'assets/images/blog/blog2.jpg',
      title: 'How to Prepare for an Interview',
      date: 'September 7, 2016',
      comments: 0,
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
      link: '/blog-post/2'
    },
    {
      image: 'assets/images/blog/blog3.jpg',
      title: 'Freelancing vs Employment',
      date: 'September 7, 2016',
      comments: 0,
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
      link: '/blog-post/3'
    }
  ];
}
