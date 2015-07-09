import {register, routing} from 'platypus';
import BaseViewControl from '{{ext}}';

export default class {{capitalizeFirst name}}ViewControl extends BaseViewControl {
    {{#if html}}
    templateString: string = require('./{{lowercase name}}.vc.html');
    {{/if}}

    context: any = {};

    constructor(router: routing.Router) {
        super();
    }
}
{{#if register}}

register.viewControl('{{lowercase type}}-vc', {{capitalizeFirst name}}ViewControl, [
    routing.Router
]);
{{/if}}
