/**
 * NOTE: Can test using /test-page?_storyblok on SB Dev space.
 *
 * NOTE: infogramEmbed in Storyblok would consist of one field called embedCode, which is a string. The embedCode is the HTML code that you get from Infogram when you share a responsive infographic.
 *
 * TODO: the blok creating and types generating
 */

import Script from 'next/script';
import { useEffect } from 'react';
import { InfogramEmbedStoryblok } from '@/types/storyblok';

interface InfogramEmbedProps {
    blok: InfogramEmbedStoryblok;
}

/**!SECTION
 * basic example of passing the embed code from infogram using dangerouslySetInnerHTML
 * This would pass the entire embed code including script tag from infogram to the component.
 *
 * As the input embed code starts as a div but eventually renders an iframe, we will dynamically load the component using next dynamic imports with ssr: false. See ./ClientInfogramEmbed.tsx
 *  */
/** NOTE: finding HMR(hot module reloading) doesn't always load the embed */
const InfogramEmbed = ({ blok } :InfogramEmbedProps) => {
  const embedCode = blok.embedCode;

    // useEffect(() => {
    //     // Check if embedCode is a string and not empty
    //     if (typeof embedCode === 'string' && embedCode.trim() !== '') {
    //         const script = document.createElement('script');
    //         script.src = 'https://e.infogram.com/js/dist.embed-loader-min.js';
    //         script.async = true;
    //         document.body.appendChild(script);

    //         return () => {
    //             document.body.removeChild(script);
    //         };
    //     }
    // }, [embedCode]);

	return (
  	<>
		<div dangerouslySetInnerHTML={{ __html: embedCode }} />

		{/** NOTE:
		 * Right now we need to add the script below,
		 * as the useEffect is still not enough to load the embed code.
         * This is a temporary solution until we find a better way to load the embed script.

		 We know the embed loader is required to generate and manage the responsive iframe for the infographic
		 */}
		<Script
            id="infogram-async"
            src="https://e.infogram.com/js/dist/embed-loader-min.js"
            strategy="afterInteractive"
        />
	</>
  );
};

export default InfogramEmbed;


/**!SECTION
 * This is a WIP component showing how we might extract data if users choose to copy and paste the entire embed from share embed in infogram and we want to ensure the output is safe.

* * This component will extract the data-id, data-title, and data-type from the embed code and use them to create a new embed code.
 *  */

const InfogramEmbedUsingMatch = ({ blok }:InfogramEmbedProps) => {
	// get the embedCode from the blok
	const {embedCode} = blok;

	//Extract the data-id
	//Use regex to extract the data-id from the embed code
	const dataIdMatch = embedCode.match(/data-id="([^"]+)"/);
	const dataId = dataIdMatch ? dataIdMatch[1] : null;

	// Extract the data-title
	const dataTitleMatch = embedCode.match(/data-title="([^"]+)"/);
	const dataTitle = dataTitleMatch ? dataTitleMatch[1] : null;

	// Extract the data-type
	const dataTypeMatch = embedCode.match(/data-type="([^"]+)"/);
	const dataType = dataTypeMatch ? dataTypeMatch[1] : null;
	// default to 'interactive' if dataType not found?


	// TODO: extract script src


	/* TODO: validate / sanitise te dataId, dataTitle,
	 * and dataType to ensure they are safe to use in the HTML
	 * (e.g., check for XSS vulnerabilities, etc.)
	*/

	return (
		<>
			<div className="infogram-embed" data-id={dataId} data-title={dataTitle} data-type={dataType}/>
			{/*
				* The script tag is added here to load the Infogram embed script.
				* This is done using the Script component from Next.js, so it can dedupe the script if it is already loaded.
				* The src attribute should point to the Infogram embed script URL.
				*/}
			<Script
				src="https://e.infogram.com/js/dist/embed-loader-min.js"
				strategy="afterInteractive"
			/>
		</>
	)

}