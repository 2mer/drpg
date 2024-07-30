import { useHotkeys } from "@mantine/hooks";
import { useGameState } from "./useGameState";
import { useWorld } from "./useWorld";
import { usePeripheral } from "./usePeripheral";

export function useCharacterControllerActions() {
	const [state] = useGameState();
	const world = useWorld();

	const engines = usePeripheral('engines');

	const interact = () => {
		const tile = world.at(state.dimension, state.position.x, state.position.y, true);
		world.emit('interact', { dimension: state.dimension, x: state.position.x, y: state.position.y, tile, preventDefault: false });
	};

	return {
		interact, goDown: () => engines.down(), goLeft: () => engines.left(), goRight: () => engines.right()
	}
}

export default function useCharacterController() {
	const handles = useCharacterControllerActions();

	const { goDown, goLeft, goRight, interact } = handles;

	useHotkeys([
		['s', goDown],
		['ArrowDown', goDown],
		['space', goDown],

		['a', goLeft],
		['ArrowLeft', goLeft],

		['d', goRight],
		['ArrowRight', goRight],

		['w', interact],
		['ArrowUp', interact],
	]);

	return handles;
}