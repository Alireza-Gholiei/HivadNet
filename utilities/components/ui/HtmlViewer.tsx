export default function HtmlViewer({ html }: { html: string }) {
	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
