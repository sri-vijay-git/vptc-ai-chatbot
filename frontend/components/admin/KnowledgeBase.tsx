"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Upload, FileText, Trash2, AlertCircle, CheckCircle, Clock, BookOpen } from "lucide-react";
import api from "@/lib/api";

interface Document {
    id: string;
    filename: string;
    uploaded_at: string;
}

export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get("/admin/documents");
            setDocuments(res.data);
            setError("");
        } catch (err: any) {
            console.error("Failed to fetch documents", err);
            setError("Failed to load documents. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
            setError("Only PDF documents are supported.");
            return;
        }

        setUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/admin/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccess(`Successfully uploaded and trained AI on "${file.name}"`);
            fetchDocuments();
        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.response?.data?.detail || "An error occurred while uploading. Ensure the document is readable.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string, filename: string) => {
        try {
            await api.delete(`/admin/documents/${id}`);
            setSuccess(`Successfully deleted "${filename}" and removed its knowledge from AI.`);
            fetchDocuments();
            setDeleteConfirmId(null);
        } catch (err) {
            console.error("Delete failed", err);
            setError("Failed to delete document.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                Loading knowledge base...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-[#2563eb]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#0a1628]">Knowledge Base</h2>
                            <p className="text-sm text-gray-500">Manage documents that the AI learns from</p>
                        </div>
                    </div>
                    
                    <div>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className={`flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            {uploading ? 'Processing & Learning...' : 'Upload PDF Document'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>{success}</div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-blue-100 bg-blue-50/50">
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Document Name</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Uploaded At</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FileText className="w-12 h-12 mb-3 text-gray-300" />
                                            <p className="font-medium text-gray-500">No documents found.</p>
                                            <p className="text-sm mt-1">Upload a PDF to start training the AI.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 border border-gray-200 rounded text-red-500 bg-white">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-[#0a1628]">{doc.filename}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {new Date(doc.uploaded_at).toLocaleString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {deleteConfirmId === doc.id ? (
                                                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-1.5 px-3 w-max">
                                                    <span className="text-sm text-red-600 font-medium mr-1 border-r border-red-200 pr-2">Delete permanently?</span>
                                                    <button 
                                                        onClick={() => handleDelete(doc.id, doc.filename)}
                                                        className="text-white bg-red-600 hover:bg-red-700 font-bold text-xs px-2 py-1 rounded"
                                                    >
                                                        Yes
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="text-gray-600 hover:bg-gray-200 font-bold text-xs px-2 py-1 rounded"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setDeleteConfirmId(doc.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent shadow-sm hover:border-red-100 flex items-center gap-2 text-sm font-medium focus:outline-none"
                                                    title="Delete Document"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
