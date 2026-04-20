import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  AlertCircle,
  Calendar,
  Download,
  Edit2,
  FileSpreadsheet,
  Heart,
  Loader2,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  birthday: '',
  department: '',
  anniversary: '',
};

const normalizeHeader = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseMembersCsv = (content) => {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], errors: ['The CSV file needs a header row and at least one member row.'] };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const nameIndex = headers.findIndex((header) => header === 'name' || header === 'fullname');

  if (nameIndex === -1) {
    return { rows: [], errors: ['CSV must include a `name` or `full name` column.'] };
  }

  const headerMap = {
    name: headers.findIndex((header) => header === 'name' || header === 'fullname'),
    phone: headers.findIndex((header) => header === 'phone' || header === 'phonenumber'),
    email: headers.findIndex((header) => header === 'email' || header === 'emailaddress'),
    birthday: headers.findIndex((header) => header === 'birthday' || header === 'birthdate' || header === 'dateofbirth'),
    department: headers.findIndex((header) => header === 'department' || header === 'unit'),
    anniversary: headers.findIndex((header) => header === 'anniversary' || header === 'weddinganniversary'),
  };

  const rows = [];
  const errors = [];

  lines.slice(1).forEach((line, index) => {
    const cells = parseCsvLine(line);
    const rowNumber = index + 2;

    const member = {
      name: headerMap.name >= 0 ? (cells[headerMap.name] || '').trim() : '',
      phone: headerMap.phone >= 0 ? (cells[headerMap.phone] || '').trim() : '',
      email: headerMap.email >= 0 ? (cells[headerMap.email] || '').trim() : '',
      birthday: headerMap.birthday >= 0 ? (cells[headerMap.birthday] || '').trim() : '',
      department: headerMap.department >= 0 ? (cells[headerMap.department] || '').trim() : '',
      anniversary: headerMap.anniversary >= 0 ? (cells[headerMap.anniversary] || '').trim() : '',
    };

    if (!member.name) {
      errors.push(`Row ${rowNumber} is missing a member name.`);
      return;
    }

    rows.push(member);
  });

  return { rows, errors };
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const fileInputRef = useRef(null);

  const fetchMembers = useCallback(async () => {
    const { data } = await supabase.from('members').select('*').order('name', { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    
    async function loadMembers() {
      const { data } = await supabase.from('members').select('*').order('name', { ascending: true });
      if (!ignore) {
        if (data) setMembers(data);
        setLoading(false);
      }
    }

    loadMembers();
    return () => {
      ignore = true;
    };
  }, []); // Only fetch on mount, manual refreshes use fetchMembers

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          member.name.toLowerCase().includes(query) ||
          member.department?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query);

        const matchesDepartment =
          selectedDepartment === 'All Departments' ||
          member.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
      }),
    [members, searchTerm, selectedDepartment]
  );

  const departments = useMemo(() => {
    const deps = new Set(members.map((m) => m.department).filter(Boolean));
    return ['All Departments', ...Array.from(deps).sort()];
  }, [members]);

  const resetImportState = () => {
    setCsvPreview([]);
    setCsvErrors([]);
    setCsvFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        email: member.email || '',
        birthday: member.birthday || '',
        department: member.department || '',
        anniversary: member.anniversary || '',
      });
    } else {
      setEditingMember(null);
      setFormData(emptyForm);
    }

    setShowModal(true);
    
    // Scroll to top on mobile when modal opens
    setTimeout(() => {
      if (window.innerWidth < 640) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    const payload = { ...formData };

    const response = editingMember
      ? await supabase.from('members').update(payload).eq('id', editingMember.id)
      : await supabase.from('members').insert([payload]);

    setSubmitting(false);

    if (response.error) {
      setNotice({ type: 'error', message: response.error.message });
      return;
    }

    setShowModal(false);
    setFormData(emptyForm);
    setEditingMember(null);
    setNotice({ type: 'success', message: editingMember ? 'Member record updated.' : 'Member added successfully.' });
    fetchMembers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    const { error } = await supabase.from('members').delete().eq('id', id);

    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }

    setNotice({ type: 'success', message: 'Member deleted successfully.' });
    fetchMembers();
  };

  const handleExportCsv = () => {
    const headers = ['name', 'phone', 'email', 'birthday', 'department', 'anniversary'];
    const rows = members.map((member) =>
      headers
        .map((header) => {
          const value = member[header] ?? '';
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scm-members.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleCsv = () => {
    const sampleRows = [
      ['name', 'phone', 'email', 'birthday', 'department', 'anniversary'],
      ['John Doe', '+2348012345678', 'john@example.com', '1992-05-14', 'Choir', ''],
      ['Mary Adebayo', '+2348098765432', 'mary@example.com', '1988-11-02', 'Welfare', '2015-08-22'],
    ];

    const csv = sampleRows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scm-members-sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = parseMembersCsv(text);

    setCsvFileName(file.name);
    setCsvPreview(result.rows);
    setCsvErrors(result.errors);

    if (!result.rows.length) {
      setNotice({ type: 'error', message: 'No valid member rows were found in that CSV file.' });
    } else {
      setNotice({
        type: result.errors.length ? 'warning' : 'success',
        message: result.errors.length
          ? `Loaded ${result.rows.length} valid rows with ${result.errors.length} issue(s) to review.`
          : `Loaded ${result.rows.length} member rows from ${file.name}.`,
      });
    }
  };

  const handleImportCsv = async () => {
    if (!csvPreview.length) return;

    setImporting(true);
    setNotice(null);

    const { error } = await supabase.from('members').insert(csvPreview);

    setImporting(false);

    if (error) {
      setNotice({ type: 'error', message: error.message });
      return;
    }

    setNotice({ type: 'success', message: `${csvPreview.length} members imported successfully.` });
    resetImportState();
    fetchMembers();
  };

  return (
    <div id="members-root" className="space-y-4 sm:space-y-8 animate-fade-in pb-20 overflow-x-hidden" translate="no" suppressHydrationWarning>
      <section id="members-intro" className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_22px_70px_rgba(7,17,38,0.08)]">
        <div className="grid gap-6 sm:gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
          <div className="flex flex-col">
            <div className="inline-flex self-start items-center gap-2 rounded-full border border-[#efd7d2] bg-[#fff1ee] px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#b53a2d]">
              <span className="flex items-center justify-center"><Users size={14} /></span>
              <span>Members Administration</span>
            </div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl leading-tight">
              <span>Manage your church directory.</span>
            </h2>
            <p className="mt-3 sm:mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
              <span>Quickly add members, search, or import from CSV to onboard your community.</span>
            </p>

            <div className="mt-6 sm:mt-8 flex flex-row gap-3 sm:gap-4">
              <button
                onClick={() => openModal()}
                className="flex-1 sm:flex-none inline-flex min-h-12 items-center justify-center rounded-xl sm:rounded-full bg-[#071126] px-4 sm:px-8 py-3 text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#102042] shadow-lg active:scale-95"
              >
                <span className="flex items-center justify-center mr-2"><Plus size={18} /></span>
                <span>Add Member</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none inline-flex min-h-12 items-center justify-center rounded-xl sm:rounded-full border border-[#eadfca] bg-[#fbf7eb] px-4 sm:px-8 py-3 text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] text-slate-700 transition hover:border-[#d8c5bb] shadow-sm active:scale-95"
              >
                <span className="flex items-center justify-center mr-2"><Upload size={18} /></span>
                <span>Import CSV</span>
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: 'Total', value: members.length, icon: Users },
              { label: 'Depts', value: new Set(members.map((member) => member.department).filter(Boolean)).size, icon: FileSpreadsheet },
              { label: 'CSV', value: 'Ready', icon: Upload },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl sm:rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] p-3 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white text-[#b53a2d] shadow-sm shrink-0 mb-3 sm:mb-5">
                  <span className="flex items-center justify-center"><item.icon size={16} className="sm:w-5 sm:h-5" /></span>
                </div>
                <div>
                  <div className="text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400"><span>{item.label}</span></div>
                  <div className="mt-0.5 sm:mt-2 text-lg sm:text-3xl font-bold tracking-tight text-slate-900"><span>{loading ? '...' : item.value}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {notice && (
        <div
          className={`rounded-[1.2rem] sm:rounded-[1.5rem] border px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm font-medium ${
            notice.type === 'error'
              ? 'border-[#f0c6be] bg-[#fff1ee] text-[#8d3024]'
              : notice.type === 'warning'
              ? 'border-[#eadfca] bg-[#fff8e6] text-[#8a5b00]'
              : 'border-[#d8e4d2] bg-[#f2f8ef] text-[#355c2b]'
          }`}
        >
          {notice.message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[#eadfca] bg-white p-5 sm:p-8 shadow-[0_20px_55px_rgba(7,17,38,0.06)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full rounded-2xl border border-[#eadfca] bg-[#fbf7eb] py-3.5 sm:py-4 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="relative w-full sm:max-w-[200px]">
                <FileSpreadsheet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="w-full appearance-none rounded-2xl border border-[#eadfca] bg-[#fbf7eb] py-3.5 sm:py-4 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfca] bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
              >
                <Download size={16} className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#efe5d1] lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#fbf7eb]">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Member</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Department</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Dates</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4ecda]" suppressHydrationWarning>
                  {/* Loading State */}
                  <tr style={{ display: loading ? 'table-row' : 'none' }}>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center gap-3 text-slate-500">
                        <Loader2 size={18} className="animate-spin" />
                        <span>Loading members...</span>
                      </div>
                    </td>
                  </tr>

                  {/* Empty State */}
                  <tr style={{ display: (!loading && filteredMembers.length === 0) ? 'table-row' : 'none' }}>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                      <span>No members found for that search.</span>
                    </td>
                  </tr>

                  {/* Data Rows */}
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="bg-white transition hover:bg-[#fffdf7]" style={{ display: (!loading && filteredMembers.length > 0) ? 'table-row' : 'none' }} suppressHydrationWarning>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071126]/8 font-bold text-[#071126]">
                            <span>{member.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900"><span>{member.name}</span></div>
                            <div className="text-xs text-slate-400">
                              <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[#b53a2d]" />
                            <span>{member.phone || 'No phone number'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            <span>{member.email || 'No email address'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-[#fff1ee] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#b53a2d]">
                          <span>{member.department || 'General'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#b53a2d]" />
                            <span>{member.birthday || 'Birthday not set'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart size={14} className="text-[#d96858]" />
                            <span>{member.anniversary || 'Anniversary not set'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(member)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfca] bg-white text-slate-500 transition hover:border-[#d8c5bb] hover:text-[#071126]"
                          >
                            <span className="flex items-center justify-center"><Edit2 size={16} /></span>
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0d4ce] bg-[#fff1ee] text-[#b53a2d] transition hover:bg-[#ffe5df]"
                          >
                            <span className="flex items-center justify-center"><Trash2 size={16} /></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-3 lg:hidden" suppressHydrationWarning>
            {/* Loading State */}
            <div style={{ display: loading ? 'block' : 'none' }} className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] px-5 py-12 text-center text-slate-500">
              <Loader2 size={24} className="mx-auto mb-4 animate-spin text-slate-300" />
              <span>Loading directory...</span>
            </div>

            {/* Empty State */}
            <div style={{ display: (!loading && filteredMembers.length === 0) ? 'block' : 'none' }} className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] px-5 py-12 text-center text-slate-500">
              <Search size={24} className="mx-auto mb-4 text-slate-300" />
              <span>No members found for that search.</span>
            </div>

            {/* Data Cards */}
            {filteredMembers.map((member) => (
              <div key={member.id} style={{ display: (!loading && filteredMembers.length > 0) ? 'block' : 'none' }} className="rounded-2xl border border-[#eadfca] bg-white p-4 shadow-sm active:bg-gray-50 transition-colors" suppressHydrationWarning>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#071126]/5 font-bold text-[#071126] text-sm">
                      <span>{member.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate"><span>{member.name}</span></div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#b53a2d] mt-0.5">
                        <span>{member.department || 'General'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => openModal(member)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#eadfca] bg-white text-slate-400 active:text-[#071126] active:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center justify-center"><Edit2 size={14} /></span>
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#f0d4ce] bg-[#fff1ee] text-[#b53a2d] active:bg-[#ffe5df] transition-colors"
                    >
                      <span className="flex items-center justify-center"><Trash2 size={14} /></span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 border-t border-[#f4ecda] pt-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Phone size={12} className="text-[#b53a2d] shrink-0" />
                    <span className="truncate"><span>{member.phone || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate"><span>{member.email || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Calendar size={12} className="text-[#b53a2d] shrink-0" />
                    <span className="truncate"><span>{member.birthday || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Heart size={12} className="text-[#d96858] shrink-0" />
                    <span className="truncate"><span>{member.anniversary || 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_20px_55px_rgba(7,17,38,0.06)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#b53a2d]">CSV Import</div>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Import member records in bulk</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1ee] text-[#b53a2d]">
                <Upload size={20} />
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Upload a CSV with these columns: <span className="font-semibold">name, phone, email, birthday, department, anniversary</span>.
              Only <span className="font-semibold">name</span> is required.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleCsvSelected}
            />

            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none inline-flex min-h-11 items-center justify-center rounded-xl sm:rounded-full bg-[#071126] px-4 py-2 text-[10px] sm:text-sm font-bold uppercase tracking-[0.12em] text-white transition active:scale-95"
              >
                <Upload size={14} className="mr-2" />
                <span>Upload CSV</span>
              </button>
              <button
                onClick={handleImportCsv}
                disabled={!csvPreview.length || importing}
                className="flex-1 sm:flex-none inline-flex min-h-11 items-center justify-center rounded-xl sm:rounded-full border border-[#eadfca] bg-[#fbf7eb] px-4 py-2 text-[10px] sm:text-sm font-bold uppercase tracking-[0.12em] text-slate-700 disabled:opacity-50 active:scale-95"
              >
                {importing ? <Loader2 size={14} className="mr-2 animate-spin" /> : <FileSpreadsheet size={14} className="mr-2" />}
                <span>Import</span>
              </button>
              <button
                onClick={handleDownloadSampleCsv}
                className="flex-1 sm:flex-none inline-flex min-h-11 items-center justify-center rounded-xl sm:rounded-full border border-[#eadfca] bg-white px-4 py-2 text-[10px] sm:text-sm font-bold uppercase tracking-[0.12em] text-slate-700 active:scale-95"
              >
                <Download size={14} className="mr-2" />
                <span>Sample</span>
              </button>
              <button
                onClick={resetImportState}
                className="inline-flex min-h-11 items-center justify-center rounded-xl sm:rounded-full border border-[#f0d4ce] bg-[#fff1ee] px-4 py-2 text-[10px] sm:text-sm font-bold uppercase tracking-[0.12em] text-[#b53a2d] active:scale-95"
              >
                <span>Clear</span>
              </button>
            </div>

            {csvFileName && (
              <div className="mt-5 rounded-2xl border border-[#eadfca] bg-[#fbf7eb] px-4 py-4 text-sm text-slate-600">
                Loaded file: <span className="font-semibold text-slate-900">{csvFileName}</span>
              </div>
            )}

            {csvErrors.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#f0d4ce] bg-[#fff1ee] px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#8d3024]">
                  <AlertCircle size={16} />
                  Import issues
                </div>
                <div className="mt-3 space-y-2 text-sm text-[#8d3024]">
                  {csvErrors.slice(0, 5).map((error) => (
                    <div key={error}>{error}</div>
                  ))}
                  {csvErrors.length > 5 && <div>And {csvErrors.length - 5} more issue(s).</div>}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_20px_55px_rgba(7,17,38,0.06)] sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#b53a2d]">Import Preview</div>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Review before importing</h3>

            <div className="mt-6 space-y-4">
              {csvPreview.length ? (
                csvPreview.slice(0, 5).map((member, index) => (
                  <div key={`${member.name}-${member.email}-${index}`} className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] p-4">
                    <div className="font-semibold text-slate-900">{member.name}</div>
                    <div className="mt-2 text-sm text-slate-600">
                      {member.email || 'No email'} {member.department ? `• ${member.department}` : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[#eadfca] bg-[#fbf7eb] px-5 py-10 text-center text-sm text-slate-500">
                  No CSV rows loaded yet.
                </div>
              )}
            </div>

            {csvPreview.length > 5 && (
              <div className="mt-4 text-sm text-slate-500">Showing 5 of {csvPreview.length} rows ready for import.</div>
            )}
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/60 p-4 sm:p-4 backdrop-blur-sm transition-all duration-300">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-[0_32px_80px_rgba(7,17,38,0.22)] animate-slide-up sm:animate-fade-in mt-8 sm:mt-0">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1e7d2] bg-white/80 px-6 py-4 sm:px-8 sm:py-6 backdrop-blur-md">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b53a2d]">
                  {editingMember ? 'Update Profile' : 'New Member'}
                </div>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {editingMember ? 'Edit member info' : 'Add to directory'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfca] bg-[#fbf7eb] text-slate-500 transition hover:text-[#b53a2d] active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. John Doe' },
                  { key: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Choir' },
                  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+234...' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
                  { key: 'birthday', label: 'Birthday', type: 'date' },
                  { key: 'anniversary', label: 'Wedding Anniversary', type: 'date' },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">{field.label}</label>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })}
                      className="w-full rounded-xl sm:rounded-2xl border border-[#eadfca] bg-[#fbf7eb] px-4 py-3 sm:py-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl sm:rounded-full border border-[#eadfca] bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-600 transition hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl sm:rounded-full bg-[#071126] px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#102042] shadow-lg active:scale-95 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                  {editingMember ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
