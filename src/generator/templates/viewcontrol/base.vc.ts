import {register, ui} from 'platypus';

export default class {{capitalizeFirst name}}ViewControl extends ui.ViewControl {
    {{#if html}}
    templateString: string = require('./{{lowercase name}}.vc.html');
    {{/if}}

    context: any = {};
}
{{#if register}}

register.viewControl('{{lowercase type}}-vc', {{capitalizeFirst name}}ViewControl);
{{/if}}
