import {register} from 'platypus';

export default class {{capitalizeFirst name}}Service {

}
{{#if register}}

register.injectable('{{lowercase type}}', {{capitalizeFirst name}}Service);
{{/if}}
