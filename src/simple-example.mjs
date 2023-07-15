import {
	Worker, isMainThread, parentPort, workerData
} from 'worker_threads';
import { fileURLToPath } from 'url';

// Function to be executed by the workers
const performCalculation = (baseNumber) => {
	// Simulate a heavy calculation
	let result = 0;
	for (let i = 0; i < 1000000000; i++) {
		result += baseNumber;
	}
	return result;
};

if (isMainThread) {
	// Create a new worker
	const worker = new Worker(fileURLToPath(import.meta.url), { workerData: 5 });

	// Receive the message sent by the worker
	worker.on('message', (result) => {
		console.log('The calculation result is:', result);
	});

	// Handle errors that occur in the worker
	worker.on('error', (error) => {
		console.error('An error occurred in the worker:', error);
	});

	// Handle the worker's exit
	worker.on('exit', (code) => {
		if (code !== 0) {
			console.error('The worker exited with exit code:', code);
		}
	});
} else {
	// Execution within the worker
	const result = performCalculation(workerData);
	parentPort.postMessage(result);
}
