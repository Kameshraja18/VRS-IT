import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit, Trash2, Search, Filter, Users, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import AnimatedCard from '../Common/AnimatedCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  department: string;
  description?: string;
  course_id?: string;
  staff_id?: string;
  is_active: boolean;
  courses?: {
    name: string;
    code: string;
  };
  users?: {
    name: string;
  };
}

const SubjectManagement: React.FC = () => {
  const { user } = useAuth();
  const { loading, getSubjects, createSubject, getCourses, getStaff } = useSupabaseData();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: 3,
    semester: 1,
    department: '',
    description: '',
    courseId: '',
    staffId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [subjectsData, coursesData, staffData] = await Promise.all([
      getSubjects(),
      getCourses(),
      getStaff()
    ]);
    
    setSubjects(subjectsData || []);
    setCourses(coursesData || []);
    setStaff(staffData || []);
  };

  const canManageSubjects = user?.role === 'admin' || user?.role === 'staff';

  if (!canManageSubjects) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators and staff can manage subjects.</p>
      </div>
    );
  }

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || subject.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const subjectData = {
      name: newSubject.name,
      code: newSubject.code,
      credits: newSubject.credits,
      semester: newSubject.semester,
      department: newSubject.department,
      description: newSubject.description,
      course_id: newSubject.courseId || null,
      staff_id: newSubject.staffId || null,
      is_active: true
    };

    try {
      await createSubject(subjectData);
      await loadData();
      setNewSubject({
        name: '',
        code: '',
        credits: 3,
        semester: 1,
        department: '',
        description: '',
        courseId: '',
        staffId: ''
      });
      setShowAddForm(false);
      setEditingSubject(null);
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  };

  const departments = [...new Set(subjects.map(s => s.department))];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filters */}
      <AnimatedCard>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredSubjects.length} subjects found
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Add Subject Form */}
      {showAddForm && (
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            <form onSubmit={handleSubmitSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Data Structures and Algorithms"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CS201"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, credits: parseInt(e.target.value) || 3 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select
                    value={newSubject.semester}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newSubject.department}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Communication">Electronics and Communication</option>
                    <option value="Electrical and Electronics">Electrical and Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Science and Humanities">Science and Humanities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    value={newSubject.courseId}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Course (Optional)</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Staff</label>
                  <select
                    value={newSubject.staffId}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, staffId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Staff (Optional)</option>
                    {staff.map(staffMember => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.users?.name} - {staffMember.designation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSubject.description}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the subject..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSubject(null);
                    setNewSubject({
                      name: '',
                      code: '',
                      credits: 3,
                      semester: 1,
                      department: '',
                      description: '',
                      courseId: '',
                      staffId: ''
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </AnimatedCard>
      )}

      {/* Subjects Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <AnimatedCard key={subject.id} delay={index * 0.1}>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{subject.code}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {subject.credits} Credits
                      </span>
                      <span>Sem {subject.semester}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{subject.department}</span>
                  </div>
                  {subject.courses && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Course:</span>
                      <span className="font-medium">{subject.courses.name}</span>
                    </div>
                  )}
                  {subject.users && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Staff:</span>
                      <span className="font-medium">{subject.users.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${subject.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {subject.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {subject.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SubjectManagement;