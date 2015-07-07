import {register} from 'platypus';
{{#if ext}}
import Base from '{{ext}}';

export default class {{capitalizeFirst name}} extends Base {
{{else}}

export default class {{capitalizeFirst name}} {
{{/if}}

}
{{#if register}}

register.injectable('{{lowercase type}}', {{capitalizeFirst name}});
{{/if}}
