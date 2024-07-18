import { useGameState } from '../hooks/useGameState';
import regions from '../logic/world/regions';
import tiles, { isShop } from '../logic/world/tiles';
import NumberRenderer from './NumberRenderer';
import miniBlockImage from '../assets/ui/miniBlock.png';
import { useWorld } from '../hooks/useWorld';
import { block } from '../util';

function DepthGauge() {
	const [state] = useGameState();
	const world = useWorld();

	const matchingRegion = regions[state.dimension].find((r) =>
		r.contains(state.position.x, state.position.y)
	);

	const feetTile = world.at(
		state.dimension,
		state.position.x,
		state.position.y,
		true
	);

	const image = block(() => {
		if (feetTile.id !== tiles.air.id) return feetTile.image;

		return matchingRegion?.image ?? tiles.air.image;
	});

	return (
		<div className='flex flex-col-reverse [grid-column:1] [grid-row:2] bg-black'>
			<div className='flex w-res h-res relative'>
				<img
					src={image}
					className='absolute inset-0 w-full h-full [image-rendering:pixelated]'
				/>
				<img
					src={miniBlockImage}
					className='absolute inset-0 w-full h-full [image-rendering:pixelated]'
				/>
			</div>
			<NumberRenderer
				value={isShop(feetTile) ? feetTile.price : state.position.y}
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
