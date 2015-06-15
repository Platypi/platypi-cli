import {register} from 'platypus';
import BaseService from '{{ext}}';

export default class {{capitalizeFirst name}}Service extends BaseService {

}
{{#if register}}

register.injectable('{{lowercase type}}-svc', {{capitalizeFirst name}}Service);
{{/if}}
