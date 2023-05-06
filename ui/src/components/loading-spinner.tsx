import { FunctionComponent } from 'react';

export const LoadingSpinner: FunctionComponent = () => {
	return (
		<div className="lds-ripple">
			<div className="border-[4px] border-solid dark:border-white border-black"></div>
			<div className="border-[4px] border-solid dark:border-white border-black"></div>
		</div>
	);
};
