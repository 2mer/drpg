import Tile from './Tile';
import { hashPos, useWorld, WorldContext } from '../hooks/useWorld';
import useCharacterController from '../hooks/useCharacterController';
import { useGameState } from '../hooks/useGameState';
import tiles, { isPlayer } from '../logic/world/tiles';
import { AnimatePresence } from 'framer-motion';
import downImage from '../assets/ui/down.png';
import NumberRenderer from './NumberRenderer';
import DepthGauge from './DepthGauge';
import ActionBar from './ActionBar';
import CurrencyGauge from './CurrencyGauge';
import { regionAt } from '../logic/world/generation';
import { WORLD_HEIGHT_PAD } from '../logic/world/constants';

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

	const region = regionAt(
		state.dimension,
		state.position.x,
		state.position.y
	);
	const stageBg = region?.background ?? region?.image ?? tiles.air.image;

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

				{/* bg area */}
				<div className='[grid-column:2] [grid-row:2] w-full h-full z-0 bg-black' />

				{/* bg overlay */}
				<div
					className='[grid-column:2] [grid-row:2] w-full h-full z-20 [image-rendering:pixelated] opacity-15'
					style={{
						backgroundImage: `url("${stageBg}")`,
						backgroundRepeat: 'repeat',
						backgroundSize: '64px',
						backgroundPositionY: (state.position.y * -64) / 4,
						transition:
							'background-image 700ms, background-position-y 250ms linear',
					}}
				/>

				{/* grid */}
				<div className='[grid-column:2] [grid-row:2]  w-[calc(64px*5)] h-[calc(64px*5)] relative z-30 overflow-hidden'>
					<div
						className='w-full h-full'
						style={{
							filter: [
								...[
									[1, 0],
									[-1, 0],
									[0, 1],
									[0, -1],
								]
									.map((c) => c.map((e) => e * 2))
									.map(
										(c) =>
											`drop-shadow(${c[0]}px ${c[1]}px 0 black)`
									),
								'drop-shadow(0 0 2px black)',
							].join(' '),
						}}
					>
						<AnimatePresence>
							{world.tiles.flatMap((row, iY) =>
								row.map((tile, iX) => {
									const worldX = iX;
									const worldY =
										state.position.y +
										iY -
										WORLD_HEIGHT_PAD;

									return (
										<Tile
											key={
												hashPos(worldX, worldY) +
												'-' +
												state.run
											}
											x={worldX}
											y={worldY}
											gx={iX}
											gy={iY - WORLD_HEIGHT_PAD}
											tile={tile}
											run={state.run}
										/>
									);
								})
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* grid */}
				<div className='[grid-column:2] [grid-row:2]  w-[calc(64px*5)] h-[calc(64px*5)] relative z-40 overflow-hidden'>
					<div
						className='w-full h-full'
						style={{
							filter: [
								...[
									[1, 0],
									[-1, 0],
									[0, 1],
									[0, -1],
								]
									.map((c) => c.map((e) => e * 2))
									.map(
										(c) =>
											`drop-shadow(${c[0]}px ${c[1]}px 0 black)`
									),
								'drop-shadow(0 0 2px black)',
							].join(' '),
						}}
					>
						<AnimatePresence>
							<Tile
								x={state.position.x}
								y={state.position.y}
								gx={state.position.x}
								gy={0}
								tile={world.playerTile}
								run={state.run}
							/>
						</AnimatePresence>
					</div>
				</div>

				{/* actions */}
				<ActionBar />
			</div>
		</div>
	);
}

export default WorldContext.wrap(Stage);
