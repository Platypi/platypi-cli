import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}TemplateControl extends ui.TemplateControl {
	{{#if html}}
	templateString: string = require('./{{lowercase name}}.tc.html');
	{{/if}}
}
{{#if register}}

register.control('{{lowercase type}}', {{capitalizeFirst name}}TemplateControl);
{{/if}}
