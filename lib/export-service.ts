import { Course } from '@/types/course';

export class ExportService {
  /**
   * Export course as standalone HTML
   */
  async exportAsHTML(course: Course): Promise<string> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(course.metadata.jobTitle)} - GenAI Course</title>
  <style>
    ${this.getInlineStyles()}
  </style>
</head>
<body>
  <div class="course-container">
    ${this.renderCourseHTML(course)}
  </div>
  <script>
    ${this.getInlineScripts()}
  </script>
</body>
</html>`;

    return html;
  }

  /**
   * Export course as PDF (returns HTML for PDF rendering)
   */
  async exportAsPDF(course: Course): Promise<string> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(course.metadata.jobTitle)} - GenAI Course</title>
  <style>
    ${this.getPDFStyles()}
  </style>
</head>
<body>
  <div class="pdf-container">
    ${this.renderCourseHTML(course)}
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Render course content as HTML
   */
  private renderCourseHTML(course: Course): string {
    let html = '<div class="course-wrapper">';

    // Title page
    html += `
      <div class="title-page">
        <div class="brand">GenAI Course Creator</div>
        <h1 class="main-title">${this.escapeHtml(course.metadata.jobTitle)}</h1>
        <div class="subtitle">Personalized AI Learning Path</div>
        <div class="course-meta">
          <div class="meta-item">
            <span class="meta-label">Total Learning Time:</span>
            <span class="meta-value">${course.metadata.estimatedTotalTime || 0} minutes</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Chapters:</span>
            <span class="meta-value">${course.chapters.length}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Created:</span>
            <span class="meta-value">${new Date(course.metadata.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `;

    // Table of contents
    html += '<nav class="toc">';
    html += '<h2>Table of Contents</h2>';
    html += '<ol>';
    course.chapters.forEach(chapter => {
      html += `
        <li>
          <a href="#chapter-${chapter.number}">
            <span class="chapter-number">Chapter ${chapter.number}</span>
            <span class="chapter-title">${this.escapeHtml(chapter.title)}</span>
            <span class="chapter-time">${chapter.estimated_time_minutes} min</span>
          </a>
        </li>
      `;
    });
    html += '</ol>';
    html += '</nav>';

    // Role analysis
    html += `
      <section class="role-analysis">
        <h2>Role Analysis & AI Impact</h2>
        <div class="analysis-grid">
          <div class="analysis-card">
            <h3>Current State</h3>
            <p>${this.escapeHtml(course.analysis.current_state)}</p>
          </div>
          <div class="analysis-card">
            <h3>AI Transformation</h3>
            <p>${this.escapeHtml(course.analysis.ai_impact)}</p>
          </div>
          <div class="analysis-card">
            <h3>Timeline</h3>
            <p>${this.escapeHtml(course.analysis.transformation_timeline)}</p>
          </div>
          <div class="analysis-card">
            <h3>Critical Skills</h3>
            <ul>
              ${course.analysis.critical_skills.map(skill =>
                `<li>${this.escapeHtml(skill)}</li>`
              ).join('')}
            </ul>
          </div>
        </div>
      </section>
    `;

    // Chapters
    course.chapters.forEach(chapter => {
      html += this.renderChapter(chapter);
    });

    html += '</div>';
    return html;
  }

  /**
   * Render individual chapter
   */
  private renderChapter(chapter: any): string {
    if (!chapter.content) {
      return `
        <article id="chapter-${chapter.number}" class="chapter">
          <h2>Chapter ${chapter.number}: ${this.escapeHtml(chapter.title)}</h2>
          <p class="error">Content not available</p>
        </article>
      `;
    }

    return `
      <article id="chapter-${chapter.number}" class="chapter">
        <header class="chapter-header">
          <div class="chapter-number-badge">Chapter ${chapter.number}</div>
          <h2 class="chapter-title">${this.escapeHtml(chapter.title)}</h2>
          <div class="chapter-meta">
            <span class="time-badge">⏱ ${chapter.estimated_time_minutes} min</span>
          </div>
        </header>

        <section class="learning-objectives">
          <h3>Learning Objectives</h3>
          <ul class="objectives-list">
            ${chapter.objectives.map((obj: string) =>
              `<li>${this.escapeHtml(obj)}</li>`
            ).join('')}
          </ul>
        </section>

        <section class="opening-scenario">
          <div class="scenario-card">
            <h3 class="scenario-title">${this.escapeHtml(chapter.content.opening_scenario.title)}</h3>
            <div class="scenario-content">
              <div class="scenario-item">
                <strong>Scenario:</strong>
                <p>${this.escapeHtml(chapter.content.opening_scenario.scenario)}</p>
              </div>
              <div class="scenario-item">
                <strong>Challenge:</strong>
                <p>${this.escapeHtml(chapter.content.opening_scenario.challenge)}</p>
              </div>
              <div class="scenario-item highlight">
                <strong>AI Solution:</strong>
                <p>${this.escapeHtml(chapter.content.opening_scenario.ai_solution)}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="core-concepts">
          <h3>Core Concepts</h3>
          ${chapter.content.core_concepts.map((concept: any) => `
            <div class="concept-card">
              <h4>${this.escapeHtml(concept.concept)}</h4>
              <p class="concept-explanation">${this.escapeHtml(concept.explanation)}</p>
              <div class="role-example">
                <strong>In Your Role:</strong>
                <p>${this.escapeHtml(concept.role_example)}</p>
              </div>
              ${concept.tools_mentioned && concept.tools_mentioned.length > 0 ? `
                <div class="tools">
                  <strong>Tools:</strong>
                  <div class="tool-tags">
                    ${concept.tools_mentioned.map((tool: string) =>
                      `<span class="tool-tag">${this.escapeHtml(tool)}</span>`
                    ).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </section>

        <section class="exercises">
          <h3>Practical Exercises</h3>
          ${chapter.content.practical_exercises.map((exercise: any) => `
            <div class="exercise-card ${exercise.difficulty}">
              <div class="exercise-header">
                <h4>${this.escapeHtml(exercise.title)}</h4>
                <span class="difficulty-badge ${exercise.difficulty}">${exercise.difficulty}</span>
              </div>
              <div class="exercise-content">
                <div class="exercise-section">
                  <strong>Instructions:</strong>
                  <p>${this.escapeHtml(exercise.instructions)}</p>
                </div>
                <div class="exercise-section">
                  <strong>Expected Outcome:</strong>
                  <p>${this.escapeHtml(exercise.expected_outcome)}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </section>

        ${chapter.latestNews && chapter.latestNews.length > 0 ? `
          <section class="latest-updates">
            <h3>Latest Industry Updates</h3>
            <div class="news-grid">
              ${chapter.latestNews.map((news: any) => `
                <div class="news-card">
                  <h4>${this.escapeHtml(news.title)}</h4>
                  <p>${this.escapeHtml(news.summary)}</p>
                  ${news.source ? `
                    <a href="${this.escapeHtml(news.source)}" target="_blank" class="news-link">
                      Read more →
                    </a>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="takeaways">
          <h3>Key Takeaways</h3>
          <ul class="takeaways-list">
            ${chapter.content.key_takeaways.map((takeaway: string) =>
              `<li>${this.escapeHtml(takeaway)}</li>`
            ).join('')}
          </ul>
        </section>

        <section class="action-items">
          <h3>Your Action Items</h3>
          <ul class="action-list">
            ${chapter.content.action_items.map((item: any) => `
              <li>
                <span class="action-task">${this.escapeHtml(item.task)}</span>
                <span class="action-timeline">${this.escapeHtml(item.timeline)}</span>
              </li>
            `).join('')}
          </ul>
        </section>
      </article>
    `;
  }

  /**
   * Get inline CSS styles
   */
  private getInlineStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        background: #f8f9fa;
      }

      .course-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      .title-page {
        text-align: center;
        padding: 80px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px;
        margin-bottom: 40px;
      }

      .brand {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        opacity: 0.9;
        margin-bottom: 20px;
      }

      .main-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 20px;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 24px;
        opacity: 0.9;
        margin-bottom: 40px;
      }

      .course-meta {
        display: flex;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
      }

      .meta-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .meta-label {
        font-size: 12px;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .meta-value {
        font-size: 20px;
        font-weight: 600;
      }

      .toc {
        background: white;
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      .toc h2 {
        font-size: 32px;
        margin-bottom: 30px;
        color: #667eea;
      }

      .toc ol {
        list-style: none;
        counter-reset: chapter;
      }

      .toc li {
        counter-increment: chapter;
        margin-bottom: 15px;
      }

      .toc a {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: #f8f9fa;
        border-radius: 10px;
        text-decoration: none;
        color: #1a1a1a;
        transition: all 0.3s;
      }

      .toc a:hover {
        background: #e9ecef;
        transform: translateX(5px);
      }

      .chapter-number {
        font-weight: 600;
        color: #667eea;
        min-width: 100px;
      }

      .chapter-title {
        flex: 1;
      }

      .chapter-time {
        font-size: 14px;
        color: #6c757d;
      }

      .role-analysis {
        background: white;
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      .role-analysis h2 {
        font-size: 32px;
        margin-bottom: 30px;
        color: #667eea;
      }

      .analysis-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .analysis-card {
        padding: 25px;
        background: #f8f9fa;
        border-radius: 15px;
        border-left: 4px solid #667eea;
      }

      .analysis-card h3 {
        font-size: 18px;
        margin-bottom: 15px;
        color: #667eea;
      }

      .analysis-card ul {
        list-style-position: inside;
      }

      .chapter {
        background: white;
        padding: 40px;
        border-radius: 20px;
        margin-bottom: 40px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      .chapter-header {
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .chapter-number-badge {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .chapter-title {
        font-size: 36px;
        margin-bottom: 10px;
      }

      .time-badge {
        display: inline-block;
        background: #e9ecef;
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 14px;
        color: #6c757d;
      }

      .chapter section {
        margin-bottom: 40px;
      }

      .chapter h3 {
        font-size: 24px;
        margin-bottom: 20px;
        color: #667eea;
      }

      .objectives-list, .takeaways-list {
        list-style-position: inside;
        line-height: 2;
      }

      .scenario-card {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 15px;
        border-left: 4px solid #667eea;
      }

      .scenario-title {
        font-size: 20px;
        margin-bottom: 20px;
        color: #667eea;
      }

      .scenario-item {
        margin-bottom: 20px;
      }

      .scenario-item strong {
        display: block;
        margin-bottom: 8px;
        color: #667eea;
      }

      .scenario-item.highlight {
        background: white;
        padding: 15px;
        border-radius: 10px;
      }

      .concept-card {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 20px;
      }

      .concept-card h4 {
        font-size: 20px;
        margin-bottom: 15px;
        color: #1a1a1a;
      }

      .concept-explanation {
        margin-bottom: 15px;
      }

      .role-example {
        background: white;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
      }

      .tool-tags {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 8px;
      }

      .tool-tag {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
      }

      .exercise-card {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 20px;
        border-left: 4px solid #28a745;
      }

      .exercise-card.intermediate {
        border-left-color: #ffc107;
      }

      .exercise-card.advanced {
        border-left-color: #dc3545;
      }

      .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .exercise-header h4 {
        font-size: 18px;
      }

      .difficulty-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 600;
      }

      .difficulty-badge.beginner {
        background: #d4edda;
        color: #155724;
      }

      .difficulty-badge.intermediate {
        background: #fff3cd;
        color: #856404;
      }

      .difficulty-badge.advanced {
        background: #f8d7da;
        color: #721c24;
      }

      .exercise-section {
        margin-bottom: 15px;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .news-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 15px;
      }

      .news-card h4 {
        font-size: 16px;
        margin-bottom: 10px;
        color: #1a1a1a;
      }

      .news-card p {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 10px;
      }

      .news-link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
      }

      .news-link:hover {
        text-decoration: underline;
      }

      .action-list {
        list-style: none;
      }

      .action-list li {
        background: #f8f9fa;
        padding: 15px 20px;
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .action-task {
        flex: 1;
      }

      .action-timeline {
        color: #667eea;
        font-weight: 600;
        font-size: 14px;
      }

      @media print {
        body {
          background: white;
        }
        .chapter {
          page-break-after: always;
        }
      }
    `;
  }

  /**
   * Get PDF-specific styles
   */
  private getPDFStyles(): string {
    return this.getInlineStyles() + `
      @page {
        size: A4;
        margin: 20mm;
      }

      body {
        background: white;
      }

      .title-page {
        page-break-after: always;
      }

      .chapter {
        page-break-after: always;
      }
    `;
  }

  /**
   * Get inline JavaScript
   */
  private getInlineScripts(): string {
    return `
      // Smooth scrolling for TOC links
      document.querySelectorAll('.toc a').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      // Add active class to current section in TOC
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.toc a').forEach(link => {
              link.classList.remove('active');
            });
            const activeLink = document.querySelector('.toc a[href="#' + id + '"]');
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.chapter').forEach(chapter => {
        observer.observe(chapter);
      });
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Export singleton instance
export const exportService = new ExportService();
