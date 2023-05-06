/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
	FunctionComponent,
	ChangeEvent,
} from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from './components/loading-spinner';
import config from '@/config';
import { ThemeToggleSwitch } from './components/theme-switch';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/use-toast';
import Footer from './components/footer';

const getFilenames = async () => {
	try {
		const response = await fetch(`${config.API_URL}/getFilenames`, {
			method: 'GET',
		});

		const data = await response.json();

		return data;
	} catch (error: any) {
		throw new Error(error);
	}
};

function App() {
	const [filenames, setFilenames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState('');

	const getSavedFilenames = async () => {
		try {
			setIsLoading(true);

			const data = await getFilenames();

			setFilenames(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log('encountered error', error);
		}
	};

	const handleFileSelect = async (filename: string) => {
		setSelectedDocument(filename);
	};

	const handleIndexNewDocument = () => {
		setSelectedDocument('');
	};

	useEffect(() => {
		document.body.className = 'dark';

		if (!filenames || filenames.length === 0) {
			getSavedFilenames();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<LoadingSpinner />
				<h1>Loading content...</h1>
			</div>
		);
	}

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-row container pl-0 h-[650px] rounded-lg border">
				<div className="flex flex-col h-full items-center justify-between p-3 border-r w-[250px]">
					<div className="flex flex-col items-center">
						<div className="flex flex-col">
							<Label>Indexed documents</Label>
							<Label className="text-gray-400">*Ready to be searched</Label>
						</div>
						{filenames && filenames.length > 0 ? (
							<ul className="flex flex-col p-3">
								{filenames.map((filename) => (
									<Button
										key={filename}
										variant="ghost"
										onClick={() => handleFileSelect(filename)}
									>
										{filename}
									</Button>
								))}
							</ul>
						) : (
							<p className="my-3">No documents indexed yet</p>
						)}
					</div>
					<Button
						variant="outline"
						className="w-full"
						onClick={handleIndexNewDocument}
					>
						Index New Document
					</Button>
				</div>

				{/* searching and indexing */}
				<div className="p-3 w-full">
					{selectedDocument ? (
						<SearchDocument filename={selectedDocument} />
					) : (
						<IndexDocument
							setFilenames={setFilenames}
							setIsLoading={setIsLoading}
						/>
					)}
				</div>
			</div>
			<div className="absolute top-2 right-2">
				<ThemeToggleSwitch />
			</div>
			<Footer />
		</div>
	);
}

type SearchDocumentProps = {
	filename: string;
};

const SearchDocument: FunctionComponent<SearchDocumentProps> = ({
	filename,
}) => {
	const toast = useToast();
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<
		{
			text: string;
			score: number;
		}[]
	>([]);

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);
	};

	const handleTextSearch = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSearching(true);

		try {
			const url = new URL(`${config.API_URL}/search`);
			url.searchParams.append('filename', filename);
			url.searchParams.append('searchTerm', searchTerm);
			const response = await fetch(url.toString(), {
				method: 'POST',
			});

			if (!response.ok) {
				throw new Error('Encountered an error while searching');
			}

			const data = await response.json();

			setSearchResults(data);
			toast.toast({
				title: 'Success',
				description: 'Successfully searched document',
				variant: 'success',
			});
			setIsSearching(false);
		} catch (error) {
			setIsSearching(false);
			console.log(error);
			toast.toast({
				title: 'Error',
				description: 'Encountered an error while searching',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex flex-col w-full h-full">
			<h1>Search document: {filename}</h1>
			<div className="flex w-full h-full flex-col items-center ">
				<form className="flex flex-row gap-3" onSubmit={handleTextSearch}>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label>Enter a search term</Label>
						<Input
							disabled={isSearching}
							type="text"
							onChange={handleTextChange}
							placeholder="enter a search term..."
						/>
					</div>
					<Button
						disabled={isSearching}
						type="submit"
						variant="secondary"
						className="self-end"
					>
						Search
					</Button>
				</form>

				{/* container for the search results  */}
				{!isSearching ? (
					<div className="flex flex-col">
						{searchResults && searchResults.length > 0 ? (
							<ul className="flex flex-col p-3">
								{searchResults.map((result) => (
									<div className="flex flex-row p-3 shadow-lg rounded-lg my-2">
										<p
											className={
												result.score > 60
													? 'font-bold text-green-500'
													: 'font-bold text-red-500'
											}
										>
											{result.score}%
										</p>
										<p className="ml-3">{result.text}</p>
									</div>
								))}
							</ul>
						) : (
							<p className="my-3">No results to show</p>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full">
						<LoadingSpinner />
						<h1>Searching...</h1>
					</div>
				)}
			</div>
		</div>
	);
};

type IndexDocumentProps = {
	setFilenames: Dispatch<SetStateAction<string[]>>;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const IndexDocument: FunctionComponent<IndexDocumentProps> = ({
	setFilenames,
	setIsLoading,
}) => {
	const [isIndexing, setIsIndexing] = useState(false);
	const toast = useToast();

	const getSavedFilenames = async () => {
		try {
			const data = await getFilenames();

			setFilenames(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			toast.toast({
				title: 'Error',
				description: 'Encountered an error while fetching filenames',
				variant: 'destructive',
			});
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			try {
				setIsIndexing(true);
				await fetch(`${config.API_URL}/index`, {
					method: 'POST',
					body: formData,
				});

				await getSavedFilenames();
				setIsIndexing(false);
				toast.toast({
					title: 'Success',
					description: 'Successfully indexed document',
					variant: 'success',
				});
			} catch (error) {
				setIsIndexing(false);
				toast.toast({
					title: 'Error',
					description: 'Encountered an error while indexing document',
					variant: 'destructive',
				});
			}
		}
	};
	return (
		<div>
			<h1>Index a new document</h1>
			<p className="text-gray-400">
				Add a new document and wait until the indexing is done.
			</p>
			<p className="text-gray-400">
				After that, you will be able to select it from the list and perform
				searching
			</p>
			{!isIndexing ? (
				<div className="my-5">
					<h1>Upload document</h1>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="picture">Document</Label>
						<Input id="picture" type="file" onChange={handleFileChange} />
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
					<LoadingSpinner />
					<h1>Depending on the size of the document,</h1>
					<h1>it may take a few minutes for the text to be indexed....</h1>
				</div>
			)}
		</div>
	);
};

export default App;
