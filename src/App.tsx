import { ErrorBoundary } from 'react-error-boundary';
import Stage from './components/Stage';
import oopsImg from './assets/ui/oops.png';
import { PIXEL_RESOLUTION } from './constants';
import { STORAGE_KEY } from './hooks/useGameState';

function fallbackRender({ error }: { error: any }) {
	return (
		<div
			className='flex flex-col bg-slate-800 h-full w-full justify-center items-center gap-4 p-4'
			role='alert'
			// @ts-ignore
			style={{ '--pixel-res': `${PIXEL_RESOLUTION}px` }}
		>
			<img
				className='w-res h-res [image-rendering:pixelated]'
				src={oopsImg}
			/>
			<p className='text-white'>Something went wrong</p>
			<pre className='text-red-500'>{error.message}</pre>
			<button onClick={() => localStorage.removeItem(STORAGE_KEY)}>
				WIPE STATE
			</button>
		</div>
	);
}

function App() {
	return (
		<ErrorBoundary fallbackRender={fallbackRender}>
			<Stage />
		</ErrorBoundary>
	);
}

export default App;
