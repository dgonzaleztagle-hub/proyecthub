const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;
const ROOT_PATH = 'D:\\\\proyectos';

app.use(cors());
app.use(express.json());

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const entries = await fs.readdir(ROOT_PATH, { withFileTypes: true });
        const projects = [];

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            if (['$RECYCLE.BIN', 'System Volume Information', 'agendaproyectos'].includes(entry.name)) continue;

            const projectPath = path.join(ROOT_PATH, entry.name);

            // Check for .git
            let hasGit = false;
            let repoUrl;
            try {
                const gitPath = path.join(projectPath, '.git');
                await fs.access(gitPath);
                hasGit = true;

                try {
                    const configContent = await fs.readFile(path.join(gitPath, 'config'), 'utf-8');
                    const match = configContent.match(/\\[remote "origin"\\]\\s+url = (.+)/);
                    if (match && match[1]) {
                        repoUrl = match[1].trim();
                    }
                } catch { }
            } catch { }

            let company = 'CloudLab';
            let type = 'other';
            let lastModified = new Date().toISOString();

            try {
                const infoPath = path.join(projectPath, '_management_data', 'info.json');
                const infoContent = await fs.readFile(infoPath, 'utf-8');
                const info = JSON.parse(infoContent);
                if (info.company) company = info.company;
                if (info.type) type = info.type;
            } catch { }

            try {
                const stats = await fs.stat(projectPath);
                lastModified = stats.mtime.toISOString();
            } catch { }

            projects.push({
                name: entry.name,
                path: projectPath,
                company,
                type,
                hasGit,
                repoUrl,
                lastModified,
            });
        }

        res.json(projects);
    } catch (error) {
        console.error('Error reading projects:', error);
        res.status(500).json({ error: 'Error reading projects' });
    }
});

// Create new project
app.post('/api/projects', async (req, res) => {
    const { name, company, type } = req.body;
    const projectPath = path.join(ROOT_PATH, name);

    try {
        await fs.mkdir(projectPath);
        const dataPath = path.join(projectPath, '_management_data');
        await fs.mkdir(dataPath);

        const info = { name, company, type, createdAt: new Date().toISOString() };
        await fs.writeFile(path.join(dataPath, 'info.json'), JSON.stringify(info, null, 2));

        const initialData = { clients: [], payments: [], notes: '', tasks: [] };
        await fs.writeFile(path.join(dataPath, 'data.json'), JSON.stringify(initialData, null, 2));

        res.json({ success: true, path: projectPath });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get project data
app.get('/api/projects/:name/data', async (req, res) => {
    try {
        const dataPath = path.join(ROOT_PATH, req.params.name, '_management_data', 'data.json');
        const content = await fs.readFile(dataPath, 'utf-8');
        res.json(JSON.parse(content));
    } catch (error) {
        res.status(404).json(null);
    }
});

// Update project data
app.put('/api/projects/:name/data', async (req, res) => {
    try {
        const dataPath = path.join(ROOT_PATH, req.params.name, '_management_data', 'data.json');
        await fs.writeFile(dataPath, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating project data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
