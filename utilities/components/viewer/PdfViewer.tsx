"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus, RefreshCcw } from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
	url: string;
	title?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [scale, setScale] = useState(1.2);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
		setPageNumber(1);
		setIsLoading(false);
		setHasError(false);
	};

	const onDocumentLoadError = () => {
		setHasError(true);
		setIsLoading(false);
	};

	const nextPage = () => {
		setPageNumber((prev) => Math.min(prev + 1, numPages));
	};

	const prevPage = () => {
		setPageNumber((prev) => Math.max(prev - 1, 1));
	};

	const zoomIn = () => {
		setScale((prev) => Math.min(prev + 0.2, 3));
	};

	const zoomOut = () => {
		setScale((prev) => Math.max(prev - 0.2, 0.6));
	};

	const resetZoom = () => {
		setScale(1.2);
	};

	if (hasError) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
				<p className="text-sm text-red-500">خطا در بارگذاری فایل PDF</p>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2">
				<div className="text-sm text-gray-600 truncate">{title || "PDF"}</div>

				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon" onClick={zoomOut} title="کوچک‌نمایی">
						<Minus className="h-4 w-4" />
					</Button>

					<span className="min-w-12 text-center text-xs text-gray-500">{Math.round(scale * 100)}%</span>

					<Button variant="ghost" size="icon" onClick={zoomIn} title="بزرگ‌نمایی">
						<Plus className="h-4 w-4" />
					</Button>

					<Button variant="ghost" size="icon" onClick={resetZoom} title="بازنشانی">
						<RefreshCcw className="h-4 w-4" />
					</Button>

					<div className="mx-2 h-5 w-px bg-gray-200" />

					<Button variant="ghost" size="icon" onClick={prevPage} disabled={pageNumber <= 1} title="صفحه قبل">
						<ChevronRight className="h-4 w-4" />
					</Button>

					<span className="min-w-20 text-center text-xs text-gray-500">
						{pageNumber} / {numPages || "-"}
					</span>

					<Button
						variant="ghost"
						size="icon"
						onClick={nextPage}
						disabled={pageNumber >= numPages}
						title="صفحه بعد"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-auto bg-gray-100 p-4">
				<div className="flex justify-center">
					<Document
						file={url}
						onLoadSuccess={onDocumentLoadSuccess}
						onLoadError={onDocumentLoadError}
						loading={
							<div className="flex items-center gap-2 text-gray-500">
								<Loader2 className="h-5 w-5 animate-spin" />
								<span>در حال بارگذاری PDF...</span>
							</div>
						}
					>
						<Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer loading="" />
					</Document>
				</div>

				{isLoading && <div className="mt-4 flex justify-center text-sm text-gray-500">در حال بارگذاری...</div>}
			</div>
		</div>
	);
};
