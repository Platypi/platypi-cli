import {register} from 'platypus';
import BaseViewControl from '{{ext}}';

export default class {{capitalizeFirst name}}ViewControl extends BaseViewControl {
	{{#if html}}
	templateString: string = require('./{{lowercase name}}.vc.html');
	{{/if}}

	context: any = {};
}
{{#if register}}

register.viewControl('{{lowercase type}}-vc', {{capitalizeFirst name}}ViewControl);
{{/if}}
