import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let toastDuration: number | undefined;

  beforeEach(async () => {
    toastDuration = undefined;
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: ApiService, useValue: { getStudents: () => of([]) } },
        {
          provide: ToastController,
          useValue: {
            create: async (options: { duration: number }) => {
              toastDuration = options.duration;
              return { present: async () => undefined };
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates the average using all students', () => {
    component.students = [
      { id: 1, name: 'Estudiante A', email: 'a@example.com', referenceComment: '', grade: 2, observation: '' },
      { id: 2, name: 'Estudiante B', email: 'b@example.com', referenceComment: '', grade: 4, observation: '' },
    ];

    expect(component.averageGrade).toBe(3);
  });

  it('includes both ends of the grade range', () => {
    component.students = [
      { id: 1, name: 'Estudiante A', email: 'a@example.com', referenceComment: '', grade: 2.9, observation: '' },
      { id: 2, name: 'Estudiante B', email: 'b@example.com', referenceComment: '', grade: 3, observation: '' },
      { id: 3, name: 'Estudiante C', email: 'c@example.com', referenceComment: '', grade: 4, observation: '' },
    ];
    component.minGrade = 3;
    component.maxGrade = 4;

    expect(component.filteredStudents.map((student) => student.id)).toEqual([2, 3]);
  });

  it('saves an observation, closes the modal, and shows a 2.5-second toast', async () => {
    const student = {
      id: 1,
      name: 'Estudiante A',
      email: 'a@example.com',
      referenceComment: '',
      grade: 4,
      observation: '',
    };
    component.openModal(student);
    component.observationDraft = 'Reforzar lectura crítica';

    await component.saveObservation();

    expect(student.observation).toBe('Reforzar lectura crítica');
    expect(component.isModalOpen).toBe(false);
    expect(toastDuration).toBe(2500);
  });
});
