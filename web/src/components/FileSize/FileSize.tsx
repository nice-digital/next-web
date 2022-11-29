import { filesize } from "filesize";
import { type FC } from "react";

export type FileSizeProps = {
	fileSizeBytes: number;
};

export const FileSize: FC<FileSizeProps> = ({ fileSizeBytes }) => (
	<>
		{filesize(fileSizeBytes, {
			round: fileSizeBytes > 999999 ? 2 : 0,
		})}
	</>
);
