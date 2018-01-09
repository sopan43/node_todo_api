var express = require('express');
var bodyParser = require('body-parser');
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
	var todoId = req.params.id;
	var matchedTodo;

	todos.forEach(function (todo) {
		if(todoId == todo.id){
			matchedTodo = todo;
		}
	});

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
	var body = req.body;

	body.id = todoNextId;
	todoNextId++;

	todos.push(body);

	res.json(body);
})

var server = app.listen(PORT, function () {
	console.log('Express listening on port '+ PORT+ '!');
});
server.timeout = 2500;