import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToDo } from '../../_interface/todo';
import { EventPing } from '../../_interface/eventping';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.sass']
})
export class TodoFormComponent implements OnInit {

  public toDo$: ToDo;
  @Output() ping: EventEmitter<any> = new EventEmitter<any>();

  constructor() { 
    this.toDo$ = {
      id: undefined,
      title: undefined,
      status: false,
      position: undefined
    };
  }

  ngOnInit() {
  }

  public createToDo(event?: any): void {
    this.ping.emit(this.toDo$);
    this.toDo$ = {
      id: undefined,
      title: undefined,
      status: false,
      position: undefined
    };
  }
}
