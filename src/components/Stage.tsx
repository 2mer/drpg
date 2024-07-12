import Tile from './Tile';
import { hashPos, useWorld, WorldContext } from '../hooks/useWorld';
import useCharacterController from '../hooks/useCharacterController';
import { useGameState } from '../hooks/useGameState';
import { isPlayer } from '../logic/world/tiles';
import { AnimatePresence } from 'framer-motion';
import downImage from '../assets/ui/down.png';
import NumberRenderer from './NumberRenderer';
import DepthGauge from './DepthGauge';
import ActionBar from './ActionBar';
import CurrencyGauge from './CurrencyGauge';

function Stage() {
	const [state, update] = useGameState();
	const world = useWorld();

	// @ts-ignore
	window.state = state;
	// @ts-ignore
	window.world = world;
	// @ts-ignore
	window.update = update;

	useCharacterController();

	return (
		<div className='flex flex-col w-full h-full items-center justify-center bg-blue-950'>
			{/* card */}
			<div className='grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] gap-2 p-2 bg-blue-600 rounded-[64px] shadow-xl'>
				{/* velocity */}
				<div className='flex [grid-column:2] [grid-row:1] bg-black'>
					<img
						src={downImage}
						className='w-[64px] h-[64px] [image-rendering:pixelated]'
					/>
					<NumberRenderer
						value={state.velocity}
						orientation='horizontal'
					/>
				</div>

				{/* currency */}
				<CurrencyGauge />

				{/* depth */}
				<DepthGauge />

				{/* grid */}
				<div className='[grid-column:2] [grid-row:2]  w-[calc(64px*5)] h-[calc(64px*5)] relative bg-black'>
					<AnimatePresence>
						{world.tiles.flatMap((row, iY) =>
							row.map((tile, iX) => {
								const worldX = iX;
								const worldY = state.position.y + iY;
								const player = isPlayer(tile);

								return (
									<Tile
										key={
											player
												? 'player'
												: hashPos(worldX, worldY) +
												  '-' +
												  state.run
										}
										x={worldX}
										y={worldY}
										gx={iX}
										gy={iY}
										tile={tile}
										run={state.run}
									/>
								);
							})
						)}
					</AnimatePresence>
				</div>

				{/* actions */}
				<ActionBar />
			</div>
		</div>
	);
}

export default WorldContext.wrap(Stage);
