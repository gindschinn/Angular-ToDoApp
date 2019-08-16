import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { TodoComponent } from './_template/todo/todo.component';
import { TodoFormComponent } from './_template/todo-form/todo-form.component';
import { HeaderComponent } from './_template/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    TodoComponent,
    TodoFormComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
