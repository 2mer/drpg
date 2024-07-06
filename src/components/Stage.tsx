import Tile from './Tile';
import { hashPos, useWorld, WorldContext } from '../hooks/useWorld';
import useCharacterController from '../hooks/useCharacterController';
import { useGameState } from '../hooks/useGameState';
import { isPlayer } from '../logic/world/tiles';
import { AnimatePresence } from 'framer-motion';

function Stage() {
	const [state] = useGameState();
	const world = useWorld();

	useCharacterController();

	return (
		<div className='flex flex-col w-full h-full items-center justify-center bg-blue-950'>
			{/* card */}
			<div className='flex flex-col ring-8 ring-blue-600 bg-black'>
				{/* grid */}
				<div className='w-[calc(64px*5)] h-[calc(64px*5)] relative'>
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
												: hashPos(worldX, worldY)
										}
										x={worldX}
										y={worldY}
										gx={iX}
										gy={iY}
										tile={tile}
									/>
								);
							})
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

export default WorldContext.wrap(Stage);
