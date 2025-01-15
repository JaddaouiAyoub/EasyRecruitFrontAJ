import {Component, OnInit} from '@angular/core';
import {CandidatService} from '../../../../services/candidat/candidat.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../../services/auth/auth.service';
import {CandidatDTO} from '../../../../models/candidat-dto.model';
import {Role} from "../../../../models/role.enum";
import {CloudinaryService} from '../../../../services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: CandidatDTO = {
    id: null,
    email: '',
    password: '',
    role: Role.CANDIDAT,
    cvUrl: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    linkedin: '',
    profilPic: null
  };

  previewUrl: string | ArrayBuffer | null = null; // Profile picture preview
  selectedPhoto!: File | null; // Selected file for upload
  updateMessage: string | null = null; // Update status message
  isSuccess: boolean = false; // Success indicator

  constructor(
    private candidatService: CandidatService,
    private cloudinaryService: CloudinaryService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.previewUrl = this.userData.profilPic;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // File validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('Only JPG and PNG formats are allowed.', 'Close', { duration: 3000 });
        this.selectedPhoto = null;
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 2 MB.', 'Close', { duration: 3000 });
        this.selectedPhoto = null;
        return;
      }

      this.selectedPhoto = file;

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.selectedPhoto) {
      // Upload the image to Cloudinary
      this.cloudinaryService.uploadFile(this.selectedPhoto).subscribe({
        next: (imageUrl: string) => {
          // Update the profile picture URL in userData
          this.userData.profilPic = imageUrl;
          this.saveProfile(); // Proceed to update profile in the backend
        },
        error: (err) => {
          console.error('Error uploading to Cloudinary:', err);
          this.snackBar.open('Failed to upload image. Please try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      // If no new photo, directly update profile
      this.saveProfile();
    }
  }

  private saveProfile(): void {
    // Appel au service pour mettre à jour les données
    this.candidatService.updateProfile(this.userData).subscribe({
      next: (response: CandidatDTO) => {
        console.log(response);
        this.updateMessage = 'Profile updated successfully.';
        this.isSuccess = true;

        // Mettre à jour les données en local
        localStorage.setItem('user', JSON.stringify(response));
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.updateMessage = 'An error occurred while updating the profile.';
        this.isSuccess = false;
      }
    });
  }
}
