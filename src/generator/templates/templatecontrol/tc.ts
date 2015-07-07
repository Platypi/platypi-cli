{{#if ext}}
import {register} from 'platypus';
import BaseTemplateControl from '{{ext}}';

export default class {{capitalizeFirst name}}TemplateControl extends BaseTemplateControl {
{{else}}
import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}TemplateControl extends ui.TemplateControl {
{{/if}}
	{{#if html}}
	templateString: string = require('./{{lowercase name}}.tc.html');
	{{/if}}
}
{{#if register}}

register.control('{{lowercase type}}', {{capitalizeFirst name}}TemplateControl);
{{/if}}
