const toDataQASelAttr = (attrValue, p0: unknown, p1: string) =>
	`[data-qa-sel='${attrValue}']`;
const toNthChildAttr = (attrValue) => `> :nth-child(${attrValue}) a`;
const toChildAndQASel = (childIndex, attrValue) =>
	toDataQASelAttr(attrValue) + " " + toNthChildAttr(childIndex);

export default {
	SubscribeToNewsletter: {
		emailAddress: toDataQASelAttr("#input_6"),
		firstnameforNewsletter: toDataQASelAttr("#first_15"),
		lastnameforNewsletter: toDataQASelAttr("#last_15"),
		sector: toDataQASelAttr("#input_11"),
		jobRole: toDataQASelAttr("#input_12"),
		subscribeButton: toDataQASelAttr("#input_4"),
	},
};
