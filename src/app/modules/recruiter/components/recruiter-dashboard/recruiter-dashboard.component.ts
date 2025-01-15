import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../../../../services/dashboard/dashboard.service";
import { RecruteurDTO } from "../../../../models/recruteur-dto.model";

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css'],
})
export class RecruiterDashboardComponent implements OnInit {
  // Metrics Data
  jobOffers: number = 0;
  candidates: number = 0;
  interviews: number = 0;
  userData: RecruteurDTO = new RecruteurDTO();

  // Recent Activities
  recentActivities: string[] = [];

  // Chart Data for Applications Per Month
  applicationsLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  applicationsData: any = {
    datasets: [
      {
        data: [],
        label: 'Applications Per Month',
        backgroundColor: '#42A5F5',
      },
    ],
  };

  // Chart Data for Job Offers by Category
  jobCategoryLabels: string[] = [];
  jobCategoryData: any = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF5252', '#AB47BC'],
      },
    ],
  };

  // Chart Data for Applications Per Day
  applicationsPerDayLabels: string[] = [];
  applicationsPerDayData: any = {
    datasets: [
      {
        data: [],
        label: 'Applications Per Day',
        backgroundColor: '#66BB6A',
      },
    ],
  };

  // Chart Options
  chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.dashboardService.getDashboardData(this.userData.id).subscribe(
      (data) => {
        // Assign Metrics
        this.jobOffers = data.totalJobOffers;
        this.candidates = data.totalCandidates;
        this.interviews = data.totalInterviews;

        // Assign Recent Activities
        this.recentActivities = data.recentActivities;

        // Assign Applications Per Month
        this.applicationsData.datasets[0].data = data.applicationsPerMonth;

        // Assign Applications Per Day
        this.applicationsPerDayLabels = Object.keys(data.applicationsPerDay);
        this.applicationsPerDayData.datasets[0].data = Object.values(data.applicationsPerDay);

        // Assign Job Offers by Category
        const totalOffers = data.jobOffersByCategory.reduce(
          (sum: number, category: any) => sum + category.count,
          0
        );

        this.jobCategoryLabels = data.jobOffersByCategory.map(
          (category: any) => category.categoryName
        );
        this.jobCategoryData.datasets[0].data = data.jobOffersByCategory.map(
          (category: any) =>
            totalOffers > 0
              ? Number(((category.count / totalOffers) * 100).toFixed(2))
              : 0
        );

        console.log('Applications Per Day Data:', this.applicationsPerDayData);
      },
      (error) => {
        console.error('Error fetching dashboard data', error);

        // Reset Data in Case of Error
        this.jobOffers = 0;
        this.candidates = 0;
        this.interviews = 0;
        this.recentActivities = [];
        this.applicationsData.datasets[0].data = [];
        this.jobCategoryLabels = [];
        this.jobCategoryData.datasets[0].data = [];
        this.applicationsPerDayLabels = [];
        this.applicationsPerDayData.datasets[0].data = [];
      }
    );
  }



generateFullPieChart(): string {
    if (!this.jobCategoryData.datasets[0]?.data?.length) {
      return '';
    }

    const data = this.jobCategoryData.datasets[0].data;
    const colors = this.jobCategoryData.datasets[0].backgroundColor;
    const total = data.reduce((sum: number, value: number) => sum + value, 0);

    if (total === 0) return '';

    let conic = 'conic-gradient(';
    let currentAngle = 0;

    data.forEach((value: number, index: number) => {
      const angle = (value / total) * 360;
      conic += `${colors[index]} ${currentAngle}deg ${currentAngle + angle}deg${index < data.length - 1 ? ',' : ''}`;
      currentAngle += angle;
    });

    return conic + ')';
  }
}
