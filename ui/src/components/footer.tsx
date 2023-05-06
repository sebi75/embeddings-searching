import { FunctionComponent } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer: FunctionComponent = () => {
	return (
		<footer className="flex justify-center items-center py-4 absolute bottom-0">
			<a
				href="https://github.com/sebi75"
				className="mx-2"
				target="_blank"
				rel="noreferrer"
			>
				<Github className="h-6 w-6 " />
			</a>
			<a
				href="https://www.linkedin.com/in/sebastian-semeniuc-17136321a/"
				className="mx-2"
				target="_blank"
				rel="noreferrer"
			>
				<Linkedin className="h-6 w-6 " />
			</a>
			<a
				href="https://twitter.com/sebyss7"
				className="mx-2"
				target="_blank"
				rel="noreferrer"
			>
				<Twitter className="h-6 w-6 " />
			</a>
			<span className="">#Built By Sebastian Semeniuc</span>
		</footer>
	);
};

export default Footer;
