import { FunctionComponent } from 'react';

export const LoadingSpinner: FunctionComponent = () => {
	return (
		<div className="lds-ripple">
			<div></div>
			<div></div>
		</div>
	);
};
