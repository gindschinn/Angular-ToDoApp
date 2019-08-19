import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToDo } from '../../_interface/todo';
import { EventPing } from '../../_interface/eventping';
import { DataService } from '../../_service/data.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.sass']
})
export class TodoComponent implements OnInit {

// @Input takes toDo from parent component as Input
  @Input() toDo$: ToDo;
// commits change to parent (list component)  
  @Output() ping: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public _dataService: DataService
  ) {}

  ngOnInit() {}

// method changeCheck type: any, returns nothing(void)
  public changeCheck(event?: any): void {
    this.toDo$.status = !this.toDo$.status;
    this._dataService.updateTodo(this.toDo$).subscribe((data: ToDo) => {
    // create eventObject as EventPing with event-title "check"
    const eventObject: EventPing = {
      title: 'check',
      object: this.toDo$
    };
    // commit eventObject
    this.ping.emit(eventObject);
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red`);
    });
  }
  public updateTitle(event?: any): void {
    this._dataService.updateTodo(this.toDo$).subscribe((data: ToDo) => {
      const eventObject: EventPing = {
        title: 'update',
        object: this.toDo$
      };
      this.ping.emit(eventObject);
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red`);
    });
  }
  public deleteToDo(event?: any): void {
    this._dataService.deleteToDo(this.toDo$).subscribe((data: ToDo) => {
      const eventObject: EventPing = {
        title: 'delete',
        object: this.toDo$
      };
      this.ping.emit(eventObject);
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red`);
    });
  }
}
