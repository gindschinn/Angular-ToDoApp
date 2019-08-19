import { Component, OnInit } from '@angular/core';
import { ToDo } from '../_interface/todo';
import { EventPing } from '../_interface/eventping';
import { DataService } from '../_service/data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  public toDoShow: boolean;
  public toDoDoneShow: boolean;
  public $todos: ToDo[];
  public $todosdone: ToDo[];

  constructor(
    public _dataService: DataService
  ) { 
    this.toDoShow = true;
    this.toDoDoneShow = false;
    this.$todos = [];
    this.$todosdone = [];
    this.loadData();
  }

  ngOnInit() {
  }

  public loadData(): void {
    this.$todos = [];
    this.$todosdone = [];
    this._dataService.getToDo().subscribe((data: ToDo[]) => {
      data.forEach((toDo: ToDo) => {
        if (toDo.status === true) {
          this.$todosdone.push(toDo);
        } else {
          this.$todos.push(toDo);
        }
      });
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red; font-size: 12px`);
    });
  }

  public create(event: ToDo): void {
    event.position = this.$todos.length + 1;
    this._dataService.postToDo(event).subscribe((data: ToDo) => {
      console.log(`%cSUC: "${data.title}" wurde erfolgreich erstellt`, `color: green`);
      this.$todos.push(data);
      // this.position();
    }, error => {
      console.log(`%cERROR: ${error.message}`, `color: red`);
    });
  }

  public update(event: EventPing): void {
    if ('check' === event.title) {
      console.log(`%c"${event.title}-Event wurde getriggert"`);
      if (!event.object.status) {
        this.$todosdone.splice(this.$todosdone.indexOf(event.object), 1);
        this.$todos.push(event.object);
      } else {
        this.$todos.splice(this.$todos.indexOf(event.object), 1);
        this.$todosdone.push(event.object);
      }
    }
    if ('delete' === event.title) {
      console.log(`%c"${event.title} - Event wurde getriggert"`);
      if (event.object.status) {
        this.$todosdone.splice(this.$todosdone.indexOf(event.object), 1);
      } else {
        this.$todos.splice(this.$todos.indexOf(event.object), 1);
      }
    }
    if ('update' === event.title) {
      console.log(`%c"${event.title} - Event wurde getriggert"`);
      if (event.object.status) {
        this.$todosdone.forEach((toDo: ToDo) => {
          if (toDo.id === event.object.id) {
            toDo.title = event.object.title;
          }
        });
      } else {
        this.$todos.forEach((toDo: ToDo) => {
          if (toDo.id === event.object.id) {
            toDo.title = event.object.title;
          }
        });
      } 
    }
  }
}
