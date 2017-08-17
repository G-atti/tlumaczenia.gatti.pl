#!/usr/bin/env node

let os = require('os');
let app = require('../app');
let http = require('http');
let cluster = require('cluster');

//
//	1.	Get port from environment variables, if it is not set, we can use the
//		default port.
//
let port = process.env.PORT || 3000;

//
//	2.	Assign the port to the app.
//
app.set('port', port);

//
//	3.	Create, meaning spawn multiple instances of the same app to take
//		advantage of multi-core processors.
//
//		IF 		the cluster is the master one, then this is the cluster
//				that ins control. This means that the master will spawn
//				children processes, while also listening for crashes.
//
//				If a process exits, then we span a new process in it place
//				so we can make sure that we constantly have X amount of
//				processes.
//
//		ELSE 	The spawned processes on the other hand are those that creates
//				servers and do the heavy lifting.
//
if(cluster.isMaster) {

	//
	//	1.	When not in production by default we spin two workers no mater
	//		the CPU/Core count.
	//
	let cpu_count = 1;

	//
	//	3.	Create all the necessary workers
	//
	while(cpu_count--)
	{
		cluster.fork();
	}

	//
	//	4.	Listen for when the process exits, and spawn a new worker in it
	//		place. This way we never run out of workers.
	//
	cluster.on('exit', function (worker) {

		//
		//	1.	If a worker dies, lets create a new one to replace him
		//
		cluster.fork();

		//
		//	->	Log what happened
		//
		console.log('Worker %d died :(', worker.id);

	});
}
else
{
	//
	//	1.	Create HTTP server.
	//
	let server = http.createServer(app);

	//
	//	2.	Listen for connection on specified port
	//
	server.listen(port);

	//
	//	3.	React to error events
	//
	server.on('error', onError);

	//
	//	4.	listen to incoming requests
	//
	server.on('listening', onListening);
}

//
//	Event listener for HTTP server "error" event.
//
function onError(error)
{
	//
	//	1.	Not quite sure what this is
	//
	if(error.syscall !== 'listen')
	{
		throw error;
	}

	//
	//	2.	handle specific errors with friendly messages
	//
	switch(error.code)
	{
		case 'EACCES':
			console.error("Port %d requires elevated privileges", port);
			process.exit(1);
			break;

		case 'EADDRINUSE':
			console.error("Port %d is already in use", port);
			process.exit(1);
			break;

		default:
			throw error;
	}
}

//
//	Event listener for HTTP server "listening" event.
//
function onListening()
{
	//
	//	-> display in the console where to look for the server
	//
	console.log("Worker %d is listening on port %d", cluster.worker.id, port);
}