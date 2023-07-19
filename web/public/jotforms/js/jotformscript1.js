JotForm.newDefaultTheme = false;
JotForm.extendsNewTheme = true;
JotForm.singleProduct = false;
JotForm.newPaymentUIForNewCreatedForms = false;
JotForm.newPaymentUI = true;

JotForm.setConditions([
	{
		action: [
			{
				id: "action_1683121549959",
				visibility: "Show",
				isError: false,
				field: "40",
			},
		],
		id: "1683121569216",
		index: "0",
		link: "Any",
		priority: "0",
		terms: [
			{
				id: "term_1683121549959",
				field: "39",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_0_1683121583197",
				visibility: "Show",
				isError: false,
				field: "43",
			},
		],
		id: "1683121578687",
		index: "1",
		link: "Any",
		priority: "1",
		terms: [
			{
				id: "term_0_1683121583197",
				field: "42",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_0_1683121660191",
				visibility: "Show",
				isError: false,
				field: "44",
			},
		],
		id: "1683121581710",
		index: "2",
		link: "Any",
		priority: "2",
		terms: [
			{
				id: "term_0_1683121660191",
				field: "41",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_1683119267519",
				skipHide: "hidePage",
				skipTo: "page-2",
				isError: false,
			},
		],
		id: "1683119297646",
		index: "3",
		link: "Any",
		priority: "3",
		terms: [
			{
				id: "term_1683119267519",
				field: "22",
				operator: "equals",
				value: "Existing",
				isError: false,
			},
		],
		type: "page",
	},
	{
		action: [
			{
				id: "action_1683117857512",
				visibility: "Show",
				isError: false,
				field: "32",
			},
		],
		id: "1683117874783",
		index: "4",
		link: "Any",
		priority: "4",
		terms: [
			{
				id: "term_1683117857512",
				field: "31",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_1683117814000",
				visibility: "Show",
				isError: false,
				field: "30",
			},
		],
		id: "1683117840831",
		index: "5",
		link: "Any",
		priority: "5",
		terms: [
			{
				id: "term_1683117814000",
				field: "29",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_1683117182247",
				visibility: "Show",
				isError: false,
				field: "33",
			},
		],
		id: "1683117207086",
		index: "6",
		link: "Any",
		priority: "6",
		terms: [
			{
				id: "term_1683117182247",
				field: "19",
				operator: "equals",
				value: "Other - please specify",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_0_1683117766742",
				visibility: "Show",
				isError: false,
				field: "15",
			},
		],
		id: "1679406655329",
		index: "7",
		link: "Any",
		priority: "7",
		terms: [
			{
				id: "term_0_1683117766742",
				field: "13",
				operator: "equals",
				value: "Yes",
				isError: false,
			},
		],
		type: "field",
	},
	{
		action: [
			{
				id: "action_0_1683118744684",
				skipHide: "skipTo",
				skipTo: "page-2",
				isError: false,
			},
		],
		id: "1682070604451",
		index: "8",
		link: "Any",
		priority: "8",
		terms: [
			{
				id: "term_0_1683118744684",
				field: "22",
				operator: "equals",
				value: "New",
				isError: false,
			},
		],
		type: "page",
	},
]);
JotForm.clearFieldOnHide = "disable";
JotForm.submitError = "jumpToFirstError";

JotForm.enterprise = "nice.jotform.com";

JotForm.init(function () {
	/*INIT-START*/
	if (window.JotForm && JotForm.accessible)
		$("input_5").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_33").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_8").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_9").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_64").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_65").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_66").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_15").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_30").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_32").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_57").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_56").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_54").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_40").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_43").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_44").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_49").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_51").setAttribute("tabindex", 0);
	if (window.JotForm && JotForm.accessible)
		$("input_53").setAttribute("tabindex", 0);
	JotForm.alterTexts(undefined);
	setTimeout(function () {
		JotForm.initMultipleUploads();
	}, 2);
	/*INIT-END*/
});

setTimeout(function () {
	JotForm.paymentExtrasOnTheFly([
		null,
		{
			name: "heading",
			qid: "1",
			text: "Interventional procedures notification form",
			type: "control_head",
		},
		null,
		{
			name: "yourDetails",
			qid: "3",
			text: "Your details",
			type: "control_head",
		},
		{
			description: "",
			name: "name",
			qid: "4",
			text: "Name",
			type: "control_fullname",
		},
		{
			description: "",
			name: "organisation",
			qid: "5",
			subLabel: "",
			text: "Organisation",
			type: "control_textbox",
		},
		{
			description: "",
			name: "email",
			qid: "6",
			subLabel: "example@example.com",
			text: "Email",
			type: "control_email",
		},
		{
			name: "informationOn",
			qid: "7",
			text: "Information on the procedure",
			type: "control_head",
		},
		{
			description: "",
			name: "nameOf",
			qid: "8",
			subLabel: "",
			text: "Name of procedure",
			type: "control_textbox",
		},
		{
			description: "",
			name: "indicationFor",
			qid: "9",
			subLabel: "If more than one, please complete a separate form.",
			text: "Indication for procedure. ",
			type: "control_textarea",
		},
		{
			name: "whereIs",
			qid: "10",
			text: "Where is the procedure being done?",
			type: "control_head",
		},
		null,
		null,
		{
			description: "",
			name: "doneInTheNHS",
			qid: "13",
			text: "In the NHS?",
			type: "control_radio",
		},
		null,
		{
			description: "",
			name: "detailsOfNHSUse",
			qid: "15",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		null,
		null,
		{
			description: "",
			name: "supportingInformation18",
			qid: "18",
			subLabel: "Word, Excel, PDF.",
			text: "Supporting information.",
			type: "control_fileupload",
		},
		{
			description: "",
			name: "privateSector",
			qid: "19",
			subLabel: "",
			text: "Role?",
			type: "control_dropdown",
		},
		null,
		{
			name: "pageBreak21",
			qid: "21",
			text: "Page Break",
			type: "control_pagebreak",
		},
		{
			description: "",
			name: "typeOfProcedure",
			qid: "22",
			text: "Type",
			type: "control_radio",
		},
		{
			name: "input23",
			qid: "23",
			text: "Tell us about an interventional procedure you think should be assessed by NICE.\nAbout our notification process.\nFields marked with an asterisk (*) are mandatory.",
			type: "control_text",
		},
		null,
		null,
		null,
		{
			name: "notifyNew",
			qid: "27",
			text: "Notify new procedures",
			type: "control_head",
		},
		{
			name: "input28",
			qid: "28",
			text: "A new procedure must be a:\n\nSurgical procedure - making a cut or a hole to gain access to the inside of a patient's body.\nProcedure accessing the body cavity without cutting.\nProcedure using electromagnetic radiation. For example x-rays, lasers.\n\nIt must also:\n\nBe available within the NHS or independent sector, or be about to be used for the first time, outside formal research.\nNot yet be considered standard clinical practice.\n\nNote: While guidance is in development, clinicians wishing to carry out the procedure, and their trusts, should ensure that special arrangements are in place for consent, governance, audit and research.",
			type: "control_text",
		},
		{
			description: "",
			name: "inThe",
			qid: "29",
			text: "In the private sector?",
			type: "control_radio",
		},
		{
			description: "",
			name: "pleaseGive",
			qid: "30",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "inA",
			qid: "31",
			text: "In a research setting?",
			type: "control_radio",
		},
		{
			description: "",
			name: "pleaseGive32",
			qid: "32",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "otherRole",
			qid: "33",
			subLabel: "",
			text: "Other role (please specify)",
			type: "control_textbox",
		},
		null,
		null,
		{
			name: "notifyGuidance",
			qid: "36",
			text: "Notify guidance for review",
			type: "control_head",
		},
		{
			name: "input37",
			qid: "37",
			text: "Let us know about safety concerns and new information you have about our existing interventional procedures guidance.\nTell us about new evidence which you think might help the advisory committee reach a different decision.",
			type: "control_text",
		},
		{
			name: "whereIs38",
			qid: "38",
			text: "Where is the procedure being done?",
			type: "control_head",
		},
		{
			description: "",
			name: "inThe39",
			qid: "39",
			text: "In the NHS?",
			type: "control_radio",
		},
		{
			description: "",
			name: "pleaseGive40",
			qid: "40",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "inThe41",
			qid: "41",
			text: "In the private sector?",
			type: "control_radio",
		},
		{
			description: "",
			name: "inA42",
			qid: "42",
			text: "In a research setting?",
			type: "control_radio",
		},
		{
			description: "",
			name: "pleaseGive43",
			qid: "43",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "pleaseGive44",
			qid: "44",
			subLabel: "",
			text: "Please give details.",
			type: "control_textarea",
		},
		null,
		null,
		null,
		null,
		{
			description: "",
			name: "typeA",
			qid: "49",
			subLabel: "",
			text: "If you do not know that the procedure is currently in use in the UK, do you know of any clinicians or hospitals interested in using it?",
			type: "control_textarea",
		},
		null,
		{
			description: "",
			name: "ifYou51",
			qid: "51",
			subLabel: "",
			text: "Any other comments.",
			type: "control_textarea",
		},
		{
			name: "additionalInformation",
			qid: "52",
			text: "Additional information",
			type: "control_head",
		},
		{
			description: "",
			name: "ifYou53",
			qid: "53",
			subLabel: "",
			text: "Please declare any conflicts of interest.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "pleaseDeclare",
			qid: "54",
			subLabel: "",
			text: "Please declare any conflicts of interest.",
			type: "control_textarea",
		},
		{
			name: "additionalInformation55",
			qid: "55",
			text: "Additional information",
			type: "control_head",
		},
		{
			description: "",
			name: "anyOther",
			qid: "56",
			subLabel: "",
			text: "Any other comments.",
			type: "control_textarea",
		},
		{
			description: "",
			name: "ifYou57",
			qid: "57",
			subLabel: "",
			text: "If you do not know that the procedure is currently in use in the UK, do you know of any clinicians or hospitals interested in using it?",
			type: "control_textarea",
		},
		null,
		null,
		{
			name: "input60",
			qid: "60",
			text: "We’ll use the information you provide on this form to contact you about the outcome of your notification. If the notified procedure falls within the remit of the programme we’ll notify you when consultation starts.\nFor more information about how we use your data, view our privacy notice.",
			type: "control_text",
		},
		{
			name: "ltpgtweamprsquollUse",
			qid: "61",
			text: "We’ll use the information you provide on this form to contact you about the outcome of your notification. If the notified procedure falls within the remit of the programme we’ll notify you when consultation starts.\nFor more information about how we use your data, view our privacy notice.",
			type: "control_text",
		},
		null,
		null,
		{
			description: "",
			name: "brieflyDescribe64",
			qid: "64",
			subLabel:
				"Please cite any published papers, abstracts or trial protocol.",
			text: "Briefly describe the procedure",
			type: "control_textarea",
		},
		{
			description: "",
			name: "deviceAnd",
			qid: "65",
			subLabel: "",
			text: "Device and manufacturer name (if the procedure involves a device).",
			type: "control_textarea",
		},
		{
			description: "",
			name: "informationOn66",
			qid: "66",
			subLabel: "",
			text: "Information on comparator procedures.",
			type: "control_textarea",
		},
		null,
		null,
		{
			name: "input69",
			qid: "69",
			text: "Upload any published data and evidence in support of your submission.\nPlease include:\n\nyour name\nthe name of the procedure, or the name and number of our existing guidance you think should be reviewed\ndetails of any confidential information.\n",
			type: "control_text",
		},
		{
			description: "",
			name: "supportingInformation",
			qid: "70",
			subLabel: "Word, Excel, PDF.",
			text: "Supporting information.",
			type: "control_fileupload",
		},
		{
			name: "ltpgtuploadAny",
			qid: "71",
			text: "Upload any published data and evidence in support of your submission.\nPlease include:\n\nyour name\nthe name of the procedure, or the name and number of our existing guidance you think should be reviewed\ndetails of any confidential information.\n",
			type: "control_text",
		},
		null,
		null,
		null,
		{ name: "submit", qid: "75", text: "Submit", type: "control_button" },
		{ name: "submit76", qid: "76", text: "Submit", type: "control_button" },
		null,
		{
			name: "pageBreak",
			qid: "78",
			text: "Page Break",
			type: "control_pagebreak",
		},
	]);
}, 20);

// tag
JotForm.showJotFormPowered = "0";

//tag
JotForm.poweredByText = "Powered by Jotform";

//tag
var all_spc = document.querySelectorAll(
	"form[id='230793530776059'] .si" + "mple" + "_spc"
);
for (var i = 0; i < all_spc.length; i++) {
	all_spc[i].value = "230793530776059-230793530776059";
}

//tag
JotForm.ownerView = true;

//tag
JotForm.isAdmin = true;

//tag
window.GOOGLE_SIGNON =
	"172124630376-qk1qmdfmur2ojaf39e070iqhpt2foaip.apps.googleusercontent.com";

//tag
window.FACEBOOK_SIGNON_APP_ID = "1140740696088074";

//tag
window.MICROSOFT_SIGNON_CLIENT_ID = "482577e8-f8d0-4a09-bbbb-15de3d05eebe";

//tag
window.JotFormAPIEndpoint = "/API";

//tag
window.JFForm = {
	id: "230793530776059",
	draftID: "",
	skippable: true,
	isHipaa: "",
	enforceHIPAARuleSet: false,
};
