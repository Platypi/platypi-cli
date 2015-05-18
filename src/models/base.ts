/// <reference path="../references.d.ts" />
import Ui from '../ui/ui';

export default class BaseObject {
	ui: Ui;
	constructor(options: any) {
		this.ui = options.ui;
	}	
}
