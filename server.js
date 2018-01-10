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

app.get('/todos', function (req, res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
	 	filteredTodos = _.where(todos, {completed: true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(todos, {completed: false});
	}else if(queryParams.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	res.json(filteredTodos);
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
});

/************************************************************************************************************************************
*																																	*
*													Delete Todos Items by Id														*
*																																	*
************************************************************************************************************************************/
app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	
	if (matchedTodo){
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	else{
		res.status(404).json({"error": "No todo item found with id " + todoId});
	}
});

/************************************************************************************************************************************
*																																	*
*													PUT(Update) Todos Items by Id													*
*																																	*
************************************************************************************************************************************/
app.put('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description','completed') ;
	var validAttribute = {};

	if (!matchedTodo){
		return res.status(404).json({"error": "No todo item found with id " + todoId});
	}
	/************************************checking for completed property************************************/
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttribute.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}
	
	/************************************checking for description property************************************/
	if(body.hasOwnProperty('description') && _.isString(body.description) &&  body.description.trim().length > 0){
		validAttribute.description = body.description.trim();
	}else if(body.hasOwnProperty('description') ){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttribute);
	res.json(matchedTodo);
});

/************************************************************************************************************************************
*																																	*
*													Starting server																	*
*																																	*
************************************************************************************************************************************/
var server = app.listen(PORT, function () {
	console.log('Express listening on port '+ PORT+ '!');
});
server.timeout = 2500;

/************************************************************************************************************************************
*																																	*
*														End Of file																	*
*																																	*
************************************************************************************************************************************/