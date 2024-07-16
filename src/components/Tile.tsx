import { AnimatePresence, motion } from 'framer-motion';
import tiles, { isPlayer, isShop, ITile } from '../logic/world/tiles';
import { hashPos } from '../hooks/useWorld';
import brokenOverlay from '../assets/tiles/broken.png';
import ShopIndication from './ShopIndication';

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
	// @ts-ignore
	const health = tile.toughness / tiles[tile.id].toughness;

	const shop = isShop(tile);

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
				<AnimatePresence>
					{shop && <ShopIndication tile={tile} />}
					{!player && health < 1 && (
						<motion.div
							className='absolute inset-0 z-10 transition-all duration-100'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 - health }}
							style={{ opacity: 1 - health }}
							transition={{
								duration: 0.1,
							}}
						>
							<img
								src={brokenOverlay}
								className='w-[64px] h-[64px] [image-rendering:pixelated]'
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<img
					src={tile.image}
					className='absolute inset w-[64px] h-[64px] [image-rendering:pixelated] z-10'
				/>
			</div>
		</motion.div>
	);
}

export default Tile;
