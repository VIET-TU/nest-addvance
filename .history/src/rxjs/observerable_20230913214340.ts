import { from, of } from 'rxjs';

const observable = of([10, 20, 30]);
console.log('object :>> ', observable);
const subscription = observable.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();
