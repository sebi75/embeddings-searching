import React, { useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkTheme';
import 'tailwindcss/tailwind.css';
import { Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';

export const ThemeToggleSwitch: React.FC = () => {
	const [enabled, setEnabled] = useDarkMode();

	const handleThemeChange = (value: boolean) => {
		setEnabled(value);
	};

	useEffect(() => {
		setEnabled(enabled);
	}, [enabled, setEnabled]);

	return (
		<div className="mx-2 flex items-center">
			<div className="mr-2">
				<Sun />
			</div>
			<Switch onCheckedChange={handleThemeChange} checked={enabled} />
			<div className="ml-2">
				<Moon />
			</div>
		</div>
	);
};
