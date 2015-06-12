import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}TemplateControl extends ui.TemplateControl {
	{{#if html}}
	templateString: string = require('./{{lowercase name}}.tc.html');
	{{/if}}
}

register.control('{{lowercase name}}', {{capitalizeFirst name}}TemplateControl);
