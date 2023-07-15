import {
	Worker, isMainThread, parentPort, workerData
} from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import microtime from 'microtime'
import convertDuration from './utils/convertDuration.mjs'

// Function to be executed by the workers
function fibonacci(n) {
	if (n < 2)
	  return 1;
	else
	  return fibonacci(n - 2) + fibonacci(n - 1);
}

if (isMainThread) {

	const DEFAULTS = [1, 10, 1]
	const args = process.argv.splice(2)
	const [threadCount, fibonacciNumber, useWorkers] = DEFAULTS.map((e, i) => Number(args[i] ?? e))

	const start_main = microtime.now()
	let promises = []
	
	for (let i = 0; i < threadCount; i++) {
		if (useWorkers) {
			let res
			promises.push(new Promise(r => res = r))
			// Create a new worker
			const start_worker = microtime.now()
			const worker = new Worker(fileURLToPath(import.meta.url), { workerData: fibonacciNumber });

			// Receive the message sent by the worker
			worker.on('message', (result) => {
				const end_worker = microtime.now()
				console.log(`Worker ${i} / Input: ${fibonacciNumber} / Result: ${result} / Duration: ${convertDuration(end_worker-start_worker)}`);
				res()
			});
		} else {
			const start_worker = microtime.now()
			let result = fibonacci(fibonacciNumber)
			const end_worker = microtime.now()
			console.log(`Worker ${i} / Input: ${fibonacciNumber} / Result: ${result} / Duration: ${convertDuration(end_worker-start_worker)}`);
		}
	}

	await Promise.all(promises)

	const end_main = microtime.now()
	console.log(`Overall time: ${convertDuration(end_main-start_main)}`)
} else {

	// Execution within the worker
	const result = fibonacci(workerData);
	parentPort.postMessage(result);
}
