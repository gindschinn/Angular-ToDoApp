import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToDo } from '../_interface/todo';
import { EventPing } from '../_interface/eventping';
import { DataService } from '../_service/data.service';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass'],
  // transistion animation for conditional rendered Todoelements
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          // element rendered to the DOM
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out', 
                    style({ height: 70, opacity: 1 }))
          ]
        ),
        transition(
          // element leaving the DOM
          ':leave', 
          [
            style({ height: 70, opacity: 1 }),
            animate('0.5s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ListComponent implements OnInit, OnDestroy {

  public toDoShow: boolean;
  public toDoDoneShow: boolean;
  public $todos: ToDo[];
  public $todosdone: ToDo[];
  public subs = new Subscription();

  constructor(
    public _dataService: DataService,
    public _dragulaService: DragulaService,
  ) { 
    this.toDoShow = true;
    this.toDoDoneShow = false;
    this.$todos = [];
    this.$todosdone = [];
    this.loadData();
// Dragula     
// Spill true would delete objects when pulled out of container
    this._dragulaService.createGroup('todos', {
      removeOnSpill: false
    });

    this.subs.add(_dragulaService.drop('todos')
      .subscribe(({ el }) => {
        this.position();
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public position(): void {
    let position = 0;
    this.$todos.forEach((todo: ToDo) => {
      position += 1;
      todo.position = position;
      this._dataService.updateTodo(todo).subscribe((data: ToDo) => {
        console.log(`%cSUC: ${data.title} wurde neu positioniert`, `color: green`);
      }, error => {
        console.log(`%cERROR: ${error.message}`, `color: red`);
      });
    });
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
      this.$todos.sort((obj1, obj2) => {
        return obj1.position - obj2.position;
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
      this.position();
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
