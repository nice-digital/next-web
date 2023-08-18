export const CardGrid = ({ blok }): React.ReactElement => {
	console.log("Card grid blok:", blok);
	return (
		<>
			{blok.cards.map((card) => (
				<p key={card._uid}>{card.heading}</p>
			))}
		</>
	);
};
