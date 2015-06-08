# Platypi CLI

The Platypi CLI is the primary way to create and manage Platypi apps. It can be used to create new projects as well as add different components (models, repositories, services, injectables, and controls) to the app.

## Install

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

All commands are run with `plat <command-name>`

### create

Creates a new project or component in the specified directory.

> **NOTE:** You can use `plat c` as an alias for `plat create`

#### Examples

Create a new project in the current directory:
```shell
plat create
```

Create a new project in its own directory
```shell
plat create --dir myproject
```

Create a ViewControl component in the project-specified default location for viewcontrols (e.g. ./app/viewcontrols/home)
```shell
plat create viewcontrol Home
```

Create a ViewControl component in ./app/viewcontrols/posts/single
```shell
plat create viewcontrol Single --dir ./app/viewcontrols/posts/
```

Create a ViewControl component that extends another ViewControl
```shell
plat create viewcontrol PostsByTag --extends ./app/viewcontrols/posts/list/list.viewcontrol.ts
```

> **NOTE:** When extending components, the file specified must have the component listed as its default export.

#### Component aliases
When specifying components you can choose to use their full name or an alias:

```
viewcontrol      | vc
templatecontrol  | tc
attributecontrol | ac
model            | m
repository       | repo
service          | svc
injectable       | inj
```

#### Options

```shell
-d,--dir <directory> Used to specify the directory in which to create the project or component
-e, --extends <file> A path (relative or absolute) to a file with which to extend the 
```
