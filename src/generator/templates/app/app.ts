import {App as Base, register, routing} from 'platypus';
import {{capitalizeFirst vcName}}ViewControl from '../viewcontrols/{{lowercase vcName}}/{{lowercase vcName}}.vc';

export default class App extends Base {
	constructor(router: routing.Router) {
		super();
		
		router.configure([
			{ pattern: '', view: {{capitalizeFirst vcName}}ViewControl }
		]);
	}
}

register.app('app', App, [
	routing.Router
]);
