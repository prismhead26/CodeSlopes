/**
 * Seed tech tutorials as blog posts so they appear in /blog and admin/posts
 *
 * Usage: npm run seed:blog-tutorials
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, '../service-account.json');
const fs = require('fs');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing service-account.json file in project root.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface BlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  authorId: string;
  authorName: string;
  authorPhoto: string | null;
  readingTime: number;
  views: number;
  likes: number;
}

const blogPosts: Omit<BlogPostData, 'slug' | 'readingTime' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'views' | 'likes'>[] = [
  {
    title: 'Linux Command Line Essentials for Beginners',
    content: `
<h2>Introduction to the Linux Command Line</h2>
<p>The command line is one of the most powerful tools in a developer's arsenal. Whether you're managing servers, automating tasks, or just navigating your file system more efficiently, mastering the terminal is essential.</p>

<h2>Getting Started</h2>
<p>Open your terminal application. On most Linux distributions, you can use <code>Ctrl + Alt + T</code> or find it in your applications menu.</p>

<h3>Basic Navigation Commands</h3>
<pre><code class="language-bash"># Print working directory - shows where you are
pwd

# List files and directories
ls
ls -la  # Detailed list including hidden files

# Change directory
cd /path/to/directory
cd ..   # Go up one level
cd ~    # Go to home directory
cd -    # Go to previous directory</code></pre>

<h3>File Operations</h3>
<pre><code class="language-bash"># Create a new file
touch filename.txt

# Create a new directory
mkdir new-directory
mkdir -p parent/child/grandchild  # Create nested directories

# Copy files and directories
cp source.txt destination.txt
cp -r source-dir/ destination-dir/  # Copy directories recursively

# Move or rename files
mv oldname.txt newname.txt
mv file.txt /new/location/

# Remove files and directories
rm file.txt
rm -r directory/  # Remove directory and contents
rm -rf directory/ # Force remove (use with caution!)</code></pre>

<h3>Viewing File Contents</h3>
<pre><code class="language-bash"># Display entire file
cat filename.txt

# Display with pagination
less filename.txt  # Use q to quit

# Display first/last lines
head -n 10 filename.txt  # First 10 lines
tail -n 10 filename.txt  # Last 10 lines
tail -f logfile.log      # Follow file updates in real-time</code></pre>

<h2>Working with Text</h2>
<h3>Searching with grep</h3>
<pre><code class="language-bash"># Search for a pattern in files
grep "search term" filename.txt
grep -r "search term" directory/  # Recursive search
grep -i "search term" file.txt    # Case insensitive
grep -n "search term" file.txt    # Show line numbers</code></pre>

<h3>Text Processing with sed and awk</h3>
<pre><code class="language-bash"># Replace text with sed
sed 's/old/new/g' file.txt        # Replace all occurrences
sed -i 's/old/new/g' file.txt     # Edit file in place

# Extract columns with awk
awk '{print $1}' file.txt         # Print first column
awk -F',' '{print $2}' file.csv   # Use comma as delimiter</code></pre>

<h2>Permissions and Ownership</h2>
<pre><code class="language-bash"># View permissions
ls -la

# Change permissions
chmod 755 script.sh    # rwxr-xr-x
chmod +x script.sh     # Add execute permission
chmod u+w file.txt     # Add write for user

# Change ownership
chown user:group file.txt
chown -R user:group directory/</code></pre>

<h2>Process Management</h2>
<pre><code class="language-bash"># View running processes
ps aux
top       # Interactive process viewer
htop      # Better interactive viewer (if installed)

# Kill processes
kill PID
kill -9 PID   # Force kill
pkill process-name

# Run in background
command &
nohup command &   # Persist after logout</code></pre>

<h2>Useful Tips</h2>
<ul>
<li>Use <code>Tab</code> for auto-completion</li>
<li>Use <code>Ctrl + R</code> to search command history</li>
<li>Use <code>!!</code> to repeat the last command</li>
<li>Use <code>sudo !!</code> to run the last command with sudo</li>
<li>Use <code>man command</code> to read the manual for any command</li>
</ul>

<h2>Conclusion</h2>
<p>These commands form the foundation of Linux system administration. Practice them regularly, and you'll find yourself becoming more efficient and comfortable with the command line. In future tutorials, we'll explore more advanced topics like shell scripting and system administration.</p>
`,
    excerpt: 'Master the essential Linux commands every developer needs to know. From basic navigation to file operations and process management.',
    coverImage: null,
    category: 'linux',
    tags: ['linux', 'command-line', 'terminal', 'bash', 'beginners'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
  {
    title: 'Git Workflow Best Practices for Teams',
    content: `
<h2>Introduction</h2>
<p>Git is the backbone of modern software development. While basic Git commands are easy to learn, establishing a solid workflow for your team can significantly improve collaboration and code quality.</p>

<h2>Setting Up Git</h2>
<pre><code class="language-bash"># Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable helpful colors
git config --global color.ui auto

# Set your preferred editor
git config --global core.editor "code --wait"  # VS Code</code></pre>

<h2>Branching Strategy: Git Flow</h2>
<p>A well-defined branching strategy keeps your repository organized and makes collaboration smoother.</p>

<h3>Main Branches</h3>
<ul>
<li><strong>main</strong> - Production-ready code</li>
<li><strong>develop</strong> - Integration branch for features</li>
</ul>

<h3>Supporting Branches</h3>
<ul>
<li><strong>feature/*</strong> - New features</li>
<li><strong>bugfix/*</strong> - Bug fixes</li>
<li><strong>hotfix/*</strong> - Urgent production fixes</li>
<li><strong>release/*</strong> - Release preparation</li>
</ul>

<pre><code class="language-bash"># Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on your feature...
git add .
git commit -m "feat: add login form component"

# Keep your branch updated
git fetch origin
git rebase origin/develop

# Push your branch
git push -u origin feature/user-authentication</code></pre>

<h2>Writing Good Commit Messages</h2>
<p>Follow the Conventional Commits specification for clear, meaningful commit history:</p>

<pre><code class="language-text"># Format
&lt;type&gt;(&lt;scope&gt;): &lt;description&gt;

[optional body]

[optional footer]

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, semicolons)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(auth): add JWT token refresh mechanism
fix(api): handle null response in user endpoint
docs(readme): update installation instructions
refactor(utils): extract date formatting helpers</code></pre>

<h2>Pull Request Best Practices</h2>
<h3>Before Creating a PR</h3>
<pre><code class="language-bash"># Update your branch with latest changes
git fetch origin
git rebase origin/develop

# Squash commits if needed (interactive rebase)
git rebase -i HEAD~3  # Last 3 commits

# Run tests locally
npm test
npm run lint</code></pre>

<h3>PR Checklist</h3>
<ul>
<li>Descriptive title following commit conventions</li>
<li>Link to related issue(s)</li>
<li>Summary of changes</li>
<li>Screenshots for UI changes</li>
<li>Test coverage for new code</li>
<li>Documentation updates if needed</li>
</ul>

<h2>Code Review Guidelines</h2>
<h3>As a Reviewer</h3>
<ul>
<li>Review promptly (within 24 hours)</li>
<li>Be constructive and specific</li>
<li>Approve if changes are acceptable</li>
<li>Use suggestions for minor changes</li>
</ul>

<h3>As an Author</h3>
<ul>
<li>Keep PRs small and focused</li>
<li>Respond to feedback professionally</li>
<li>Don't take criticism personally</li>
</ul>

<h2>Handling Merge Conflicts</h2>
<pre><code class="language-bash"># When conflicts occur during rebase
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for conflict markers: &lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;

# After resolving
git add resolved-file.txt
git rebase --continue

# If things go wrong
git rebase --abort  # Start over</code></pre>

<h2>Useful Git Commands</h2>
<pre><code class="language-bash"># View commit history
git log --oneline --graph --all

# Stash changes temporarily
git stash
git stash pop
git stash list

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout -- .
git clean -fd  # Remove untracked files

# Cherry-pick a commit
git cherry-pick &lt;commit-hash&gt;

# Find who changed a line
git blame filename.txt</code></pre>

<h2>Conclusion</h2>
<p>A consistent Git workflow improves team productivity and code quality. Start with these practices and adapt them to your team's needs. Remember, the best workflow is one that your entire team follows consistently.</p>
`,
    excerpt: 'Learn professional Git workflows, branching strategies, and collaboration best practices used by development teams worldwide.',
    coverImage: null,
    category: 'devops',
    tags: ['git', 'version-control', 'workflow', 'collaboration', 'devops'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
  {
    title: 'Docker Fundamentals: Containerize Your Applications',
    content: `
<h2>What is Docker?</h2>
<p>Docker is a platform for developing, shipping, and running applications in containers. Containers package your application with all its dependencies, ensuring it runs consistently across different environments.</p>

<h2>Why Use Docker?</h2>
<ul>
<li><strong>Consistency</strong> - "Works on my machine" becomes "works everywhere"</li>
<li><strong>Isolation</strong> - Applications run independently without conflicts</li>
<li><strong>Efficiency</strong> - Containers share the host OS kernel, using fewer resources than VMs</li>
<li><strong>Scalability</strong> - Easy to scale applications horizontally</li>
</ul>

<h2>Installing Docker</h2>
<pre><code class="language-bash"># Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (logout required)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker run hello-world</code></pre>

<h2>Docker Basics</h2>
<h3>Images vs Containers</h3>
<ul>
<li><strong>Image</strong> - A read-only template with instructions for creating a container</li>
<li><strong>Container</strong> - A runnable instance of an image</li>
</ul>

<h3>Essential Commands</h3>
<pre><code class="language-bash"># Pull an image
docker pull nginx:latest

# List images
docker images

# Run a container
docker run -d -p 8080:80 --name my-nginx nginx

# List running containers
docker ps
docker ps -a  # Include stopped containers

# Stop/Start/Remove containers
docker stop my-nginx
docker start my-nginx
docker rm my-nginx

# View logs
docker logs my-nginx
docker logs -f my-nginx  # Follow logs

# Execute command in running container
docker exec -it my-nginx bash</code></pre>

<h2>Creating a Dockerfile</h2>
<p>A Dockerfile defines how to build your container image.</p>

<h3>Node.js Application Example</h3>
<pre><code class="language-dockerfile"># Use an official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "server.js"]</code></pre>

<h3>Build and Run</h3>
<pre><code class="language-bash"># Build the image
docker build -t my-node-app:1.0 .

# Run the container
docker run -d -p 3000:3000 --name my-app my-node-app:1.0</code></pre>

<h2>Docker Compose</h2>
<p>Docker Compose lets you define and run multi-container applications.</p>

<h3>docker-compose.yml Example</h3>
<pre><code class="language-yaml">version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/myapp
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=myapp
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:</code></pre>

<h3>Docker Compose Commands</h3>
<pre><code class="language-bash"># Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Scale a service
docker-compose up -d --scale web=3</code></pre>

<h2>Best Practices</h2>
<h3>Dockerfile Optimization</h3>
<pre><code class="language-dockerfile"># Use multi-stage builds to reduce image size
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]</code></pre>

<h3>Security Best Practices</h3>
<ul>
<li>Use official base images</li>
<li>Run as non-root user</li>
<li>Scan images for vulnerabilities</li>
<li>Don't store secrets in images</li>
<li>Keep images minimal</li>
</ul>

<pre><code class="language-dockerfile"># Run as non-root user
FROM node:20-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
# ... rest of Dockerfile</code></pre>

<h2>Useful Commands Reference</h2>
<pre><code class="language-bash"># Clean up unused resources
docker system prune -a

# View resource usage
docker stats

# Inspect a container
docker inspect container-name

# Copy files to/from container
docker cp local-file.txt container:/path/
docker cp container:/path/file.txt ./

# View container's environment
docker exec container env</code></pre>

<h2>Conclusion</h2>
<p>Docker simplifies application deployment and ensures consistency across environments. Start with simple containers, then progress to Docker Compose for multi-container applications. As you grow, explore orchestration tools like Kubernetes for production workloads.</p>
`,
    excerpt: 'Get started with Docker containers. Learn to build images, run containers, and orchestrate multi-container applications with Docker Compose.',
    coverImage: null,
    category: 'devops',
    tags: ['docker', 'containers', 'devops', 'deployment', 'docker-compose'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
  {
    title: 'Network Troubleshooting: Essential Tools and Techniques',
    content: `
<h2>Introduction</h2>
<p>Network issues can be frustrating, but with the right tools and systematic approach, you can diagnose and resolve most problems efficiently. This guide covers essential networking tools available on Linux and Windows.</p>

<h2>Basic Connectivity Testing</h2>
<h3>Ping</h3>
<p>The simplest way to test if a host is reachable.</p>
<pre><code class="language-bash"># Basic ping
ping google.com

# Limit number of pings
ping -c 4 google.com        # Linux
ping -n 4 google.com        # Windows

# Set timeout
ping -W 2 google.com        # Linux (2 seconds)

# Ping with timestamp
ping -D google.com          # Linux</code></pre>

<h3>Understanding Ping Results</h3>
<ul>
<li><strong>Reply</strong> - Host is reachable</li>
<li><strong>Request timed out</strong> - No response (firewall, down, or unreachable)</li>
<li><strong>Destination unreachable</strong> - Routing problem</li>
<li><strong>High latency</strong> - Network congestion or distance</li>
</ul>

<h2>Tracing Network Paths</h2>
<h3>Traceroute / Tracert</h3>
<pre><code class="language-bash"># Linux
traceroute google.com

# Windows
tracert google.com

# Use ICMP instead of UDP (Linux)
traceroute -I google.com

# Show AS numbers
traceroute -A google.com</code></pre>

<h3>MTR (My Traceroute)</h3>
<p>Combines ping and traceroute for continuous monitoring.</p>
<pre><code class="language-bash"># Install on Ubuntu
sudo apt install mtr

# Run MTR
mtr google.com

# Report mode (run and exit)
mtr -r -c 10 google.com</code></pre>

<h2>DNS Troubleshooting</h2>
<h3>nslookup and dig</h3>
<pre><code class="language-bash"># Basic DNS lookup
nslookup google.com
dig google.com

# Query specific record types
dig google.com MX           # Mail servers
dig google.com NS           # Name servers
dig google.com TXT          # TXT records
dig google.com ANY          # All records

# Use specific DNS server
dig @8.8.8.8 google.com
nslookup google.com 8.8.8.8

# Reverse DNS lookup
dig -x 8.8.8.8

# Trace DNS resolution
dig +trace google.com</code></pre>

<h3>Common DNS Issues</h3>
<ul>
<li><strong>NXDOMAIN</strong> - Domain doesn't exist</li>
<li><strong>SERVFAIL</strong> - DNS server failed to answer</li>
<li><strong>Timeout</strong> - DNS server unreachable</li>
</ul>

<h2>Port and Service Testing</h2>
<h3>Netcat (nc)</h3>
<pre><code class="language-bash"># Test if a port is open
nc -zv hostname 80
nc -zv hostname 22

# Scan range of ports
nc -zv hostname 20-25

# Listen on a port (for testing)
nc -l 8080</code></pre>

<h3>Telnet</h3>
<pre><code class="language-bash"># Test connection to a port
telnet hostname 80
telnet hostname 443

# Test SMTP
telnet mail.example.com 25</code></pre>

<h3>curl for HTTP Testing</h3>
<pre><code class="language-bash"># Basic HTTP request
curl https://api.example.com

# Show response headers
curl -I https://api.example.com

# Verbose output (shows connection details)
curl -v https://api.example.com

# Test with specific HTTP method
curl -X POST -d "data=test" https://api.example.com

# Follow redirects
curl -L https://example.com

# Show timing information
curl -w "@curl-format.txt" -o /dev/null -s https://example.com</code></pre>

<h2>Network Configuration</h2>
<h3>Viewing Network Interfaces</h3>
<pre><code class="language-bash"># Linux
ip addr
ip link show
ifconfig (deprecated but still common)

# Windows
ipconfig /all

# View routing table
ip route          # Linux
route print       # Windows
netstat -rn       # Both</code></pre>

<h3>Checking Active Connections</h3>
<pre><code class="language-bash"># Linux
ss -tuln          # Listening ports
ss -tunp          # With process info
netstat -tuln     # Alternative

# Windows
netstat -an
netstat -b        # With process names (admin required)

# Find what's using a port
lsof -i :8080     # Linux
netstat -ano | findstr :8080  # Windows</code></pre>

<h2>Packet Analysis</h2>
<h3>tcpdump</h3>
<pre><code class="language-bash"># Capture all traffic on interface
sudo tcpdump -i eth0

# Filter by host
sudo tcpdump host 192.168.1.100

# Filter by port
sudo tcpdump port 80

# Save to file for Wireshark analysis
sudo tcpdump -i eth0 -w capture.pcap

# Read from capture file
tcpdump -r capture.pcap

# Show packet contents
sudo tcpdump -A port 80</code></pre>

<h2>Troubleshooting Methodology</h2>
<ol>
<li><strong>Define the problem</strong> - What exactly isn't working?</li>
<li><strong>Check physical layer</strong> - Cables, links, lights</li>
<li><strong>Verify local config</strong> - IP, gateway, DNS settings</li>
<li><strong>Test connectivity</strong> - Ping gateway, then external hosts</li>
<li><strong>Check DNS</strong> - Can you resolve names?</li>
<li><strong>Test the service</strong> - Is the specific port/service responding?</li>
<li><strong>Check firewalls</strong> - Local and network firewalls</li>
<li><strong>Analyze packets</strong> - When all else fails, capture traffic</li>
</ol>

<h2>Quick Reference</h2>
<table>
<tr><th>Task</th><th>Tool</th></tr>
<tr><td>Basic connectivity</td><td>ping</td></tr>
<tr><td>Path analysis</td><td>traceroute, mtr</td></tr>
<tr><td>DNS lookup</td><td>dig, nslookup</td></tr>
<tr><td>Port testing</td><td>nc, telnet</td></tr>
<tr><td>HTTP testing</td><td>curl</td></tr>
<tr><td>View connections</td><td>ss, netstat</td></tr>
<tr><td>Packet capture</td><td>tcpdump, Wireshark</td></tr>
</table>

<h2>Conclusion</h2>
<p>Network troubleshooting is a methodical process. Start simple with ping and work your way up to more complex tools as needed. Document your findings and build a mental model of your network to speed up future troubleshooting.</p>
`,
    excerpt: 'Learn essential network troubleshooting tools and techniques. From ping to packet analysis, diagnose and resolve network issues efficiently.',
    coverImage: null,
    category: 'networking',
    tags: ['networking', 'troubleshooting', 'linux', 'sysadmin', 'tcp-ip'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
  {
    title: 'Web Application Security Best Practices',
    content: `
<h2>Introduction</h2>
<p>Security should be a primary concern from the start of any web application project. This guide covers the most critical security practices to protect your applications and users.</p>

<h2>OWASP Top 10 Overview</h2>
<p>The OWASP Top 10 represents the most critical security risks to web applications:</p>
<ol>
<li>Broken Access Control</li>
<li>Cryptographic Failures</li>
<li>Injection</li>
<li>Insecure Design</li>
<li>Security Misconfiguration</li>
<li>Vulnerable Components</li>
<li>Authentication Failures</li>
<li>Software Integrity Failures</li>
<li>Logging & Monitoring Failures</li>
<li>Server-Side Request Forgery (SSRF)</li>
</ol>

<h2>Preventing Injection Attacks</h2>
<h3>SQL Injection</h3>
<pre><code class="language-javascript">// BAD - Vulnerable to SQL injection
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// GOOD - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);

// With an ORM (Prisma example)
const user = await prisma.user.findUnique({
  where: { id: userId }
});</code></pre>

<h3>XSS (Cross-Site Scripting)</h3>
<pre><code class="language-javascript">// BAD - Directly inserting user input
element.innerHTML = userInput;

// GOOD - Use textContent or sanitize
element.textContent = userInput;

// Or sanitize HTML with DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// React automatically escapes by default
return &lt;div&gt;{userInput}&lt;/div&gt;;  // Safe

// But be careful with dangerouslySetInnerHTML
return &lt;div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}} /&gt;;</code></pre>

<h2>Authentication Best Practices</h2>
<h3>Password Storage</h3>
<pre><code class="language-javascript">import bcrypt from 'bcrypt';

// Hash password before storing
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(inputPassword, hashedPassword);</code></pre>

<h3>Session Management</h3>
<pre><code class="language-javascript">// Use secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000    // 1 hour
  }
}));</code></pre>

<h3>JWT Best Practices</h3>
<pre><code class="language-javascript">import jwt from 'jsonwebtoken';

// Sign token with expiration
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }  // Short-lived access tokens
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // Handle invalid/expired token
}</code></pre>

<h2>Authorization & Access Control</h2>
<pre><code class="language-javascript">// Implement role-based access control
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// Usage
app.delete('/api/users/:id',
  requireRole('admin'),
  deleteUserHandler
);

// Always verify ownership for user-specific resources
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(order);
});</code></pre>

<h2>Security Headers</h2>
<pre><code class="language-javascript">// Using Helmet.js for Express
import helmet from 'helmet';

app.use(helmet());

// Or configure headers manually
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );

  // HSTS (HTTPS only)
  res.setHeader('Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  next();
});</code></pre>

<h2>CSRF Protection</h2>
<pre><code class="language-javascript">import csrf from 'csurf';

// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Include token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// In your HTML form
// &lt;input type="hidden" name="_csrf" value="{{csrfToken}}"&gt;</code></pre>

<h2>Input Validation</h2>
<pre><code class="language-javascript">import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age: z.number().int().min(18).max(120).optional(),
});

// Validate input
app.post('/api/users', (req, res) => {
  try {
    const validatedData = userSchema.parse(req.body);
    // Process valid data
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
});</code></pre>

<h2>Secure File Uploads</h2>
<pre><code class="language-javascript">import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      // Generate random filename
      const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});</code></pre>

<h2>Logging and Monitoring</h2>
<pre><code class="language-javascript">import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Log security events
logger.info('User login', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

logger.warn('Failed login attempt', {
  email: req.body.email,
  ip: req.ip,
  reason: 'Invalid password'
});</code></pre>

<h2>Security Checklist</h2>
<ul>
<li>Use HTTPS everywhere</li>
<li>Keep dependencies updated</li>
<li>Implement rate limiting</li>
<li>Use parameterized queries</li>
<li>Sanitize all user input</li>
<li>Set secure HTTP headers</li>
<li>Implement proper authentication</li>
<li>Use CSRF tokens for forms</li>
<li>Validate file uploads</li>
<li>Log security events</li>
<li>Regular security audits</li>
</ul>

<h2>Conclusion</h2>
<p>Security is an ongoing process, not a one-time task. Stay updated with the latest vulnerabilities, regularly audit your code, and always assume user input is malicious. Building security into your development workflow from the start is far easier than adding it later.</p>
`,
    excerpt: 'Essential security practices for web applications. Learn to protect against common vulnerabilities like XSS, SQL injection, and implement proper authentication.',
    coverImage: null,
    category: 'security',
    tags: ['security', 'web-development', 'owasp', 'authentication', 'best-practices'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
  {
    title: 'Setting Up a Windows Development Environment',
    content: `
<h2>Introduction</h2>
<p>A well-configured development environment is crucial for productivity. This guide walks you through setting up a modern Windows development environment with all the tools you need.</p>

<h2>Windows Terminal</h2>
<p>Windows Terminal is the modern terminal application for Windows that supports multiple tabs, panes, and shells.</p>

<h3>Installation</h3>
<pre><code class="language-powershell"># Install via winget
winget install Microsoft.WindowsTerminal

# Or from Microsoft Store
# Search for "Windows Terminal"</code></pre>

<h3>Recommended Settings</h3>
<p>Open settings with <code>Ctrl + ,</code> and configure:</p>
<ul>
<li>Set your default profile (PowerShell, Git Bash, or WSL)</li>
<li>Enable acrylic background for a modern look</li>
<li>Configure font (Cascadia Code is excellent for coding)</li>
</ul>

<h2>Windows Subsystem for Linux (WSL2)</h2>
<p>WSL2 gives you a full Linux environment on Windows - essential for modern web development.</p>

<h3>Installation</h3>
<pre><code class="language-powershell"># Open PowerShell as Administrator
wsl --install

# This installs WSL2 with Ubuntu by default
# Restart your computer when prompted

# After restart, set up your Linux username and password</code></pre>

<h3>Install Other Distributions</h3>
<pre><code class="language-powershell"># List available distributions
wsl --list --online

# Install a specific distribution
wsl --install -d Debian
wsl --install -d Ubuntu-22.04</code></pre>

<h3>WSL Configuration</h3>
<p>Create <code>~/.wslconfig</code> in your Windows home folder:</p>
<pre><code class="language-ini">[wsl2]
memory=8GB
processors=4
swap=2GB

[experimental]
autoMemoryReclaim=gradual</code></pre>

<h2>Package Managers</h2>
<h3>Winget (Windows Package Manager)</h3>
<pre><code class="language-powershell"># Search for packages
winget search vscode

# Install packages
winget install Microsoft.VisualStudioCode
winget install Git.Git
winget install Node.js.LTS

# Update all packages
winget upgrade --all</code></pre>

<h3>Chocolatey (Alternative)</h3>
<pre><code class="language-powershell"># Install Chocolatey (run as Admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Install packages
choco install nodejs-lts git vscode -y</code></pre>

<h2>Git Configuration</h2>
<pre><code class="language-bash"># Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set VS Code as default editor
git config --global core.editor "code --wait"

# Configure line endings (important for Windows)
git config --global core.autocrlf true

# Enable helpful colors
git config --global color.ui auto

# Set default branch name
git config --global init.defaultBranch main</code></pre>

<h3>SSH Keys for GitHub</h3>
<pre><code class="language-bash"># Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start ssh-agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub | clip

# Add to GitHub: Settings > SSH Keys > New SSH Key</code></pre>

<h2>Node.js Setup</h2>
<h3>Using nvm-windows</h3>
<pre><code class="language-powershell"># Download and install nvm-windows from:
# https://github.com/coreybutler/nvm-windows/releases

# Install Node.js versions
nvm install lts
nvm install 20

# Use a specific version
nvm use 20

# List installed versions
nvm list</code></pre>

<h3>Essential Global Packages</h3>
<pre><code class="language-bash"># Install useful global tools
npm install -g pnpm
npm install -g yarn
npm install -g typescript
npm install -g ts-node
npm install -g nodemon</code></pre>

<h2>Visual Studio Code Setup</h2>
<h3>Essential Extensions</h3>
<ul>
<li><strong>ESLint</strong> - JavaScript/TypeScript linting</li>
<li><strong>Prettier</strong> - Code formatting</li>
<li><strong>GitLens</strong> - Enhanced Git integration</li>
<li><strong>Remote - WSL</strong> - Work in WSL from VS Code</li>
<li><strong>Thunder Client</strong> - API testing</li>
<li><strong>Docker</strong> - Docker integration</li>
<li><strong>Error Lens</strong> - Inline error display</li>
</ul>

<h3>Recommended Settings</h3>
<pre><code class="language-json">{
  "editor.fontSize": 14,
  "editor.fontFamily": "Cascadia Code, Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "files.autoSave": "onFocusChange",
  "workbench.colorTheme": "One Dark Pro"
}</code></pre>

<h2>Docker Desktop</h2>
<pre><code class="language-powershell"># Install Docker Desktop
winget install Docker.DockerDesktop

# After installation:
# 1. Enable WSL2 backend in Docker settings
# 2. Enable Kubernetes if needed
# 3. Configure resource limits</code></pre>

<h2>Database Tools</h2>
<h3>PostgreSQL</h3>
<pre><code class="language-powershell"># Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Or run via Docker
docker run -d --name postgres \\
  -e POSTGRES_PASSWORD=mysecretpassword \\
  -p 5432:5432 \\
  postgres:15</code></pre>

<h3>Database GUIs</h3>
<ul>
<li><strong>DBeaver</strong> - Universal database tool</li>
<li><strong>pgAdmin</strong> - PostgreSQL specific</li>
<li><strong>MongoDB Compass</strong> - MongoDB GUI</li>
</ul>

<h2>Useful PowerShell Configuration</h2>
<p>Add to your PowerShell profile (<code>$PROFILE</code>):</p>
<pre><code class="language-powershell"># Create profile if it doesn't exist
if (!(Test-Path -Path $PROFILE)) {
  New-Item -ItemType File -Path $PROFILE -Force
}

# Edit profile
notepad $PROFILE

# Add these lines:
# Oh My Posh for beautiful prompts
oh-my-posh init pwsh | Invoke-Expression

# Useful aliases
Set-Alias -Name g -Value git
Set-Alias -Name c -Value code

# Quick navigation
function dev { Set-Location C:\\Development }
function projects { Set-Location C:\\Projects }

# Git shortcuts
function gs { git status }
function gp { git pull }
function gc { param($m) git commit -m "$m" }</code></pre>

<h2>Environment Variables</h2>
<pre><code class="language-powershell"># View all environment variables
Get-ChildItem Env:

# Set user environment variable
[Environment]::SetEnvironmentVariable("MY_VAR", "value", "User")

# Set system environment variable (requires Admin)
[Environment]::SetEnvironmentVariable("MY_VAR", "value", "Machine")

# Add to PATH
$env:Path += ";C:\\my\\new\\path"</code></pre>

<h2>Final Checklist</h2>
<ul>
<li>Windows Terminal installed and configured</li>
<li>WSL2 with Ubuntu set up</li>
<li>Git configured with SSH keys</li>
<li>Node.js with nvm-windows</li>
<li>VS Code with essential extensions</li>
<li>Docker Desktop running</li>
<li>PowerShell profile customized</li>
</ul>

<h2>Conclusion</h2>
<p>With this setup, you have a powerful development environment that combines the best of Windows and Linux. WSL2 gives you access to Linux tools while keeping your Windows workflow. Keep your tools updated and customize your environment to match your workflow.</p>
`,
    excerpt: 'Complete guide to setting up a modern Windows development environment with WSL2, VS Code, Git, Node.js, and essential tools.',
    coverImage: null,
    category: 'windows',
    tags: ['windows', 'development', 'setup', 'wsl', 'tools'],
    published: true,
    authorId: 'system',
    authorName: 'CodeSlopes',
    authorPhoto: null,
  },
];

async function seedBlogTutorials() {
  console.log('Starting blog tutorial seeding...\n');

  const now = Timestamp.now();
  let successCount = 0;
  let skipCount = 0;

  for (const post of blogPosts) {
    const slug = createSlug(post.title);

    // Check if post already exists
    const existingQuery = await db.collection('posts').where('slug', '==', slug).get();

    if (!existingQuery.empty) {
      console.log(`⏭️  Skipping "${post.title}" - already exists`);
      skipCount++;
      continue;
    }

    const postData: BlogPostData = {
      ...post,
      slug,
      readingTime: calculateReadingTime(post.content),
      createdAt: now,
      updatedAt: now,
      publishedAt: post.published ? now : null,
      views: 0,
      likes: 0,
    };

    try {
      const docRef = await db.collection('posts').add(postData);
      console.log(`✅ Created: "${post.title}" (${docRef.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create "${post.title}":`, error);
    }
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`   Created: ${successCount}`);
  console.log(`   Skipped: ${skipCount}`);
  console.log(`   Total: ${blogPosts.length}`);
}

seedBlogTutorials()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
