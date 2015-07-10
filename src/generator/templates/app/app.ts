import {App, register, routing} from 'platypus';
import {{capitalizeFirst vcName}}ViewControl from '../viewcontrols/{{lowercase vcName}}/{{lowercase vcName}}.vc';

export default class MyApp extends App {
    constructor(router: routing.Router) {
        super();

        router.configure([
            { pattern: '', view: {{capitalizeFirst vcName}}ViewControl }
        ]);
    }

    error(ev: events.ErrorEvent<Error>): void {
        console.log(ev.error);
    }
}

register.app('app', MyApp, [
    routing.Router
]);
