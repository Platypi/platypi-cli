import {async, register} from 'platypus';
import BaseRepository from '{{ext}}';

export default class {{capitalizeFirst name}}Repository extends BaseRepository {

}
{{#if register}}

register.injectable('{{lowercase type}}-repo', {{capitalizeFirst name}}Repository);
{{/if}}
