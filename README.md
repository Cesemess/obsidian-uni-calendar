# University Schedule & Calendar for Obsidian 🎓

[![Author](https://img.shields.io/badge/Author-Cesemess-blue.svg)](https://github.com/Cesemess)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux%20%7C%20iOS%20%7C%20Android-brightgreen.svg)]()
[![Obsidian](https://img.shields.io/badge/Obsidian-v0.15%2B-purple.svg)](https://obsidian.md)
[![Language](https://img.shields.io/badge/Languages-11%20Supported%20(EN%2C%20DE%2C%20FR%2C%20ES%2C%20ZH%2C%20JA%2C%20KO%2C%20PT%2C%20IT%2C%20RU%2C%20PL)-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-yellow.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/cesemess)

> **Never miss a lecture, lab, or exam again.**  
> Transform your university class schedule into an interactive sidebar calendar, live class countdown, and automated note-taking dashboard directly within Obsidian. Works seamlessly across **macOS, Windows, Linux, iOS, and Android**.

---

## 🌟 Why Choose University Schedule & Calendar?

Most calendar tools only display dates without integrating with how students actually study. This plugin bridges the gap: it syncs your university schedule and connects every single class directly to your personal lecture notes vault.

- **One-Click Note Access**: Clicking any class in your schedule instantly opens that day's lecture note (e.g. `2026-11-14 - Computer Science.md`) inside the corresponding subject folder.
- **Visual Drag-and-Drop Template Builder**: Design your ideal class note in an interactive modal by dragging and dropping variable chips (`{subject}`, `{date}`, `{time}`, `{room}`, `{lecturer}`, `{type}`) with real-time live preview.
- **Smart Folder & Note Creation**: If a subject folder or note doesn't exist yet, one click creates both the folder and a pre-formatted note from your template.
- **Live Class Countdown**: When a lecture or lab is currently in session, a live pulse indicator tells you how much time is left (e.g. `⏳ 25 min remaining`).
- **Global Multilingual & Regional Formatting**: Full support for **11 languages** (English, German, French, Spanish, Simplified Chinese, Japanese, Korean, Portuguese, Italian, Russian, and Polish), region-tailored university timetable guides (Canvas, Blackboard, Moodle, HISinOne/LSF, ADE Campus, SIGAA, Everytime, etc.), customizable first day of the week (Monday / Sunday), 24h / 12h clock, and 17 international date formats.

---

## 🚀 Key Features

### 1. 📅 Interactive Sidebar Calendar & Daily Timeline
- **Month Grid View**: See your entire month at a glance with color-coded dots representing your classes. Today's date is highlighted in your theme's accent color.
- **Daily Timeline**: Chronological timeline of all your classes for the selected day, showing start/end times, room locations, lecturer names, and class types.
- **Fast Navigation**: Jump to **Today**, browse previous/next months, or refresh your schedule with a single click.

### 2. 🎨 Visual Note Template Builder (Drag & Drop)
- Open the **Visual Template Builder** from Settings or the Command Palette (`Open Visual Template Builder`).
- **Interactive Variable Chips**: Displays real sample data from your loaded schedule. Click or drag any chip directly into the Markdown editor.
- **Quick Presets**:
  - 📋 **Standard** — Clean header, metadata callout, and notes section.
  - 📊 **Obsidian Properties (YAML)** — Ready for Obsidian Properties and Dataview queries.
  - 📌 **Minimal** — Simple title and date.
  - 📄 **Blank Note** — Creates a completely empty note.
- **Date Format Selector**: Choose between 17 international formats (e.g. `YYYY-MM-DD`, `DD.MM.YYYY`, `DD-MM-YYYY`, `DD/MM/YYYY`, `14 listopada 2026`, `sobota, 14 listopada 2026` / `Saturday, 14 November 2026`).

### 3. ⏳ Live Ongoing Class Countdown
- Real-time indicator for classes currently taking place: `⏳ 30 min remaining`.
- Subtle accent highlight so you always know your current class status at a glance.

### 4. 📂 Subject-to-Folder Mapping
- **Organized by Subject**: Keeps your vault structured: `[Subject Folder] / [Note Name].md` (e.g. `Computer Science / 2026-10-15 - Computer Science.md`).
- **Two-Column Mapping Table**: Pair any course from your schedule with an existing vault folder, or create and assign a new folder in 1 click.
- **Auto-Matching**: Automatically detects and matches folders with similar names.
- **Unmapped Subjects Prompt**: Clicking an unmapped subject offers to create its folder and first note automatically, or you can set it to `🚫 No folder (ignore)`.

### 5. 🚫 Excluded Subjects & Keyword Filter
- Have multiple language groups, electives, or seminars in a shared group schedule that you don't attend?
- Toggle off unwanted subjects in the **Exclusions** tab.
- Add, edit, or remove filter keywords interactively (e.g. `Group B`, `Sports`, `Elective`).

### 6. 🎨 Custom Class Categories & Colors
- Customize both the display name and badge color for every class category (including compound categories such as `Language course (Exam)`):
  - 🔵 **Lecture**
  - 🟢 **Exercises / Tutorials**
  - 🟣 **Laboratory**
  - 🔷 **Language Course**
  - 🟠 **Project**
  - 🌸 **Seminar**
  - 🔴 **Exam**
  - ⚪ **Other**

### 7. 📝 Daily Notes & Dashboard Embed (` ```uni-schedule ` or ` ```uni-calendar `)
Embed your class schedule directly into your Daily Notes or Home Dashboard using a codeblock:

````markdown
## Today's Lectures
```uni-schedule
```
````

Preview today's schedule, tomorrow's schedule, or any specific date using keywords (`today`, `dzisiaj`, `tomorrow`, `jutro`) or explicit dates (`YYYY-MM-DD`):
````markdown
```uni-schedule
date: today
```
````
````markdown
```uni-schedule
date: tomorrow
```
````
````markdown
```uni-schedule
date: 2026-10-20
```
````

### 8. 📤 Clean iCalendar (.ics) Export
- Export your customized, filtered schedule (with all excluded classes removed) to `schedule-export.ics` in your vault.
- Import it into Apple Calendar, Google Calendar, or Outlook!

### 9. 🌐 Global Multilingual & Regional Customization
Tailor your experience in **Settings -> Language & Region**:
- **11 Fully Supported Languages**: 🇺🇸/🇬🇧 **English**, 🇩🇪 **Deutsch**, 🇫🇷 **Français**, 🇪🇸 **Español**, 🇨🇳 **简体中文**, 🇯🇵 **日本語**, 🇰🇷 **한국어**, 🇧🇷/🇵🇹 **Português**, 🇮🇹 **Italiano**, 🇷🇺 **Русский**, and 🇵🇱 **Polski** (plus **Automatic / System detection**).
- **First Day of the Week**: Choose between Monday or Sunday.
- **Clock Format**: 24-hour (`14:30`) or 12-hour AM/PM (`2:30 PM`).
- **Date Format**: Choose from 17 international numeric and textual formats (e.g. `YYYY-MM-DD`, `DD.MM.YYYY`, `14 November 2026`, `2026年11月14日`).
- **Region-Tailored University Guides**: Includes native step-by-step instructions for extracting calendar feeds from local higher education portals worldwide:
  - 🇺🇸/🇬🇧/🇨🇦/🇦🇺 **US, UK, CA, AU & Global**: Canvas LMS, Blackboard Learn, Brightspace (D2L), Moodle.
  - 🇩🇪/🇦🇹/🇨🇭 **Germany, Austria & Switzerland**: HISinOne, QIS/LSF, Stud.IP, CAMPUSonline (TUMonline, RWTHonline), Moodle, ILIAS.
  - 🇫🇷/🇧🇪/🇨🇭 **France, Belgium & Francophonie**: ADE Campus (ADE Expert), ENT universitaire, Moodle.
  - 🇪🇸/🇲🇽/🇨🇴/🇦🇷 **Spain & Latin America**: Campus Virtual (Moodle), SIGMA, Universitas XXI (UXXI), Canvas LMS.
  - 🇨🇳 **China & Singapore**: 正方教务 (ZFSoft), 青果教务 (Kingosoft), 超星学习通, Canvas.
  - 🇯🇵 **Japan**: CAMPUSSQUARE, Manaba, Moodle, KOAN, UTAS, Google Workspace for Education.
  - 🇰🇷 **South Korea**: 에브리타임 (Everytime), 대학 종합정보시스템 / 학사포털, LMS (Canvas, Moodle, 코스모스).
  - 🇧🇷/🇵🇹 **Brazil & Portugal**: SIGAA (Portal do Discente), Moodle / Aprender, FénixEdu.
  - 🇮🇹 **Italy**: Esse3 (Cineca), EasyAcademy / University Planner, Moodle.
  - 🇷🇺 **Russia & Eastern Europe**: РУЗ (ВШЭ, МГУ, МФТИ), Модеус (Modeus), Moodle.
  - 🇵🇱 **Poland**: USOSweb, Wirtualny Dziekanat, Moodle.

### 10. 🔗 Adding Schedules: Public URLs, Google Calendar & Manual `.ics` Files
- **Important**: Any calendar added via an internet URL **must be publicly accessible** (or use a direct tokenized iCal feed). If your university portal or calendar requires a private login, export the `.ics` file and click **Upload .ics file** in Settings.
- **Google Calendar Support**:
  - Automatically converts Google Calendar *"Get shareable link"* (`?cid=...`) and embed links into iCal `.ics` feeds when the calendar is set to **"Make available to public"** (*See all event details*).
  - If your Google Workspace / university organization restricts public sharing (causing `HTTP 401`), scroll down in **Google Calendar -> Settings and sharing -> Integrate calendar** and copy either the **"Secret address in iCal format"** (`.../private-xxx/basic.ics`) or **"Public address in iCal format"**, or export and upload the `.ics` file from disk.

---

## 📦 Installation

### Method 1: Via Obsidian Community Plugins
1. Open **Settings** -> **Community plugins** in Obsidian.
2. Turn off **Restricted mode**.
3. Click **Browse** and search for `University Schedule & Calendar`.
4. Click **Install**, then **Enable**.

### Method 2: Via BRAT (Beta Reviewers Auto-update Tool)
1. Install the **BRAT** plugin from Obsidian Community Plugins.
2. In BRAT settings, click **Add Beta plugin**.
3. Enter repository: `Cesemess/obsidian-uni-calendar` (or your GitHub repository URL).
4. Click **Add Plugin** and enable it.

### Method 3: Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` from the latest GitHub Release.
2. Inside your Obsidian vault, navigate to `.obsidian/plugins/`.
3. Create a folder named `university-calendar` and place the three files inside.
4. Reload Obsidian and enable **University Schedule & Calendar** in **Settings** -> **Community plugins**.

---

## ⚙️ Template Placeholders Reference

You can use these placeholders in both your **Note Content Template** and **Note File Name Format**:

| Placeholder | Description | Example |
| :--- | :--- | :--- |
| `{subject}` | Course / Subject title | `Computer Science` |
| `{date}` | Class date (formatted per your Date Format setting) | `2026-10-15` |
| `{time}` | Class start and end time | `10:45 – 12:15` |
| `{time_start}` | Class start time | `10:45` |
| `{time_end}` | Class end time | `12:15` |
| `{room}` | Room or location | `Room 204` |
| `{lecturer}` | Lecturer / Instructor name | `Prof. Jane Smith` |
| `{type}` | Localized class type | `Lecture` |
| `{description}` | Raw event description / notes | `Group A - Lab 2` |

---

## ☕ Support the Project

If you find this plugin helpful for your university studies or daily productivity, consider supporting its continued development!

[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=cesemess&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://buymeacoffee.com/cesemess)

Or via link: **[buymeacoffee.com/cesemess](https://buymeacoffee.com/cesemess)**

---

## 🤝 Contributing & Author

Created by **[Cesemess](https://github.com/Cesemess)**.  
Issues, feature requests, and pull requests are welcome!

## 📄 License

Licensed under the [MIT License](LICENSE).
