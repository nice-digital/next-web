import { debounce } from "lodash";
import { useEffect } from "react";

interface UseResizeProps {
	callback: () => void;
	debounceDelay: number;
}

export const useResize = ({
	callback,
	debounceDelay,
}: UseResizeProps): void => {
	useEffect(() => {
		const handleResize = debounce(callback, debounceDelay);

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			handleResize.cancel();
			window.removeEventListener("resize", handleResize);
		};
	}, [callback, debounceDelay]);
};
