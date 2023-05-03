export const getFileTypeNameFromMime = (mimeType: string): string => {
	switch (mimeType) {
		case "application/vnd.ms-excel":
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
		case "application/vnd.ms-excel.sheet.macroEnabled.12":
			return "Excel";
		case "application/msword":
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			return "Word";
		case "application/vnd.ms-powerpoint":
		case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
			return "PowerPoint";
		case "application/pdf":
			return "PDF";
		case "text/html":
			return "";
		case "audio/mpeg":
			return "Audio resource";
		case "application/epub+zip":
			return "ePub";
		case "application/x-mobipocket-ebook":
			return "eBook";
		default:
			return "";
	}
};
