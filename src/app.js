import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import config from 'config';

const app = express();

app.disable('x-powered-by'); // disable x-powered-by
app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'pug')
app.set('port', config.get('app.port'));


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


require('./routes/appRoutes')(app)
require('./routes/randomNumberRoutes')(app);
require('./routes/gameRoutes')(app);
require('./routes/playerRoutes')(app);
require('./routes/guessRoutes')(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const server = http.createServer(app);
const port = app.get('port');
server.listen(port, () => {
	console.log(`Application listening on ${config.get('app.baseUrl')}`);
	console.log(`Environment => ${config.util.getEnv('NODE_ENV')}`);
});

module.exports = app;
