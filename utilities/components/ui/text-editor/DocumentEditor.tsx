"use client";

import React, { useEffect, useRef } from "react";
import { tinymceBlazorWrapper } from "./init.js";

interface TinyMceBlazorAdapterProps {
	id?: string;
	value: string;
	onChange: (value: string) => void;
	onTextChange?: (value: string) => void | null;
	disabled?: boolean;
}

export const DocumentEditor: React.FC<TinyMceBlazorAdapterProps> = ({
	id = "archive-document-editor",
	value,
	onChange,
	onTextChange,
	disabled = false,
}) => {
	const editorRef = useRef<HTMLTextAreaElement>(null);

	const valueRef = useRef(value);
	const chunkMapRef = useRef(new Map<string, string>());
	const textChunkMapRef = useRef(new Map());

	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	useEffect(() => {
		tinymceBlazorWrapper.updateMode(id, disabled);
	}, [disabled, id]);

	useEffect(() => {
		if (typeof window === "undefined" || !editorRef.current) return;

		const el = editorRef.current;

		if (id) {
			el.id = id;
		}

		const dotNetRef = {
			invokeMethodAsync: async (methodName: string, ...args: any[]) => {
				if (methodName === "GetValue") {
					return valueRef.current || "";
				}

				if (methodName === "UpdateModel") {
					const [streamId, chunkIndex, chunk, totalChunks] = args;

					const currentAcc = chunkMapRef.current.get(streamId) || "";
					const newAcc = currentAcc + chunk;

					if (chunkIndex === totalChunks) {
						onChange(newAcc);
						chunkMapRef.current.delete(streamId);
					} else {
						chunkMapRef.current.set(streamId, newAcc);
					}
				}

				if (methodName === "UpdateText") {
					const [streamId, chunkIndex, chunk, totalChunks] = args;

					const currentAcc = textChunkMapRef.current.get(streamId) || "";
					const newAcc = currentAcc + chunk;

					if (chunkIndex === totalChunks) {
						if (onTextChange) {
							onTextChange(newAcc);
						}

						textChunkMapRef.current.delete(streamId);
					} else {
						textChunkMapRef.current.set(streamId, newAcc);
					}
				}
			},
		};

		const blazorConf = {
			src: "/tinymce/tinymce.js",
			jsConf: null,
			inline: false,
			modelEvents: "change input undo redo",
			disabled: false,
			conf: {
				directionality: "rtl",
				content_style: `
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
			},
		};

		tinymceBlazorWrapper.init(el, blazorConf, dotNetRef);

		return () => {
			if (tinymceBlazorWrapper && el) {
				tinymceBlazorWrapper.destroy(el, el.id);
			}
		};
	}, [id]);

	return (
		<div className="w-full" style={{ minHeight: "600px" }}>
			<textarea ref={editorRef} style={{ visibility: "hidden" }} />
		</div>
	);
};
