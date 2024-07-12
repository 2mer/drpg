import { useGameState } from '../hooks/useGameState';
import regions from '../logic/world/regions';
import tiles from '../logic/world/tiles';
import NumberRenderer from './NumberRenderer';
import miniBlockImage from '../assets/ui/miniBlock.png';

function DepthGauge() {
	const [state] = useGameState();

	const matchingRegion = regions.find((r) =>
		r.contains(state.position.x, state.position.y)
	);

	return (
		<div className='flex flex-col-reverse [grid-column:1] [grid-row:2] bg-black'>
			<div className='flex w-[64px] h-[64px] relative'>
				<img
					src={matchingRegion?.image ?? tiles.air.image}
					className='absolute inset-0 w-full h-full [image-rendering:pixelated]'
				/>
				<img
					src={miniBlockImage}
					className='absolute inset-0 w-full h-full [image-rendering:pixelated]'
				/>
			</div>
			<NumberRenderer
				value={state.position.y}
				orientation='vertical'
				overflow='cyclic'
				style={{
					transform: 'scaleY(-1)',
				}}
			/>
		</div>
	);
}

export default DepthGauge;
