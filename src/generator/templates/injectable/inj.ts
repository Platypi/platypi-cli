import {register} from 'platypus';

export default class {{capitalizeFirst name}} {

}
{{#if register}}

register.injectable('{{lowercase type}}', {{capitalizeFirst name}});
{{/if}}
