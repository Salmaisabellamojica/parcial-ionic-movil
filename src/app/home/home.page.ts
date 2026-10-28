import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonAvatar,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTextarea,
  IonTitle,
  ToastController,
  IonToolbar,
} from '@ionic/angular';
import { ApiService, Student } from '../../service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonAvatar,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private apiService = inject(ApiService);
  private toastController = inject(ToastController);
  students: Student[] = [];
  isLoadingStudents = true;
  apiError: string | null = null;

  minGrade: number | null = null;
  maxGrade: number | null = null;
  selectedStudent: Student | null = null;
  observationDraft = '';
  isModalOpen = false;

  ngOnInit(): void {
    this.apiService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.isLoadingStudents = false;
      },
      error: () => {
        this.apiError = 'No se pudieron cargar los estudiantes.';
        this.isLoadingStudents = false;
      },
    });
  }

  get averageGrade(): number {
    if (this.students.length === 0) {
      return 0;
    }

    return this.students.reduce((total, student) => total + student.grade, 0) / this.students.length;
  }

  get gradeFilterError(): string | null {
    const grades = [this.minGrade, this.maxGrade];
    if (grades.some((grade) => grade !== null && (!Number.isFinite(grade) || grade < 0 || grade > 5))) {
      return 'Las notas deben estar entre 0.0 y 5.0.';
    }

    if (this.minGrade !== null && this.maxGrade !== null && this.minGrade > this.maxGrade) {
      return 'La nota mínima no puede superar a la máxima.';
    }

    return null;
  }

  get filteredStudents(): Student[] {
    if (this.gradeFilterError) {
      return [];
    }

    return this.students.filter(
      (student) =>
        (this.minGrade === null || student.grade >= this.minGrade) &&
        (this.maxGrade === null || student.grade <= this.maxGrade),
    );
  }

  openModal(student: Student): void {
    this.selectedStudent = student;
    this.observationDraft = student.observation;
    this.isModalOpen = true;
  }

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  async saveObservation(): Promise<void> {
    if (!this.selectedStudent) {
      return;
    }

    this.selectedStudent.observation = this.observationDraft.trim();
    this.closeModal();

    const toast = await this.toastController.create({
      message: 'Observación académica guardada',
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedStudent = null;
    this.observationDraft = '';
  }
}