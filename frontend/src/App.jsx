import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Download,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
  Trash2,
  Eye,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  LogIn,
  LogOut,
  LoaderCircle,
  Check,
  LayoutTemplate,
  RotateCcw,
  GripVertical,
  Target,
  Copy,
  Pencil,
  ChevronUp,
  ChevronDown,
  Gauge,
  ShieldCheck,
  Settings,
  UserCircle,
  Save,
} from "lucide-react";

import { apiRequest } from "./api";
import "./App.css";

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const createEducation = () => ({
  id: createId(),
  degree: "",
  college: "",
  duration: "",
  marks: "",
});

const createProject = () => ({
  id: createId(),
  name: "",
  tools: "",
  description: "",
});

const createExperience = () => ({
  id: createId(),
  company: "",
  role: "",
  duration: "",
  description: "",
});

const createCertification = (name = "") => ({
  id: createId(),
  name,
});

const initialResume = {
  title: "My Resume",
  name: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  summary: "",

  educationEntries: [createEducation()],
  projects: [createProject()],
  experienceEntries: [createExperience()],

  technicalSkills: "",
  softSkills: "",
  certificationEntries: [createCertification()],
  certifications: "",
  languages: "",

  template: "simple",
  hiddenSections: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "education", "projects", "technical-skills", "soft-skills", "certifications", "languages"],
  pdfSettings: { fontSize: 10, margin: 28, lineHeight: 1.45, pageSize: "A4" },
};

const standardSections = [
  { id: "personal", title: "Personal information" },
  { id: "summary", title: "Professional summary" },
  { id: "education", title: "Education" },
  { id: "projects", title: "Projects" },
  { id: "technical-skills", title: "Technical skills" },
  { id: "soft-skills", title: "Soft skills" },
  { id: "experience", title: "Work experience / internship" },
  { id: "certifications", title: "Certifications & achievements" },
  { id: "languages", title: "Languages known" },
];

const resumeTemplates = [
  {
    id: "simple",
    name: "Simple Professional",
    description: "Clean, classic and ATS-friendly.",
    color: "#263d68",
    tag: "ATS FRIENDLY",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary style with teal accents.",
    color: "#247e79",
    tag: "POPULAR",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Distinctive styling with warm accents.",
    color: "#bd654a",
    tag: "CREATIVE",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Space-saving layout for concise resumes.",
    color: "#6d55cf",
    tag: "COMPACT",
  },
  {
    id: "firstjob",
    name: "First Job",
    description: "Highlights education and projects for freshers.",
    color: "#2871ad",
    tag: "FRESHERS",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined typography with centered details and warm gold accents.",
    color: "#9a783d",
    tag: "ELEGANT",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Bold navy header and structured professional sections.",
    color: "#203653",
    tag: "PROFESSIONAL",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Airy monochrome layout with clean, understated details.",
    color: "#59636e",
    tag: "MINIMAL",
  },
];

function getTemplateSectionOrder(templateId) {
  if (templateId === "firstjob") return ["education", "projects", "technical-skills", "soft-skills", "experience", "certifications", "languages", "summary"];
  if (templateId === "compact") return ["summary", "technical-skills", "education", "experience", "projects", "certifications", "soft-skills", "languages"];
  return ["summary", "experience", "education", "projects", "technical-skills", "soft-skills", "certifications", "languages"];
}

const templateSample = {
  ...initialResume,
  name: "Alex Morgan",
  role: "Software Developer",
  email: "alex.morgan@email.com",
  phone: "+91 98765 43210",
  location: "Pune, Maharashtra",
  linkedIn: "linkedin.com/in/alexmorgan",
  summary:
    "Motivated developer with a strong foundation in programming, problem-solving and building practical web applications.",
  educationEntries: [
    {
      id: "sample-edu-1",
      degree: "Master of Computer Applications",
      college: "University / College Name",
      duration: "2024 – 2026",
      marks: "8.5 CGPA",
    },
    {
      id: "sample-edu-2",
      degree: "Bachelor of Computer Applications",
      college: "College Name",
      duration: "2021 – 2024",
      marks: "8.2 CGPA",
    },
  ],
  projects: [
    {
      id: "sample-project-1",
      name: "Student Management System",
      tools: "React, Node.js, Express, MongoDB",
      description:
        "Developed a web application to manage student records and academic information.",
    },
  ],
  technicalSkills: "Java, React, JavaScript, SQL, Git",
  softSkills: "Communication, Teamwork, Problem Solving",
  certifications: "Relevant technical certifications",
  languages: "English, Hindi, Marathi",
};

function splitEntries(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(/[\n,]+/);
  return values.map((item) => String(item).trim()).filter(Boolean);
}

function splitList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const resumeSectionLabels = [
  { id: "summary", title: "Professional summary" },
  { id: "experience", title: "Work experience / internship" },
  { id: "education", title: "Education" },
  { id: "projects", title: "Projects" },
  { id: "technical-skills", title: "Technical skills" },
  { id: "soft-skills", title: "Soft skills" },
  { id: "certifications", title: "Certifications & achievements" },
  { id: "languages", title: "Languages known" },
];

function calculateAtsScore(resume = {}) {
  const checks = [
    { label: "Full name", ok: Boolean(resume.name?.trim()), weight: 10, tip: "Add your full name." },
    { label: "Contact details", ok: Boolean(resume.email?.trim() && resume.phone?.trim()), weight: 12, tip: "Add both your email and phone number." },
    { label: "Professional title", ok: Boolean(resume.role?.trim()), weight: 8, tip: "Add the job title you are targeting." },
    { label: "Summary", ok: Boolean(resume.summary?.trim()), weight: 12, tip: "Write a concise 2–4 line professional summary." },
    { label: "Education", ok: (resume.educationEntries || []).some((e) => e.degree?.trim() && e.college?.trim()), weight: 12, tip: "Add your degree and college details." },
    { label: "Technical skills", ok: splitList(resume.technicalSkills).length >= 3, weight: 14, tip: "Add at least three relevant technical skills." },
    { label: "Projects", ok: (resume.projects || []).some((p) => p.name?.trim() && p.description?.trim()), weight: 14, tip: "Describe at least one project and what you built." },
    { label: "Experience / internship", ok: (resume.experienceEntries || []).some((e) => e.company?.trim() || e.role?.trim()), weight: 6, tip: "Add internship or work experience if you have it; otherwise use this space for relevant projects." },
    { label: "Action-oriented detail", ok: /developed|built|created|implemented|designed|improved|managed|automated|tested/i.test([resume.summary, ...(resume.projects || []).map((p) => p.description), ...(resume.experienceEntries || []).map((e) => e.description)].join(" ")), weight: 6, tip: "Use clear action verbs to explain your contribution." },
    { label: "LinkedIn", ok: Boolean(resume.linkedIn?.trim()), weight: 3, tip: "Add your LinkedIn profile if it is up to date." },
    { label: "Skills / languages / certificates", ok: splitList(resume.softSkills).length > 0 || splitList(resume.languages).length > 0 || (resume.certificationEntries || []).some((c) => c.name?.trim()), weight: 3, tip: "Add relevant soft skills, languages, or certifications." },
  ];
  const score = checks.reduce((total, item) => total + (item.ok ? item.weight : 0), 0);
  return { score, checks, suggestions: checks.filter((item) => !item.ok).map((item) => item.tip) };
}

function getResumeSearchText(resume = {}) {
  return [resume.role, resume.summary, resume.technicalSkills, resume.softSkills,
    ...(resume.educationEntries || []).flatMap((e) => [e.degree, e.college]),
    ...(resume.projects || []).flatMap((p) => [p.name, p.tools, p.description]),
    ...(resume.experienceEntries || []).flatMap((e) => [e.role, e.company, e.description]),
    ...(resume.certificationEntries || []).map((c) => c.name),
    resume.certifications, resume.languages].filter(Boolean).join(" ").toLowerCase();
}

const matcherStopWords = new Set(["and", "the", "with", "for", "from", "you", "your", "our", "are", "will", "have", "has", "this", "that", "into", "who", "what", "their", "years", "year", "work", "role", "job", "candidate", "ability", "skills", "required", "preferred", "using", "must", "good", "strong", "knowledge", "experience", "including", "such", "all", "any", "can", "not", "about", "team", "responsibilities"]);
function getJobMatch(resume = {}, jobDescription = "") {
  const terms = [...new Set((jobDescription.toLowerCase().match(/[a-z][a-z+#.\-]{1,}/g) || []).filter((word) => word.length > 2 && !matcherStopWords.has(word)))];
  const resumeText = getResumeSearchText(resume);
  const matched = terms.filter((term) => resumeText.includes(term));
  const missing = terms.filter((term) => !resumeText.includes(term));
  return { total: terms.length, matched, missing, score: terms.length ? Math.round((matched.length / terms.length) * 100) : 0 };
}

function normalizeEducation(entry = {}) {
  return {
    id: entry.id || createId(),
    degree: entry.degree || "",
    college: entry.college || "",
    duration: entry.duration || entry.year || "",
    marks: entry.marks || "",
  };
}

function normalizeProject(project = {}) {
  return {
    id: project.id || createId(),
    name: project.name || "",
    tools: project.tools || "",
    description: project.description || "",
  };
}

function normalizeExperience(entry = {}) {
  return {
    id: entry.id || createId(),
    company: entry.company || "",
    role: entry.role || "",
    duration: entry.duration || "",
    description: entry.description || "",
  };
}

// Convert MongoDB/API data into the editor format.
function fromApi(item = {}) {
  const personal = item.personal || {};

  const rawEducation = Array.isArray(item.education)
    ? item.education
    : item.education && typeof item.education === "object"
      ? [item.education]
      : [];

  const educationEntries =
    rawEducation.length > 0
      ? rawEducation.map(normalizeEducation)
      : item.educationEntries?.length
        ? item.educationEntries.map(normalizeEducation)
        : item.education?.degree ||
            item.education?.college ||
            item.education?.year ||
            item.education?.marks
          ? [normalizeEducation(item.education)]
          : [
              normalizeEducation({
                degree: item.education || "",
                college: item.college || "",
                duration: item.year || "",
                marks: item.marks || "",
              }),
            ];

  const rawProjects = Array.isArray(item.projects)
    ? item.projects
    : item.project || item.projectTools || item.projectDescription
      ? [
          {
            name: item.project,
            tools: item.projectTools,
            description: item.projectDescription,
          },
        ]
      : [];

  const rawExperience = Array.isArray(item.experience)
    ? item.experience
    : item.experience && typeof item.experience === "object"
      ? [item.experience]
      : item.experienceEntries || [];

  const customSections = Array.isArray(item.customSections)
    ? item.customSections.map((section) => ({
        id: section.id || createId(),
        title: section.title || "Additional section",
        content: section.content || "",
      }))
    : [];

  return {
    ...initialResume,

    _id: item._id,
    title: item.title || "My Resume",

    name: personal.name ?? item.name ?? "",
    role: personal.jobTitle ?? personal.role ?? item.role ?? "",
    email: personal.email ?? item.email ?? "",
    phone: personal.phone ?? item.phone ?? "",
    location: personal.address ?? personal.location ?? item.location ?? "",
    linkedIn: personal.linkedin ?? personal.linkedIn ?? item.linkedIn ?? "",
    summary: personal.summary ?? item.summary ?? "",

    educationEntries,

    projects: rawProjects.map(normalizeProject),

    experienceEntries: rawExperience.map(normalizeExperience),

    technicalSkills: splitList(
      item.technicalSkills ?? item.skills
    ).join(", "),

    softSkills: splitList(item.softSkills).join(", "),

    certificationEntries: (
      splitEntries(item.certifications).length
        ? splitEntries(item.certifications)
        : [""]
    ).map((name) => createCertification(name)),

    certifications: item.certifications || "",

    languages: splitList(item.languages).join(", "),

    template: item.template || "simple",

    hiddenSections: Array.isArray(item.hiddenSections)
      ? item.hiddenSections
      : [],

    customSections,

    sectionOrder:
      Array.isArray(item.sectionOrder) && item.sectionOrder.length
        ? item.sectionOrder
        : initialResume.sectionOrder,

    pdfSettings: {
      ...initialResume.pdfSettings,
      ...(item.pdfSettings || {}),
    },
  };
}

// Convert editor data into the format saved by the backend.
function toApi(resume) {
  return {
    title:
      resume.title?.trim() ||
      resume.name?.trim() ||
      "My Resume",

    personal: {
      name: resume.name || "",
      jobTitle: resume.role || "",
      email: resume.email || "",
      phone: resume.phone || "",
      address: resume.location || "",
      linkedin: resume.linkedIn || "",
      summary: resume.summary || "",
    },

    education: (resume.educationEntries || []).map((entry) => ({
      degree: entry.degree || "",
      college: entry.college || "",
      duration: entry.duration || "",
      year: entry.duration || "",
      marks: entry.marks || "",
    })),

    projects: (resume.projects || []).map((project) => ({
      name: project.name || "",
      tools: project.tools || "",
      description: project.description || "",
    })),

    technicalSkills: splitList(resume.technicalSkills),
    softSkills: splitList(resume.softSkills),

    experience: (resume.experienceEntries || []).map((entry) => ({
      company: entry.company || "",
      role: entry.role || "",
      duration: entry.duration || "",
      description: entry.description || "",
    })),

    certifications: (resume.certificationEntries || [])
      .map((entry) => entry.name?.trim())
      .filter(Boolean)
      .join("\n"),

    languages: splitList(resume.languages),

    template: resume.template || "simple",
    hiddenSections: resume.hiddenSections || [],

    customSections: (resume.customSections || []).map((section) => ({
      id: section.id,
      title: section.title || "Additional section",
      content: section.content || "",
    })),

    sectionOrder:
      resume.sectionOrder || initialResume.sectionOrder,

    pdfSettings: {
      ...initialResume.pdfSettings,
      ...(resume.pdfSettings || {}),
    },
  };
}

function TemplateGallery({ resume, onUse, templates = resumeTemplates }) {
  const hasInformation = Boolean(
    resume.name ||
      resume.role ||
      resume.email ||
      resume.summary ||
      resume.educationEntries?.some((entry) => entry.degree)
  );

  const previewResume = hasInformation ? resume : templateSample;

  return (
    <section className="templates-page page-container">
      <div className="templates-intro">
        <span className="section-kicker">FIND YOUR STYLE</span>
        <h1>Choose your resume template</h1>
        <p>
          Explore professional designs and choose one to start
          building your resume. Your details appear in the preview.
        </p>

      </div>

      <div className="templates-filter-row">
        <span className="templates-filter active">
          <Sparkles size={15} /> All templates
        </span>
        <span className="templates-filter">
          <Check size={15} /> ATS friendly
        </span>
        <span className="templates-filter">
          <GraduationCap size={15} /> First job
        </span>
      </div>

      <div className="templates-grid">
        {templates.map((item) => (
          <article className="gallery-card" key={item.id}>
            <button
              type="button"
              className="gallery-preview"
              onClick={() => onUse(item.baseTemplate || item.id)}
              aria-label={`Preview ${item.name} template`}
            >
              <div className="gallery-paper">
                <ResumePreview
                  resume={previewResume}
                  template={item.baseTemplate || item.id}
                />
              </div>
            </button>

            <div className="gallery-card-info">
              <div className="gallery-card-title">
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                </div>

                <span
                  className="gallery-color"
                  style={{ background: item.color }}
                />
              </div>

              <span className="template-tag">{item.tag}</span>


              <button
                className="primary-button gallery-use-button"
                onClick={() => onUse(item.baseTemplate || item.id)}
              >
                Use this template <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [resume, setResume] = useState({ ...initialResume });
  const [savedResumes, setSavedResumes] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [template, setTemplate] = useState("simple");
  const [authNextPage, setAuthNextPage] = useState("dashboard");
  const [jobDescription, setJobDescription] = useState("");
  const [draggingSection, setDraggingSection] = useState("");
  const [customTemplates, setCustomTemplates] = useState([]);
  const [templateForm, setTemplateForm] = useState({ name: "", description: "", tag: "ADMIN TEMPLATE", color: "#4169e1", baseTemplate: "modern" });
  const [savingTemplate, setSavingTemplate] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("resumecraft_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [adminSession, setAdminSession] = useState(() => localStorage.getItem("resumecraft_admin_session") === "true");
  const isAdmin = adminSession || user?.role === "admin";
  const allTemplates = customTemplates.map((item) => ({
    ...item,
    id: item.id || item._id,
    baseTemplate: item.baseTemplate || item.layout || "modern",
  }));

  useEffect(() => {
    let cancelled = false;
    apiRequest("/templates")
      .then((data) => { if (!cancelled) setCustomTemplates(Array.isArray(data) ? data : data.templates || []); })
      .catch(() => { if (!cancelled) setCustomTemplates([]); });
    return () => { cancelled = true; };
  }, []);

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!message && !error) return undefined;

    const timer = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [message, error]);

  useEffect(() => {
    if (user && localStorage.getItem("resumecraft_token")) {
      loadResumes();
    } else {
      setSavedResumes([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?._id]);

  const loadResumes = async () => {
    setLoadingResumes(true);

    try {
      const data = await apiRequest("/resumes");

      setSavedResumes(
        Array.isArray(data) ? data.map(fromApi) : []
      );
    } catch (err) {
      setError(err.message || "Could not load your resumes.");
    } finally {
      setLoadingResumes(false);
    }
  };

  const updateField = (field, value) => {
    setResume((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "name" && (!previous.title || previous.title === "My Resume" || previous.title === previous.name)
        ? { title: value || "My Resume" }
        : {}),
    }));
  };

  const removeSection = (sectionId) => {
    setResume((previous) => ({
      ...previous,
      hiddenSections: [
        ...new Set([
          ...(previous.hiddenSections || []),
          sectionId,
        ]),
      ],
    }));

    setMessage("Section removed. Save your resume to keep this change.");
  };

  const restoreSection = (sectionId) => {
    setResume((previous) => ({
      ...previous,
      hiddenSections: (previous.hiddenSections || []).filter(
        (id) => id !== sectionId
      ),
    }));

    setMessage("Section restored. Save your resume to keep this change.");
  };

  const addCustomSection = () => {
    const title = window.prompt("Enter the new section title:");

    if (!title?.trim()) return;

    setResume((previous) => ({
      ...previous,
      customSections: [
        ...(previous.customSections || []),
        {
          id: createId(),
          title: title.trim(),
          content: "",
        },
      ],
    }));

    setMessage("Section added. Add its content and save your resume.");
  };

  const updateCustomSection = (id, field, value) => {
    setResume((previous) => ({
      ...previous,
      customSections: (previous.customSections || []).map((section) =>
        section.id === id
          ? { ...section, [field]: value }
          : section
      ),
    }));
  };

  const deleteCustomSection = (id) => {
    if (!window.confirm("Remove this custom section?")) return;

    setResume((previous) => ({
      ...previous,
      customSections: (previous.customSections || []).filter(
        (section) => section.id !== id
      ),
    }));
  };

  const goToAuth = (mode = "login", destination = "dashboard") => {
    setAuthMode(mode);
    setAuthNextPage(destination);
    setAuthForm({ name: "", email: "", password: "", username: "" });
    setError("");
    setMessage("");
    setPage("auth");
    setMobileMenu(false);
  };

  const requireLogin = (nextPage) => {
    if (!user || !localStorage.getItem("resumecraft_token")) {
      goToAuth("login", nextPage);
      setMessage("Log in to continue to ResumeCraft.");
      return false;
    }

    setPage(nextPage);
    setMobileMenu(false);
    return true;
  };

  const createResume = () => {
    setResume({
      ...initialResume,
      educationEntries: [createEducation()],
      projects: [createProject()],
      experienceEntries: [createExperience()],
      hiddenSections: [],
      customSections: [],
    });

    setTemplate("simple");
    setPage("templates");
    setMobileMenu(false);
  };

  const chooseTemplate = (selectedTemplate) => {
    setTemplate(selectedTemplate);

    setResume((previous) => ({
      ...previous,
      template: selectedTemplate,
      sectionOrder: getTemplateSectionOrder(selectedTemplate),
    }));

    setPage("editor");
    setError("");

    setMessage(
      `${
        allTemplates.find((item) => (item.baseTemplate || item.id) === selectedTemplate)?.name ||
        resumeTemplates.find((item) => item.id === selectedTemplate)?.name ||
        "Resume"
      } template selected.`
    );
  };

  const saveResume = async () => {
    if (!user || !localStorage.getItem("resumecraft_token")) {
      goToAuth("login", "editor");
      setMessage("Log in before saving your resume.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = toApi({
        ...resume,
        template,
      });

      let result;

      if (resume._id) {
        result = await apiRequest(`/resumes/${resume._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        result = await apiRequest("/resumes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      const saved = fromApi(result.resume || result);

      setResume(saved);
      setTemplate(saved.template || template);

      setSavedResumes((previous) => [
        saved,
        ...previous.filter((item) => item._id !== saved._id),
      ]);

      setMessage(result.message || "Resume saved successfully!");
      setPage("dashboard");
    } catch (err) {
      setError(err.message || "Could not save your resume.");
    } finally {
      setLoading(false);
    }
  };

  const editResume = (item) => {
    const mappedResume = {
      ...initialResume,
      ...item,
      educationEntries:
        item.educationEntries?.map(normalizeEducation) ||
        [createEducation()],
      projects: item.projects?.map(normalizeProject) || [
        createProject(),
      ],
      experienceEntries:
        item.experienceEntries?.map(normalizeExperience) || [
          createExperience(),
        ],
      hiddenSections: item.hiddenSections || [],
      customSections: item.customSections || [],
      sectionOrder: item.sectionOrder?.length ? item.sectionOrder : initialResume.sectionOrder,
      pdfSettings: { ...initialResume.pdfSettings, ...(item.pdfSettings || {}) },
      template: item.template || "simple",
    };

    setResume(mappedResume);
    setTemplate(mappedResume.template);
    setError("");
    setMessage("");
    setPage("editor");
  };

  const previewSavedResume = (item) => {
    editResume(item);
    setPage("preview");
  };

  const exportSavedResume = (item) => {
    // Keep the user on the saved-resume flow; never open the editing page for PDF export.
    const previousScrollY = window.scrollY;
    const mappedResume = {
      ...initialResume,
      ...item,
      educationEntries: item.educationEntries?.map(normalizeEducation) || [createEducation()],
      projects: item.projects?.map(normalizeProject) || [createProject()],
      experienceEntries: item.experienceEntries?.map(normalizeExperience) || [createExperience()],
      hiddenSections: item.hiddenSections || [],
      customSections: item.customSections || [],
      sectionOrder: item.sectionOrder?.length ? item.sectionOrder : initialResume.sectionOrder,
      pdfSettings: { ...initialResume.pdfSettings, ...(item.pdfSettings || {}) },
      template: item.template || "simple",
    };

    setResume(mappedResume);
    setTemplate(mappedResume.template);
    setError("");
    setMessage("");
    setPage("preview");

    // Print only the resume. Whether the user saves or cancels, return to the same list position.
    window.onafterprint = () => {
      window.onafterprint = null;
      setPage("dashboard");
      window.requestAnimationFrame(() => window.scrollTo(0, previousScrollY));
    };
    window.setTimeout(() => window.print(), 500);
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume permanently?")) return;

    setError("");

    try {
      await apiRequest(`/resumes/${id}`, {
        method: "DELETE",
      });

      setSavedResumes((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Resume deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete this resume.");
    }
  };

  const duplicateResume = async (item) => {
    try {
      const result = await apiRequest(`/resumes/${item._id}/duplicate`, { method: "POST" });
      const duplicated = fromApi(result.resume || result);
      setSavedResumes((previous) => [duplicated, ...previous]);
      setMessage("Resume duplicated successfully.");
    } catch (err) {
      setError(err.message || "Could not duplicate this resume.");
    }
  };

  const renameResume = async (item) => {
    const title = window.prompt("Enter a new resume name:", item.title || item.name || "My Resume");
    if (!title?.trim()) return;
    try {
      const result = await apiRequest(`/resumes/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({ title: title.trim() }),
      });
      const renamed = fromApi(result.resume || { ...item, title: title.trim() });
      setSavedResumes((previous) => previous.map((resumeItem) => resumeItem._id === item._id ? { ...resumeItem, ...renamed, title: title.trim() } : resumeItem));
      setMessage("Resume renamed successfully.");
    } catch (err) {
      setError(err.message || "Could not rename this resume.");
    }
  };

  const reorderSections = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    setResume((previous) => {
      const order = [...(previous.sectionOrder?.length ? previous.sectionOrder : initialResume.sectionOrder)];
      const from = order.indexOf(sourceId);
      const to = order.indexOf(targetId);
      if (from < 0 || to < 0) return previous;
      order.splice(from, 1);
      order.splice(to, 0, sourceId);
      return { ...previous, sectionOrder: order };
    });
  };

  const updatePdfSetting = (field, value) => {
    setResume((previous) => ({
      ...previous,
      pdfSettings: { ...initialResume.pdfSettings, ...(previous.pdfSettings || {}), [field]: value },
    }));
  };

  const openUserProfile = () => {
    if (!user || !localStorage.getItem("resumecraft_token")) {
      goToAuth("login", "profile");
      return;
    }
    setPage("profile");
    setError("");
    setMessage("");
  };

  const addTemplate = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    setSavingTemplate(true);
    setError("");
    try {
      const result = await apiRequest("/templates", {
        method: "POST",
        body: JSON.stringify(templateForm),
      });
      const created = result.template || result;
      setCustomTemplates((previous) => [...previous, created]);
      setTemplateForm({ name: "", description: "", tag: "ADMIN TEMPLATE", color: "#4169e1", baseTemplate: "modern" });
      setMessage("Template added to the Templates section.");
    } catch (err) {
      setError(err.message || "Could not add template. Check admin access and backend route setup.");
    } finally {
      setSavingTemplate(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!isAdmin || !window.confirm("Remove this template?")) return;
    try {
      await apiRequest(`/templates/${id}`, { method: "DELETE" });
      setCustomTemplates((previous) => previous.filter((item) => item._id !== id));
      setMessage("Template removed.");
    } catch (err) {
      setError(err.message || "Could not remove template.");
    }
  };

  const handleAuthChange = (event) => {
    setAuthForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (authMode === "admin-login") {
      if (authForm.username === "admin" && authForm.password === "admin@1234") {
        localStorage.setItem("resumecraft_admin_session", "true");
        setAdminSession(true);
        setAuthForm({ name: "", email: "", password: "", username: "" });
        setMessage("Admin login successful.");
        setPage("admin-dashboard");
      } else {
        setError("Invalid admin username or password.");
      }
      setLoading(false);
      return;
    }

    try {
      const endpoint =
        authMode === "register" ? "/auth/register" : "/auth/login";

      const payload =
        authMode === "register"
          ? authForm
          : {
              email: authForm.email,
              password: authForm.password,
            };

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("resumecraft_token", data.token);
      localStorage.setItem("resumecraft_user", JSON.stringify(data.user));

      setUser(data.user);
      setMessage(data.message || "Welcome to ResumeCraft!");
      setPage(data.user?.role === "admin" ? "admin-dashboard" : authNextPage);

      setAuthForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (showMessage = true) => {
    localStorage.removeItem("resumecraft_token");
    localStorage.removeItem("resumecraft_user");

    setUser(null);
    setSavedResumes([]);
    setResume({ ...initialResume });
    setTemplate("simple");
    setPage("home");
    setError("");
    setMessage(showMessage ? "You have logged out." : "");
  };

  const downloadResume = () => {
    if (!user || !localStorage.getItem("resumecraft_token")) {
      goToAuth("login", "editor");
      setMessage("Please log in to download your resume as a PDF. You can still edit and preview it without logging in.");
      return;
    }

    const pageSize = resume.pdfSettings?.pageSize === "Letter" ? "Letter" : "A4";
    let printStyle = document.getElementById("resumecraft-dynamic-print-page");
    if (!printStyle) {
      printStyle = document.createElement("style");
      printStyle.id = "resumecraft-dynamic-print-page";
      document.head.appendChild(printStyle);
    }
    printStyle.textContent = `@page { size: ${pageSize}; margin: 0; }`;
    window.print();
  };

  return (
    <div className="app-shell">
      {page === "home" ? (
        <header className="navbar">
          <button className="brand" onClick={() => setPage("home")} aria-label="ResumeCraft home">
            <span className="brand-icon"><FileText size={22} /></span>
            <span>Resume<span className="brand-highlight">Craft</span></span>
          </button>
          <button className="mobile-menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle navigation">
            {mobileMenu ? <X /> : <Menu />}
          </button>
          <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
            <button className={page === "home" ? "nav-active" : ""} onClick={() => { setPage("home"); setMobileMenu(false); }}>Home</button>
            <button onClick={() => { setPage("templates"); setMobileMenu(false); }}><LayoutTemplate size={16} /> Templates</button>
            <button onClick={openUserProfile}><UserCircle size={16} /> User Profile</button>
            {isAdmin ? (
              <button onClick={() => { setPage("admin-dashboard"); setMobileMenu(false); }}><ShieldCheck size={16} /> Admin Dashboard</button>
            ) : (
              <button onClick={() => { goToAuth("admin-login", "admin-dashboard"); setMobileMenu(false); }}><ShieldCheck size={16} /> Admin Login</button>
            )}
          </nav>
        </header>
      ) : (
        <header className="independent-header">
          {page !== "admin-dashboard" && (
            <button
              className="back-home-button"
              style={{ marginLeft: 0, marginRight: 0, flexShrink: 0 }}
              onClick={() => {
                if (page === "dashboard" || page === "profile" || page === "templates" || page === "auth") {
                  setPage("home");
                } else {
                  openUserProfile();
                }
                setMobileMenu(false);
              }}
              aria-label={page === "dashboard" || page === "profile" || page === "templates" || page === "auth" ? "Go to Home" : "Go to User Profile"}
            >
              {page === "dashboard" || page === "profile" || page === "templates" || page === "auth" ? <><ArrowLeft size={15} /> Home</> : <><UserCircle size={15} /> User Profile</>}
            </button>
          )}
          <button className="independent-brand" onClick={() => setPage("home")} aria-label="ResumeCraft home">
            <span className="brand-icon"><FileText size={20} /></span>
            <span>Resume<span className="brand-highlight">Craft</span></span>
          </button>
          <div className="independent-page-title">
            {({ auth: "Account", templates: "Templates", dashboard: "User Profile", profile: "User Profile", "admin-dashboard": "Admin Dashboard", editor: "Resume Editor", preview: "Resume Preview" })[page] || "ResumeCraft"}
          </div>
        </header>
      )}

      {(message || error) && (
        <div
          className={`notice ${
            error ? "notice-error" : "notice-success"
          }`}
          role="status"
        >
          <span>{error || message}</span>

          <button
            className="notice-close"
            onClick={() => {
              setMessage("");
              setError("");
            }}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main>
        {page === "home" && (
          <div className="home-page">
            <section className="hero">
              <div className="hero-orb hero-orb-one" />
              <div className="hero-orb hero-orb-two" />
              <div className="hero-copy">
                <div className="eyebrow">
                  <Sparkles size={15} /> YOUR CAREER, YOUR STORY
                </div>

                <h1>
                  Make your next move <span>unforgettable.</span>
                </h1>

                <p>
                  Create a standout resume in minutes. Make it yours, match it to your dream role,
                  and take your next career step with confidence.
                </p>

                <div className="hero-actions">
                  <button className="primary-button hero-primary" onClick={createResume}>
                    Build My Resume <ArrowRight size={18} />
                  </button>

                  <button
                    className="secondary-button hero-secondary"
                    onClick={() => setPage("templates")}
                  >
                    Explore Templates <LayoutTemplate size={17} />
                  </button>
                </div>

                <div className="hero-benefits">
                  <span><Check size={14} /> Live preview</span>
                  <span><Check size={14} /> ATS readiness tools</span>
                  <span><Check size={14} /> PDF export</span>
                </div>

                <div className="hero-social-proof">
                  <div className="avatar-stack"><span>A</span><span>R</span><span>S</span><span>+</span></div>
                  <div><strong>Small steps. Big opportunities.</strong><small>Your next chapter starts here.</small></div>
                </div>
              </div>

              <div className="hero-visual" aria-label="Resume preview illustration">
                <div className="hero-visual-glow" />
                <div className="floating-chip chip-top"><span className="chip-icon chip-purple"><Sparkles size={16} /></span><span><strong>Career-ready</strong><small>Make every detail count</small></span></div>
                <div className="floating-chip chip-bottom"><span className="chip-icon chip-green"><Check size={17} /></span><span><strong>Resume saved</strong><small>Looking sharp already</small></span></div>
                <div className="hero-resume-frame">
                  <div className="resume-window-bar"><span /><span /><span /><small>resume-preview.pdf</small></div>
                  <div className="hero-resume-paper">
                    <ResumePreview resume={resume} template={template} />
                  </div>
                </div>
                <div className="score-float"><div className="score-mini-ring">✓</div><span><strong>Ready to improve</strong><small>Check your resume</small></span></div>
              </div>
            </section>

            <section className="trust-strip page-container">
              <span>EVERYTHING YOU NEED TO MAKE A GREAT FIRST IMPRESSION</span>
              <div><span><Check size={15} /> Customizable templates</span><span><Check size={15} /> One-click PDF export</span><span><Check size={15} /> Your resumes in one place</span></div>
            </section>

            <section className="home-section templates-teaser page-container">
              <div className="home-section-heading">
                <div><span className="section-kicker">FIND YOUR LOOK</span><h2>A template for every next step.</h2><p>Start with a design that fits your story. Customize it with your own details.</p></div>
                <button className="text-link-button" onClick={() => setPage("templates")}>View all templates <ArrowRight size={16} /></button>
              </div>
              <div className="home-template-grid">
                {allTemplates.slice(0, 3).map((item, index) => (
                  <button className={`home-template-card home-template-${index + 1}`} key={item.id} onClick={() => chooseTemplate(item.baseTemplate || item.id)}>
                    <span className="mini-template-badge">{item.tag}</span>
                    <div className="mini-template-paper"><div className="mini-paper-top" style={{ background: item.color }} /><span className="mini-paper-line wide" /><span className="mini-paper-line medium" /><div className="mini-paper-columns"><div><i /><i /><i /><i /></div><div><b /><b /><b /></div></div></div>
                    <div className="mini-template-info"><span><strong>{item.name}</strong><small>{item.description}</small></span><span className="mini-template-arrow"><ArrowRight size={17} /></span></div>
                  </button>
                ))}
              </div>
            </section>

            <section className="home-features-section">
              <div className="page-container">
                <div className="home-section-heading centered-heading"><div><span className="section-kicker">MORE THAN A RESUME</span><h2>Everything you need to stand out.</h2><p>Simple tools to help you build, polish and tailor your professional story.</p></div></div>
                <div className="home-feature-grid">
                  <article className="home-feature-card feature-purple"><span className="home-feature-icon"><Gauge size={22} /></span><h3>ATS Readiness</h3><p>Check resume completeness and get practical suggestions to improve the information you share.</p><span className="feature-number">01</span></article>
                  <article className="home-feature-card feature-pink"><span className="home-feature-icon"><Target size={22} /></span><h3>Job Description Matcher</h3><p>Compare your resume with a target role and spot keywords that may be missing.</p><span className="feature-number">02</span></article>
                  <article className="home-feature-card feature-blue"><span className="home-feature-icon"><Eye size={22} /></span><h3>Live Resume Preview</h3><p>See your content take shape while you edit sections and switch templates.</p><span className="feature-number">03</span></article>
                  <article className="home-feature-card feature-green"><span className="home-feature-icon"><Download size={22} /></span><h3>PDF Export Controls</h3><p>Fine-tune page size, margins, font size and line spacing before printing to PDF.</p><span className="feature-number">04</span></article>
                  <article className="home-feature-card feature-orange"><span className="home-feature-icon"><GripVertical size={22} /></span><h3>Your Sections, Your Order</h3><p>Reorder resume sections to highlight the information that matters most.</p><span className="feature-number">05</span></article>
                  <article className="home-feature-card feature-lilac"><span className="home-feature-icon"><Copy size={22} /></span><h3>Multiple Resume Versions</h3><p>Save separate versions for different roles and keep your applications organized.</p><span className="feature-number">06</span></article>
                </div>
              </div>
            </section>

            <section className="home-how page-container">
              <div className="how-copy"><span className="section-kicker">THREE SIMPLE STEPS</span><h2>From blank page to <span>next opportunity.</span></h2><p>No complicated tools. Just your experience, your goals and a little creative polish.</p><button className="primary-button" onClick={createResume}>Create your resume <ArrowRight size={17} /></button></div>
              <div className="how-steps"><article><span>01</span><div><h3>Choose your template</h3><p>Pick a look that feels like you.</p></div></article><article><span>02</span><div><h3>Add your story</h3><p>Fill in your skills, education and projects.</p></div></article><article><span>03</span><div><h3>Polish and download</h3><p>Review your resume and export a PDF.</p></div></article></div>
            </section>

            <section className="home-cta page-container"><div><span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to make your move?</h2><p>Build a resume that tells your story with confidence.</p></div><button className="primary-button" onClick={createResume}>Build My Resume <ArrowRight size={18} /></button></section>
          </div>
        )}

        {page === "auth" && (
          <section className="auth-page page-container">
            <div className="auth-card">
              <div className="auth-icon">
                <FileText size={27} />
              </div>

              <span className="section-kicker">{authMode === "admin-login" ? "RESUMECRAFT ADMIN" : "WELCOME TO RESUMECRAFT"}</span>

              <h1>
                {authMode === "admin-login" ? "Admin Login" : authMode === "register" ? "Create your account" : "Welcome back"}
              </h1>

              <p>
                {authMode === "admin-login"
                  ? "Sign in with your administrator account to access the admin area."
                  : authMode === "register"
                    ? "Create an account to save and manage your resumes."
                    : "Log in to continue building your career story."}
              </p>

              <form onSubmit={handleAuthSubmit} className="auth-form">
                {authMode === "register" && (
                  <Field
                    label="Full name"
                    value={authForm.name}
                    onChange={(value) =>
                      setAuthForm((previous) => ({
                        ...previous,
                        name: value,
                      }))
                    }
                    required
                  />
                )}

                {authMode === "admin-login" ? (
                  <label className="field">
                    <span>Admin Username</span>
                    <input
                      name="username"
                      type="text"
                      value={authForm.username}
                      onChange={handleAuthChange}
                      required
                      autoComplete="username"
                      placeholder="Enter admin username"
                    />
                  </label>
                ) : null}

                {authMode !== "admin-login" && (
                <label className="field">
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    value={authForm.email}
                    onChange={handleAuthChange}
                    required
                    autoComplete="email"
                  />
                </label>
                )}

                <label className="field">
                  <span>Password (minimum 8 characters)</span>
                  <input
                    name="password"
                    type="password"
                    value={authForm.password}
                    onChange={handleAuthChange}
                    required
                    minLength={8}
                    autoComplete={
                      authMode === "register"
                        ? "new-password"
                        : "current-password"
                    }
                  />
                </label>

                <button
                  className="primary-button full-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : authMode === "register" ? (
                    "Create account"
                  ) : (
                    "Log in"
                  )}

                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              {authMode === "admin-login" ? (
                <p className="auth-switch">
                  Regular user?
                  <button onClick={() => goToAuth("login", "profile")}>User Login</button>
                </p>
              ) : (
                <p className="auth-switch">
                  {authMode === "register" ? "Already have an account?" : "New to ResumeCraft?"}
                  <button onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setError(""); setMessage(""); }}>
                    {authMode === "register" ? "Log in" : "Create account"}
                  </button>
                </p>
              )}
            </div>
          </section>
        )}

        {page === "templates" && (
          <TemplateGallery resume={resume} onUse={chooseTemplate} templates={allTemplates} />
        )}

        {(page === "dashboard" || page === "profile") && (
          <section className="dashboard page-container">
            <div className="page-heading">
              <div>
                <span className="section-kicker">YOUR WORKSPACE</span>
                <h1>User Profile</h1>
                <p>
                  Manage your account details and saved resumes, {user?.name || "there"}.
                </p>
              </div>

              <button className="primary-button" onClick={createResume}>
                <Plus size={18} /> Create New
              </button>
            </div>

            <div className="profile-summary-card">
              <span className="profile-avatar"><UserCircle size={30} /></span>
              <div className="profile-details"><h2>{user?.name || "ResumeCraft User"}</h2><p>{user?.email || "Sign in to view your account details"}</p><span className="profile-role">{isAdmin ? "Administrator" : "Registered user"}</span></div>
              <button className="secondary-button" onClick={() => handleLogout()}><LogOut size={15} /> Log out</button>
            </div>


            <div className="list-heading">
              <h2>Recent resumes</h2>
              <span>{savedResumes.length} saved</span>
            </div>

            {loadingResumes ? (
              <div className="empty-state">
                <LoaderCircle className="spin" size={28} />
                <p>Loading your resumes...</p>
              </div>
            ) : savedResumes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileText size={34} />
                </div>

                <h3>Your next resume starts here</h3>
                <p>
                  Create your first resume and customize it to match your goals.
                </p>

                <button className="primary-button" onClick={createResume}>
                  <Plus size={18} /> Create your first resume
                </button>
              </div>
            ) : (
              <div className="resume-grid">
                {savedResumes.map((item) => (
                  <article className="resume-card" key={item._id}>
                    <div className="resume-card-top">
                      <span className="resume-file-icon">
                        <FileText />
                      </span>

                      <button
                        className="icon-button delete-button"
                        onClick={() => deleteResume(item._id)}
                        aria-label="Delete resume"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <h3>{item.title || item.name || "My Resume"}</h3>
                    <p>{item.role || "Professional resume"}</p>

                    <div className="resume-card-actions-primary">
                      <button type="button" className="card-view-button" onClick={() => previewSavedResume(item)}>
                        <Eye size={15} /> View resume
                      </button>
                      <button type="button" className="card-edit-button" onClick={() => editResume(item)}>
                        Edit resume <ArrowRight size={16} />
                      </button>
                      <button type="button" className="card-export-button" onClick={() => exportSavedResume(item)}>
                        <Download size={15} /> Export PDF
                      </button>
                    </div>
                    <div className="resume-card-tools resume-card-actions">
                      <button type="button" onClick={() => renameResume(item)}><Pencil size={14} /> Rename</button>
                      <button type="button" onClick={() => duplicateResume(item)}><Copy size={14} /> Duplicate</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "admin-dashboard" && (
          isAdmin ? (
            <section className="admin-dashboard page-container">
              <div className="page-heading"><div><span className="section-kicker">CONTROL CENTER</span><h1>Admin Dashboard</h1><p>Add and manage the templates available to every ResumeCraft user.</p></div><div style={{display:"flex",gap:10,alignItems:"center"}}><button className="secondary-button" onClick={() => setPage("home")}>Home</button><span className="admin-pill"><ShieldCheck size={16} /> Admin access</span><button className="secondary-button" onClick={() => { localStorage.removeItem("resumecraft_admin_session"); setAdminSession(false); setPage("home"); }}> <LogOut size={15} /> Log out</button></div></div>
              <div className="admin-summary-grid"><article><LayoutTemplate size={22} /><span><strong>{allTemplates.length}</strong><small>Available templates</small></span></article><article><UserCircle size={22} /><span><strong>Role protected</strong><small>Administrator workspace</small></span></article></div>
              <div className="admin-content-grid">
                <form className="admin-template-form" onSubmit={addTemplate}>
                  <div className="admin-form-title"><span className="admin-form-icon"><Plus size={20} /></span><div><h2>Add a template</h2><p>Creates a new option in the public Templates gallery.</p></div></div>
                  <label className="field"><span>Template name</span><input required maxLength={50} value={templateForm.name} onChange={(e) => setTemplateForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Blue Minimal" /></label>
                  <label className="field"><span>Description</span><textarea required maxLength={180} value={templateForm.description} onChange={(e) => setTemplateForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe this template" rows={3} /></label>
                  <div className="admin-form-row"><label className="field"><span>Base layout</span><select value={templateForm.baseTemplate} onChange={(e) => setTemplateForm((p) => ({ ...p, baseTemplate: e.target.value }))}>{resumeTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label className="field"><span>Accent color</span><input type="color" value={templateForm.color} onChange={(e) => setTemplateForm((p) => ({ ...p, color: e.target.value }))} /></label></div>
                  <label className="field"><span>Badge label</span><input maxLength={24} value={templateForm.tag} onChange={(e) => setTemplateForm((p) => ({ ...p, tag: e.target.value.toUpperCase() }))} /></label>
                  <button className="primary-button full-button" type="submit" disabled={savingTemplate}>{savingTemplate ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />} {savingTemplate ? "Adding..." : "Add template"}</button>
                </form>
                <div className="admin-template-list"><div className="admin-list-heading"><h2>All templates</h2><span>{allTemplates.length} available</span></div>{allTemplates.length ? allTemplates.map((item) => <article className="admin-template-row" key={item._id}><span className="template-color-dot" style={{ background: item.color || "#4169e1" }} /><div><strong>{item.name}</strong><p>{item.description}</p><small>Layout: {item.baseTemplate || "modern"}</small></div><button className="icon-action danger" onClick={() => deleteTemplate(item._id)} aria-label={`Delete ${item.name}`}><Trash2 size={16} /></button></article>) : <div className="admin-empty"><LayoutTemplate size={28} /><h3>No templates available</h3><p>Add a template using the form. It will appear in the Templates page.</p></div>}</div>
              </div>
            </section>
          ) : <section className="page-container access-denied"><ShieldCheck size={36} /><h1>Admin access required</h1><p>This page is available to administrator accounts only.</p><button className="primary-button" onClick={() => setPage("home")}>Return home</button></section>
        )}

        {page === "preview" && (
          <section className="standalone-resume-preview page-container">
            <div className="standalone-preview-actions">
              <button type="button" className="secondary-button" onClick={() => setPage("dashboard")}><ArrowLeft size={15} /> Back to My Resumes</button>
              <button type="button" className="primary-button" onClick={downloadResume}><Download size={16} /> Export PDF</button>
            </div>
            <div className="standalone-preview-paper">
              <ResumePreview resume={resume} template={template} />
            </div>
          </section>
        )}

        {page === "editor" && (
          <section className="editor-page">
            <div className="editor-heading">
              <div>
                <span className="section-kicker">RESUME WORKSHOP</span>
                <h1>Build your resume</h1>
                <p>Update your details and see the changes instantly.</p>
              </div>

              <div className="editor-actions">
                <button
                  className="secondary-button"
                  onClick={saveResume}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Resume"}
                </button>

                <button className="primary-button" onClick={downloadResume}>
                  <Download size={17} /> Export PDF
                </button>
              </div>
            </div>

            <div className="section-manager">
              <div>
                <h2>Customize your sections</h2>
                <p>Remove sections you don't need or create your own.</p>
              </div>

              {(resume.hiddenSections || []).length > 0 && (
                <div className="restore-sections">
                  <strong>Restore removed sections</strong>
                  {standardSections
                    .filter((section) => resume.hiddenSections.includes(section.id))
                    .map((section) => (
                      <button
                        type="button"
                        key={section.id}
                        className="restore-section-button"
                        onClick={() => restoreSection(section.id)}
                      >
                        <RotateCcw size={14} /> {section.title}
                      </button>
                    ))}
                </div>
              )}

            <div className="resume-tools-grid ats-matcher-row">
              <section className="tool-panel ats-panel">
                  <div className="tool-panel-heading">
                    <span className="tool-icon"><Gauge size={20} /></span>
                    <div><h2>ATS Resume Check</h2><p>Content completeness check — not a guarantee of ATS ranking.</p></div>
                  </div>
                  <div className="ats-score-row">
                    <div className="ats-score-ring" style={{ "--score": `${calculateAtsScore(resume).score}%` }}><strong>{calculateAtsScore(resume).score}</strong><span>/100</span></div>
                    <div className="ats-score-copy"><strong>{calculateAtsScore(resume).score >= 80 ? "Good progress" : calculateAtsScore(resume).score >= 55 ? "Getting there" : "Room to improve"}</strong><span>{calculateAtsScore(resume).checks.filter((item) => item.ok).length} of {calculateAtsScore(resume).checks.length} checks passed</span></div>
                  </div>
                  {calculateAtsScore(resume).suggestions.length ? <ul className="ats-suggestions">{calculateAtsScore(resume).suggestions.slice(0, 4).map((tip) => <li key={tip}>{tip}</li>)}</ul> : <p className="tool-success"><Check size={15} /> Core resume sections look complete.</p>}
              </section>

              <section className="tool-panel matcher-panel">
                <div className="tool-panel-heading">
                  <span className="tool-icon"><Target size={20} /></span>
                  <div><h2>Job Description Matcher</h2><p>Paste a job description to find matching and missing keywords.</p></div>
                </div>
                <textarea className="job-description-input" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here..." rows={5} />
                {jobDescription.trim() && <div className="matcher-results"><div className="matcher-score"><strong>{getJobMatch(resume, jobDescription).score}%</strong><span>keyword overlap</span></div><div className="matcher-keyword-group"><strong>Found ({getJobMatch(resume, jobDescription).matched.length})</strong><div className="keyword-chips">{getJobMatch(resume, jobDescription).matched.slice(0, 12).map((term) => <span className="keyword-found" key={term}>{term}</span>)}</div></div><div className="matcher-keyword-group"><strong>Consider adding if accurate ({getJobMatch(resume, jobDescription).missing.length})</strong><div className="keyword-chips">{getJobMatch(resume, jobDescription).missing.slice(0, 12).map((term) => <span className="keyword-missing" key={term}>{term}</span>)}</div></div><p className="field-help">Keyword overlap is a simple local comparison, not an AI evaluation. Only add skills you genuinely have.</p></div>}
              </section>
            </div>

              <div className="section-manager-bottom">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={addCustomSection}
                >
                  <Plus size={17} /> Add Section
                </button>
              </div>
            </div>



            <section className="section-order-panel">
              <div><h2><GripVertical size={18} /> Reorder resume sections</h2><p>Drag a section to change its order in the live preview and exported PDF.</p></div>
              <div className="section-order-list" onDragOver={(event) => event.preventDefault()}>
                {(resume.sectionOrder?.length ? resume.sectionOrder : initialResume.sectionOrder).map((id) => {
                  const label = resumeSectionLabels.find((item) => item.id === id);
                  if (!label || resume.hiddenSections?.includes(id)) return null;
                  return <div className={`section-order-item ${draggingSection === id ? "dragging" : ""}`} key={id} draggable onDragStart={() => setDraggingSection(id)} onDragEnd={() => setDraggingSection("")} onDrop={(event) => { event.preventDefault(); reorderSections(draggingSection, id); setDraggingSection(""); }}><GripVertical size={17} /><span>{label.title}</span></div>;
                })}
              </div>
            </section>

            <section className="pdf-settings-panel">
              <div><h2><FileText size={18} /> PDF layout controls</h2><p>These settings apply to the live preview and browser PDF export.</p></div>
              <div className="pdf-controls-grid">
                <label>Page size<select value={resume.pdfSettings?.pageSize || "A4"} onChange={(event) => updatePdfSetting("pageSize", event.target.value)}><option value="A4">A4</option><option value="Letter">Letter</option></select></label>
                <label>Font size <strong>{resume.pdfSettings?.fontSize ?? 10}px</strong><input type="range" min="8" max="13" step="0.5" value={resume.pdfSettings?.fontSize ?? 10} onChange={(event) => updatePdfSetting("fontSize", Number(event.target.value))} /></label>
                <label>Page margin <strong>{resume.pdfSettings?.margin ?? 28}px</strong><input type="range" min="12" max="48" step="2" value={resume.pdfSettings?.margin ?? 28} onChange={(event) => updatePdfSetting("margin", Number(event.target.value))} /></label>
                <label>Line spacing <strong>{resume.pdfSettings?.lineHeight ?? 1.45}</strong><input type="range" min="1.1" max="1.8" step="0.05" value={resume.pdfSettings?.lineHeight ?? 1.45} onChange={(event) => updatePdfSetting("lineHeight", Number(event.target.value))} /></label>
              </div>
            </section>

            <div className="editor-layout">
              <div className="editor-form">
                <FormSection
                  title="Personal information"
                  icon={<UserRound size={19} />}
                  hidden={resume.hiddenSections?.includes("personal")}
                  onRemove={() => removeSection("personal")}
                >
                  <Field
                    label="Full name"
                    value={resume.name}
                    onChange={(value) => updateField("name", value)}
                  />

                  <Field
                    label="Professional title"
                    value={resume.role}
                    onChange={(value) => updateField("role", value)}
                  />

                  <div className="form-row">
                    <Field
                      label="Email"
                      value={resume.email}
                      onChange={(value) => updateField("email", value)}
                    />

                    <Field
                      label="Phone"
                      value={resume.phone}
                      onChange={(value) => updateField("phone", value)}
                    />
                  </div>

                  <Field
                    label="Location"
                    value={resume.location}
                    onChange={(value) => updateField("location", value)}
                  />

                  <Field
                    label="LinkedIn Profile URL"
                    value={resume.linkedIn}
                    onChange={(value) => updateField("linkedIn", value)}
                  />
                </FormSection>

                <FormSection
                  title="Professional summary"
                  icon={<BriefcaseBusiness size={19} />}
                  hidden={resume.hiddenSections?.includes("summary")}
                  onRemove={() => removeSection("summary")}
                >
                  <Field
                    label="About you"
                    value={resume.summary}
                    onChange={(value) => updateField("summary", value)}
                    multiline
                  />
                </FormSection>

                <FormSection
                  title="Education"
                  icon={<GraduationCap size={19} />}
                  hidden={resume.hiddenSections?.includes("education")}
                  onRemove={() => removeSection("education")}
                >
                  {(resume.educationEntries || []).map((entry, index) => (
                    <div className="repeatable-entry" key={entry.id}>
                      <div className="repeatable-entry-heading">
                        <h3>Education {index + 1}</h3>

                        <button
                          type="button"
                          className="section-remove-button"
                          onClick={() =>
                            setResume((previous) => ({
                              ...previous,
                              educationEntries:
                                previous.educationEntries.filter(
                                  (item) => item.id !== entry.id
                                ),
                            }))
                          }
                        >
                          <Trash2 size={15} /> Remove Entry
                        </button>
                      </div>

                      <Field
                        label="Degree (SSC / HSC / Graduation / Postgraduation)"
                        value={entry.degree}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            educationEntries:
                              previous.educationEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, degree: value }
                                  : item
                              ),
                          }))
                        }
                      />

                      <Field
                        label="College / University"
                        value={entry.college}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            educationEntries:
                              previous.educationEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, college: value }
                                  : item
                              ),
                          }))
                        }
                      />

                      <div className="form-row">
                        <Field
                          label="Duration / Graduation year"
                          value={entry.duration}
                          onChange={(value) =>
                            setResume((previous) => ({
                              ...previous,
                              educationEntries:
                                previous.educationEntries.map((item) =>
                                  item.id === entry.id
                                    ? { ...item, duration: value }
                                    : item
                                ),
                            }))
                          }
                        />

                        <Field
                          label="CGPA / Percentage"
                          value={entry.marks}
                          onChange={(value) =>
                            setResume((previous) => ({
                              ...previous,
                              educationEntries:
                                previous.educationEntries.map((item) =>
                                  item.id === entry.id
                                    ? { ...item, marks: value }
                                    : item
                                ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="secondary-button repeat-add-button"
                    onClick={() =>
                      setResume((previous) => ({
                        ...previous,
                        educationEntries: [
                          ...(previous.educationEntries || []),
                          createEducation(),
                        ],
                      }))
                    }
                  >
                    <Plus size={16} /> Add Entry
                  </button>
                </FormSection>

                <FormSection
                  title="Projects"
                  icon={<FileText size={19} />}
                  hidden={resume.hiddenSections?.includes("projects")}
                  onRemove={() => removeSection("projects")}
                >
                  {(resume.projects || []).map((project, index) => (
                    <div className="repeatable-entry" key={project.id}>
                      <div className="repeatable-entry-heading">
                        <h3>Project {index + 1}</h3>

                        <button
                          type="button"
                          className="section-remove-button"
                          onClick={() =>
                            setResume((previous) => ({
                              ...previous,
                              projects: previous.projects.filter(
                                (item) => item.id !== project.id
                              ),
                            }))
                          }
                        >
                          <Trash2 size={15} /> Remove Project
                        </button>
                      </div>

                      <Field
                        label="Project Name"
                        value={project.name}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            projects: previous.projects.map((item) =>
                              item.id === project.id
                                ? { ...item, name: value }
                                : item
                            ),
                          }))
                        }
                      />

                      <Field
                        label="Tools / Technologies"
                        value={project.tools}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            projects: previous.projects.map((item) =>
                              item.id === project.id
                                ? { ...item, tools: value }
                                : item
                            ),
                          }))
                        }
                      />

                      <Field
                        label="Project Description"
                        value={project.description}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            projects: previous.projects.map((item) =>
                              item.id === project.id
                                ? { ...item, description: value }
                                : item
                            ),
                          }))
                        }
                        multiline
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="secondary-button repeat-add-button"
                    onClick={() =>
                      setResume((previous) => ({
                        ...previous,
                        projects: [
                          ...(previous.projects || []),
                          createProject(),
                        ],
                      }))
                    }
                  >
                    <Plus size={16} /> Add Entry
                  </button>
                </FormSection>

                <FormSection
                  title="Technical skills"
                  icon={<Sparkles size={19} />}
                  hidden={resume.hiddenSections?.includes("technical-skills")}
                  onRemove={() => removeSection("technical-skills")}
                >
                  <Field
                    label="Technical skills (separate with commas)"
                    value={resume.technicalSkills}
                    onChange={(value) => updateField("technicalSkills", value)}
                    multiline
                  />
                </FormSection>

                <FormSection
                  title="Soft skills"
                  icon={<UserRound size={19} />}
                  hidden={resume.hiddenSections?.includes("soft-skills")}
                  onRemove={() => removeSection("soft-skills")}
                >
                  <Field
                    label="Soft skills (separate with commas)"
                    value={resume.softSkills}
                    onChange={(value) => updateField("softSkills", value)}
                    multiline
                  />

                  <p className="field-help">
                    Example: Communication, Teamwork, Problem Solving
                  </p>
                </FormSection>

                <FormSection
                  title="Work experience / internship"
                  icon={<BriefcaseBusiness size={19} />}
                  hidden={resume.hiddenSections?.includes("experience")}
                  onRemove={() => removeSection("experience")}
                >
                  {(resume.experienceEntries || []).map((entry, index) => (
                    <div className="repeatable-entry" key={entry.id}>
                      <div className="repeatable-entry-heading">
                        <h3>Experience {index + 1}</h3>

                        <button
                          type="button"
                          className="section-remove-button"
                          onClick={() =>
                            setResume((previous) => ({
                              ...previous,
                              experienceEntries:
                                previous.experienceEntries.filter(
                                  (item) => item.id !== entry.id
                                ),
                            }))
                          }
                        >
                          <Trash2 size={15} /> Remove Entry
                        </button>
                      </div>

                      <Field
                        label="Company name"
                        value={entry.company}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            experienceEntries:
                              previous.experienceEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, company: value }
                                  : item
                              ),
                          }))
                        }
                      />

                      <Field
                        label="Job role"
                        value={entry.role}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            experienceEntries:
                              previous.experienceEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, role: value }
                                  : item
                              ),
                          }))
                        }
                      />

                      <Field
                        label="Duration"
                        value={entry.duration}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            experienceEntries:
                              previous.experienceEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, duration: value }
                                  : item
                              ),
                          }))
                        }
                      />

                      <Field
                        label="Responsibilities / work done"
                        value={entry.description}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            experienceEntries:
                              previous.experienceEntries.map((item) =>
                                item.id === entry.id
                                  ? { ...item, description: value }
                                  : item
                              ),
                          }))
                        }
                        multiline
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="secondary-button repeat-add-button"
                    onClick={() =>
                      setResume((previous) => ({
                        ...previous,
                        experienceEntries: [
                          ...(previous.experienceEntries || []),
                          createExperience(),
                        ],
                      }))
                    }
                  >
                    <Plus size={16} /> Add Entry
                  </button>
                </FormSection>

                <FormSection
                  title="Certifications & achievements"
                  icon={<GraduationCap size={19} />}
                  hidden={resume.hiddenSections?.includes("certifications")}
                  onRemove={() => removeSection("certifications")}
                >
                  {(resume.certificationEntries || []).map((entry, index) => (
                    <div className="repeat-entry-row certification-entry-row" key={entry.id}>
                      <Field
                        label={`Certification or achievement ${index + 1}`}
                        value={entry.name}
                        onChange={(value) =>
                          setResume((previous) => ({
                            ...previous,
                            certificationEntries: previous.certificationEntries.map((item) =>
                              item.id === entry.id ? { ...item, name: value } : item
                            ),
                          }))
                        }
                      />
                      {(resume.certificationEntries || []).length > 1 && (
                        <button
                          type="button"
                          className="section-remove-button certification-delete-button"
                          title="Remove certification"
                          aria-label="Remove certification"
                          onClick={() =>
                            setResume((previous) => ({
                              ...previous,
                              certificationEntries: previous.certificationEntries.filter(
                                (item) => item.id !== entry.id
                              ),
                            }))
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="secondary-button repeat-add-button"
                    onClick={() =>
                      setResume((previous) => ({
                        ...previous,
                        certificationEntries: [
                          ...(previous.certificationEntries || []),
                          createCertification(),
                        ],
                      }))
                    }
                  >
                    <Plus size={16} /> Add Certification
                  </button>
                </FormSection>

                <FormSection
                  title="Languages known"
                  icon={<FileText size={19} />}
                  hidden={resume.hiddenSections?.includes("languages")}
                  onRemove={() => removeSection("languages")}
                >
                  <Field
                    label="Languages (separate with commas)"
                    value={resume.languages}
                    onChange={(value) => updateField("languages", value)}
                    multiline
                  />
                </FormSection>

                {(resume.customSections || []).map((section) => (
                  <FormSection
                    key={section.id}
                    title={section.title}
                    icon={<FileText size={19} />}
                    onRemove={() => deleteCustomSection(section.id)}
                  >
                    <Field
                      label="Section title"
                      value={section.title}
                      onChange={(value) =>
                        updateCustomSection(section.id, "title", value)
                      }
                    />

                    <Field
                      label="Section content"
                      value={section.content}
                      onChange={(value) =>
                        updateCustomSection(section.id, "content", value)
                      }
                      multiline
                    />
                  </FormSection>
                ))}




                <button
                  className="primary-button full-button"
                  onClick={saveResume}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Resume"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>

              <div className="preview-column">
                <div className="preview-heading">
                  <div>
                    <h3>Live Preview</h3>
                    <p>Your resume updates as you type.</p>
                  </div>

                  <button
                    className="icon-button"
                    onClick={downloadResume}
                    title="Export PDF"
                    aria-label="Export PDF"
                  >
                    <Download size={19} />
                  </button>
                </div>

                <ResumePreview
                  resume={resume}
                  printable
                  template={template}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <button
          className="brand footer-brand"
          onClick={() => setPage("home")}
        >
          <span className="brand-icon">
            <FileText size={18} />
          </span>

          <span>
            Resume<span className="brand-highlight">Craft</span>
          </span>
        </button>

        <p>Build your story. Make your next move.</p>
        <span>© 2026 ResumeCraft</span>
      </footer>
    </div>
  );
}

function FormSection({
  title,
  icon,
  children,
  hidden = false,
  onRemove,
}) {
  const [isOpen, setIsOpen] = useState(
    title === "Personal information" || title === "Professional summary"
  );

  if (hidden) return null;

  return (
    <section className={`form-section flow-section ${isOpen ? "is-open" : ""}`}>
      <div className="flow-section-heading">
        <button
          type="button"
          className="flow-section-toggle"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
        >
          <span className="flow-section-icon">{icon}</span>
          <span className="flow-section-title">{title}</span>
          <span className="flow-chevron" aria-hidden="true">{isOpen ? "⌃" : "⌄"}</span>
        </button>
        <button
          type="button"
          className="section-remove-button flow-section-remove"
          onClick={onRemove}
          title={`Remove ${title}`}
          aria-label={`Remove ${title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {isOpen && <div className="flow-section-content">{children}</div>}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const textValue = typeof value === "string" ? value : String(value ?? "");
  const previewValue = textValue.trim() || `Add ${label.toLowerCase()}`;

  return (
    <div className={`flow-entry ${isEditing ? "editing" : ""}`}>
      <div className="flow-entry-preview">
        <span className="flow-drag-handle" aria-hidden="true">⠿</span>

        <button
          type="button"
          className="flow-entry-text"
          onClick={() => setIsEditing((previous) => !previous)}
          aria-label={`Edit ${label}`}
        >
          <span className="flow-entry-label">{label}</span>
          <span className={`flow-entry-value ${textValue.trim() ? "" : "empty"}`}>
            {previewValue}
          </span>
        </button>

        <button
          type="button"
          className="flow-edit-button"
          onClick={() => setIsEditing((previous) => !previous)}
          aria-label={isEditing ? `Finish editing ${label}` : `Edit ${label}`}
          title={isEditing ? "Done editing" : "Edit field"}
        >
          {isEditing ? <Check size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {isEditing && (
        <div className="flow-entry-editor">
          <label className="flow-input-label">
            <span>{label}</span>
            {multiline ? (
              <textarea
                rows={4}
                value={textValue}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={textValue}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                autoFocus
              />
            )}
          </label>
          <div className="flow-entry-actions">
            <button
              type="button"
              className="flow-done-button"
              onClick={() => setIsEditing(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumePreview({
  resume = initialResume,
  printable = false,
  template = "simple",
}) {
  const technicalSkills = splitList(resume.technicalSkills);
  const softSkills = splitList(resume.softSkills);
  const languages = splitList(resume.languages);
  const hidden = resume.hiddenSections || [];

  const educationEntries = (resume.educationEntries || []).filter(
    (entry) =>
      entry.degree || entry.college || entry.duration || entry.marks
  );

  const projects = (resume.projects || []).filter(
    (project) => project.name || project.tools || project.description
  );

  const experienceEntries = (resume.experienceEntries || []).filter(
    (entry) =>
      entry.company || entry.role || entry.duration || entry.description
  );

  const summarySection = resume.summary ? (
    <section className="paper-section" key="summary">
      <h3>PROFESSIONAL SUMMARY</h3>
      <p>{resume.summary}</p>
    </section>
  ) : null;

  const experienceSection = experienceEntries.length > 0 ? (
    <section className="paper-section" key="experience">
      <h3>WORK EXPERIENCE / INTERNSHIP</h3>

      {experienceEntries.map((entry) => (
        <div key={entry.id} className="paper-entry">
          {entry.role && <strong>{entry.role}</strong>}
          {entry.company && <p>{entry.company}</p>}
          {entry.duration && <p>{entry.duration}</p>}
          {entry.description && <p>{entry.description}</p>}
        </div>
      ))}
    </section>
  ) : null;

  const educationSection = educationEntries.length > 0 ? (
    <section className="paper-section" key="education">
      <h3>EDUCATION</h3>

      {educationEntries.map((entry) => (
        <div key={entry.id} className="paper-entry">
          {entry.degree && <strong>{entry.degree}</strong>}
          {entry.college && <p>{entry.college}</p>}

          {[entry.duration, entry.marks].filter(Boolean).length > 0 && (
            <p>
              {[entry.duration, entry.marks].filter(Boolean).join(" | ")}
            </p>
          )}
        </div>
      ))}
    </section>
  ) : null;

  const projectSection = projects.length > 0 ? (
    <section className="paper-section" key="projects">
      <h3>PROJECTS</h3>

      {projects.map((project) => (
        <div key={project.id} className="paper-entry">
          {project.name && <strong>{project.name}</strong>}

          {project.tools && (
            <p>
              <strong>Tools:</strong> {project.tools}
            </p>
          )}

          {project.description && <p>{project.description}</p>}
        </div>
      ))}
    </section>
  ) : null;

  const skillsSection = technicalSkills.length > 0 ? (
    <section className="paper-section" key="technical-skills">
      <h3>TECHNICAL SKILLS</h3>

      <div className="paper-skills">
        {technicalSkills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    </section>
  ) : null;

  const softSkillsSection = softSkills.length > 0 ? (
    <section className="paper-section" key="soft-skills">
      <h3>SOFT SKILLS</h3>

      <div className="paper-skills">
        {softSkills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    </section>
  ) : null;

  const certifications = (resume.certificationEntries || [])
    .map((entry) => entry.name?.trim())
    .filter(Boolean);
  // Older saved resumes may only have the original single certifications field.
  if (certifications.length === 0 && resume.certifications) {
    certifications.push(...splitEntries(resume.certifications));
  }

  const certificationSection = certifications.length > 0 ? (
    <section className="paper-section" key="certifications">
      <h3>CERTIFICATIONS & ACHIEVEMENTS</h3>
      <div className="paper-certifications">
        {certifications.map((certification, index) => (
          <span key={`${certification}-${index}`}>{certification}</span>
        ))}
      </div>
    </section>
  ) : null;

  const languagesSection = languages.length > 0 ? (
    <section className="paper-section" key="languages">
      <h3>LANGUAGES KNOWN</h3>
      <div className="paper-skills paper-languages">
        {languages.map((language, index) => (
          <span key={`${language}-${index}`}>{language}</span>
        ))}
      </div>
    </section>
  ) : null;

  let sections;

  if (template === "firstjob") {
    sections = [
      educationSection,
      projectSection,
      skillsSection,
      softSkillsSection,
      experienceSection,
      certificationSection,
      languagesSection,
      summarySection,
    ];
  } else if (template === "compact") {
    sections = [
      summarySection,
      skillsSection,
      educationSection,
      experienceSection,
      projectSection,
      certificationSection,
      softSkillsSection,
      languagesSection,
    ];
  } else {
    sections = [
      summarySection,
      experienceSection,
      educationSection,
      projectSection,
      skillsSection,
      softSkillsSection,
      certificationSection,
      languagesSection,
    ];
  }

  return (
    <article
      className={`resume-paper template-${template} ${
        printable ? "printable-paper" : ""
      }`}
      style={{
        padding: `${resume.pdfSettings?.margin ?? 28}px`,
        fontSize: `${resume.pdfSettings?.fontSize ?? 10}px`,
        lineHeight: resume.pdfSettings?.lineHeight ?? 1.45,
        "--resume-page-size": resume.pdfSettings?.pageSize || "A4",
      }}
    >
      {!hidden.includes("personal") && (
        <header className="paper-header">
          <h2>{resume.name || "Your Name"}</h2>
          <p className="paper-role">{resume.role || "Target Job Role"}</p>

          <p className="paper-contact">
            {[resume.email, resume.phone, resume.location]
              .filter(Boolean)
              .join(" | ")}
          </p>

          {resume.linkedIn && (
            <p className="paper-contact">{resume.linkedIn}</p>
          )}
        </header>
      )}

      {(resume.sectionOrder?.length ? resume.sectionOrder : initialResume.sectionOrder)
        .map((sectionId) => sections.find((section) => section?.key === sectionId))
        .filter(Boolean)
        .filter((section) => !hidden.includes(section.key))}

      {(resume.customSections || [])
        .filter(
          (section) => section.title?.trim() && section.content?.trim()
        )
        .map((section) => (
          <section className="paper-section" key={section.id}>
            <h3>{section.title.toUpperCase()}</h3>
            <p>{section.content}</p>
          </section>
        ))}
    </article>
  );
}

export default App;