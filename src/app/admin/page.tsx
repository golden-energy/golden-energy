"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  storage_path: string;
  alt_text: string | null;
  is_cover: boolean;
}

interface Project {
  id: number;
  location: string;
  client: string;
  scope: string;
  images?: ProjectImage[];
}

interface ProjectFormState {
  location: string;
  client: string;
  scope: string;
}

const emptyForm: ProjectFormState = {
  location: "",
  client: "",
  scope: "",
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageIsCover, setImageIsCover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const request = async <T,>(path: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(adminKey ? { "x-admin-key": adminKey } : {}),
        ...(options.headers || {}),
      },
    });

    if (response.status === 204) return null as T;

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.error || "Request failed");
    }

    return payload as T;
  };

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await request<{ data: Project[] }>("/api/projects?limit=200");
      setProjects(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedKey = window.localStorage.getItem("golden-energy-admin-key") || "";
    setAdminKey(savedKey);
    setRememberKey(Boolean(savedKey));
  }, []);

  const unlockAdmin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await request("/api/admin/validate");

      if (rememberKey) {
        window.localStorage.setItem("golden-energy-admin-key", adminKey);
      } else {
        window.localStorage.removeItem("golden-energy-admin-key");
      }

      setIsUnlocked(true);
      setMessage("Admin unlocked.");
      await loadProjects();
    } catch (err) {
      setIsUnlocked(false);
      setError(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const lockAdmin = () => {
    setIsUnlocked(false);
    setAdminKey("");
    setProjects([]);
    setSelectedProjectId(null);
    window.localStorage.removeItem("golden-energy-admin-key");
    setMessage("Admin locked.");
    setError(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitProject = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (editingId) {
        await request(`/api/projects/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        setMessage("Project updated successfully.");
      } else {
        await request("/api/projects", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMessage("Project added successfully.");
      }

      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project: Project) => {
    setEditingId(project.id);
    setSelectedProjectId(project.id);
    setForm({
      location: project.location,
      client: project.client,
      scope: project.scope,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (project: Project) => {
    const confirmed = window.confirm(`Delete project #${project.id} for ${project.client}?`);
    if (!confirmed) return;

    setError(null);
    setMessage(null);
    try {
      await request(`/api/projects/${project.id}`, { method: "DELETE" });
      setMessage("Project deleted successfully.");
      if (selectedProjectId === project.id) setSelectedProjectId(null);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const uploadImage = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedProjectId || !imageFile) {
      setError("Choose a project and image first.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const base64 = await fileToBase64(imageFile);
      await request(`/api/projects/${selectedProjectId}/images`, {
        method: "POST",
        body: JSON.stringify({
          fileName: imageFile.name,
          contentType: imageFile.type,
          base64,
          altText: imageAlt,
          isCover: imageIsCover,
        }),
      });

      setImageFile(null);
      setImageAlt("");
      setImageIsCover(false);
      setMessage("Image uploaded successfully.");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const setCoverImage = async (imageId: number) => {
    setError(null);
    setMessage(null);
    try {
      await request(`/api/project-images/${imageId}/cover`, { method: "PATCH" });
      setMessage("Cover image updated.");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set cover image");
    }
  };

  const deleteImage = async (imageId: number) => {
    const confirmed = window.confirm("Delete this image?");
    if (!confirmed) return;

    setError(null);
    setMessage(null);
    try {
      await request(`/api/project-images/${imageId}`, { method: "DELETE" });
      setMessage("Image deleted successfully.");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  if (!isUnlocked) {
    return (
      <main className="admin-page login-page">
        <section className="login-card">
          <p className="eyebrow">Golden Energy</p>
          <h1>Admin Login</h1>
          <p className="muted">Enter the admin password before opening the dashboard.</p>

          <form onSubmit={unlockAdmin} className="stacked-form">
            <label>
              Password
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Admin password"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={(event) => setRememberKey(event.target.checked)}
              />
              Remember password in this browser
            </label>
            <button type="submit" disabled={loading}>{loading ? "Checking..." : "Open admin dashboard"}</button>
          </form>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <Link href="/" className="login-link">Back to website</Link>
        </section>

        <style jsx>{`
          .admin-page {
            align-items: center;
            background: #f4f7fb;
            display: flex;
            justify-content: center;
            min-height: 100vh;
            padding: 32px 16px;
          }
          .login-card {
            background: #fff;
            border: 1px solid #e5e9f0;
            border-radius: 18px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
            max-width: 460px;
            padding: 28px;
            width: 100%;
          }
          .login-card h1 {
            color: #1e3a8a;
            font-size: clamp(2rem, 4vw, 2.6rem);
            line-height: 1.1;
            margin-bottom: 10px;
          }
          .eyebrow {
            color: #f2b500;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-size: 0.8rem;
          }
          .muted {
            color: #64748b;
            margin-bottom: 18px;
          }
          .stacked-form {
            display: grid;
            gap: 14px;
          }
          label {
            color: #334155;
            display: grid;
            font-weight: 700;
            gap: 7px;
          }
          input {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            color: #0f172a;
            font: inherit;
            padding: 11px 12px;
            width: 100%;
          }
          .checkbox-label {
            align-items: center;
            display: flex;
            gap: 10px;
          }
          .checkbox-label input {
            width: auto;
          }
          button,
          .login-link {
            border: 0;
            border-radius: 10px;
            background: #f2b500;
            color: #fff;
            cursor: pointer;
            display: inline-block;
            font-weight: 700;
            padding: 10px 14px;
            text-align: center;
            text-decoration: none;
          }
          button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
          .login-link {
            background: #eef2f7;
            color: #1e3a8a;
            margin-top: 14px;
          }
          .success {
            color: #047857;
            font-weight: 700;
            margin-top: 14px;
          }
          .error {
            color: #dc2626;
            font-weight: 700;
            margin-top: 14px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Golden Energy</p>
            <h1>Admin Dashboard</h1>
            <p>Manage company projects and project photos from one place.</p>
          </div>
          <Link href="/" className="secondary-link">View website</Link>
        </div>

        <div className="grid two-columns">
          <section className="card">
            <h2>Access</h2>
            <p className="muted">The dashboard is unlocked for this browser session.</p>
            <div className="inline-form">
              <button type="button" className="ghost" onClick={lockAdmin}>Lock admin</button>
            </div>
          </section>

          <section className="card status-card">
            <h2>Status</h2>
            {loading && <p className="muted">Loading projects...</p>}
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !message && !error && <p className="muted">Ready.</p>}
          </section>
        </div>

        <div className="grid two-columns align-start">
          <section className="card">
            <h2>{editingId ? `Edit project #${editingId}` : "Add new project"}</h2>
            <form onSubmit={submitProject} className="stacked-form">
              <label>
                Location
                <input
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                  required
                  placeholder="الغردقة"
                />
              </label>
              <label>
                Client
                <input
                  value={form.client}
                  onChange={(event) => setForm((current) => ({ ...current, client: event.target.value }))}
                  required
                  placeholder="Client / project name"
                />
              </label>
              <label>
                Scope
                <textarea
                  value={form.scope}
                  onChange={(event) => setForm((current) => ({ ...current, scope: event.target.value }))}
                  required
                  rows={8}
                  placeholder="Project work scope"
                />
              </label>
              <div className="button-row">
                <button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update project" : "Add project"}</button>
                {editingId && <button type="button" className="ghost" onClick={resetForm}>Cancel edit</button>}
              </div>
            </form>
          </section>

          <section className="card">
            <h2>Upload project photos</h2>
            <form onSubmit={uploadImage} className="stacked-form">
              <label>
                Project
                <select
                  value={selectedProjectId ?? ""}
                  onChange={(event) => setSelectedProjectId(Number(event.target.value) || null)}
                  required
                >
                  <option value="">Choose project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>#{project.id} - {project.client}</option>
                  ))}
                </select>
              </label>
              <label>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  required
                />
              </label>
              <label>
                Alt text
                <input
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                  placeholder="Short image description"
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={imageIsCover}
                  onChange={(event) => setImageIsCover(event.target.checked)}
                />
                Set as cover image
              </label>
              <button type="submit" disabled={saving}>Upload image</button>
            </form>

            {selectedProject && (
              <div className="image-gallery">
                <h3>Photos for #{selectedProject.id}</h3>
                {(selectedProject.images || []).length === 0 && <p className="muted">No images yet.</p>}
                {(selectedProject.images || []).map((image) => (
                  <div className="image-row" key={image.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.image_url} alt={image.alt_text || selectedProject.client} />
                    <div>
                      <p>{image.alt_text || "Project image"}</p>
                      {image.is_cover && <span className="badge">Cover</span>}
                    </div>
                    <div className="image-actions">
                      {!image.is_cover && <button type="button" className="ghost" onClick={() => setCoverImage(image.id)}>Set cover</button>}
                      <button type="button" className="danger" onClick={() => deleteImage(image.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="card">
          <div className="section-header">
            <h2>Projects</h2>
            <button type="button" className="ghost" onClick={loadProjects}>Refresh</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Client</th>
                  <th>Photos</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>#{project.id}</td>
                    <td>{project.location}</td>
                    <td>{project.client}</td>
                    <td>{project.images?.length || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="ghost" onClick={() => setSelectedProjectId(project.id)}>Photos</button>
                        <button type="button" onClick={() => editProject(project)}>Edit</button>
                        <button type="button" className="danger" onClick={() => deleteProject(project)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f4f7fb;
          padding: 32px 16px;
        }
        .admin-shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .admin-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .admin-topbar h1 {
          color: #1e3a8a;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.1;
        }
        .eyebrow {
          color: #f2b500;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .secondary-link,
        button {
          border: 0;
          border-radius: 10px;
          background: #f2b500;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          padding: 10px 14px;
          text-decoration: none;
          white-space: nowrap;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        button.ghost {
          background: #eef2f7;
          color: #1e3a8a;
        }
        button.danger {
          background: #dc2626;
        }
        .grid {
          display: grid;
          gap: 18px;
          margin-bottom: 18px;
        }
        .two-columns {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .align-start {
          align-items: start;
        }
        .card {
          background: #fff;
          border: 1px solid #e5e9f0;
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          padding: 22px;
        }
        .card h2 {
          color: #1e3a8a;
          margin-bottom: 10px;
        }
        .muted {
          color: #64748b;
        }
        .success {
          color: #047857;
          font-weight: 700;
        }
        .error {
          color: #dc2626;
          font-weight: 700;
        }
        .inline-form {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .stacked-form {
          display: grid;
          gap: 14px;
        }
        label {
          color: #334155;
          display: grid;
          font-weight: 700;
          gap: 7px;
        }
        input,
        textarea,
        select {
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #0f172a;
          font: inherit;
          padding: 11px 12px;
          width: 100%;
        }
        textarea {
          resize: vertical;
        }
        .checkbox-label {
          align-items: center;
          display: flex;
          gap: 10px;
        }
        .checkbox-label input {
          width: auto;
        }
        .button-row,
        .section-header,
        .table-actions,
        .image-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-header {
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .table-scroll {
          overflow-x: auto;
        }
        table {
          border-collapse: collapse;
          min-width: 780px;
          width: 100%;
        }
        th,
        td {
          border-bottom: 1px solid #e5e9f0;
          padding: 12px;
          text-align: left;
          vertical-align: top;
        }
        th {
          color: #1e3a8a;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .image-gallery {
          border-top: 1px solid #e5e9f0;
          margin-top: 20px;
          padding-top: 18px;
        }
        .image-gallery h3 {
          color: #1e3a8a;
          margin-bottom: 12px;
        }
        .image-row {
          align-items: center;
          border: 1px solid #e5e9f0;
          border-radius: 14px;
          display: grid;
          gap: 12px;
          grid-template-columns: 74px 1fr auto;
          margin-bottom: 10px;
          padding: 10px;
        }
        .image-row img {
          border-radius: 10px;
          height: 62px;
          object-fit: cover;
          width: 74px;
        }
        .badge {
          background: #dcfce7;
          border-radius: 999px;
          color: #047857;
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          margin-top: 4px;
          padding: 3px 8px;
        }
        @media (max-width: 820px) {
          .admin-topbar,
          .inline-form,
          .button-row,
          .section-header,
          .table-actions,
          .image-actions {
            align-items: stretch;
            flex-direction: column;
          }
          .two-columns {
            grid-template-columns: 1fr;
          }
          .image-row {
            grid-template-columns: 1fr;
          }
          .image-row img {
            height: 180px;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
