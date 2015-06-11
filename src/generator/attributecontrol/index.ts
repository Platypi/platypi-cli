import Generator from '../_models/control';

export default class TemplateControlGenerator extends Generator {
	static aliases: Array<string> = ['ac'];

	constructor(options: any) {
		super(options, {
			type: 'AttributeControl',
			ext: 'ac',
			noLessOrHtml: true
		});
	}
}
