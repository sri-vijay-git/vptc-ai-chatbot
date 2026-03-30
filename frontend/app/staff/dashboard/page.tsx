"use client";

import { useState, useEffect } from "react";
import { Users, LogOut, CheckCircle, Save, Filter, User } from "lucide-react";
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

    // Reusing the /student/profile endpoint to store staff's department mapping simply
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
            
            // Initialize attendance map to default 'Present' for all
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
                student_email: s.id, // Using id as fallback
                status: attendanceMap[s.id]
            }));
            
            await api.post("/staff/attendance", { records });
            
            // Refresh stats
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

    // Department Array Options
    const DEPARTMENTS = [
        "1st Year Staff (S&H)",
        "Computer Engineering (CSE)",
        "Electronics and Comm. Engineering (ECE)",
        "Electrical and Electronics Engineering (EEE)",
        "Mechanical Engineering",
        "Civil Engineering"
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
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
                
                {/* Setup Department Step */}
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
                            Save Setting & View Students
                        </button>
                    </div>
                ) : (
                    /* Main Dashboard */
                    <div className="space-y-6">
                        
                        {/* Stats & Actions */}
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
                        
                        {/* Students Table */}
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
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Roll No</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Student Name</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Semester</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-center">Past Attendance Total</th>
                                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Today's Attendance</th>
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
                                                            {student.roll_no || "N/A"}
                                                        </td>
                                                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                                                            {student.attendance ? <span className="text-xs">{student.id}</span> : "Student User"}
                                                        </td>
                                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">{student.semester || "Not Set"}</span>
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
                                                        <td className="p-4">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${attendanceMap[student.id] === 'Present' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500 group-hover:border-green-400'}`}>
                                                                        {attendanceMap[student.id] === 'Present' && <CheckCircle className="w-3 h-3" />}
                                                                    </div>
                                                                    <input 
                                                                        type="radio" 
                                                                        name={`att-${student.id}`} 
                                                                        checked={attendanceMap[student.id] === 'Present'}
                                                                        onChange={() => handleAttendanceChange(student.id, "Present")}
                                                                        className="hidden" 
                                                                    />
                                                                    <span className={`text-sm font-medium ${attendanceMap[student.id] === 'Present' ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}`}>P</span>
                                                                </label>
                                                                
                                                                <label className="flex items-center gap-2 cursor-pointer group ml-2">
                                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${attendanceMap[student.id] === 'Absent' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 dark:border-gray-500 group-hover:border-red-400'}`}>
                                                                        {attendanceMap[student.id] === 'Absent' && <span className="block w-2 h-0.5 bg-white rounded-full"></span>}
                                                                    </div>
                                                                    <input 
                                                                        type="radio" 
                                                                        name={`att-${student.id}`} 
                                                                        checked={attendanceMap[student.id] === 'Absent'}
                                                                        onChange={() => handleAttendanceChange(student.id, "Absent")}
                                                                        className="hidden" 
                                                                    />
                                                                    <span className={`text-sm font-medium ${attendanceMap[student.id] === 'Absent' ? 'text-red-700 dark:text-red-400' : 'text-gray-500'}`}>A</span>
                                                                </label>
                                                            </div>
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
        </div>
    );
}
