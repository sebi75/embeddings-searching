import {
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
	FunctionComponent,
} from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from './components/loading-spinner';
import config from '@/config';
import { ThemeToggleSwitch } from './components/theme-switch';
import { Button } from './components/ui/button';

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
				<div className="p-3">
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
		</div>
	);
}

type SearchDocumentProps = {
	filename: string;
};

const SearchDocument: FunctionComponent<SearchDocumentProps> = ({
	filename,
}) => {
	return <div>search document component for {filename}</div>;
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

	const getSavedFilenames = async () => {
		try {
			const data = await getFilenames();

			setFilenames(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log('encountered error', error);
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		console.log(file);
		if (file) {
			const formData = new FormData();
			formData.append('file', file);
			try {
				setIsIndexing(true);
				const response = await fetch(`${config.API_URL}/index`, {
					method: 'POST',
					body: formData,
				});

				const data = await response.json();
				await getSavedFilenames();
				setIsIndexing(false);
				console.log(data);
			} catch (error) {
				setIsIndexing(false);
				console.log('encountered error', error);
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
