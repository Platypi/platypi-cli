import * as path from 'path';
import Base from './base';
import { isObject, isString, merge, cloneDeep } from 'lodash';
import FileUtils from './fileutils';

let findup = require('findup'),
    stringify = require('json-stable-stringify');

export default class Project extends Base {
    /**
     * The root directory for the project
     */
    root: string;
    bin: string;

    get name(): string {
        return this.pkg.name;
    }

    protected pkg: models.ILocalPackage;
    protected cliPkg: models.IPackage;
    protected file: FileUtils;
    protected get pkgLocation(): string {
        return path.resolve(this.root, 'package.json');
    }
    protected finishReading: Promise<void> = Promise.resolve<void>(null);
    protected finishWriting: Promise<void> = Promise.resolve<void>(null);

    static project(ui: ui.Ui, root: string): Promise<Project> {
        return Project.closestPackage(ui, root).then(
            (info: { directory: string; pkg: any }) => {
                ui.debug(`Closest project found at ${info.directory}`);

                return new Project({
                    root: info.directory,
                    pkg: info.pkg,
                    ui: ui,
                });
            }
        );
    }

    protected static closestPackage(
        ui: ui.Ui,
        root: string
    ): Promise<{ directory: string; pkg: any }> {
        return Promise.all([
            Project.closestConfig(ui, root, 'package.json'),
            Project.closestConfig(ui, root, 'platypi.json'),
        ]).then((values) => {
            let pkg = values[0],
                platypi = values[1],
                pkgError = !isString(pkg.directory),
                platypiError = !isString(platypi.directory);

            if (pkgError && platypiError) {
                return {
                    directory: undefined,
                    pkg: {},
                };
            } else if (pkgError) {
                pkg = {
                    directory: platypi.directory,
                    pkg: {},
                };
            } else if (platypiError) {
                platypi = {
                    directory: pkg.directory,
                    pkg: {},
                };
            }
            return {
                directory: pkg.directory,
                pkg: merge(pkg.pkg, { platypi: platypi.pkg }),
            };
        });
    }

    protected static closestConfig(
        ui: ui.Ui,
        root: string,
        configName: string
    ): Promise<{ directory: string; pkg: any }> {
        return new Promise((resolve, reject) => {
            ui.debug(`Searching for ${configName} at and above ${root}`);
            findup(root, configName, (err: any, directory: string) => {
                if (isObject(err)) {
                    resolve(Project.handleError(ui, root, err));
                    return;
                }
                resolve(directory);
            });
        }).then((directory: string) => {
            if (!isString(directory)) {
                return <any>directory;
            }
            let config = path.join(directory, configName);
            ui.debug(`Reading ${config}`);
            return {
                directory: directory,
                pkg: cloneDeep(require(config)),
            };
        });
    }

    protected static handleError(ui: ui.Ui, root: string, err: any): any {
        if (isObject(err) && /not found/i.test(err.message)) {
            ui.debug(`No project found at or up from: \`${root}\``);
            return {
                directory: undefined,
                pkg: undefined,
            };
        } else {
            return err;
        }
    }

    constructor(options: models.IProjectOptions) {
        super(options);
        let cliPackage: any = (this.cliPkg = require('../../package.json'));
        this.bin = this.utils.keys(cliPackage.bin)[0];
        this.root = options.root;
        this.pkg = this.utils.cloneDeep(options.pkg);
        this.file = this.instantiate(FileUtils, options);
    }

    getConfig(property: string): any {
        let config = this.pkg.platypi || {};

        return config[property];
    }

    cliPackage(): models.IPackage {
        return this.utils.cloneDeep(this.cliPkg);
    }

    package(): models.ILocalPackage {
        return this.utils.cloneDeep(this.pkg);
    }

    addDependencies(deps: any, dev?: boolean): Promise<void> {
        return this.extendPackageProperty(
            (dev ? 'devD' : 'd') + 'ependencies',
            deps
        );
    }

    addScripts(scripts: any): Promise<void> {
        return this.extendPackageProperty('scripts', scripts);
    }

    protected extendPackageProperty(
        property: string,
        value: any
    ): Promise<void> {
        return (this.finishWriting = this.finishWriting
            .then(() => {
                return this.readLocalPackage();
            })
            .then((pkg) => {
                this.utils.extend(pkg[property], value);
                pkg[property] = JSON.parse(stringify(pkg[property]));

                return this.writeLocalPackage(pkg);
            }));
    }

    private readLocalPackage(): Promise<models.ILocalPackage> {
        return this.file.read(this.pkgLocation).then((pkg) => {
            return JSON.parse(pkg);
        });
    }

    private writeLocalPackage(pkg: models.ILocalPackage): Promise<void> {
        return this.file.write(this.pkgLocation, JSON.stringify(pkg, null, 2));
    }
}
