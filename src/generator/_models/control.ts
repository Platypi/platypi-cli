import * as path from 'path';
import {Promise} from 'es6-promise';
import Generator from './base';

export default class ControlGenerator extends Generator {
    options: generator.IControlOptions;
    protected noLessOrHtml: boolean;

    constructor(options: any, config: generator.IControlConfig) {
        super(options, config);
        this.noLessOrHtml = !!config.noLessOrHtml;
    }

    defineOptions(): void {
        super.defineOptions();

        if (!this.noLessOrHtml) {
            this.option('less', {
                description: `Do not generate a less file`,
                defaults: true
            });

            this.option('html', {
                description: `Do not generate an html file`,
                defaults: true
            });
        }
    }

    protected _render(src: string, dest: string, config: any): Thenable<any> {
        var options = this.options;
        config.html = options.html;

        var promises = [
            this._renderFile('.ts', src, dest, config)
        ];

        if (!this.noLessOrHtml) {
            if (options.less) {
                promises.push(this._renderFile('.less', this.ext, dest, config));
            }

            if (options.html) {
                promises.push(this._renderFile('.html', this.ext, dest, config));
            }
        }

        return Promise.all(promises);
    }

    protected _renderFile(ext: string, src: string, dest: string, config: any): Thenable<any> {
        return this.render(src + ext, dest + ext, config);
    }
}
