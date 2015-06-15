import {register} from 'platypus';

export default class {{capitalizeFirst name}}Repository {

}
{{#if register}}

register.injectable('{{lowercase type}}', {{capitalizeFirst name}}Repository);
{{/if}}
