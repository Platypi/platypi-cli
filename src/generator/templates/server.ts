import * as express from 'express';
import {join} from 'path';
import * as logger from 'morgan';
import * as serve from 'serve-static';

const root = join(__dirname, '../');
const port = 3000;

function isFileExt(file: string): boolean {
    var len = file.length;

    if (file.indexOf('.') === -1) {
        return false;
    } else if (!(file[len - 5] === '.' ||
        file[len - 4] === '.' ||
        file[len - 3] === '.' ||
        file[len - 2] === '.' ||
        file[len - 1] === '.')) {
        return false;
    } else if (file.indexOf('/api') === 0 || file.indexOf('/?') === 0) {
        return false;
    }

    return true;
}

let app = express(),
	platui = '/node_modules/platypusui/dist/fonts';

app
	.use(logger('dev'))
	.use(serve(join(root, 'app')))
	.use(platui, serve(join(root, platui)))
	.get('*', (req: express.Request, res: express.Response, next: Function) => {
		if (isFileExt(req.url)) {
			next();
			return;
		}

		res.sendFile(join(root, 'app/index.html'));
	});

app.listen(port, () => {
	console.log(`listening on port ${port}.`);
});
