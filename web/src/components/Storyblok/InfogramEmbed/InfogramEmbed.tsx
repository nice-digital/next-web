
import Script from 'next/script';
import { useEffect } from 'react';
import { InfogramEmbedStoryblok } from '@/types/storyblok';

export interface InfogramEmbedProps {
    blok: InfogramEmbedStoryblok;
}

//should we set as env vars or should we try to get it from the embed code?
const INFOGRAMSCRIPT = 'https://e.infogram.com/js/dist/embed-loader-min.js';
const INFOGRAMSCRIPTID = 'infogram-async';


// moved extract logic to own function, unit test it
const extractEmbedData = (embedCode: string) => {
	try {
		// Use regex to extract the data-id, data-title, and data-type from the embed code
		const dataIdMatch = embedCode.match(/data-id="([^"]+)"/);
		const dataId = dataIdMatch ? dataIdMatch[1] : null;

		const dataTitleMatch = embedCode.match(/data-title="([^"]+)"/);
		const dataTitle = dataTitleMatch ? dataTitleMatch[1] : null;

		const dataTypeMatch = embedCode.match(/data-type="([^"]+)"/);
		const dataType = dataTypeMatch ? dataTypeMatch[1] : 'interactive'; // default to 'interactive' if dataType not found

		return {
			dataId,
			dataTitle,
			dataType,
			isValid: !!(dataId && dataTitle && dataType)
		}
		// Check if all values are present};
	} catch (error) {
		console.error('Error extracting embed data:', error);
		return {
			dataId: null,
			dataTitle: null,
			dataType: null,
			isValid: false };
	}
}



/** NOTE: finding HMR(hot module reloading) doesn't always load the embed */const InfogramEmbed = ({ blok } :InfogramEmbedProps) => {
	const embedCode = blok.embedCode;
  	const embedData = embedCode ? extractEmbedData(embedCode) : null;

	// Check if embedCode is a string and not empty
	if(!embedCode) {
		return <div>Embed code is not available</div>;
	}

	// Check if embedData is valid
	if (!embedData || !embedData.isValid) {
		return <div>Embed code is invalid</div>;
	}


	// Should we use a ref to check if the script is already loaded?
	// should we use next/script instead of hooks?
	// TODO: Check if the script is already loaded
    useEffect(() => {

		// Check if the script is already loaded
		const existingScript = document.getElementById(INFOGRAMSCRIPTID);
		if (existingScript) {
			// If the script is already loaded, do nothing
			return () => {};
		}

        // Check if embedCode is a string and not empty
        if (typeof embedCode === 'string' && embedCode.trim() !== '') {
            const script = document.createElement('script');
            script.src = INFOGRAMSCRIPT;
			script.id = 'infogram-async';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
		// If embedCode is not a string or is empty, do nothing
		return () => {};
    }, [embedCode]);

	return (
  	<>
		<div className="infogram-embed"
			 data-id={embedData.dataId}
			 data-title={embedData.dataTitle}
			 data-type={embedData.dataType}/>


		{/*
		we can hard code the values here but we should probably use the data from the embed code so we are using the same values (what happens if infogram change src url or id for script tag?).
		<Script
            id="infogram-async"
            src="https://e.infogram.com/js/dist/embed-loader-min.js"
            strategy="afterInteractive"
        /> */}
	</>
  );
};

export default InfogramEmbed;
