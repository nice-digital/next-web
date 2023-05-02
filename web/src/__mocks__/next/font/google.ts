type GoogleFont = {
	style: {
		fontFamily: string;
	};
};

const fontMock: GoogleFont = {
	style: {
		fontFamily: "Arial",
	},
};

export const Inter = (): GoogleFont => {
	return fontMock;
};
export const Lora = (): GoogleFont => {
	return fontMock;
};
