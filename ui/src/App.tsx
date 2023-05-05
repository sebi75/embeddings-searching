import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from './components/loading-spinner';

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const testFetch = async () => {
		try {
			setIsLoading(true);
			const response = await fetch('http://localhost:5000/ping', {
				method: 'GET',
			});

			const data = await response.json();
			setIsLoading(false);
			console.log(data);
		} catch (error) {
			setIsLoading(false);
			console.log('encountered error', error);
		}
	};

	useEffect(() => {
		document.body.className = 'dark';
		testFetch();
	}, []);

	return (
		<div className="flex h-screen w-full items-center justify-center">
			{!isLoading ? (
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="picture">Picture</Label>
					<Input id="picture" type="file" />
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
					<LoadingSpinner />
					<h1>It may take a few minutes for the text to be indexed....</h1>
				</div>
			)}
		</div>
	);
}

export default App;
