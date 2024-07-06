import { useGameState } from '../hooks/useGameState';

function Velocity() {
	const [state] = useGameState();

	if (!state.velocity) return null;

	return <>{state.velocity}</>;
}

export default Velocity;
