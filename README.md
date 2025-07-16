# BEVAE181 Quiz App 🎓

---

> A fun, sarcastic, and fully functional quiz app for the BEVAE181: Environmental Studies subject under IGNOU.  
> Built with React + TypeScript, styled using Tailwind CSS, and hosted on Netlify.  
> Includes a PDF generator with question-wise answers and results.

[Netlify Status Badge]

👉 Live Demo: https://bevae181.netlify.app/  
📦 Download PDF result after quiz completion  
🧪 Mandatory name, all-question answering, and sarcastic alerts included

---

## Tech Stack

- React (with Vite)
- TypeScript
- Tailwind CSS
- jsPDF
- Netlify

---

## Project Structure
```
bevae181-quiz-app/
├── public/
│   └── questions.json         # Quiz questions (editable)
├── src/
│   ├── QuizApp.tsx            # Main quiz logic
│   ├── main.tsx               # React entry
│   ├── index.css              # Tailwind setup
├── index.html                 # SEO + analytics
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```
---

## Features

- Sarcastic validation alerts
- 30-minute timer
- Erase answer feature
- PDF export styled like IGNOU result
- Auto grading with pass/fail
- Question-wise summary in result
- Responsive layout

---

## Sample Credentials

- Name: `Vaibhav`
- Enrollment: 2500491234 (or leave blank)

---

## Setup & Development

1. Clone the repo:
   ```
   git clone https://github.com/Mr-vabs/bevae181.git
   ```

3. Install dependencies:
   ```
   cd bevae18 && npm install
   ```

5. Run the app locally:
   ```
   npm run dev
   ```

7. Build for production:
   ```
   npm run build
   ```

---

## Deployment

1. Push the code to GitHub
2. Connect repo to Netlify
3. Set:
   - Build command: `npm run build`
   - Publish directory: `dist`

That’s it!

---

## Credits

Created by Vaibhav Kasaudhan  
IGNOU logo used under educational fair use.

---
