# Contributing to MacWhisper Dictation App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to foster an inclusive and welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/macwhisper-dictation-app.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages: `git commit -m "Add: feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation
```bash
npm install
npm run dev
```

## Project Structure

- `src/main/` - Electron main process (Node.js)
- `src/renderer/` - React frontend
- `src/main/services/` - Backend services
- `src/renderer/components/` - React components
- `src/renderer/hooks/` - Custom hooks
- `src/renderer/styles/` - CSS stylesheets

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable names

### React
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling
- Follow the existing CSS structure
- Use CSS variables for theming
- Keep styles modular and component-specific

### Commits
- Use clear, descriptive commit messages
- Follow conventional commits format:
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `docs:` - Documentation changes
  - `style:` - Code style changes
  - `refactor:` - Code refactoring
  - `test:` - Test additions/changes
  - `chore:` - Build process or auxiliary tool changes

## Testing

- Test your changes thoroughly before submitting
- Test on multiple platforms if possible (Windows, macOS, Linux)
- Include steps to test in your PR description

## Pull Request Process

1. Update README.md if needed
2. Update documentation for new features
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback promptly

## Feature Requests

To request a new feature:
1. Check existing issues first
2. Open a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Discuss implementation approach

## Bug Reports

To report a bug:
1. Check if it's already reported
2. Open a new issue with the "bug" label
3. Include:
   - Operating system and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Error messages or logs

## Questions?

Feel free to open an issue with the "question" label for any questions about contributing.

Thank you for contributing to MacWhisper Dictation App!
