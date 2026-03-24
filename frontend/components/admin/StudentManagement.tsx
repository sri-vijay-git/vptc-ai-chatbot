"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, Check, AlertTriangle, Users } from "lucide-react";
import api from "@/lib/api";

interface Student {
    id: string;
    email: string;
    full_name: string;
    roll_no: string;
    department: string;
    semester: string;
    cgpa: number;
    attendance: number;
    created_at: string;
}

export default function StudentManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal states
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/admin/students");
            setStudents(res.data);
        } catch (err) {
            console.error("Failed to fetch students", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;
        
        try {
            await api.put(`/admin/students/${editingStudent.id}`, {
                full_name: editingStudent.full_name,
                roll_no: editingStudent.roll_no,
                department: editingStudent.department,
                semester: editingStudent.semester,
                cgpa: Number(editingStudent.cgpa),
                attendance: Number(editingStudent.attendance)
            });
            
            // Refresh list
            fetchStudents();
            setEditingStudent(null);
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update student profile.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/admin/students/${id}`);
            // Refresh list
            fetchStudents();
            setDeleteConfirmId(null);
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete student account.");
        }
    };

    const filteredStudents = students.filter(s => 
        (s.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.roll_no || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                Loading student records...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-[#2563eb]" />
                        <h2 className="text-xl font-bold text-[#0a1628]">Student Directory</h2>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search by name, roll no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-blue-100 bg-blue-50/50">
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Name & Email</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Roll No</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Dept / Sem</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">CGPA</th>
                                <th className="py-3 px-4 font-semibold text-[#1e3a5f]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-[#0a1628]">{student.full_name || "Unknown"}</div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="py-3 px-4 text-[#1e3a5f] font-medium">
                                            {student.roll_no}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-[#0a1628]">{student.department !== "Not Set" ? student.department : "—"}</div>
                                            <div className="text-sm text-gray-500">{student.semester !== "Not Set" ? student.semester : "—"}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                Number(student.cgpa) >= 8.5 ? "bg-green-100 text-green-700" :
                                                Number(student.cgpa) >= 7.0 ? "bg-blue-100 text-blue-700" :
                                                Number(student.cgpa) > 0 ? "bg-yellow-100 text-yellow-700" :
                                                "bg-gray-100 text-gray-600"
                                            }`}>
                                                {Number(student.cgpa) > 0 ? Number(student.cgpa).toFixed(2) : "N/A"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => setEditingStudent({...student})}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                    title="Edit Student"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                
                                                {deleteConfirmId === student.id ? (
                                                    <div className="flex items-center gap-1 bg-red-100 rounded px-2">
                                                        <button 
                                                            onClick={() => handleDelete(student.id)}
                                                            className="p-1 text-red-700 hover:text-red-900 font-bold text-xs"
                                                            title="Confirm Delete"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteConfirmId(null)}
                                                            className="p-1 text-gray-500 hover:text-gray-700 font-bold text-xs"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setDeleteConfirmId(student.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete Account"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#0a1628] text-white">
                            <h3 className="font-semibold text-lg">Edit Student Profile</h3>
                            <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={editingStudent.full_name} 
                                    onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2563eb] outline-none" 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
                                    <input 
                                        type="text" 
                                        value={editingStudent.roll_no} 
                                        onChange={(e) => setEditingStudent({...editingStudent, roll_no: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2563eb] outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input 
                                        type="text" 
                                        value={editingStudent.department} 
                                        onChange={(e) => setEditingStudent({...editingStudent, department: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2563eb] outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                    <input 
                                        type="text" 
                                        value={editingStudent.semester} 
                                        onChange={(e) => setEditingStudent({...editingStudent, semester: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2563eb] outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                                    <input 
                                        type="number" step="0.01" min="0" max="10"
                                        value={editingStudent.cgpa} 
                                        onChange={(e) => setEditingStudent({...editingStudent, cgpa: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2563eb] outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white rounded font-medium shadow transition-colors flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
