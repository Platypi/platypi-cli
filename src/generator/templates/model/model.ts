import {register} from 'platypus';
{{#if ext}}
import BaseModel from '{{ext}}';

export default class {{capitalizeFirst name}} extends BaseModel {
{{else}}

export default class {{capitalizeFirst name}} {
{{/if}}
}
{{#if register}}

register.injectable('{{lowercase type}}-mdl', {{capitalizeFirst name}});
{{/if}}
