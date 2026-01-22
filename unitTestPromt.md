# Unit Test Generation Prompt

## Task
Write comprehensive unit tests for the provided code covering three data categories:

### 1. Valid Data (Happy Path)
- Typical expected inputs
- Boundary values (min/max within valid range)
- Different valid data types if applicable

### 2. Invalid Data (Negative Testing)
- Wrong data types (string instead of number, etc.)
- Out-of-range values (below min, above max)
- Malformed formats (invalid email, wrong date format)
- Special characters where not expected
- SQL injection / XSS payloads (if input handling)

### 3. Empty/Null Data (Edge Cases)
- null / undefined / None
- Empty string ""
- Empty array []
- Empty object {}
- Whitespace-only strings "   "

## Output Requirements
- Use **{Jest}** framework
- Follow AAA pattern (Arrange-Act-Assert)
- Use parametrized tests where applicable
- Include descriptive test names: `test_<method>_<scenario>_<expected_result>`
- Add brief comments explaining WHY each test case matters
- Mock external dependencies