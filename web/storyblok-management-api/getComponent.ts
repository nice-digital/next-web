/**!SECTION
 * NOTE: To run this as it currently is:
 * - open terminal
 * - cd to web
 * - run: npx ts-node storyblok-management-api/getComponent.ts
 */

import { config } from "dotenv";

config({ path: ".env.dev.local" });

const LIVE_SPACE_ID = process.env.LIVE_SPACE_ID;
const ALPHA_SPACE_ID = process.env.ALPHA_SPACE_ID;
const DEV_SPACE_ID = process.env.DEV_SPACE_ID;
const AUTH_TOKEN = process.env.MANAGEMENT_TOKEN;
const COMPONENT_ID = process.env.COMPONENT_ID;

import Storyblok from "storyblok-js-client";



const sbManagement = new Storyblok({oauthToken: AUTH_TOKEN})

async function getComponent(spaceId:number, componentId:number) {
	try {
		const response = await sbManagement.get(`spaces/${spaceId}/components/${componentId}`, {});
		console.log("component data: ", response.data);
		return response.data.component
	} catch(err) {
		console.error("Error fetching component", err);
		throw err
	}
}

//NOTE: This is only for testing the SB Management API to first grab a component by it's space ID and component ID.

//NOTE: FOR TESTING ADD THE YOUR RELEVANT SPACE_ID and COMPONENT_ID to your .env.dev.local file. (See above consts)
getComponent(Number(DEV_SPACE_ID),Number(COMPONENT_ID))
