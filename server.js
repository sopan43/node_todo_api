var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var todos = [];
var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root');
});
/************************************************************************************************************************************
*																																	*
*													Get All Todos Items																*
*																																	*
************************************************************************************************************************************/
// GET /todos
app.get('/todos', function (req, res){
	res.json(todos);
})

/************************************************************************************************************************************
*																																	*
*													Get Todos Items by Id															*
*																																	*
************************************************************************************************************************************/
app.get('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo){
		res.json(matchedTodo);
	}
	else{
		res.status(404).send();
	}
	//res.send('Asking for todo with if of '+ req.params.id);
});

/************************************************************************************************************************************
*																																	*
*													Get Todos Items by Completed													*
*													(Not Working)																	*
************************************************************************************************************************************/
app.get('/todos/:completed', function (req, res){
	var todoCom = (req.params.completed);
	res.send(typeof todoCom);
	var matchedTodo = _.findWhere(todos, {completed: todoCom});
	if (matchedTodo){
		res.json(matchedTodo);
	}
	else{
		res.status(404).send();
	}
	//res.send('Asking for todo with if of '+ req.params.id);
});

/************************************************************************************************************************************
*																																	*
*													POST Todos Items																*
*																																	*
************************************************************************************************************************************/
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description','completed') ;

	if( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = todoNextId;
	todoNextId++;

	todos.push(body);

	res.json(body);
})

var server = app.listen(PORT, function () {
	console.log('Express listening on port '+ PORT+ '!');
});
server.timeout = 2500;