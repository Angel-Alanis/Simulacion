import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './result.component';

const routes: Routes = [{ path: '', component: ResultComponent }];

@NgModule({
  declarations: [ResultComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class ResultModule { }
