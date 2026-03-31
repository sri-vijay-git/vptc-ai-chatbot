"use client";

import { useState, useEffect } from "react";
import { Users, LogOut, CheckCircle, Save, Filter, User, Edit, X, Book, Award, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

export default function StaffDashboard() {
    const router = useRouter();
    const [staffData, setStaffData] = useState({ name: "Staff", department: "", id: "" });
    const [isEditingDept, setIsEditingDept] = useState(false);
    
    // Students handling
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Attendance mapping: student_id -> "Present" | "Absent"
    const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Staff Edit Student Modal
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [academicRecord, setAcademicRecord] = useState<any>({ courses: [], marks_history: [] });
    const [isLoadingRecord, setIsLoadingRecord] = useState(false);

    const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: 3 });
    const [newMark, setNewMark] = useState({ subject: "", obtained_marks: "", total_marks: "100" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!token) {
            router.push("/login");
            return;
        }
        if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj.role !== "staff" && userObj.role !== "admin") {
                router.push("/");
                return;
            }
            setStaffData(prev => ({ ...prev, name: userObj.full_name || "Staff Member", id: userObj.id }));
        }
        fetchStaffProfile();
    }, [router]);

    const fetchStaffProfile = async () => {
        try {
            const res = await api.get("/student/profile");
            const dept = res.data.department;
            if (dept && dept !== "Not Set") {
                setStaffData(prev => ({ ...prev, department: dept }));
                fetchAssignedStudents(dept);
            } else {
                setIsEditingDept(true);
            }
        } catch (e) {
            console.error("Failed to fetch staff profile", e);
        }
    };

    const handleSaveDepartment = async () => {
        if (!staffData.department) return;
        try {
            await api.post("/student/profile", { department: staffData.department });
            setIsEditingDept(false);
            fetchAssignedStudents(staffData.department);
        } catch (e) {
            alert("Failed to save department setting.");
        }
    };

    const fetchAssignedStudents = async (department: string) => {
        setLoading(true);
        try {
            const res = await api.get(`/staff/students?department=${encodeURIComponent(department)}`);
            setStudents(res.data);
            
            const initialMap: Record<string, string> = {};
            res.data.forEach((s: any) => {
                initialMap[s.id] = "Present";
            });
            setAttendanceMap(initialMap);
        } catch (e) {
            console.error("Failed to fetch students", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId: string, status: string) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmitAttendance = async () => {
        setIsSubmitting(true);
        try {
            const records = students.map(s => ({
                student_id: s.id,
                student_email: s.id,
                status: attendanceMap[s.id]
            }));
            
            await api.post("/staff/attendance", { records });
            alert("Attendance successfully recorded!");
            fetchAssignedStudents(staffData.department);
        } catch (e) {
            alert("Failed to save attendance.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
    };

    // --- Academic Record Management Functions ---
    const handleManageStudent = async (student: any) => {
        setSelectedStudent(student);
        setIsLoadingRecord(true);
        try {
            const res = await api.get(`/staff/student/${student.id}/academic`);
            setAcademicRecord(res.data);
        } catch (e) {
            alert("Failed to fetch academic record.");
        } finally {
            setIsLoadingRecord(false);
        }
    };

    const handleSaveAcademicRecord = async (updatedRecord: any) => {
        try {
            await api.post(`/staff/student/${selectedStudent.id}/academic`, updatedRecord);
            setAcademicRecord(updatedRecord);
        } catch (e) {
            alert("Failed to auto-save changes.");
        }
    };

    const handleAddCourse = () => {
        if (!newCourse.code || !newCourse.name) return;
        const updated = { 
            ...academicRecord, 
            courses: [...(academicRecord.courses || []), { ...newCourse, id: Date.now().toString() }] 
        };
        handleSaveAcademicRecord(updated);
        setNewCourse({ code: "", name: "", credits: 3 });
    };

    const handleDeleteCourse = (courseId: string) => {
        if (!confirm("Remove this course from student's record?")) return;
        const updated = { 
            ...academicRecord, 
            courses: (academicRecord.courses || []).filter((c: any) => c.id !== courseId) 
        };
        handleSaveAcademicRecord(updated);
    };

    const handleAddMark = () => {
        if (!newMark.subject || !newMark.obtained_marks || !newMark.total_marks) return;
        const updated = { 
            ...academicRecord, 
            marks_history: [...(academicRecord.marks_history || []), { ...newMark, id: Date.now().toString(), date: new Date().toISOString() }] 
        };
        handleSaveAcademicRecord(updated);
        setNewMark({ subject: "", obtained_marks: "", total_marks: "100" });
    };

    const handleDeleteMark = (markId: string) => {
        if (!confirm("Delete this exam mark record?")) return;
        const updated = { 
            ...academicRecord, 
            marks_history: (academicRecord.marks_history || []).filter((m: any) => m.id !== markId) 
        };
        handleSaveAcademicRecord(updated);
    };

    const closeManageModal = () => {
        setSelectedStudent(null);
    };

    const DEPARTMENTS = [
        "1st Year Staff (S&H)",
        "Computer Engineering (CSE)",
        "Electronics and Comm. Engineering (ECE)",
        "Electrical and Electronics Engineering (EEE)",
        "Mechanical Engineering",
        "Civil Engineering"
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md flex-shrink-0">
                                <Image src="/logo.png" alt="VPTC Logo" fill className="object-cover" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Staff Portal</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {staffData.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 py-8">
                {isEditingDept ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-700/50 p-8 max-w-xl mx-auto text-center">
                        <Filter className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Configure Your Department</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Please select which department you handle. 1st Year (S&H) staff will see all 1st year students.</p>
                        
                        <select 
                            value={staffData.department}
                            onChange={(e) => setStaffData({...staffData, department: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500 mb-6"
                        >
                            <option value="">-- Select Your Department --</option>
                            {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleSaveDepartment}
                            disabled={!staffData.department}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Save Setting
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-yellow-500" />
                                    Assigned Students: {students.length}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                    Tracking Department: <span className="font-semibold text-gray-800 dark:text-gray-200">{staffData.department}</span>
                                    <button onClick={() => setIsEditingDept(true)} className="text-xs text-yellow-600 hover:underline ml-2">(Change)</button>
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleSubmitAttendance}
                                disabled={isSubmitting || students.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg shadow disabled:opacity-50 transition-transform transform active:scale-95"
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? "Saving..." : "Submit Daily Attendance"}
                            </button>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {loading ? (
                                <div className="p-12 text-center text-gray-500 dark:text-gray-400">Loading your students...</div>
                            ) : students.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    No students matched in your tracking department yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Reg & Roll No</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Student Profile</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Past Attendance Total</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Today's Attendance</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => {
                                                const attTotal = student.total_classes || 0;
                                                const attPresent = student.present_classes || 0;
                                                const attPercent = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : 0;
                                                
                                                return (
                                                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition-colors">
                                                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                                                            <div>{student.reg_no || "Reg: N/A"}</div>
                                                            <div className="text-xs text-gray-500 mt-1">{student.roll_no || "Roll: N/A"}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                                            <div className="font-medium text-gray-900 dark:text-white text-sm">{student.name || "Unknown Student"}</div>
                                                            <div className="text-xs text-gray-500 mt-1">{student.email || student.id}</div>
                                                            <div className="text-xs text-gray-400 mt-0.5">Sem {student.semester || "N/A"}</div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className={`text-sm font-bold ${attPercent >= 75 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                                    {attPercent}%
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    ({attPresent}/{attTotal} days)
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${attendanceMap[student.id] === 'Present' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500 group-hover:border-green-400'}`}>
                                                                        {attendanceMap[student.id] === 'Present' && <CheckCircle className="w-3 h-3" />}
                                                                    </div>
                                                                    <input 
                                                                        type="radio" 
                                                                        checked={attendanceMap[student.id] === 'Present'}
                                                                        onChange={() => handleAttendanceChange(student.id, "Present")}
                                                                        className="hidden" 
                                                                    />
                                                                    <span className={`hidden sm:inline text-sm font-medium ${attendanceMap[student.id] === 'Present' ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>P</span>
                                                                </label>
                                                                
                                                                <label className="flex items-center gap-2 cursor-pointer group ml-2">
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${attendanceMap[student.id] === 'Absent' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 dark:border-gray-500 group-hover:border-red-400'}`}>
                                                                        {attendanceMap[student.id] === 'Absent' && <span className="block w-2 h-0.5 bg-white rounded-full"></span>}
                                                                    </div>
                                                                    <input 
                                                                        type="radio" 
                                                                        checked={attendanceMap[student.id] === 'Absent'}
                                                                        onChange={() => handleAttendanceChange(student.id, "Absent")}
                                                                        className="hidden" 
                                                                    />
                                                                    <span className={`hidden sm:inline text-sm font-medium ${attendanceMap[student.id] === 'Absent' ? 'text-red-700 dark:text-red-400' : 'text-gray-500'}`}>A</span>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button 
                                                                onClick={() => handleManageStudent(student)}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                                Manage Marks & Courses
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Manage Student Modal Overlay */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Control Academic Record
                                </h2>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    Editing Profile: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedStudent.name || selectedStudent.email || selectedStudent.id}</span>
                                    <span className="mx-2">•</span>
                                    <span>Sem {selectedStudent.semester || "Not Set"}</span>
                                </p>
                            </div>
                            <button onClick={closeManageModal} className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-800">
                            {isLoadingRecord ? (
                                <div className="py-20 text-center text-gray-500">Loading academic data...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    
                                    {/* COURSES COLUMN */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            <Book className="w-5 h-5 text-blue-500" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Assigned Courses</h3>
                                        </div>

                                        <div className="space-y-2">
                                            {(academicRecord.courses || []).length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No courses recorded yet.</p>
                                            ) : (
                                                academicRecord.courses.map((c: any) => (
                                                    <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm border border-gray-100 dark:border-gray-700">
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white uppercase">{c.code}</div>
                                                            <div className="text-gray-600 dark:text-gray-300">{c.name}</div>
                                                        </div>
                                                        <button onClick={() => handleDeleteCourse(c.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                            <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-3 text-center">Assign New Course</h4>
                                            <div className="space-y-3">
                                                <input 
                                                    type="text" placeholder="Course Code (e.g. CS101)" 
                                                    value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})}
                                                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                                />
                                                <input 
                                                    type="text" placeholder="Course Full Name" 
                                                    value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})}
                                                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                                                />
                                                <button onClick={handleAddCourse} disabled={!newCourse.code || !newCourse.name} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded text-sm transition-colors">
                                                    Assign Course
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EXAM MARKS COLUMN */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            <Award className="w-5 h-5 text-purple-500" />
                                            <h3 className="font-bold text-gray-900 dark:text-white">Exam Marks (Percentage)</h3>
                                        </div>

                                        <div className="space-y-2">
                                            {(academicRecord.marks_history || []).length === 0 ? (
                                                <p className="text-sm text-gray-500 italic">No exams recorded yet.</p>
                                            ) : (
                                                academicRecord.marks_history.map((m: any) => {
                                                    const perc = Math.round((Number(m.obtained_marks) / Number(m.total_marks)) * 100);
                                                    return (
                                                        <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm border border-gray-100 dark:border-gray-700">
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white text-sm">{m.subject}</div>
                                                                <div className="text-xs mt-1">
                                                                    <span className={perc >= 35 ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 font-bold"}>
                                                                        {m.obtained_marks}/{m.total_marks} ({perc}%)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => handleDeleteMark(m.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                                            <h4 className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase mb-3 text-center">Add Evaluation Mark</h4>
                                            <div className="space-y-3">
                                                <input 
                                                    type="text" placeholder="Evaluation Name / Subject" 
                                                    value={newMark.subject} onChange={e => setNewMark({...newMark, subject: e.target.value})}
                                                    className="w-full p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:border-purple-500"
                                                />
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="number" placeholder="Marks" 
                                                        value={newMark.obtained_marks} onChange={e => setNewMark({...newMark, obtained_marks: e.target.value})}
                                                        className="w-1/2 p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:border-purple-500"
                                                    />
                                                    <div className="flex items-center justify-center text-gray-400">/</div>
                                                    <input 
                                                        type="number" placeholder="Total" 
                                                        value={newMark.total_marks} onChange={e => setNewMark({...newMark, total_marks: e.target.value})}
                                                        className="w-1/2 p-2 text-sm rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:border-purple-500"
                                                    />
                                                </div>
                                                <button onClick={handleAddMark} disabled={!newMark.subject || !newMark.obtained_marks || !newMark.total_marks} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2 rounded text-sm transition-colors">
                                                    Save Marks
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
