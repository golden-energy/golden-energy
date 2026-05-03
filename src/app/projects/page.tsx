"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";

interface ProjectImage {
  id: number;
  image_url: string;
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/projects?limit=200`)
      .then(async (res) => {
        const payload = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(payload?.error || "Failed to fetch projects");
        }

        return payload;
      })
      .then((data) => {
        setProjects(Array.isArray(data?.data) ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="projects-main">
        <div className="container">
          <header className="page-header">
            <h1>{t.projectsPage.title}</h1>
            <p>{t.projectsPage.subtitle}</p>
          </header>
          
          {loading && <div className="status-msg">{t.projectsPage.loading}</div>}
          {error && <div className="status-msg error">{t.projectsPage.errorPrefix}: {error}</div>}
          
          {!loading && !error && (
            <div className="table-wrapper">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>{t.projectsPage.columns.id}</th>
                    <th>Photo</th>
                    <th>{t.projectsPage.columns.location}</th>
                    <th>{t.projectsPage.columns.client}</th>
                    <th>{t.projectsPage.columns.scope}</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td data-label={t.projectsPage.columns.id}>{project.id}</td>
                      <td data-label="Photo">
                        {(() => {
                          const cover = project.images?.find((image) => image.is_cover) || project.images?.[0];
                          return cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cover.image_url} alt={cover.alt_text || project.client} className="project-thumb" />
                          ) : (
                            <span className="no-photo">—</span>
                          );
                        })()}
                      </td>
                      <td data-label={t.projectsPage.columns.location}>{project.location}</td>
                      <td data-label={t.projectsPage.columns.client}>{project.client}</td>
                      <td data-label={t.projectsPage.columns.scope} className="scope-cell">
                        {project.scope}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <div className="status-msg">{t.projectsPage.empty}</div>
              )}
            </div>
          )}
          
          <div className="actions">
            <Link href="/" className="btn-primary">
              {t.projectsPage.backHome}
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .projects-main {
          padding-top: 120px;
          padding-bottom: 60px;
          background-color: #fcfcfc;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
          z-index: 1;
        }

        .page-header h1 {
          color: var(--primary-color, #f39c12);
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .page-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .status-msg {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
        }

        .status-msg.error {
          color: #e74c3c;
        }

        .table-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .projects-table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
        }

        .projects-table th {
          background-color: var(--primary-color, #f39c12);
          color: white;
          padding: 15px;
          text-align: right;
          font-weight: 600;
        }

        .projects-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
          text-align: right;
          vertical-align: top;
        }

        .project-thumb {
          width: 90px;
          height: 64px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }

        .no-photo {
          color: #999;
        }

        .scope-cell {
          white-space: pre-wrap;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .projects-table tr:hover {
          background-color: #fff9f0;
        }

        .actions {
          margin-top: 50px;
          text-align: center;
        }

        /* Mobile Responsiveness - Transformed Table */
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 1.8rem;
          }

          .projects-table thead {
            display: none; /* Hide headers on mobile */
          }

          .projects-table, 
          .projects-table tbody, 
          .projects-table tr, 
          .projects-table td {
            display: block;
            width: 100%;
          }

          .projects-table tr {
            margin-bottom: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 10px;
            background: white;
          }

          .projects-table td {
            text-align: right;
            padding-right: 45%;
            position: relative;
            border-bottom: 1px solid #f9f9f9;
          }

          .projects-table td:last-child {
            border-bottom: none;
          }

          .projects-table td::before {
            content: attr(data-label);
            position: absolute;
            right: 15px;
            width: 40%;
            padding-left: 10px;
            font-weight: bold;
            text-align: right;
            color: var(--primary-color, #f39c12);
          }

          .scope-cell {
            padding-right: 15px !important;
            padding-top: 35px !important;
          }

          .scope-cell::before {
            position: absolute;
            top: 10px;
            right: 15px;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
