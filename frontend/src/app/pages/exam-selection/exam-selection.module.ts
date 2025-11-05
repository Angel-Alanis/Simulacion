import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExamSelectionComponent } from './exam-selection.component';

const routes: Routes = [{ path: '', component: ExamSelectionComponent }];

@NgModule({
  declarations: [ExamSelectionComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ExamSelectionModule { }
