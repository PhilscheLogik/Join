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
  taskList: Task[] = [];
  unsubTasks;

  constructor() {
    this.unsubTasks = this.subTaskList();
  }

  ngOnDestroy() {
    this.unsubTasks();
  }

  subTaskList() {
    return onSnapshot(this.getTaskRef(), (task) => {
      this.taskList = [];

      task.forEach((e) => {
        this.taskList.push(this.setTaskObj(e.data(), e.id));
      });
    });
  }

  getTaskRef() {
    return collection(this.firestore, 'tasks');
  }

  setTaskObj(obj: any, id: string): Task {
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

  async addTask(item: Task) {
    try {
      await addDoc(this.getTaskRef(), item);
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  }

  async deleteTask(id: string) {
    if (id) {
      await deleteDoc(doc(this.getTaskRef(), id));
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
    const updateRef = doc(this.getTaskRef(), id);

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
