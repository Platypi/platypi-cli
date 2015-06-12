import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}ViewControl extends ui.ViewControl {
	{{#if html}}
	templateString: string = require('./{{lowercase name}}.vc.html');
	{{/if}}
}

register.viewControl('{{lowercase name}}-vc', {{capitalizeFirst name}}ViewControl);
