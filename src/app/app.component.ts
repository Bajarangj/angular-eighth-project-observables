import { Component, DestroyRef, OnInit, effect, inject, signal } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);

  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {initialValue: 0});

  // custom observable
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error();
      if(timesExecuted > 3){
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log("Emitting new value...");
      subscriber.next({message: 'New value'});
      timesExecuted++;
    }, 2000);
  });

  constructor() {
    effect(() => {
      console.log(`Clicked button ${this.clickCount()} times.`);
    })
  }

  ngOnInit(): void {
    // const subscription = interval(1000).pipe(
    //   map((value) => value*2)
    // ).subscribe({
    //   next: (value) => console.log(value)
    // });
    
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // })

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log("COMPLETED!"),
      error: () => console.log('error from observable')
    })

    const subscription = this.clickCount$.subscribe({
      next: (value) => console.log(`Clicked button ${value} times.`)
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onClick() {
    this.clickCount.update((oldCount) => oldCount + 1);
  }
}
