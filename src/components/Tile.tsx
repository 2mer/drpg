import { motion } from 'framer-motion';
import { isPlayer, ITile } from '../logic/world/tiles';
import Velocity from './Velocity';
import { hashPos } from '../hooks/useWorld';

function Tile({
	tile,
	x,
	y,
	gx,
	gy,
	run,
}: {
	tile: ITile;
	x: number;
	y: number;
	gx: number;
	gy: number;
	run: number;
}) {
	const player = isPlayer(tile);

	return (
		<motion.div
			layout='position'
			layoutId={player ? 'player' : hashPos(x, y) + '-' + run}
			className='w-[64px] h-[64px] absolute'
			data-tile-id={tile.name}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				layout: {
					modifyTarget: (target) => Math.round(target / 9) * 9,
				},
			}}
			style={{ left: gx * 64, top: gy * 64 }}
		>
			<div className='w-[64px] h-[64px] relative'>
				<div className='absolute inset-0 flex justify-center items-center [font-family:Pixelify_Sans] text-[48px] opacity-0 hover:opacity-100 hover:bg-blue-500 hover:bg-opacity-25 hover:ring-4 hover:ring-blue-500 hover:ring-inset'>
					{player ? (
						<Velocity />
					) : (
						Boolean(tile.toughness) && tile.toughness
					)}
				</div>
				<img
					src={tile.image}
					className='w-[64px] h-[64px] [image-rendering:pixelated]'
				/>
			</div>
		</motion.div>
	);
}

export default Tile;
