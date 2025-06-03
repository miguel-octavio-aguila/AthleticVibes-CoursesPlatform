import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressSource = new BehaviorSubject<number>(0);
  public progress$ = this.progressSource.asObservable();

  constructor() { }

  setProgress(value: number) {
    console.log('Setting progress to:', value); // for debug
    this.progressSource.next(value);
  }

  getCurrentProgress(): number {
    return this.progressSource.value;
  }

  resetProgress(): void {
    this.progressSource.next(0);
  }
}
