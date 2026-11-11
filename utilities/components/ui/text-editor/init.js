const CreateScriptLoader = () => {
	let unique = 0;

	const uuid = (prefix) => {
		const time = Date.now();
		const random = Math.floor(Math.random() * 1000000000);
		unique++;
		return prefix + "_" + random + unique + String(time);
	};
	const state = {
		scriptId: uuid("tiny-script"),
		listeners: [],
		scriptLoaded: false,
	};

	const injectScript = (scriptId, doc, url, injectionCallback) => {
		const scriptTag = doc.createElement("script");
		scriptTag.referrerPolicy = "origin";
		scriptTag.type = "application/javascript";
		scriptTag.id = scriptId;
		scriptTag.src = url;

		const handler = () => {
			scriptTag.removeEventListener("load", handler);
			injectionCallback();
		};
		scriptTag.addEventListener("load", handler);
		if (doc.head) {
			doc.head.appendChild(scriptTag);
		}
	};

	const load = (doc, url, cb) => {
		if (state.scriptLoaded) {
			cb();
		} else {
			state.listeners.push(cb);
			if (!doc.getElementById(state.scriptId)) {
				injectScript(state.scriptId, doc, url, () => {
					state.listeners.forEach((fn) => fn());
					state.scriptLoaded = true;
				});
			}
		}
	};

	return {
		load,
	};
};

if (typeof window !== "undefined") {
	if (!window.tinymceBlazorLoader) {
		window.tinymceBlazorLoader = CreateScriptLoader();
	}
}

const getGlobal = () => {
	return typeof window !== "undefined" ? window : global;
};

const getTiny = () => {
	const global = getGlobal();
	return global && global.tinymce ? global.tinymce : null;
};

const updateTinyVal = (id, val) => {
	if (getTiny() && getTiny().get(id).getContent() !== val) {
		getTiny().get(id).setContent(val);
	}
};

const fetchApi = import("./fetch-event/index.js").then((module) => {
	return module.fetchEventSource;
});

const mentions_menu_complete = (editor, userInfo) => {
	const span = editor.getDoc().createElement("span");
	span.className = "mymention";
	span.setAttribute("data-mention-id", userInfo.id);
	span.appendChild(editor.getDoc().createTextNode("@" + userInfo.name));
	return span;
};

const mentions_select = (mention, success) => {
	const id = mention.getAttribute("data-mention-id");

	if (!userRequest[id]) {
		userRequest[id] = fakeServer.fetchUser(id);
	}
	userRequest[id].then((userDetail) => {
		const div = document.createElement("div");
		div.innerHTML =
			'<div class="card">' +
			'<img class="avatar" src="' +
			userDetail.image +
			'">' +
			"<h1>" +
			userDetail.fullName +
			"</h1>" +
			"<p>" +
			userDetail.description +
			"</p>" +
			"</div>";
		success(div);
	});
};

const useDarkMode = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
// eslint-disable-next-line unused-imports/no-unused-vars
const isSmallScreen = typeof window !== "undefined" ? window.matchMedia("(max-width: 1023.5px)").matches : false;

const ai_request = (request, respondWith) => {
	respondWith.stream((signal, streamMessage) => {
		const conversation = request.thread.flatMap((event) => {
			if (event.response) {
				return [
					{ role: "user", content: event.request.query },
					{ role: "assistant", content: event.response.data },
				];
			} else {
				return [];
			}
		});

		const systemMessages = request.system.map((content) => ({
			role: "system",
			content,
		}));

		const content =
			request.context.length === 0 || conversation.length > 0
				? request.query
				: `Question: ${request.query} Context: """${request.context}"""`;

		const messages = [...conversation, ...systemMessages, { role: "user", content }];

		let hasHead = false;
		let markdownHead = "";

		const hasMarkdown = (message) => {
			if (message.includes("`") && markdownHead !== "```") {
				const numBackticks = message.split("`").length - 1;
				markdownHead += "`".repeat(numBackticks);
				if (hasHead && markdownHead === "```") {
					markdownHead = "";
					hasHead = false;
				}
				return true;
			} else if (message.includes("html") && markdownHead === "```") {
				markdownHead = "";
				hasHead = true;
				return true;
			}
			return false;
		};

		const requestBody = {
			model: "gpt-4o",
			temperature: 0.7,
			max_tokens: 4000,
			messages,
			stream: true,
		};

		const openAiOptions = {
			signal,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer eyJhbGciOiJFUzM4NCJ9.eyJhdWQiOlsiaHR0cHM6Ly9vcGVuYWkuYWktZGVtby1wcm94eS50aW55LmNsb3VkLyJdLCJleHAiOjE3NTEzMjgwMDAsImh0dHBzOi8vb3BlbmFpLmFpLWRlbW8tcHJveHkudGlueS5jbG91ZC9yb2xlIjoicHVibGljLWRlbW8iLCJpc3MiOiJodHRwczovL2FpLWRlbW8tcHJveHkudGlueS5jbG91ZC8iLCJqdGkiOiJmOGFmY2EyNC1mN2FhLTQxMjktYTc2Yy02YThlZDU3YjAyZjYiLCJzdWIiOiJhaS1hc3Npc3RhbnQtZGVtbyJ9.Xu0apHCbxgmRQTeTqrTIDFFhh2CgKeARRXa3mCxSGoCwZqkoQaFRZBCzDo8Xz7DuUa5mW2XHl-HYcYiXJM9ly16d0oY7lJefHBeLlmJEBE1CSttHBkCRWZS8eFLCasL6`,
			},
			body: JSON.stringify(requestBody),
		};

		const onopen = async (response) => {
			if (response) {
				const contentType = response.headers.get("content-type");
				if (response.ok && contentType?.includes("text/event-stream")) {
					return;
				} else if (contentType?.includes("application/json")) {
					const data = await response.json();
					if (data.error) {
						throw new Error(`${data.error.type}: ${data.error.message}`);
					}
				}
			} else {
				throw new Error("Failed to communicate with the ChatGPT API");
			}
		};

		const onmessage = (ev) => {
			const data = ev.data;
			if (data !== "[DONE]") {
				const parsedData = JSON.parse(data);
				const firstChoice = parsedData?.choices[0];
				const message = firstChoice?.delta?.content;
				if (message && message !== "") {
					if (!hasMarkdown(message)) {
						streamMessage(message);
					}
				}
			}
		};

		const onerror = (error) => {
			throw error;
		};

		return fetchApi
			.then((fetchEventSource) =>
				fetchEventSource("https://openai.ai-demo-proxy.tiny.cloud/v1/chat/completions", {
					...openAiOptions,
					openWhenHidden: true,
					onopen,
					onmessage,
					onerror,
				}),
			)
			.then(async (response) => {
				if (response && !response.ok) {
					const data = await response.json();
					if (data.error) {
						throw new Error(`${data.error.type}: ${data.error.message}`);
					}
				}
			})
			.catch(onerror);
	});
};

const fetchRevisions = () => {
	return Promise.resolve([
		{
			revisionId: "3",
			createdAt: "2023-11-24T22:26:21.578Z",
			author: {
				id: "husky",
				name: "A Tiny Husky",
				avatar: "../_images/tiny-husky.jpg",
			},
			content: `
              <p><img style="display: block; margin-left: auto; margin-right: auto;" title="Tiny Logo" src="https://www.tiny.cloud/docs/images/logos/android-chrome-256x256.png" alt="TinyMCE Logo" width="128" height="128"></p>
              <h2 style="text-align: center;">Welcome to the TinyMCE editor demo!</h2>
              <h2>A simple table to play with</h2>
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <thead>
              <tr>
              <th>Product</th>
              <th>Cost</th>
              <th>Really?</th>
              </tr>
              </thead>
              <tbody>
              <tr>
              <td>TinyMCE</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              <tr>
              <td>Plupload</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              </tbody>
              </table>
              <h2>Found a bug?</h2>
              <p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>
              <h2>Finally ...</h2>
              <p><s>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank" rel="noopener">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</s></p>
              <p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>
            `,
		},
		{
			revisionId: "2",
			createdAt: "2023-11-25T08:30:21.578Z",
			author: {
				id: "tiny.user",
				name: "A Tiny User",
				avatar: "../_images/logos/android-chrome-192x192.png",
			},
			content: `
              <p><img style="display: block; margin-left: auto; margin-right: auto;" title="Tiny Logo" src="https://www.tiny.cloud/docs/images/logos/android-chrome-256x256.png" alt="TinyMCE Logo" width="128" height="128"></p>
              <h2 style="text-align: center;">Welcome to the TinyMCE editor demo!</h2>
              <h2>Got questions or need help?</span></h2>
              <ol>
              <li>Our <a href="../">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
              <li>Have a specific question? Try the <a href="https://stackoverflow.com/questions/tagged/tinymce" target="_blank" rel="noopener"><code>tinymce</code> tag at Stack Overflow</a>.</li>
              <li>We also offer enterprise grade support as part of <a href="../../../../pricing">TinyMCE premium plans</a>.</li>
              </ol>
              <h2>A simple table to play with</h2>
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <thead>
              <tr>
              <th>Product</th>
              <th>Cost</th>
              <th>Really?</th>
              </tr>
              </thead>
              <tbody>
              <tr>
              <td>TinyMCE</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              <tr>
              <td>Plupload</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              </tbody>
              </table>
              <h2>Found a bug?</h2>
              <p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>
              <h2>Finally ...</h2>
              <p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank" rel="noopener">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p>
              <p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>
            `,
		},
		{
			revisionId: "1",
			createdAt: "2023-11-29T10:11:21.578Z",
			author: {
				id: "tiny.user",
				name: "A Tiny User",
				avatar: "../_images/logos/android-chrome-192x192.png",
			},
			content: `
              <p><img style="display: block; margin-left: auto; margin-right: auto;" title="Tiny Logo" src="https://www.tiny.cloud/docs/images/logos/android-chrome-256x256.png" alt="TinyMCE Logo" width="128" height="128"></p>
              <h2 style="text-align: center;">Welcome to the TinyMCE editor demo!</h2>
              <h2>Got questions or need help?</h2>
              <ul>
              <li>Our <a href="../index.html">documentation</a> is a great resource for learning how to configure TinyMCE.</li>
              <li>Have a specific question? Try the <a href="https://stackoverflow.com/questions/tagged/tinymce" target="_blank" rel="noopener"><code>tinymce</code> tag at Stack Overflow</a>.</li>
              <li>We also offer enterprise grade support as part of <a href="../../../../pricing">TinyMCE premium plans</a>.</li>
              </ul>
              <h2>A simple table to play with</h2>
              <table style="border-collapse: collapse; width: 100%;" border="1">
              <thead>
              <tr>
              <th>Product</th>
              <th>Cost</th>
              <th>Really?</th>
              </tr>
              </thead>
              <tbody>
              <tr>
              <td>TinyMCE</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              <tr>
              <td>Plupload</td>
              <td>Free</td>
              <td>YES!</td>
              </tr>
              </tbody>
              </table>
              <h2>Found a bug?</h2>
              <p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p>
              <h2>Finally ...</h2>
              <p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank" rel="noopener">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p>
              <p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>
            `,
		},
	]);
};

const tinyEventHandler = (() => {
	const eventCache = {};
	const bindEvent = (editor, event, fn) => {
		if (!eventCache[editor.id]) eventCache[editor.id] = [];
		eventCache[editor.id].push({ name: event, fn });
		editor.on(event, fn);
	};
	const unbindEditor = (editorId) => {
		const editor = getTiny().get(editorId);
		eventCache[editorId].forEach((event) => {
			editor.off(event.name, event.fn);
		});
		delete eventCache.editorId;
	};
	return {
		bindEvent,
		unbindEditor,
	};
})();

const chunkMap = (() => {
	const map = new Map();
	const next = (streamId, editorId, val, index, size) => {
		const acc = (map.has(streamId) ? map.get(streamId) : "") + val;
		if (index === size) {
			updateTinyVal(editorId, acc);
			map.delete(streamId);
		} else {
			map.set(streamId, acc);
		}
	};
	return {
		push: next,
	};
})();

export const tinymceBlazorWrapper = {
	insertContent: (id, content, args) => {
		const tiny = getTiny().get(id);
		tiny?.insertContent(content, args);
	},
	updateMode: (id, disable) => {
		const tinyGlobal = getTiny();
		if (!tinyGlobal) return;

		const tiny = tinyGlobal.get(id);
		if (!tiny) return;

		if (tiny.mode && typeof tiny.mode.set === "function") {
			tiny.mode.set(disable ? "readonly" : "design");
		} else {
			tiny.setMode(disable ? "readonly" : "design");
		}
	},
	updateValue: (id, streamId, value, index, chunks) => {
		chunkMap.push(streamId, id, value, index, chunks);
	},
	init: (el, blazorConf, dotNetRef) => {
		const chunkSize = 16 * 1024;
		const update = (format, content) => {
			const updateFn = format === "text" ? "UpdateText" : "UpdateModel";
			const chunks = Math.floor(content.length / chunkSize) + 1;
			const streamId = (Date.now() % 100000) + "";
			for (let i = 0; i < chunks; i++) {
				const chunk = content.substring(chunkSize * i, chunkSize * (i + 1));
				dotNetRef.invokeMethodAsync(updateFn, streamId, i + 1, chunk, chunks);
			}
		};
		const getJsObj = (objectPath) => {
			const jsConf =
				objectPath !== null && typeof objectPath === "string"
					? objectPath.split(".").reduce((acc, current) => {
							return acc !== undefined ? acc[current] : undefined;
						}, window)
					: undefined;
			return jsConf !== undefined && typeof jsConf === "object" ? jsConf : {};
		};
		const tinyConf = {
			...getJsObj(blazorConf.jsConf),
			...blazorConf.conf,
			plugins:
				"ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown revisionhistory importword exportword exportpdf",
			editimage_cors_hosts: ["picsum.photos"],
			tinydrive_token_provider: (success, _failure) => {
				success({
					token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Ks_BdfH4CWilyzLNk8S2gDARFhuxIauLa8PwhdEQhEo",
				});
			},
			// tinydrive_demo_files_url: './wwwroot/images/demo_files.json',
			tinydrive_dropbox_app_key: "jee1s9eykoh752j",
			tinydrive_google_drive_key: "AIzaSyAsVRuCBc-BLQ1xNKtnLHB3AeoK-xmOrTc",
			tinydrive_google_drive_client_id:
				"748627179519-p9vv3va1mppc66fikai92b3ru73mpukf.apps.googleusercontent.com",
			mobile: {
				plugins:
					"ai preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate",
			},
			menu: {
				tc: {
					title: "Comments",
					items: "addcomment showcomments deleteallconversations",
				},
			},
			menubar: "file edit view insert format tools table tc help",
			toolbar:
				"undo redo | importword exportword exportpdf | revisionhistory | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table math media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck", // Note: if a toolbar item requires a plugin, the item will not present in the toolbar if the plugin is not also loaded.
			language_url: "/tinymce/langs/fa.js",
			language: "fa",
			directionality: "rtl",
			placeholder: "Type here...",
			autosave_ask_before_unload: true,
			autosave_interval: "30s",
			autosave_prefix: "{path}{query}-{id}-",
			autosave_restore_when_empty: false,
			autosave_retention: "2m",
			image_advtab: true,
			typography_default_lang: "en-US",
			typography_langs: ["en-US", "es", "de"],
			typography_rules: [
				"common/punctuation/quote",
				"en-US/dash/main",
				"common/nbsp/afterParagraphMark",
				"common/nbsp/afterSectionMark",
				"common/nbsp/afterShortWord",
				"common/nbsp/beforeShortLastNumber",
				"common/nbsp/beforeShortLastWord",
				"common/nbsp/dpi",
				"common/punctuation/apostrophe",
				"common/space/delBeforePunctuation",
				"common/space/afterComma",
				"common/space/afterColon",
				"common/space/afterExclamationMark",
				"common/space/afterQuestionMark",
				"common/space/afterSemicolon",
				"common/space/beforeBracket",
				"common/space/bracket",
				"common/space/delBeforeDot",
				"common/space/squareBracket",
				"common/number/mathSigns",
				"common/number/times",
				"common/number/fraction",
				"common/symbols/arrow",
				"common/symbols/cf",
				"common/symbols/copy",
				"common/punctuation/delDoublePunctuation",
				"common/punctuation/hellip",
			],
			typography_ignore: ["code"],
			link_list: [
				{ title: "My page 1", value: "https://www.tiny.cloud" },
				{ title: "My page 2", value: "http://www.moxiecode.com" },
			],
			image_list: [
				{ title: "My page 1", value: "https://www.tiny.cloud" },
				{ title: "My page 2", value: "http://www.moxiecode.com" },
			],
			image_class_list: [
				{ title: "None", value: "" },
				{ title: "Some class", value: "class-name" },
			],
			importcss_append: true,
			height: 600,
			image_caption: true,
			quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
			noneditable_class: "mceNonEditable",
			toolbar_mode: "sliding",
			spellchecker_ignore_list: ["Ephox", "Moxiecode", "tinymce", "TinyMCE"],
			tinycomments_mode: "embedded",
			content_style: `
				.mymention { color: gray; }
				
				@font-face {
					font-family: IRANSans;
					src: url("/fonts/IRANSans/ttf/IRANSans-Regular.ttf");
					src:
						url("/fonts/IRANSans/ttf/IRANSans-Regular.ttf?#iefix") format("embedded-opentype"),
						url("/fonts/IRANSans/woff2/IRANSans-Regular.woff2") format("woff2"),
						url("/fonts/IRANSans/woff/IRANSans-Regular.woff") format("woff"),
						url("/fonts/IRANSans/ttf/IRANSans-Regular.ttf") format("truetype");
					font-weight: normal;
					font-style: normal;
					font-display: fallback;
				}

				@font-face {
					font-family: IRANSans;
					src: url("/fonts/IRANSans/ttf/IRANSans-Bold.ttf");
					src:
						url("/fonts/IRANSans/ttf/IRANSans-Bold.ttf?#iefix") format("embedded-opentype"),
						url("/fonts/IRANSans/woff2/IRANSans-Bold.woff2") format("woff2"),
						url("/fonts/IRANSans/woff/IRANSans-Bold.woff") format("woff"),
						url("/fonts/IRANSans/ttf/IRANSans-Bold.ttf") format("truetype");
					font-weight: bold;
					font-style: normal;
					font-display: fallback;
				}

				@font-face {
					font-family: IRANSans;
					src: url("/fonts/IRANSans/ttf/IRANSans-Thin.ttf");
					src:
						url("/fonts/IRANSans/ttf/IRANSans-Thin.ttf?#iefix") format("embedded-opentype"),
						url("/fonts/IRANSans/woff2/IRANSans-Thin.woff2") format("woff2"),
						url("/fonts/IRANSans/woff/IRANSans-Thin.woff") format("woff"),
						url("/fonts/IRANSans/ttf/IRANSans-Thin.ttf") format("truetype");
					font-weight: 100;
					font-style: normal;
					font-display: fallback;
				}

				@font-face {
					font-family: IRANSans;
					src: url("/fonts/IRANSans/ttf/IRANSans-Light.ttf");
					src:
						url("/fonts/IRANSans/ttf/IRANSans-Light.ttf?#iefix") format("embedded-opentype"),
						url("/fonts/IRANSans/woff2/IRANSans-Light.woff2") format("woff2"),
						url("/fonts/IRANSans/woff/IRANSans-Light.woff") format("woff"),
						url("/fonts/IRANSans/ttf/IRANSans-Light.ttf") format("truetype");
					font-weight: 300;
					font-style: normal;
					font-display: fallback;
				}

				@font-face {
					font-family: IRANSans;
					src: url("/fonts/IRANSans/ttf/IRANSans-Medium.ttf");
					src:
						url("/fonts/IRANSans/ttf/IRANSans-Medium.ttf?#iefix") format("embedded-opentype"),
						url("/fonts/IRANSans/woff2/IRANSans-Medium.woff2") format("woff2"),
						url("/fonts/IRANSans/woff/IRANSans-Medium.woff") format("woff"),
						url("/fonts/IRANSans/ttf/IRANSans-Medium.ttf") format("truetype");
					font-weight: 500;
					font-style: normal;
					font-display: fallback;
				}

				body {
					font-family: 'IRANSans', Tahoma, Arial, sans-serif !important;
					font-size: 16px;
					line-height: 1.6;
				}
			`,
			contextmenu: "link image editimage table spellchecker configurepermanentpen",
			a11y_advanced_options: true,
			skin: useDarkMode ? "oxide-dark" : "oxide",
			content_css: useDarkMode ? "dark" : "default",
			mentions_selector: ".mymention",
			// mentions_fetch: mentions_fetch,
			// mentions_menu_hover: mentions_menu_hover,
			mentions_menu_complete: mentions_menu_complete,
			mentions_select: mentions_select,
			mentions_item_type: "profile",
			autocorrect_capitalize: true,
			mergetags_list: [
				{
					title: "Client",
					menu: [
						{
							value: "Client.LastCallDate",
							title: "Call date",
						},
						{
							value: "Client.Name",
							title: "Client name",
						},
					],
				},
				{
					title: "Proposal",
					menu: [
						{
							value: "Proposal.SubmissionDate",
							title: "Submission date",
						},
					],
				},
				{
					value: "Consultant",
					title: "Consultant",
				},
				{
					value: "Salutation",
					title: "Salutation",
				},
			],
			ai_request,
			exportpdf_converter_options: {
				format: "Letter",
				margin_top: "1in",
				margin_right: "1in",
				margin_bottom: "1in",
				margin_left: "1in",
			},
			exportword_converter_options: {
				document: {
					size: "Letter",
				},
			},
			importword_converter_options: {
				formatting: {
					styles: "inline",
					resets: "inline",
					defaults: "inline",
				},
			},
			revisionhistory_fetch: fetchRevisions,
			revisionhistory_author: {
				id: "john.doe",
				name: "John Doe",
			},
			revisionhistory_display_author: true,
		};
		if (blazorConf.licenseKey) {
			tinyConf.license_key = blazorConf.licenseKey;
		}
		tinyConf.inline = blazorConf.inline;
		tinyConf.readonly = blazorConf.disabled;
		tinyConf.target = el;

		tinyConf._setup = tinyConf.setup;
		tinyConf.setup = (editor) => {
			tinyEventHandler.bindEvent(editor, "init", () =>
				dotNetRef.invokeMethodAsync("GetValue").then((value) => {
					editor.setContent(value);
				}),
			);
			tinyEventHandler.bindEvent(editor, "change", () => {
				dotNetRef.invokeMethodAsync("OnChange");
			});
			tinyEventHandler.bindEvent(editor, "input", () => {
				dotNetRef.invokeMethodAsync("OnInput");
			});

			tinyEventHandler.bindEvent(editor, "setcontent", () =>
				update("text", editor.getContent({ format: "text" })),
			);
			tinyEventHandler.bindEvent(editor, blazorConf.modelEvents, () => {
				update("html", editor.getContent());
				update("text", editor.getContent({ format: "text" }));
			});

			if (tinyConf._setup && typeof tinyConf._setup === "function") {
				tinyConf._setup(editor, tinyEventHandler);
			}
		};

		if (getTiny()) {
			getTiny().init(tinyConf);
		} else {
			if (el && el.ownerDocument) {
				window.tinymceBlazorLoader.load(el.ownerDocument, blazorConf.src, () => {
					getTiny().init(tinyConf);
				});
			}
		}
	},
	destroy: (el, id) => {
		if (getTiny() && getTiny().get(id)) {
			tinyEventHandler.unbindEditor(id);
			getTiny().get(id).remove();
		}
	},
};
