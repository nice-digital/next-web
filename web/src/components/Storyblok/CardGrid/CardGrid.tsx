import { StoryblokComponentType } from "@storyblok/react";

type CardBlokProps = StoryblokComponentType<"card"> & {
	heading: string;
};

interface CardGridBlokProps {
	blok: {
		cards: CardBlokProps[];
	};
}

export const CardGrid = ({ blok }: CardGridBlokProps): React.ReactElement => {
	console.log("Card grid blok:", blok);
	return (
		<>
			{blok.cards.map((card) => (
				<p key={card._uid}>{card.heading}</p>
			))}
		</>
	);
};
