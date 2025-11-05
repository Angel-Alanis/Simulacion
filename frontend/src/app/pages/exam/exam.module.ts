import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExamComponent } from './exam.component';

const routes: Routes = [{ path: '', component: ExamComponent }];

@NgModule({
  declarations: [ExamComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ExamModule { }
