# Weather Forecast Dashboard — Continuous Integration with GitHub Actions

**College Practical Experiment:**  
*"To design and execute a Continuous Integration workflow using GitHub Actions to automatically build and test an application."*


## 1. Project Title
**Weather Forecast Dashboard (CI/CD Automated Workflow)**

---

## 2. Project Objective
Manual testing and building of web applications can be slow, error-prone, and inconsistent across different development environments. The objective of this project is to implement a robust **Continuous Integration (CI)** pipeline using **GitHub Actions** for a React application. 

Every commit pushed to any branch or proposed through a pull request automatically triggers an automated workflow that:
- Validates source code formatting and syntax standards using **ESLint**.
- Executes automated component test suites using **React Testing Library** and **Vitest**.
- Compiles a production-ready application bundle using **Vite**.
- Packages and archives the generated build artifact (`dist/`) for verification and deployment.

---

## 3. Technologies Used
- **Frontend Framework:** React 19 (JavaScript / JSX)
- **Build Tool & Dev Server:** Vite 8
- **Linter & Code Quality:** ESLint 10 (with React Hooks and React Refresh plugins)
- **Testing Framework:** Jest 30 & jest-environment-jsdom
- **Babel Transpiler:** Babel (`@babel/preset-env`, `@babel/preset-react`, `babel-jest`)
- **UI Component Testing:** React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
- **CI/CD Platform:** GitHub Actions (`ubuntu-latest` runner)
- **Public Weather API:** Open-Meteo Geocoding and Weather Forecast APIs
- **Styling:** Modern CSS3 (responsive flexbox/grid layout, CSS custom properties)

---

## 4. Weather Dashboard Features
- **City Search:** Search current weather conditions for any global city.
- **Real-Time Weather Metrics:**
  - Current temperature in degrees Celsius (°C).
  - "Feels like" apparent temperature (°C).
  - Relative humidity percentage (%).
  - Wind speed (km/h).
  - Weather condition description (Clear sky, Partly cloudy, Foggy, Rain, Snow, Thunderstorm).
- **Error Handling & Validation:**
  - Input validation: Alerts user if an empty city name is submitted.
  - Invalid city handling: Clear alert if no matching location is returned.
  - Network error recovery: Informative message if the weather service cannot be reached.
- **Accessibility (a11y):** Form labels, ARIA alerts (`role="alert"`), and status announcements (`role="status"`).
- **Responsive Design:** Polished UI optimized for desktop, tablet, and mobile displays.

---

## 5. Weather API Information
The application integrates with **Open-Meteo**, a free and open-source weather API service:
1. **Geocoding API:** Resolves user-entered city names to geographic coordinates (`latitude` and `longitude`).
   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json`
2. **Forecast API:** Fetches current weather observations for the retrieved coordinates.
   - Endpoint: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`

---

## 6. API Key Design Decision
In many third-party API integrations, sensitive API keys must be securely stored in **GitHub Secrets** (`secrets.WEATHER_API_KEY`) to prevent exposing credentials in public source code.

However, **Open-Meteo's standard public endpoints do not require an API key or authentication tokens** for non-commercial educational use:
- No artificial API key or secret placeholder is required.
- No dummy GitHub secret is configured, avoiding unnecessary configuration overhead.
- No sensitive credentials or secrets are leaked into client-side code.
- If migrating to a proprietary commercial provider (e.g., OpenWeatherMap or WeatherAPI), an environment variable (such as `VITE_WEATHER_API_KEY`) would be injected via repository secrets in the CI workflow.

---

## 7. Prerequisites
Ensure you have the following installed on your development machine:
- **Node.js:** `v20.x`, `v22.x` (LTS recommended), or `v24.x`
- **npm:** `v10.x` or higher
- **Git:** Version 2.x+

Verify your installation:
```bash
node -v
npm -v
git --version
```

---

## 8. Installation
Clone the repository and install the exact locked dependencies using `npm ci`:
```bash
git clone https://github.com/santhiyam149-vs/weather-ci.git
cd weather-ci
npm ci
```
> **Note:** `npm ci` (Clean Install) installs dependencies directly from `package-lock.json`, ensuring an identical dependency tree across local machines and the GitHub Actions CI environment.

---

## 9. Running Locally
To launch the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to the local address displayed in the terminal (usually `http://localhost:5173`).

---

## 10. Running ESLint
Execute static code analysis across JavaScript and JSX files:
```bash
npm run lint
```
- Checks for syntax issues, unused variables, and React Hooks rules.
- Exits with code `0` when all checks pass.
- Returns a non-zero exit code if genuine linting violations are detected, failing the CI pipeline as expected.

---

## 11. Running Automated Tests
Run the component test suite using Jest and React Testing Library:
```bash
npm test
```
The test suite in [`src/App.test.jsx`](src/App.test.jsx) covers:
1. **Search Box Test:** Confirms the search input and button are visible and verifies that users can type city names.
2. **Invalid City Test:** Mocks the geocoding API returning empty results and verifies the `"City not found"` alert message is displayed.
3. **Temperature Display Test:** Mocks successful geocoding and forecast API responses and verifies city name, temperature, and weather metrics are correctly rendered.
4. **Empty Input Test:** Validates that submitting an empty search query shows a prompt requiring a city name.
5. **Network Failure Test:** Validates graceful handling when network requests fail.

---

## 12. Building for Production
Compile and bundle the production assets:
```bash
npm run build
```
The optimized HTML, CSS, and minified JavaScript bundles are output to the `dist/` folder.

To preview the production build locally:
```bash
npm run preview
```

---

## 13. GitHub Actions Continuous Integration Workflow
The CI pipeline is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Workflow Triggers
The workflow runs automatically on:
- **Pushes** to any branch (`branches: ['**']`).
- **Pull Requests** targeting any branch (`branches: ['**']`).

### Step-by-Step CI Pipeline Execution Order
Each workflow execution runs on an isolated Ubuntu virtual environment (`ubuntu-latest`) and executes the following steps in order:

| Step # | Step Name | Action / Command | Purpose |
| :---: | :--- | :--- | :--- |
| **1** | **Checkout repository** | `actions/checkout@v4` | Clones repository source code into the runner workspace. |
| **2 & 3** | **Set up Node.js & npm caching** | `actions/setup-node@v4` (`node-version: 22`, `cache: 'npm'`) | Provisions Node.js 22 LTS and restores cached `~/.npm` packages to accelerate builds. |
| **4** | **Install dependencies** | `npm ci` | Performs a clean, reproducible installation of locked dependencies. |
| **5** | **Run ESLint** | `npm run lint` | Runs ESLint to verify code quality, hooks rules, and coding standards. |
| **6** | **Run component tests** | `npm test` | Runs the automated test suite non-interactively using Jest and React Testing Library. |
| **7** | **Build production application** | `npm run build` | Compiles and bundles production static assets using Vite into `dist/`. |
| **8** | **Upload production build artifact** | `actions/upload-artifact@v4` | Packages and uploads `dist/` as a verifiable build artifact named `weather-dashboard-build`. |

If any step fails (lint error, failing test, build error), the workflow terminates immediately, marking the build as failed and preventing faulty code from progressing.

---

## 14. Testing Framework Configuration: Jest with React Testing Library
The testing framework is configured using **Jest** and **React Testing Library**:
- **Babel Integration:** Configured via `babel.config.json` with `@babel/preset-env` and `@babel/preset-react` (with `{ "runtime": "automatic" }`) to transpile modern ES modules and JSX into code Jest executes in Node.js.
- **Environment Simulation:** Configured with `jest-environment-jsdom` to emulate browser DOM APIs.
- **CSS and Asset Mocking:** Configured via `jest.config.js` with `moduleNameMapper` mapping `.css` imports to `__mocks__/styleMock.js`, preventing syntax errors when importing stylesheets (`import './App.css'`).
- **DOM Assertions:** Enhanced with `@testing-library/jest-dom` imported in `src/setupTests.js` for custom matchers (`toBeInTheDocument()`, `toBeVisible()`, `toHaveTextContent()`, `toHaveValue()`).
- **Fetch Mocking:** `globalThis.fetch` is initialized in `src/setupTests.js` and mocked using `jest.spyOn(globalThis, 'fetch')` across all test scenarios without making live external API requests.
- **Non-Interactive Execution:** `npm test` runs `jest` in single-run mode for predictable CI automation.

---

## 15. Verifying GitHub Actions and Downloading Artifacts
1. **Push Changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure GitHub Actions CI workflow, ESLint, and component tests"
   git push origin main
   ```
2. **Monitor the Pipeline:**
   - Go to your repository on GitHub: `https://github.com/santhiyam149-vs/weather-ci`
   - Click on the **Actions** tab.
   - Select the latest workflow run: **"Weather Dashboard CI"**.
   - Watch the live execution of each step (`Checkout`, `Setup Node.js`, `Install`, `Lint`, `Test`, `Build`, `Artifact Upload`).
3. **Download Build Artifact:**
   - Once the workflow completes with a green checkmark, scroll down to the **Artifacts** section at the bottom of the run summary page.
   - Click **`weather-dashboard-build`** to download the generated zip archive containing the compiled `dist/` production assets.

---

## 16. Summary for College Practical Evaluation
- **CI Workflow Status:** Successfully designed and automated via GitHub Actions.
- **Quality Assurance:** Ensured via ESLint flat configuration and React Testing Library component tests.
- **Reproducibility:** Guaranteed across all platforms via `npm ci` and locked dependencies in `package-lock.json`.
- **Deliverables:** Automated testing report and downloadable production build artifact on every commit.
