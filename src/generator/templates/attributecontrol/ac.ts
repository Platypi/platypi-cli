import {register, AttributeControl} from 'platypus';

export default class {{capitalizeFirst name}}AttributeControl extends AttributeControl {
}
{{#if register}}

register.control('{{lowercase type}}', {{capitalizeFirst name}}AttributeControl);
{{/if}}
