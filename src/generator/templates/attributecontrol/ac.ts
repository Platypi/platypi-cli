import {register, AttributeControl} from 'platypus';

export default class {{capitalizeFirst name}}AttributeControl extends AttributeControl {
}

register.control('{{lowercase name}}', {{capitalizeFirst name}}AttributeControl);
