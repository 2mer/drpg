import { AnimatePresence, motion } from 'framer-motion';
import tiles, { isPlayer, isShop, ITile } from '../logic/world/tiles';
import { hashPos } from '../hooks/useWorld';
import brokenOverlay from '../assets/tiles/broken.png';
import ShopIndication from './ShopIndication';
import { PIXEL_RESOLUTION } from '../constants';

function Tile({
	tile,
	x,
	y,
	gx,
	gy,
	run,
	onClick,
}: {
	tile: ITile;
	x: number;
	y: number;
	gx: number;
	gy: number;
	run: number;
	onClick?: () => void;
}) {
	const player = isPlayer(tile);
	// @ts-ignore
	const health = tile.toughness / tiles[tile.id].toughness;

	const shop = isShop(tile);

	return (
		<motion.div
			layout='position'
			layoutId={player ? 'player' : hashPos(x, y) + '-' + run}
			className='w-res h-res absolute'
			data-tile-id={tile.name}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				layout: {
					modifyTarget: (target) => Math.round(target / 9) * 9,
				},
			}}
			style={{ left: gx * PIXEL_RESOLUTION, top: gy * PIXEL_RESOLUTION }}
			onClick={onClick}
			role={onClick ? 'button' : undefined}
		>
			<div className='w-res h-res relative'>
				<AnimatePresence>
					{shop && <ShopIndication tile={tile} />}
					{!player && health < 1 && (
						<motion.div
							className='absolute inset-0 z-50 transition-all duration-100'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 - health }}
							style={{ opacity: 1 - health }}
							transition={{
								duration: 0.1,
							}}
						>
							<img
								src={brokenOverlay}
								className='w-res h-res [image-rendering:pixelated]'
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<img
					src={tile.image}
					className='absolute inset w-res h-res [image-rendering:pixelated] z-10'
				/>
			</div>
		</motion.div>
	);
}

export default Tile;
