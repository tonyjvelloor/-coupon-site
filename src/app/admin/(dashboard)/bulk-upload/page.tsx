"use client";

import { useState, useRef } from "react";
import {
    Upload,
    FileSpreadsheet,
    Image,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    X,
} from "lucide-react";

type UploadType = "coupons" | "stores" | "images";

interface UploadResult {
    total: number;
    success: number;
    failed: number;
    errors?: { row?: number; filename?: string; error: string }[];
    uploaded?: { filename: string; url: string }[];
}

export default function BulkUploadPage() {
    const [activeTab, setActiveTab] = useState<UploadType>("coupons");
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<UploadResult | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tabs = [
        { id: "coupons" as const, label: "Coupons", icon: FileSpreadsheet },
        { id: "stores" as const, label: "Stores", icon: FileSpreadsheet },
        { id: "images" as const, label: "Images", icon: Image },
    ];

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        setResult(null);

        try {
            const formData = new FormData();

            if (activeTab === "images") {
                selectedFiles.forEach((file) => formData.append("files", file));
                formData.append("folder", "stores");
            } else {
                formData.append("file", selectedFiles[0]);
            }

            const response = await fetch(`/api/admin/bulk-upload/${activeTab}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                total: selectedFiles.length,
                success: 0,
                failed: selectedFiles.length,
                errors: [{ error: "Upload failed. Please try again." }],
            });
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = (type: string) => {
        window.open(`/api/admin/bulk-upload/template?type=${type}`, "_blank");
    };

    const clearSelection = () => {
        setSelectedFiles([]);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const acceptedFileTypes = activeTab === "images"
        ? "image/*"
        : ".xlsx,.xls,.csv";

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Bulk Upload
                </h1>
                <p className="text-gray-600 mt-1">
                    Upload multiple coupons, stores, or images at once
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            clearSelection();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                ? "bg-violet-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Upload {activeTab === "images" ? "Images" : "Excel File"}
                        </h2>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptedFileTypes}
                                multiple={activeTab === "images"}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">
                                Drag and drop your {activeTab === "images" ? "images" : "Excel file"} here
                            </p>
                            <p className="text-sm text-gray-500">
                                or click to browse
                            </p>
                        </div>

                        {/* Selected Files */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-700">
                                        Selected Files ({selectedFiles.length})
                                    </h3>
                                    <button
                                        onClick={clearSelection}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-700 truncate">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || isUploading}
                            className="mt-6 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload {activeTab === "images" ? "Images" : "Data"}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Upload Results
                            </h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-blue-600">{result.total}</p>
                                    <p className="text-sm text-blue-700">Total</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-green-600">{result.success}</p>
                                    <p className="text-sm text-green-700">Success</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4 text-center">
                                    <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                                    <p className="text-sm text-red-700">Failed</p>
                                </div>
                            </div>

                            {/* Uploaded Images */}
                            {result.uploaded && result.uploaded.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Uploaded Files</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {result.uploaded.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg"
                                            >
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-700 truncate">
                                                    {file.filename}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-auto">
                                                    {file.url}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Errors */}
                            {result.errors && result.errors.length > 0 && (
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Errors</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {result.errors.map((err, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2 bg-red-50 px-3 py-2 rounded-lg"
                                            >
                                                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-red-700">
                                                    {err.row ? `Row ${err.row}: ` : ""}
                                                    {err.filename ? `${err.filename}: ` : ""}
                                                    {err.error}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Templates & Instructions */}
                <div className="space-y-6">
                    {/* Download Templates */}
                    {activeTab !== "images" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Download Templates
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => downloadTemplate("coupons")}
                                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-violet-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Coupons Template</p>
                                        <p className="text-xs text-gray-500">Excel file with sample data</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => downloadTemplate("stores")}
                                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-violet-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Stores Template</p>
                                        <p className="text-xs text-gray-500">Excel file with sample data</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => downloadTemplate("categories")}
                                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-violet-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Categories Template</p>
                                        <p className="text-xs text-gray-500">Excel file with sample data</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-violet-50 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-violet-900 mb-2">
                                    {activeTab === "images" ? "Image Upload Tips" : "Excel Upload Tips"}
                                </h3>
                                <ul className="text-sm text-violet-800 space-y-1">
                                    {activeTab === "images" ? (
                                        <>
                                            <li>• Supported formats: JPG, PNG, WebP, GIF, SVG</li>
                                            <li>• Recommended size: 200x200px for logos</li>
                                            <li>• Files will be saved to /uploads/stores/</li>
                                            <li>• Use the generated URLs in your Excel data</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>• Download the template first</li>
                                            <li>• Keep column headers exactly as provided</li>
                                            <li>• For coupons, storeSlug must match an existing store</li>
                                            <li>• Use TRUE/FALSE for boolean values</li>
                                            <li>• Date format: YYYY-MM-DD</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
