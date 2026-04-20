import { useEffect, useMemo, useRef, useState } from 'react';
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

  const fetchMembers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data } = await supabase.from('members').select('*').order('name', { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      const { data } = await supabase.from('members').select('*').order('name', { ascending: true });
      if (isMounted && data) {
        setMembers(data);
        setLoading(false);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_22px_70px_rgba(7,17,38,0.08)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#efd7d2] bg-[#fff1ee] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#b53a2d]">
              <Users size={14} />
              Members Administration
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build and manage your church member directory beautifully.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Add members one by one, search quickly, export records, or import an entire list from CSV when you need to onboard many people at once.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => openModal()}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#071126] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
              >
                <Plus size={18} className="mr-2" />
                Add Member
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#fbf7eb] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
              >
                <Upload size={18} className="mr-2" />
                Import CSV
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { label: 'Total Members', value: members.length, icon: Users },
              { label: 'Departments', value: new Set(members.map((member) => member.department).filter(Boolean)).size, icon: FileSpreadsheet },
              { label: 'CSV Ready', value: 'Yes', icon: Upload },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#b53a2d] shadow-sm">
                  <item.icon size={20} />
                </div>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{loading ? '...' : item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {notice && (
        <div
          className={`rounded-[1.5rem] border px-5 py-4 text-sm font-medium ${
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
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_20px_55px_rgba(7,17,38,0.06)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full rounded-2xl border border-[#eadfca] bg-[#fbf7eb] py-4 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="relative w-full sm:max-w-[200px]">
                <FileSpreadsheet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="w-full appearance-none rounded-2xl border border-[#eadfca] bg-[#fbf7eb] py-4 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
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
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfca] bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
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
                <tbody className="divide-y divide-[#f4ecda]">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="inline-flex items-center gap-3 text-slate-500">
                          <Loader2 size={18} className="animate-spin" />
                          Loading members...
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length ? (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="bg-white transition hover:bg-[#fffdf7]">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071126]/8 font-bold text-[#071126]">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{member.name}</div>
                              <div className="text-xs text-slate-400">
                                Joined {new Date(member.created_at).toLocaleDateString()}
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
                            {member.department || 'General'}
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
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0d4ce] bg-[#fff1ee] text-[#b53a2d] transition hover:bg-[#ffe5df]"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                        No members found for that search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-4 lg:hidden">
            {loading ? (
              <div className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] px-5 py-8 text-center text-slate-500">
                Loading members...
              </div>
            ) : filteredMembers.length ? (
              filteredMembers.map((member) => (
                <div key={member.id} className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{member.name}</div>
                      <div className="mt-1 text-sm text-slate-500">{member.department || 'General'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(member)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadfca] bg-white text-slate-500"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0d4ce] bg-[#fff1ee] text-[#b53a2d]"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#b53a2d]" />
                      <span>{member.phone || 'No phone number'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span>{member.email || 'No email address'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#b53a2d]" />
                      <span>{member.birthday || 'Birthday not set'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] px-5 py-8 text-center text-slate-500">
                No members found for that search.
              </div>
            )}
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

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#071126] px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
              >
                <Upload size={16} className="mr-2" />
                Choose CSV
              </button>
              <button
                onClick={handleImportCsv}
                disabled={!csvPreview.length || importing}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfca] bg-[#fbf7eb] px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing ? <Loader2 size={16} className="mr-2 animate-spin" /> : <FileSpreadsheet size={16} className="mr-2" />}
                Import Rows
              </button>
              <button
                onClick={handleDownloadSampleCsv}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#eadfca] bg-white px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
              >
                <Download size={16} className="mr-2" />
                Sample CSV
              </button>
              <button
                onClick={resetImportState}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#f0d4ce] bg-[#fff1ee] px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b53a2d] transition hover:bg-[#ffe5df]"
              >
                Clear
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_32px_80px_rgba(7,17,38,0.22)]">
            <div className="flex items-center justify-between border-b border-[#f1e7d2] px-6 py-5 sm:px-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#b53a2d]">
                  {editingMember ? 'Edit Member' : 'New Member'}
                </div>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {editingMember ? 'Update member record' : 'Add a member to the directory'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfca] bg-[#fbf7eb] text-slate-500 transition hover:text-[#b53a2d]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
                  { key: 'department', label: 'Department', type: 'text', placeholder: 'Choir, Welfare, Ushering' },
                  { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+234...' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com' },
                  { key: 'birthday', label: 'Birthday', type: 'date' },
                  { key: 'anniversary', label: 'Wedding Anniversary', type: 'date' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{field.label}</label>
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.key]}
                      onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })}
                      className="w-full rounded-2xl border border-[#eadfca] bg-[#fbf7eb] px-4 py-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#fbf7eb] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#071126] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042] disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
                  {editingMember ? 'Save Changes' : 'Create Member'}
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
