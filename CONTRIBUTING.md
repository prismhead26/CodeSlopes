# Contributing to CopeSlopes

Thank you for considering contributing to CopeSlopes! This document provides guidelines for contributing to the project.

## Development Workflow

1. **Fork the repository** and clone it locally
2. **Create a new branch** for your feature or bugfix
3. **Make your changes** following our coding standards
4. **Write tests** for your changes
5. **Run the test suite** to ensure everything passes
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and submit a pull request

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types for all functions and components
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object types

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types with TypeScript

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Keep custom CSS to a minimum
- Use dark mode classes where appropriate

### Testing

- Write unit tests for utilities and functions
- Write component tests for React components
- Write E2E tests for critical user flows
- Aim for at least 50% code coverage

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(blog): add category filtering
fix(auth): resolve sign-in redirect issue
docs(readme): update setup instructions
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update tests to reflect your changes
3. Ensure all tests pass locally
4. Update documentation as needed
5. Request review from maintainers

## Code Review Guidelines

- Be respectful and constructive
- Focus on the code, not the person
- Provide specific, actionable feedback
- Explain the "why" behind suggestions
- Be open to discussion

## Testing Requirements

Before submitting a PR:

```bash
# Run linter
npm run lint

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Check test coverage
npm run test:coverage
```

## Questions?

Feel free to open an issue for any questions or concerns!
