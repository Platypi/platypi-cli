# Platypi CLI

The Platypi CLI is the primary way to create and manage Platypi apps. It can be used to create new projects as well as add different components (models, repositories, services, injectables, and controls) to the app.

## Installation

Use `npm` to install this package.

Globally (preferred)
```shell
npm install platypi-cli -g
```

or, Locally
```shell
npm install platypi-cli --save-dev
```

## Usage

All commands are run with `plat <command>`. You can run `plat <command> -h` for further help. The help menus cascade.

So `plat create app -h` will show you a different help menu than `plat create -h` or `plat create viewcontrol -h`.

### create

Creates a new project or component in the specified directory. Walks you through a series of prompts to determine the project specifications.

> **NOTE:** You can use `plat c` as an alias for `plat create`

#### Examples

Create a new project in the current directory:
```shell
plat create
```

Create a new project MyProject in its own directory
```shell
plat create -n MyProject --dir myproject
```

Create a ViewControl component in the project-specified default location for viewcontrols (e.g. ./app/viewcontrols/home)
```shell
plat create viewcontrol -n Home
```

Create a ViewControl component in ./app/viewcontrols/posts/list
```shell
plat create viewcontrol -n List --dir posts/
```

Create a ViewControl component that extends another ViewControl
```shell
plat create viewcontrol -n PostsByTag --extends ../list/list.vc
```

> **NOTE:** When extending components, the exact path you specify will be used as the import path. The path specified must have the component listed as its default export.

#### Component aliases
When specifying components you can choose to use their full name or an alias:

```
viewcontrol      | vc
templatecontrol  | tc
attributecontrol | ac
model            | mdl
repository       | repo
service          | svc
injectable       | inj
```

#### Useful Options

```shell
-n, --name <name> Specifies the name of the file
-d, --dir <directory> Used to specify the directory in which to create the project or component
```

### cordova

You can run `plat cordova` from anywhere in your project, and it will run `cordova` commands from within the scope of the `/cordova` folder of your project.

#### Examples

Run your cordova project on an Android device **from the /cordova folder** of your project.

```shell
cordova run android --device
```

Run your cordova project on an Android device **from the / folder** of your project.

```shell
plat cordova run android --device
```

This will work with any cordova command. You can type `plat cordova -h` for more information.
