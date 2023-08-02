import { Inter, Lora } from "next/font/google";
import { FC } from "react";

const inter = Inter({
	subsets: ["latin"],
});

const lora = Lora({
	subsets: ["latin"],
});

export const FontStyles: FC = () => (
	<style jsx global>{`
		html {
			--sans-font-family: ${inter.style.fontFamily};
			--serif-font-family: ${lora.style.fontFamily};
		}
	`}</style>
);
