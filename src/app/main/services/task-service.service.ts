import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  firestore: Firestore = inject(Firestore);

  todoList: Task[] = [];
  progressList: Task[] = [];
  feedbackList: Task[] = [];
  doneList: Task[] = [];

  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // progress = ['Get to work', 'Pick up groceries']

  // feedback = ['Go home', 'Fall asleep']

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  unsubToDo;
  unsubInProgress;
  unsubFeedback;
  unsubDone;

  constructor() {
    this.unsubToDo = this.subToDoList();
    this.unsubInProgress = this.subInProgressList();
    this.unsubFeedback = this.subFeedbackList();
    this.unsubDone = this.subDoneList();
  }

  ngOnDestroy() {
    this.unsubToDo();
    this.unsubInProgress();
    this.unsubFeedback();
    this.unsubDone();
  }

  subToDoList() {
    return onSnapshot(this.getToDoRef(), (todo) => {
      this.todoList = [];

      todo.forEach((e) => {
        this.todoList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  subInProgressList() {
    return onSnapshot(this.getInProgressRef(), (progress) => {
      this.progressList = [];

      progress.forEach((e) => {
        this.progressList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  subFeedbackList() {
    return onSnapshot(this.getFeedbackRef(), (feedback) => {
      this.feedbackList = [];

      feedback.forEach((e) => {
        this.feedbackList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  subDoneList() {
    return onSnapshot(this.getDoneRef(), (done) => {
      this.doneList = [];

      done.forEach((e) => {
        this.doneList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  getToDoRef() {
    return collection(this.firestore, 'todo');
  }
  getInProgressRef() {
    return collection(this.firestore, 'inprogress');
  }
  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }
  getDoneRef() {
    return collection(this.firestore, 'done');
  }

  setObj(obj: any, id: string): Task {
    return {
      id: id || '',
      title: obj.title,
      description: obj.description || '',
      assignedTo: obj.assignedTo || '',
      date: obj.date,
      prio: obj.prio,
      category: obj.category,
      subtasks: obj.subtasks || '',
    };
  }

  // async addToDo(item: Task) {
  //   try {
  //     await addDoc(this.getToDoRef(), item);
  //   } catch (err) {
  //     console.error('Error adding contact:', err);
  //   }
  // }

  // async deleteToDO(id: string) {
  //   if (id) {
  //     await deleteDoc(doc(this.getToDoRef(), id));
  //   }
  // }

  async addTask(category: string, task: Task) {
    const ref = this.getCategoryRef(category);
    try {
      await addDoc(ref, task);
      console.info('----- task Service AddDoc  -------');      
      console.log(task);
      console.log('Wo soll es eingefügt werden: ',category);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  }

  async deleteTask(category: string, id: string) {
    if (id) {
      const ref = this.getCategoryRef(category);
      try {
        await deleteDoc(doc(ref, id));
        console.info('----- task Service deleteDoc  -------');        
        console.log(id);
        console.log('Wo soll gelöscht werden: ',category);
      } catch (err) {
        console.error('Error delete task:', err);
      }
    }
  }

  getCategoryRef(category: string) {
    switch (category) {
      case 'todo':
        return this.getToDoRef();
      case 'inprogress':
        return this.getInProgressRef();
      case 'feedback':
        return this.getFeedbackRef();
      case 'done':
        return this.getDoneRef();
      default:
        throw new Error('Invalid category');
    }
  }

  async updateContact(
    id: string,
    newTitle: string,
    newDescription: string,
    newAssignedTo: any,
    newDate: string,
    newPrio: string,
    newCategory: string,
    newSubtasks: any
  ) {
    const updateRef = doc(this.getToDoRef(), id);

    if (
      newTitle &&
      newDescription &&
      newAssignedTo &&
      newDate &&
      newPrio &&
      newCategory &&
      newSubtasks
    ) {
      await updateDoc(updateRef, {
        title: newTitle,
        description: newDescription,
        assignedTo: newAssignedTo,
        date: newDate,
        prio: newPrio,
        category: newCategory,
        subtasks: newSubtasks,
      });
    }
  }
}
