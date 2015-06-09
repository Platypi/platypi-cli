import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}TemplateControl extends ui.TemplateControl {
	templateString: string = require('./{{lowercase name}}.tc.html');
}

register.control('{{lowercase name}}', {{capitalizeFirst name}}TemplateControl);
