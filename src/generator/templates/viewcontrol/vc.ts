import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}ViewControl extends ui.ViewControl {
	templateString: string = require('./{{lowercase name}}.vc.html');
}

register.viewControl('{{lowercase name}}-vc', {{capitalizeFirst name}}ViewControl);
