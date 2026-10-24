/* ==========================================================================
   University Schedule & Calendar Plugin for Obsidian
   Author: Cesemess (https://github.com/Cesemess)
   Repository: https://github.com/Cesemess/obsidian-uni-calendar
   Description: Cross-platform university calendar and class schedule
                integrated with note folders (Folder = Subject, File = Note).
                Supports macOS, Windows, Linux, iOS (iPhone & iPad), and Android.
                Język: Polski (PL).
   License: MIT
   ========================================================================== */

const {
  Plugin,
  PluginSettingTab,
  Setting,
  ItemView,
  Notice,
  Modal,
  requestUrl,
  setIcon,
  normalizePath,
  TFile,
  TFolder
} = require("obsidian");

const VIEW_TYPE_CALENDAR = "university-calendar-view";

const BMC_CUP_SVG = `<svg class="ai-bmc-cup-svg uni-bmc-cup-svg" viewBox="0 0 884 1279" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="logo-coffee" d="M472.623 590.836C426.682 610.503 374.546 632.802 306.976 632.802C278.71 632.746 250.58 628.868 223.353 621.274L270.086 1101.08C271.74 1121.13 280.876 1139.83 295.679 1153.46C310.482 1167.09 329.87 1174.65 349.992 1174.65C349.992 1174.65 416.254 1178.09 438.365 1178.09C462.161 1178.09 533.516 1174.65 533.516 1174.65C553.636 1174.65 573.019 1167.08 587.819 1153.45C602.619 1139.82 611.752 1121.13 613.406 1101.08L663.459 570.876C641.091 563.237 618.516 558.161 593.068 558.161C549.054 558.144 513.591 573.303 472.623 590.836Z" fill="#ffffff"/><path class="logo-outline" d="M879.567 341.849L872.53 306.352C866.215 274.503 851.882 244.409 819.19 232.898C808.711 229.215 796.821 227.633 788.786 220.01C780.751 212.388 778.376 200.55 776.518 189.572C773.076 169.423 769.842 149.257 766.314 129.143C763.269 111.85 760.86 92.4243 752.928 76.56C742.604 55.2584 721.182 42.8009 699.88 34.559C688.965 30.4844 677.826 27.0375 666.517 24.2352C613.297 10.1947 557.342 5.03277 502.591 2.09047C436.875 -1.53577 370.983 -0.443234 305.422 5.35968C256.625 9.79894 205.229 15.1674 158.858 32.0469C141.91 38.224 124.445 45.6399 111.558 58.7341C95.7448 74.8221 90.5829 99.7026 102.128 119.765C110.336 134.012 124.239 144.078 138.985 150.737C158.192 159.317 178.251 165.846 198.829 170.215C256.126 182.879 315.471 187.851 374.007 189.968C438.887 192.586 503.87 190.464 568.44 183.618C584.408 181.863 600.347 179.758 616.257 177.304C634.995 174.43 647.022 149.928 641.499 132.859C634.891 112.453 617.134 104.538 597.055 107.618C594.095 108.082 591.153 108.512 588.193 108.942L586.06 109.252C579.257 110.113 572.455 110.915 565.653 111.661C551.601 113.175 537.515 114.414 523.394 115.378C491.768 117.58 460.057 118.595 428.363 118.647C397.219 118.647 366.058 117.769 334.983 115.722C320.805 114.793 306.661 113.611 292.552 112.177C286.134 111.506 279.733 110.801 273.333 110.009L267.241 109.235L265.917 109.046L259.602 108.134C246.697 106.189 233.792 103.953 221.025 101.251C219.737 100.965 218.584 100.249 217.758 99.2193C216.932 98.1901 216.482 96.9099 216.482 95.5903C216.482 94.2706 216.932 92.9904 217.758 91.9612C218.584 90.9319 219.737 90.2152 221.025 89.9293H221.266C232.33 87.5721 243.479 85.5589 254.663 83.8038C258.392 83.2188 262.131 82.6453 265.882 82.0832H265.985C272.988 81.6186 280.026 80.3625 286.994 79.5366C347.624 73.2301 408.614 71.0801 469.538 73.1014C499.115 73.9618 528.676 75.6996 558.116 78.6935C564.448 79.3474 570.746 80.0357 577.043 80.8099C579.452 81.1025 581.878 81.4465 584.305 81.7391L589.191 82.4445C603.438 84.5667 617.61 87.1419 631.708 90.1703C652.597 94.7128 679.422 96.1925 688.713 119.077C691.673 126.338 693.015 134.408 694.649 142.03L696.732 151.752C696.786 151.926 696.826 152.105 696.852 152.285C701.773 175.227 706.7 198.169 711.632 221.111C711.994 222.806 712.002 224.557 711.657 226.255C711.312 227.954 710.621 229.562 709.626 230.982C708.632 232.401 707.355 233.6 705.877 234.504C704.398 235.408 702.75 235.997 701.033 236.236H700.895L697.884 236.649L694.908 237.044C685.478 238.272 676.038 239.419 666.586 240.486C647.968 242.608 629.322 244.443 610.648 245.992C573.539 249.077 536.356 251.102 499.098 252.066C480.114 252.57 461.135 252.806 442.162 252.771C366.643 252.712 291.189 248.322 216.173 239.625C208.051 238.662 199.93 237.629 191.808 236.58C198.106 237.389 187.231 235.96 185.029 235.651C179.867 234.928 174.705 234.177 169.543 233.397C152.216 230.798 134.993 227.598 117.7 224.793C96.7944 221.352 76.8005 223.073 57.8906 233.397C42.3685 241.891 29.8055 254.916 21.8776 270.735C13.7217 287.597 11.2956 305.956 7.64786 324.075C4.00009 342.193 -1.67805 361.688 0.472751 380.288C5.10128 420.431 33.165 453.054 73.5313 460.35C111.506 467.232 149.687 472.807 187.971 477.556C338.361 495.975 490.294 498.178 641.155 484.129C653.44 482.982 665.708 481.732 677.959 480.378C681.786 479.958 685.658 480.398 689.292 481.668C692.926 482.938 696.23 485.005 698.962 487.717C701.694 490.429 703.784 493.718 705.08 497.342C706.377 500.967 706.846 504.836 706.453 508.665L702.633 545.797C694.936 620.828 687.239 695.854 679.542 770.874C671.513 849.657 663.431 928.434 655.298 1007.2C653.004 1029.39 650.71 1051.57 648.416 1073.74C646.213 1095.58 645.904 1118.1 641.757 1139.68C635.218 1173.61 612.248 1194.45 578.73 1202.07C548.022 1209.06 516.652 1212.73 485.161 1213.01C450.249 1213.2 415.355 1211.65 380.443 1211.84C343.173 1212.05 297.525 1208.61 268.756 1180.87C243.479 1156.51 239.986 1118.36 236.545 1085.37C231.957 1041.7 227.409 998.039 222.9 954.381L197.607 711.615L181.244 554.538C180.968 551.94 180.693 549.376 180.435 546.76C178.473 528.023 165.207 509.681 144.301 510.627C126.407 511.418 106.069 526.629 108.168 546.76L120.298 663.214L145.385 904.104C152.532 972.528 159.661 1040.96 166.773 1109.41C168.15 1122.52 169.44 1135.67 170.885 1148.78C178.749 1220.43 233.465 1259.04 301.224 1269.91C340.799 1276.28 381.337 1277.59 421.497 1278.24C472.979 1279.07 524.977 1281.05 575.615 1271.72C650.653 1257.95 706.952 1207.85 714.987 1130.13C717.282 1107.69 719.576 1085.25 721.87 1062.8C729.498 988.559 737.115 914.313 744.72 840.061L769.601 597.451L781.009 486.263C781.577 480.749 783.905 475.565 787.649 471.478C791.392 467.391 796.352 464.617 801.794 463.567C823.25 459.386 843.761 452.245 859.023 435.916C883.318 409.918 888.153 376.021 879.567 341.849ZM72.4301 365.835C72.757 365.68 72.1548 368.484 71.8967 369.792C71.8451 367.813 71.9483 366.058 72.4301 365.835ZM74.5121 381.94C74.6842 381.819 75.2003 382.508 75.7337 383.334C74.925 382.576 74.4089 382.009 74.4949 381.94H74.5121ZM76.5597 384.641C77.2996 385.897 77.6953 386.689 76.5597 384.641V384.641ZM80.672 387.979H80.7752C80.7752 388.1 80.9645 388.22 81.0333 388.341C80.9192 388.208 80.7925 388.087 80.6548 387.979H80.672ZM800.796 382.989C793.088 390.319 781.473 393.726 769.996 395.43C641.292 414.529 510.713 424.199 380.597 419.932C287.476 416.749 195.336 406.407 103.144 393.382C94.1102 392.109 84.3197 390.457 78.1082 383.798C66.4078 371.237 72.1548 345.944 75.2003 330.768C77.9878 316.865 83.3218 298.334 99.8572 296.355C125.667 293.327 155.64 304.218 181.175 308.09C211.917 312.781 242.774 316.538 273.745 319.36C405.925 331.405 540.325 329.529 671.92 311.91C695.906 308.686 719.805 304.941 743.619 300.674C764.835 296.871 788.356 289.731 801.175 311.703C809.967 326.673 811.137 346.701 809.778 363.615C809.359 370.984 806.139 377.915 800.779 382.989H800.796Z" fill="#0D0C22"/></svg>`;

function appendCoffeeButtonContent(btnEl, text) {
  if (!btnEl) return;
  try {
    const svgDoc = new DOMParser().parseFromString(BMC_CUP_SVG, "image/svg+xml");
    if (svgDoc && svgDoc.documentElement) {
      btnEl.appendChild(btnEl.ownerDocument.importNode(svgDoc.documentElement, true));
    }
  } catch (e) {
    // fallback if DOMParser fails
  }
  btnEl.createSpan({ cls: "ai-coffee-btn-text uni-coffee-btn-text", text: text || "" });
}

// ==========================================================================
// Internationalization (i18n) - Multilingual Dictionary (11 Languages)
// EN, DE, FR, ES, ZH, JA, KO, PT, IT, RU, PL
// ==========================================================================

const DEFAULT_NOTE_TEMPLATES = {
  en: "# {subject} — {date}\n> ⏰ **Time:** {time} | 📍 **Room:** {room}\n> 👤 **Lecturer:** {lecturer} | 🏷️ **Type:** {type}\n\n## Notes\n\n\n",
  de: "# {subject} — {date}\n> ⏰ **Uhrzeit:** {time} | 📍 **Raum:** {room}\n> 👤 **Dozent:** {lecturer} | 🏷️ **Art:** {type}\n\n## Notizen\n\n\n",
  fr: "# {subject} — {date}\n> ⏰ **Horaire :** {time} | 📍 **Salle :** {room}\n> 👤 **Enseignant :** {lecturer} | 🏷️ **Type :** {type}\n\n## Notes de cours\n\n\n",
  es: "# {subject} — {date}\n> ⏰ **Hora:** {time} | 📍 **Aula:** {room}\n> 👤 **Profesor:** {lecturer} | 🏷️ **Tipo:** {type}\n\n## Notas de clase\n\n\n",
  zh: "# {subject} — {date}\n> ⏰ **时间：** {time} | 📍 **教室：** {room}\n> 👤 **教师：** {lecturer} | 🏷️ **类型：** {type}\n\n## 课程笔记\n\n\n",
  ja: "# {subject} — {date}\n> ⏰ **時間:** {time} | 📍 **教室:** {room}\n> 👤 **担当教員:** {lecturer} | 🏷️ **種別:** {type}\n\n## 講義ノート\n\n\n",
  ko: "# {subject} — {date}\n> ⏰ **시간:** {time} | 📍 **강의실:** {room}\n> 👤 **교수:** {lecturer} | 🏷️ **유형:** {type}\n\n## 강의 노트\n\n\n",
  pt: "# {subject} — {date}\n> ⏰ **Horário:** {time} | 📍 **Sala:** {room}\n> 👤 **Professor:** {lecturer} | 🏷️ **Tipo:** {type}\n\n## Anotações da aula\n\n\n",
  it: "# {subject} — {date}\n> ⏰ **Orario:** {time} | 📍 **Aula:** {room}\n> 👤 **Docente:** {lecturer} | 🏷️ **Tipo:** {type}\n\n## Appunti di lezione\n\n\n",
  ru: "# {subject} — {date}\n> ⏰ **Время:** {time} | 📍 **Аудитория:** {room}\n> 👤 **Преподаватель:** {lecturer} | 🏷️ **Тип:** {type}\n\n## Заметки к занятию\n\n\n",
  pl: "# {subject} — {date}\n> ⏰ **Godzina:** {time} | 📍 **Sala:** {room}\n> 👤 **Prowadzący:** {lecturer} | 🏷️ **Typ:** {type}\n\n## Notatki\n\n\n",
};

const YAML_NOTE_TEMPLATES = {
  en: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - university\n  - lecture-notes\n---\n\n# {subject}\n\n> 📍 **Room:** {room} | 👤 **Lecturer:** {lecturer} | ⏰ **Time:** {time}\n\n## Lecture Notes\n\n\n## Tasks & Assignments\n- [ ] \n",
  de: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - studium\n  - vorlesungsnotizen\n---\n\n# {subject}\n\n> 📍 **Raum:** {room} | 👤 **Dozent:** {lecturer} | ⏰ **Uhrzeit:** {time}\n\n## Vorlesungsnotizen\n\n\n## Aufgaben & Klausurthemen\n- [ ] \n",
  fr: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - etudes\n  - notes-de-cours\n---\n\n# {subject}\n\n> 📍 **Salle :** {room} | 👤 **Enseignant :** {lecturer} | ⏰ **Horaire :** {time}\n\n## Notes de cours\n\n\n## Devoirs & Examens\n- [ ] \n",
  es: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - universidad\n  - apuntes\n---\n\n# {subject}\n\n> 📍 **Aula:** {room} | 👤 **Profesor:** {lecturer} | ⏰ **Hora:** {time}\n\n## Apuntes de clase\n\n\n## Tareas y exámenes\n- [ ] \n",
  zh: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - 大学课程\n  - 课程笔记\n---\n\n# {subject}\n\n> 📍 **教室：** {room} | 👤 **教师：** {lecturer} | ⏰ **时间：** {time}\n\n## 课堂笔记\n\n\n## 待办与考试安排\n- [ ] \n",
  ja: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - 大学\n  - 講義ノート\n---\n\n# {subject}\n\n> 📍 **教室:** {room} | 👤 **担当教員:** {lecturer} | ⏰ **時間:** {time}\n\n## 講義メモ・ノート\n\n\n## 課題・試験対策\n- [ ] \n",
  ko: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - 대학강의\n  - 강의노트\n---\n\n# {subject}\n\n> 📍 **강의실:** {room} | 👤 **교수:** {lecturer} | ⏰ **시간:** {time}\n\n## 강의 필기\n\n\n## 과제 및 시험 일정\n- [ ] \n",
  pt: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - faculdade\n  - anotacoes-de-aula\n---\n\n# {subject}\n\n> 📍 **Sala:** {room} | 👤 **Professor:** {lecturer} | ⏰ **Horário:** {time}\n\n## Anotações da aula\n\n\n## Tarefas e provas\n- [ ] \n",
  it: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - universita\n  - appunti-lezione\n---\n\n# {subject}\n\n> 📍 **Aula:** {room} | 👤 **Docente:** {lecturer} | ⏰ **Orario:** {time}\n\n## Appunti di lezione\n\n\n## Compiti ed esami\n- [ ] \n",
  ru: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - учеба\n  - конспекты-лекций\n---\n\n# {subject}\n\n> 📍 **Аудитория:** {room} | 👤 **Преподаватель:** {lecturer} | ⏰ **Время:** {time}\n\n## Конспект занятия\n\n\n## Задания и подготовка к сессии\n- [ ] \n",
  pl: "---\nsubject: \"{subject}\"\ndate: {date}\ntime: \"{time}\"\nroom: \"{room}\"\nlecturer: \"{lecturer}\"\ntype: \"{type}\"\ntags:\n  - studia\n  - notatki\n---\n\n# {subject}\n\n> 📍 **Sala:** {room} | 👤 **Prowadzący:** {lecturer} | ⏰ **Godzina:** {time}\n\n## Notatki z zajęć\n\n\n## Zadania i kolokwia\n- [ ] \n",
};

const TRANSLATIONS = {
  en: {
    allCalendars: "All calendars",
    filterCalendarLabel: "Applies to calendar",
    btnCollapse: "Collapse",
    btnExpand: "Expand",
    calendarCoursesCount: "{count} subjects",
    noCoursesInCalendar: "No subjects detected in this calendar.",
    viewTitle: "Schedule & Calendar",
    ribbonTitle: "Open university schedule",
    commandOpen: "Open university calendar in sidebar",
    commandSync: "Refresh schedule from university",
    commandExportIcs: "Export clean calendar (.ics)",
    today: "Today",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    refreshSchedule: "Refresh schedule from university",
    refreshSuccess: "Schedule updated! Total classes: {count}",
    refreshError: "Error fetching schedule: ",
    weekdaysShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsGenitive: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    noClasses: "No classes",
    oneClass: "1 class",
    fewClasses: "{count} classes",
    manyClasses: "{count} classes",
    emptyScheduleTitle: "No classes scheduled for this day.",
    emptyScheduleDesc: "Enjoy your free time or review your notes!",
    remainingMin: "{min} min left",
    allDay: "All day",
    noteExists: "Note exists",
    missingNote: "Missing note",
    openNoteHint: "Open note",
    createNoteHint: "Click to create note",
    noFolderBadge: "No folder",
    createFolderHint: "Click to create folder and note",
    subjectIgnoredNotice: "This subject is marked as ignored in settings (no folder).",
    defaultCourseName: "Subject",
    defaultCalendarName: "Calendar",
    noInfo: "No info",

    // Tabs
    tabAbout: "About",
    tabGeneral: "Schedules & Sync",
    tabLanguage: "Language & Region",
    tabMapping: "Notes & Templates",
    tabExclusions: "Exclusions",
    tabColors: "Appearance & Colors",

    // Quick Start
    qsTitle: "Quick Start — How to Begin?",
    qsStep1Title: "Add your schedule: ",
    qsStep1Desc: "In the „Schedules & Sync” tab, paste your university iCal/ICS subscription link (e.g. USOSweb, Moodle, Google Calendar) or upload a downloaded .ics file.",
    qsStep2Title: "Configure templates and folders: ",
    qsStep2Desc: "In the „Notes & Templates” tab, map subject folders and customize your note template using the visual template builder.",
    qsStep3Title: "Open schedule in the sidebar: ",
    qsStep3Desc: "Click the graduation cap 🎓 icon in the Obsidian ribbon — browse your classes, watch the live countdown, and create notes in one click.",

    // Language
    langSelectName: "Interface Language",
    langSelectDesc: "Choose the display language for the plugin.",
    langAuto: "Automatic (system)",

    // Guide
    guideTitle: "How University Schedule Works & Best Practices",
    guide1Title: "Direct integration with your university timetable",
    guide1Desc: "The plugin fetches and parses official iCalendar feeds (iCal/ICS). It recognizes lectures, labs, classes, classrooms, instructors, and counts down to upcoming events.",
    guide2Title: "Core concept: Folder = Course, File = Class note",
    guide2Desc: "Clicking a class card on the timeline instantly opens the existing note for that day or creates a new one using your template with YAML frontmatter.",
    guide3Title: "Best practice: full semester organization",
    guide3Desc: "To get the best study workflow and stay fully organized throughout the semester:",
    guideBullet1: "🗂️ Dedicated folder per course: Map each subject to a vault folder so lecture and lab notes land directly where they belong.",
    guideBullet2: "🚫 Smart exclusions: Hide discussion groups or sections you don't attend, or filter out unwanted classes by keyword.",
    guideBullet3: "☕ Break & free period indicators: Enable visual gap indicators between classes with customizable thresholds and icons.",
    guideCalloutTitle: "In practice: ",
    guideCalloutText: "Walk into lecture, open Obsidian, click the active class in your sidebar, and start taking notes in a pre-formatted file with classroom and professor already filled in.",

    // Coffee & Support
    coffeeBannerText: "Enjoying the plugin? Buy me a coffee!",
    coffeeBannerSubtext: " Support development and maintenance.",
    coffeeBannerBtn: "Buy me a coffee",
    coffeeBannerTitle: "Enjoying the plugin? Buy me a coffee!",
    coffeeBannerDesc: "Support development, new features, and ongoing maintenance.",
    btnBuyCoffee: "Buy me a coffee",
    supportTitle: "Support the Project",
    supportDesc: "This plugin is completely free and open-source, built with passion in free time. If it helps you stay organized with your studies, buying a coffee is a great way to say thanks and support future development!",
    supportBtnText: "Buy me a coffee",
    hideSupportName: "Hide support",
    hideSupportDesc: "Hides the support banner at the very top of settings and the coffee cup icon in the sidebar header.",

    // About project
    linksTitle: "About the Project",
    heroAuthor: "Author",
    linksGithub: "GitHub Repository",
    linksIssues: "Report Bug or Suggest Feature",
    aboutPluginDesc: "University calendar and schedule sidebar with live class countdown, visual note template builder, subject folder mapping, and automatic note linking.",
    aboutAuthor: "Author",
    aboutSupportTitle: "Support the Project",
    aboutSupportDesc: "This plugin is completely free and open-source, built with passion in free time. If it helps you stay organized with your studies, buying a coffee is a great way to say thanks and support future development!",
    aboutLinksTitle: "Useful Links",
    btnGithubRepo: "GitHub Repository",
    btnReportIssue: "Report Bug or Suggest Feature",
    aboutQuickStartTitle: "Quick Start — How to Begin?",
    aboutStep1: "Add your schedule: In the „Schedules & Sync” tab, paste your university iCal/ICS link or upload a downloaded .ics file.",
    aboutStep2: "Configure templates and appearance: In „Notes & Templates” configure note template and subject folders.",
    aboutStep3: "Open sidebar view: Click the graduation cap 🎓 icon in the left ribbon to view your schedule and countdown.",
    emptyNoSourcesTitle: "No university schedule added yet",
    emptyNoSourcesDesc: "Add your university iCal subscription feed (e.g. Canvas, Blackboard, Moodle, Google Calendar) or upload a downloaded .ics schedule file in settings to see your timeline.",
    btnAddScheduleSettings: "Open Settings & Add Schedule",
    dateHeaderTemplate: "{dayName}, {month} {dayNum}, {year}",
    modalCreateTitle: "Create a new class note?",
    modalCreateDesc: "There is no note yet for {date} for course:",
    modalTargetLoc: "Target file location in vault:",
    modalCancel: "Cancel",
    modalCreateBtn: "Create note",
    noteCreatedNotice: "Created note: {path}",
    noteOpenedNotice: "Opened note: {name}",
    modalCreateFolderTitle: "No folder found for this subject",
    modalCreateFolderDesc: "There is no vault folder yet for subject:",
    modalCreateFolderPrompt: "Would you like to create a new folder and the first note for {date}?",
    modalFolderInputLabel: "New folder name or path:",
    modalNotePreviewLabel: "New note location:",
    modalCreateFolderBtn: "Create folder & note",
    folderAndNoteCreatedNotice: "Created folder '{folder}' and note: {path}",
    confirmDeleteScheduleTitle: "Remove schedule?",
    confirmDeleteScheduleDesc: "Are you sure you want to remove the schedule '{name}'? Its events will disappear from the calendar view. Your existing Markdown notes will remain untouched.",
    typeLecture: "Lecture",
    typeExercises: "Exercises / Tutorial",
    typeLab: "Laboratory",
    typeLanguage: "Language Course",
    typeLanguageExam: "Language Course (Exam)",
    typeProject: "Project",
    typeSeminar: "Seminar",
    typeExam: "Exam",
    typeOther: "Other class",
    settingTimelineGapsTitle: "Timeline Breaks & Free Periods",
    settingShowTimelineGapsName: "Show breaks / gaps on daily timeline",
    settingShowTimelineGapsDesc: "Displays visual indicators for free periods between consecutive classes on the timeline.",
    timelineBreakTooltip: "Free period: {time}",
    cardAppearanceTitle: "Breaks & Free Periods Appearance",
    cardAppearanceDesc: "Configure how free periods between classes are displayed on your daily timeline.",
    cardCategoriesTitle: "Course Categories & Colors",
    cardCategoriesDesc: "Customize badge colors and display labels for different class types (lectures, labs, seminars, exams).",
    breakStyleLabel: "Display style",
    breakStylePill: "Pill badge",
    breakStyleCard: "Timeline card",
    breakStyleLine: "Dashed line",
    breakStyleText: "Plain text",
    breakCardDefaultTitle: "Free period / Break",
    breakIconLabel: "Break icon",
    breakIconCoffee: "☕ Coffee cup",
    breakIconFood: "🍔 Food / Lunch",
    breakIconPause: "⏸️ Pause",
    breakIconHourglass: "⏳ Hourglass",
    breakIconWalk: "🚶 Walking",
    breakIconBook: "📖 Reading / Book",
    breakIconMusic: "🎵 Headphones / Music",
    breakIconSun: "☀️ Sun",
    breakIconMoon: "🌙 Moon",
    breakIconSpark: "✨ Sparkles",
    breakIconBattery: "🔋 Recharging",
    breakIconClock: "⏰ Clock",
    breakIconLeaf: "🍃 Leaf",
    breakIconSmile: "😊 Relax",
    breakMinMinutesLabel: "Minimum break length (minutes)",
    breakMinMinutesDesc: "Free periods shorter than this will not be shown.",
    breakMinMinutesPlaceholder: "e.g. 15",
    breakMaxMinutesLabel: "Maximum break length (minutes)",
    breakMaxMinutesDesc: "0 means no upper limit (shows all gaps above minimum).",
    breakMaxMinutesPlaceholder: "0 = no limit",
    perCalendarGapsTitle: "Per-Calendar Break Settings",
    perCalendarGapsDesc: "Override break settings individually for specific calendars.",
    enableCalendarGapOverride: "Override break settings for this calendar",
    categoryUsedInCalendars: "Used in calendars",
    settingShowCoffeeIconName: "Show coffee cup icon in sidebar header",
    settingShowCoffeeIconDesc: "Displays a subtle coffee cup icon next to settings in the sidebar calendar header.",
    settingsTitle: "University Schedule & Calendar Settings",
    urlSettingName: "Add schedule source",
    urlSettingDesc: "Paste a live iCal/ICS link from your university (e.g. Canvas, Blackboard, Moodle, Google Calendar, Outlook) or upload a downloaded .ics file from disk. Note: web subscriptions must be publicly accessible or provide a secret feed token.",
    urlSettingDescShort: "Add your university class schedule from an iCal/ICS subscription link (e.g. Canvas, Blackboard, Moodle, Google Calendar, Outlook) or upload a downloaded .ics file.",
    publicCalendarTip: "💡 How to get your schedule from your university:\n• Canvas LMS: In global navigation click Calendar → at bottom right click „Calendar Feed” and copy the URL.\n• Blackboard Learn: Navigate to Calendar → Settings (gear icon) → Share Calendar / iCal Feed → copy the subscription link.\n• Moodle / Brightspace (D2L): Go to Calendar → Export calendar → All events → Get calendar URL (or Subscribe).\n• Google Calendar / Outlook (Microsoft 365): In Google, copy the „Secret address in iCal format” from calendar settings; in Outlook, go to Settings → Calendar → Shared calendars → Publish a calendar and copy the ICS link.\n• Downloaded .ics file: If your university portal doesn't provide a direct subscription feed, download your .ics timetable file and click „Upload .ics file” above.",
    urlPlaceholder: "https://canvas.university.edu/feeds/calendar.ics or Google/Outlook/Moodle link",
    btnDownloadNow: "Add from URL",
    btnDownloading: "Downloading...",
    btnUploadIcs: "Upload .ics file",
    uploadIcsDesc: "Upload a downloaded .ics / iCal timetable file from your device",
    icsLoadedSuccess: "Loaded schedule '{name}'! Added {count} classes.",
    invalidIcsError: "Error: Provided file does not contain a valid iCalendar (ICS) structure.",
    fileLoadError: "Error reading schedule file: ",
    addedSchedulesTitle: "Configured Schedules",
    noSchedulesAdded: "No schedules added yet. Paste a link above or upload an .ics file from your device.",
    scheduleTypeUrl: "Live subscription URL",
    scheduleTypeFile: "Local .ics file",
    btnRefreshSource: "Sync schedule now",
    btnRenameSource: "Rename schedule",
    renameSourcePlaceholder: "New schedule name...",
    scheduleRenamedNotice: "Schedule renamed to: {name}",
    errDuplicateCalendarName: "A schedule with this name already exists.",
    btnLockSource: "Lock against sync updates",
    btnUnlockSource: "Unlock for sync updates",
    badgeLockedSource: "Locked",
    scheduleLockedNotice: "Schedule '{name}' is now locked against sync overwrites.",
    scheduleUnlockedNotice: "Schedule '{name}' is unlocked and will sync normally.",
    allSchedulesLockedNotice: "All schedules are locked. Unlock at least one schedule to sync.",
    btnHideSource: "Hide classes from calendar",
    btnShowSource: "Show classes on calendar",
    badgeHiddenSource: "Hidden",
    scheduleHiddenNotice: "Schedule '{name}' is now hidden.",
    scheduleShownNotice: "Schedule '{name}' is now visible.",
    btnDeleteSource: "Delete schedule",
    scheduleRemovedNotice: "Removed schedule: {name}",
    btnExportIcs: "Export clean calendar (.ics)",
    exportIcsDesc: "Exports all active, non-excluded classes to a clean .ics file in your vault.",
    exportSuccess: "Exported {count} classes to: {path}",
    exportEmptyError: "No classes to export. Add a schedule first.",
    syncStartupName: "Sync automatically on startup",
    syncStartupDesc: "Automatically refreshes schedule feeds from the internet when Obsidian starts.",
    btnCancelEdit: "Cancel",
    btnShowCalNameOnEvents: "Show calendar name on event cards",
    btnHideCalNameOnEvents: "Hide calendar name on event cards",
    calNameShownNotice: "Calendar name will now be shown on events for '{name}'.",
    calNameHiddenNotice: "Calendar name hidden on events for '{name}'.",
    badgeCalNameShown: "Name shown",
    notesFolderCardTitle: "Folders & Vault Storage",
    notesTemplateSectionTitle: "Class Note Template",
    notesSettingsTitle: "Notes & Templates",
    notesSettingsDesc: "Configure note generation templates, folder organization, and file naming format.",
    settingDisableNoteClickName: "Disable note click on timeline cards",
    settingDisableNoteClickDesc: "Prevents opening or creating notes when clicking class cards on the timeline.",
    baseFolderSetting: "Base courses folder",
    baseFolderDesc: "Root folder in your vault where course subfolders will be placed (leave blank for vault root).",
    baseFolderPlaceholder: "e.g. University or Studies",
    optVaultRoot: "Vault root (no base folder)",
    dateFormatSetting: "Date format",
    dateFormatDesc: "Used in note filenames and the {date} variable.",
    dateFormatExample: "Example: {sample}",
    noteNameFormatSetting: "Note filename format",
    noteNameFormatDesc: "Available variables: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Note content template",
    templateDesc: "Template applied when creating a new lecture note. Supports Markdown and Obsidian Properties (YAML).",
    btnOpenTemplateBuilder: "Open Visual Template Builder",
    builderModalTitle: "Visual Note Template Builder",
    builderModalDesc: "Customize your lecture note template with live preview and drag-and-drop variable chips.",
    builderPresetsLabel: "Template presets",
    presetStandard: "📋 Standard",
    presetProperties: "📊 Obsidian Properties (YAML)",
    presetMinimal: "📌 Minimal",
    presetBlank: "📄 Blank Note",
    builderChipsLabel: "Available variables from your schedule (click or drag into editor):",
    builderChipTooltip: "Click to insert or drag into template: {desc}",
    builderEditorLabel: "Template editor (Markdown / YAML)",
    builderPreviewLabel: "Live preview with real class data",
    builderBlankPreview: "Template is empty. Insert text or variables above.",
    btnSaveTemplate: "Save template",
    templateSavedNotice: "Note template saved successfully!",
    sampleSubject: "Computer Science",
    sampleRoom: "Hall 101",
    sampleLecturer: "Prof. Alan Turing",
    sampleDesc: "Group A - Algorithms and Data Structures",
    langTitle: "Language",
    langDesc: "Select your preferred display language for the calendar, days of the week, timeline, and settings.",
    langSelectLabel: "Interface language",
    regionTitle: "Regional Formatting",
    regionDesc: "Configure date format, first day of the week, and clock format (24h / 12h).",
    firstDayOfWeekSetting: "First day of week",
    firstDayOfWeekDesc: "Choose whether the calendar grid starts on Monday or Sunday.",
    firstDayMonday: "Monday",
    firstDaySunday: "Sunday",
    timeFormatSetting: "Time format",
    timeFormatDesc: "Choose 24-hour clock (14:30) or 12-hour clock (2:30 PM).",
    timeFormat24h: "24-hour (14:30)",
    timeFormat12h: "12-hour AM/PM (2:30 PM)",
    mappingTitle: "Subject to Folder Mapping",
    mappingDesc: "Assign vault folders to courses detected in your schedule. Class notes will automatically be saved into the corresponding folder.",
    colSubject: "Course / Subject",
    colFolder: "Vault Folder",
    optAutoMatch: "Auto-match folder",
    optAutoMatchFound: "Auto-match (found: {folder})",
    optNotFoundAuto: "No folder (auto-create on note open)",
    optCreateNewFolder: "➕ Create new folder...",
    optNoFolder: "🚫 No folder (ignore subject)",
    cleanSubjectNamesSetting: "Clean course titles",
    cleanSubjectNamesDesc: "Automatically strips class type tags like (wyk), (lab), [W], (Lec) and exam keywords when suggesting folder and note names.",
    autoFindFolderSetting: "Auto-detect existing folders",
    autoFindFolderDesc: "Automatically looks for existing vault folders matching the course name when no explicit mapping is set.",
    autoMatchedTo: "Auto-matched to: {folder}",
    statusManuallyMapped: "Manually mapped",
    statusIgnored: "Ignored (no folder)",
    noMatchFound: "No matching folder found",
    folderCreatedAndAssignedNotice: "Created folder '{folder}' and mapped to subject '{subject}'.",
    noSubjectsFound: "No courses found in your schedule. Add a schedule source first.",
    exclusionsTitle: "Excluded Courses & Keyword Filters",
    exclusionsDesc: "Hide courses or groups you don't attend. Excluded events will not appear on the calendar, timeline, or exports.",
    detectedSubjects: "Detected courses (toggle to exclude)",
    keywordsTitle: "Filter keywords & conditional rules",
    keywordsDesc: "Exclude classes matching a keyword (e.g. 'Sports' or 'Group B'). You can also use conditional rules like 'if Statistics exclude Oczeretko' or the builder below.",
    keywordsPlaceholder: "e.g. Group B, Sports, or 'if Statistics exclude Oczeretko'...",
    btnAddKeyword: "Add rule",
    btnEditKeyword: "Edit",
    btnSaveKeyword: "Save",
    btnDeleteKeyword: "Delete",
    noKeywordsText: "No filter keywords or rules defined.",
    conditionalRuleBuilderTitle: "Conditional Exclusion Builder (If Subject ➔ Exclude Lecturer / Keyword)",
    conditionalRuleBuilderDesc: "Exclude a specific instructor, subgroup, or keyword only when it occurs in a specific subject (e.g. if Subject is 'Statistics', exclude 'Oczeretko').",
    selectSubjectPlaceholder: "Select course...",
    conditionalKwPlaceholder: "Instructor name or keyword to exclude...",
    btnAddConditionalRule: "+ Add conditional rule",
    ruleIfPrefix: "If",
    ruleExcludePrefix: "Exclude",
    ruleAllPrefix: "All required",
    noticeSelectSubjectFirst: "Please select a course first.",
    noticeEnterKeywordFirst: "Please enter a keyword or instructor to exclude.",
    excludeToggleOn: "Subject is excluded (click to show)",
    excludeToggleOff: "Subject is visible (click to exclude)",
    colorsTitle: "Class Categories & Colors",
    colorsDesc: "Customize category names and badge colors. The plugin automatically categorizes events based on keywords in their description and title.",
    categoryNamePlaceholder: "Default: {default}",
    btnResetColors: "Reset colors to default",
    errHttpStatus: "Server returned error {status}: {text}",
    errHttp401Google: "Error 401 (Google Calendar Access Denied): Internet calendars must be public (in Google Calendar settings check „Make available to public → See all event details”), OR copy the „Secret address in iCal format” (.ics) at the bottom of Google Calendar settings, or download and upload the .ics file manually.",
    errHttp401General: "Error {status} (Unauthorized): Calendars shared over the internet must be public. Make the calendar public or upload the .ics file manually from disk.",
    errNoScheduleSource: "Add a schedule URL in settings or upload an .ics file from disk.",
    errInvalidIcsContent: "The downloaded content does not contain a valid iCal/ICS calendar.",
    errCreateNote: "Error creating note: {message}",
    scheduleBtnTitle: "Course schedule (all sessions)",
    scheduleBtnLabel: "Schedule",
    scheduleStatTotal: "{count} total",
    scheduleStatPast: "{count} completed",
    scheduleStatUpcoming: "{count} remaining",
    filterAll: "All ({count})",
    filterUpcoming: "Upcoming ({count})",
    filterPast: "Past ({count})",
    nextSessionBadge: "Next class",
    allSessionsHeading: "Course sessions timeline",
    noSessionsFoundForCourse: "No sessions found for this course.",
    statusOngoing: "Now",
    statusNext: "Next",
    statusPast: "Done",
    statusFuture: "Upcoming",
    statusCancelled: "Cancelled",
    btnJumpToDayInCalendar: "Show in schedule",
    btnViewInSchedule: "Show day",
    btnOpenNote: "Note",
    btnCreateNoteShort: "Note",
    btnOpenCourseHub: "Course folder",
    badgeOpenNoteTooltip: "Click to open note",
    badgeCreateNoteTooltip: "Click to create note",
    badgeMapFolderTooltip: "Click to set subject folder",
    courseHubNotFound: "Subject folder not found. Assign a folder in settings or create a note first.",
    courseHubCreated: "Course note created: {path}",
    countdownOngoing: "Class in progress now",
    countdownToday: "Today at {time}",
    countdownTomorrow: "Tomorrow at {time}",
    countdownInDays: "In {days} days",
    allSessionsCompleted: "All scheduled classes for this course have already concluded."
  },
  de: {
    allCalendars: "Alle Kalender",
    filterCalendarLabel: "Gilt für Kalender",
    btnCollapse: "Einklappen",
    btnExpand: "Ausklappen",
    calendarCoursesCount: "{count} Fächer",
    noCoursesInCalendar: "Keine Fächer in diesem Kalender erkannt.",
    viewTitle: "Stundenplan & Kalender",
    ribbonTitle: "Hochschul-Stundenplan öffnen",
    commandOpen: "Hochschulkalender in Seitenleiste öffnen",
    commandSync: "Stundenplan von Hochschule aktualisieren",
    commandExportIcs: "Bereinigten Kalender exportieren (.ics)",
    today: "Heute",
    prevMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",
    refreshSchedule: "Stundenplan von Hochschule aktualisieren",
    refreshSuccess: "Stundenplan aktualisiert! Termine insgesamt: {count}",
    refreshError: "Fehler beim Abrufen des Stundenplans: ",
    weekdaysShort: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    weekdaysFull: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthsGenitive: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    dateHeaderTemplate: "{dayName}, {dayNum}. {month} {year}",
    noClasses: "Keine Kurse",
    oneClass: "1 Kurs",
    fewClasses: "{count} Kurse",
    manyClasses: "{count} Kurse",
    emptyScheduleTitle: "Keine Kurse für diesen Tag geplant.",
    emptyScheduleDesc: "Genieße deine freie Zeit oder wiederhole den Vorlesungsstoff!",
    emptyNoSourcesTitle: "Noch kein Stundenplan hinzugefügt",
    emptyNoSourcesDesc: "Füge deinen iCal-Stundenplanlink (z. B. HISinOne, LSF, Stud.IP, CAMPUSonline, Moodle) ein oder lade eine .ics-Datei in den Einstellungen hoch.",
    btnAddScheduleSettings: "Einstellungen öffnen & Plan hinzufügen",
    remainingMin: "Noch {min} Min.",
    allDay: "Ganztägig",
    noteExists: "Notiz existiert",
    missingNote: "Keine Notiz",
    openNoteHint: "Notiz öffnen",
    createNoteHint: "Klicken, um Notiz zu erstellen",
    noFolderBadge: "Kein Ordner",
    createFolderHint: "Klicken, um Ordner und Notiz zu erstellen",
    subjectIgnoredNotice: "Dieses Fach ist in den Einstellungen als ignoriert markiert (kein Ordner).",
    defaultCourseName: "Fach",
    defaultCalendarName: "Kalender",
    noInfo: "Keine Information",
    modalCreateTitle: "Neue Notiz für diesen Kurs erstellen?",
    modalCreateDesc: "Es existiert noch keine Notiz für den {date} für das Fach:",
    modalTargetLoc: "Zielspeicherort der Datei im Vault:",
    modalCancel: "Abbrechen",
    modalCreateBtn: "Notiz erstellen",
    noteCreatedNotice: "Notiz erstellt: {path}",
    noteOpenedNotice: "Notiz geöffnet: {name}",
    modalCreateFolderTitle: "Kein Ordner für dieses Fach gefunden",
    modalCreateFolderDesc: "In deinem Vault existiert noch kein Ordner für das Fach:",
    modalCreateFolderPrompt: "Möchtest du einen neuen Ordner und die erste Notiz für den {date} erstellen?",
    modalFolderInputLabel: "Name oder Pfad des neuen Ordners:",
    modalNotePreviewLabel: "Speicherort der neuen Notiz:",
    modalCreateFolderBtn: "Ordner & Notiz erstellen",
    folderAndNoteCreatedNotice: "Ordner '{folder}' und Notiz erstellt: {path}",
    confirmDeleteScheduleTitle: "Stundenplan entfernen?",
    confirmDeleteScheduleDesc: "Möchtest du den Stundenplan '{name}' wirklich entfernen? Seine Termine werden aus dem Kalender ausgeblendet. Deine erstellten Notizen bleiben unverändert erhalten.",
    typeLecture: "Vorlesung",
    typeExercises: "Übung",
    typeLab: "Praktikum / Labor",
    typeLanguage: "Sprachkurs",
    typeLanguageExam: "Sprachkurs (Prüfung)",
    typeProject: "Projekt",
    typeSeminar: "Seminar",
    typeExam: "Prüfung / Klausur",
    typeOther: "Sonstige Kurse",
    settingTimelineGapsTitle: "Freistunden & Pausen im Stundenplan",
    settingShowTimelineGapsName: "Pausen / Freistunden auf der Tagesachse anzeigen",
    settingShowTimelineGapsDesc: "Zeigt visuelle Pausenanzeigen zwischen aufeinanderfolgenden Lehrveranstaltungen an.",
    timelineBreakTooltip: "Freistunde: {time}",
    cardAppearanceTitle: "Erscheinungsbild von Pausen & Freistunden",
    cardAppearanceDesc: "Konfiguriere, wie Freistunden zwischen Kursen im Tagesablauf angezeigt werden.",
    cardCategoriesTitle: "Fachkategorien & Farben",
    cardCategoriesDesc: "Passe Bezeichnungen und Farben für unterschiedliche Veranstaltungsarten (Vorlesung, Übung, Praktikum, Prüfung) an.",
    breakStyleLabel: "Darstellungsstil",
    breakStylePill: "Pill-Abzeichen",
    breakStyleCard: "Zeitachsen-Karte",
    breakStyleLine: "Gestrichelte Linie",
    breakStyleText: "Reiner Text",
    breakCardDefaultTitle: "Freistunde / Pause",
    breakIconLabel: "Pausensymbol",
    breakIconCoffee: "☕ Kaffeetasse",
    breakIconFood: "🍔 Essen / Mittagspause",
    breakIconPause: "⏸️ Pause",
    breakIconHourglass: "⏳ Sanduhr",
    breakIconWalk: "🚶 Spaziergang",
    breakIconBook: "📖 Lesen / Buch",
    breakIconMusic: "🎵 Musik / Kopfhörer",
    breakIconSun: "☀️ Sonne",
    breakIconMoon: "🌙 Mond",
    breakIconSpark: "✨ Funken",
    breakIconBattery: "🔋 Akku laden",
    breakIconClock: "⏰ Uhr",
    breakIconLeaf: "🍃 Blatt",
    breakIconSmile: "😊 Entspannen",
    breakMinMinutesLabel: "Mindestdauer der Pause (Minuten)",
    breakMinMinutesDesc: "Pausen, die kürzer als dieser Wert sind, werden nicht angezeigt.",
    breakMinMinutesPlaceholder: "z. B. 15",
    breakMaxMinutesLabel: "Maximale Pausendauer (Minuten)",
    breakMaxMinutesDesc: "0 bedeutet keine Obergrenze (alle Pausen ab der Mindestlänge werden angezeigt).",
    breakMaxMinutesPlaceholder: "0 = unbegrenzt",
    perCalendarGapsTitle: "Pauseneinstellungen pro Kalender",
    perCalendarGapsDesc: "Pausenregeln für einzelne Kalender individuell überschreiben.",
    enableCalendarGapOverride: "Pauseneinstellungen für diesen Kalender überschreiben",
    categoryUsedInCalendars: "In Kalendern verwendet",
    settingShowCoffeeIconName: "Kaffeesymbol im Kalenderkopf anzeigen",
    settingShowCoffeeIconDesc: "Zeigt ein dezentes Kaffeesymbol neben den Einstellungen in der Seitenleiste an.",
    tabAbout: "Über das Plugin",
    tabGeneral: "Stundenpläne & Sync",
    tabLanguage: "Sprache & Region",
    tabMapping: "Notizen & Vorlagen",
    tabExclusions: "Ausschlüsse",
    tabColors: "Darstellung & Farben",
    qsTitle: "Schnellstart — Erste Schritte",
    qsStep1Title: "Stundenplan hinzufügen: ",
    qsStep1Desc: "Füge im Reiter „Stundenpläne & Sync” deinen iCal/ICS-Abonnementlink (z. B. HISinOne, LSF, Stud.IP, CAMPUSonline, Moodle) ein oder lade eine heruntergeladene .ics-Datei hoch.",
    qsStep2Title: "Vorlagen und Ordner einrichten: ",
    qsStep2Desc: "Ordne im Reiter „Notizen & Vorlagen” Fächer bestimmten Vault-Ordnern zu und passe die Vorlage im visuellen Editor an.",
    qsStep3Title: "Seitenleiste öffnen: ",
    qsStep3Desc: "Klicke auf das Doktorhut-Symbol 🎓 in der Obsidian-Seitenleiste — verfolge Live-Countdowns zu deinen Vorlesungen und erstelle Notizen mit einem Klick.",
    langSelectName: "Oberflächensprache",
    langSelectDesc: "Wähle die Anzeigesprache für das Plugin.",
    langAuto: "Automatisch (System)",
    guideTitle: "Funktionsweise & Best Practices",
    guide1Title: "Direkte Integration mit deinem Vorlesungsverzeichnis",
    guide1Desc: "Das Plugin liest offizielle iCalendar-Feeds (iCal/ICS) ein, erkennt Vorlesungen, Übungen, Praktika, Hörsäle und Dozenten und zählt die Zeit bis zum nächsten Termin herunter.",
    guide2Title: "Grundprinzip: Ordner = Fach, Datei = Vorlesungsnotiz",
    guide2Desc: "Ein Klick auf eine Veranstaltung in der Zeitachse öffnet sofort die bestehende Notiz dieses Tages oder erstellt eine neue Vorlage mit YAML-Metadaten.",
    guide3Title: "Empfehlung: Vollständige Semesterorganisation",
    guide3Desc: "Für den optimalen Workflow während des gesamten Semesters:",
    guideBullet1: "🗂️ Eigener Ordner pro Fach: Verknüpfe jedes Fach mit einem Vault-Ordner, damit Notizen direkt am richtigen Ort abgelegt werden.",
    guideBullet2: "🚫 Intelligente Ausschlüsse: Blende Übungsgruppen aus, an denen du nicht teilnimmst, oder filtere Termine nach Schlüsselwörtern.",
    guideBullet3: "☕ Pausen- und Freistunden-Indikatoren: Aktiviere visuelle Freistunden-Markierungen zwischen Kursen.",
    guideCalloutTitle: "In der Praxis: ",
    guideCalloutText: "Du betrittst den Hörsaal, öffnest Obsidian, klickst auf die aktuelle Vorlesung in der Seitenleiste und beginnst sofort mit der Mitschrift — Raum, Dozent und Datum sind bereits ausgefüllt.",
    coffeeBannerText: "Gefällt dir das Plugin? Kaufe mir einen Kaffee!",
    coffeeBannerSubtext: " Unterstütze die Weiterentwicklung und Pflege.",
    coffeeBannerBtn: "Kaffee spendieren",
    coffeeBannerTitle: "Gefällt dir das Plugin? Kaufe mir einen Kaffee!",
    coffeeBannerDesc: "Unterstütze die Weiterentwicklung, neue Funktionen und die Wartung des Projekts.",
    btnBuyCoffee: "Kaffee spendieren",
    supportTitle: "Projekt unterstützen",
    supportDesc: "Dieses Plugin ist völlig kostenlos und quelloffen (Open Source), entwickelt in der Freizeit. Wenn es dir im Studienalltag hilft, ist ein Kaffee ein großartiges Dankeschön!",
    supportBtnText: "Kaffee spendieren",
    hideSupportName: "Unterstützungs-Hinweis ausblenden",
    hideSupportDesc: "Blendet das Unterstützungsbanner oben in den Einstellungen und das Kaffeesymbol in der Seitenleiste aus.",
    linksTitle: "Über das Projekt",
    heroAuthor: "Autor",
    linksGithub: "GitHub-Repository",
    linksIssues: "Fehler melden oder Feature vorschlagen",
    aboutPluginDesc: "Hochschulkalender und Stundenplan in der Seitenleiste mit Live-Vorlesungs-Countdown, visuellem Vorlagen-Editor, Ordnerzuordnung und automatischer Notizverlinkung.",
    aboutAuthor: "Autor",
    aboutSupportTitle: "Projekt unterstützen",
    aboutSupportDesc: "Dieses Plugin ist völlig kostenlos und quelloffen, entwickelt in der Freizeit. Wenn es dir bei der Organisation deines Studiums hilft, freue ich mich über einen Kaffee!",
    aboutLinksTitle: "Nützliche Links",
    btnGithubRepo: "GitHub-Repository",
    btnReportIssue: "Fehler melden oder Feature vorschlagen",
    aboutQuickStartTitle: "Schnellstart — Erste Schritte",
    aboutStep1: "Stundenplan hinzufügen: Füge im Reiter „Stundenpläne & Sync” deinen iCal/ICS-Link ein (z. B. HISinOne, LSF, Stud.IP, CAMPUSonline, Moodle) oder lade eine .ics-Datei hoch.",
    aboutStep2: "Vorlagen und Ordner einrichten: Konfiguriere unter „Notizen & Vorlagen” die Dateinamen und Vault-Ordner für deine Fächer.",
    aboutStep3: "Seitenleiste öffnen: Klicke auf das Doktorhut-Symbol 🎓 in der linken Leiste, um deinen Stundenplan und Countdown zu sehen.",
    settingsTitle: "Hochschul-Stundenplan Einstellungen",
    urlSettingName: "Stundenplanquelle hinzufügen",
    urlSettingDesc: "Füge einen iCal/ICS-Link deiner Hochschule (z. B. HISinOne, LSF, Stud.IP, CAMPUSonline, Moodle, Google Kalender) ein oder lade eine .ics-Datei hoch. Hinweis: Web-Kalender müssen öffentlich oder über ein privates Abonnement-Token erreichbar sein.",
    urlSettingDescShort: "Füge deinen Stundenplan per iCal/ICS-Abonnementlink (z. B. HISinOne, LSF, Stud.IP, Moodle, Google Kalender, Outlook) hinzu oder lade eine .ics-Datei hoch.",
    publicCalendarTip: "💡 So fügst du deinen Stundenplan deiner Hochschule hinzu:\n• HISinOne / LSF / QIS: Im Portal anmelden → Stundenplan / Veranstaltungsbelegungsplan aufrufen → auf „iCal-Export” (.ics) oder „Abonnieren” klicken und den Link kopieren.\n• Stud.IP: Zu Planer / Stundenplan wechseln → unten auf das Kalendersymbol / „Exportieren” klicken → iCalendar (.ics) Abonnement-URL kopieren.\n• CAMPUSonline (TUMonline, RWTHonline etc.): Zu Terminkalender gehen → „iCal-Abonnement” / „Veröffentlichen” wählen und die private Kalender-URL kopieren.\n• Moodle / ILIAS: Im Kalender auf „Kalender exportieren” → „Alle Termine” → „Kalender-URL abrufen” klicken.\n• Google Kalender / Outlook: In Google die „Geheime Adresse im iCal-Format” kopieren; in Outlook unter Kalender freigeben / veröffentlichen den ICS-Link abrufen.\n• Lokale Datei: Bietet deine Uni keinen Web-Link an, lade die .ics-Datei aus dem Portal herunter und nutze den Button „.ics-Datei hochladen” oben.",
    urlPlaceholder: "https://uni-portal.de/kalender.ics oder TUMonline/Stud.IP/Moodle-Link",
    btnDownloadNow: "Über URL hinzufügen",
    btnDownloading: "Wird heruntergeladen...",
    btnUploadIcs: ".ics-Datei hochladen",
    uploadIcsDesc: "Lade eine heruntergeladene .ics-Stundenplandatei von deinem Computer hoch",
    icsLoadedSuccess: "Stundenplan '{name}' geladen! {count} Termine hinzugefügt.",
    invalidIcsError: "Fehler: Die Datei enthält keine gültige iCalendar-Struktur (.ics).",
    fileLoadError: "Fehler beim Laden der Stundenplandatei: ",
    addedSchedulesTitle: "Eingerichtete Stundenpläne",
    noSchedulesAdded: "Noch keine Stundenpläne hinzugefügt. Füge oben einen Link ein oder wähle eine .ics-Datei aus.",
    scheduleTypeUrl: "Web-Abonnement (URL)",
    scheduleTypeFile: "Lokale Datei (.ics)",
    btnRefreshSource: "Jetzt synchronisieren",
    btnRenameSource: "Stundenplan umbenennen",
    renameSourcePlaceholder: "Neuer Name des Stundenplans...",
    scheduleRenamedNotice: "Stundenplan umbenannt in: {name}",
    errDuplicateCalendarName: "Ein Stundenplan mit diesem Namen existiert bereits.",
    btnLockSource: "Gegen Sync-Überschreiben sperren",
    btnUnlockSource: "Für Synchronisation entsperren",
    badgeLockedSource: "Gesperrt",
    scheduleLockedNotice: "Stundenplan '{name}' ist gegen Überschreiben gesperrt.",
    scheduleUnlockedNotice: "Stundenplan '{name}' wurde entsperrt und synchronisiert wieder.",
    allSchedulesLockedNotice: "Alle Stundenpläne sind gesperrt. Entsperre mindestens einen, um zu synchronisieren.",
    btnHideSource: "Termine im Kalender ausblenden",
    btnShowSource: "Termine im Kalender einblenden",
    badgeHiddenSource: "Ausgeblendet",
    scheduleHiddenNotice: "Stundenplan '{name}' ist jetzt ausgeblendet.",
    scheduleShownNotice: "Stundenplan '{name}' ist jetzt sichtbar.",
    btnDeleteSource: "Stundenplan löschen",
    scheduleRemovedNotice: "Stundenplan entfernt: {name}",
    btnExportIcs: "Bereinigten Kalender exportieren (.ics)",
    exportIcsDesc: "Exportiert alle aktiven, nicht ausgeschlossenen Termine als bereinigte .ics-Datei in deinen Vault.",
    exportSuccess: "{count} Termine exportiert nach: {path}",
    exportEmptyError: "Keine Termine zum Exportieren vorhanden. Füge zuerst einen Stundenplan hinzu.",
    syncStartupName: "Beim Start automatisch synchronisieren",
    syncStartupDesc: "Aktualisiert die Stundenplan-Abonnements automatisch aus dem Internet, sobald Obsidian startet.",
    btnCancelEdit: "Abbrechen",
    btnShowCalNameOnEvents: "Kalendernamen auf Terminkarten anzeigen",
    btnHideCalNameOnEvents: "Kalendernamen auf Terminkarten ausblenden",
    calNameShownNotice: "Kalendername wird für '{name}' jetzt angezeigt.",
    calNameHiddenNotice: "Kalendername für '{name}' ausgeblendet.",
    badgeCalNameShown: "Name sichtbar",
    notesFolderCardTitle: "Ordner & Vault-Speicherort",
    notesTemplateSectionTitle: "Vorlesungsnotiz-Vorlage",
    notesSettingsTitle: "Notizen & Vorlagen",
    notesSettingsDesc: "Verwalte Vorlagen für deine Vorlesungsmitschriften, Ordnerzuordnungen und das Dateinamenformat.",
    settingDisableNoteClickName: "Notiz-Klick auf Terminkarten deaktivieren",
    settingDisableNoteClickDesc: "Verhindert das Öffnen oder Erstellen von Notizen beim Klicken auf eine Lehrveranstaltung in der Zeitachse.",
    baseFolderSetting: "Basisordner für Studienfächer",
    baseFolderDesc: "Hauptordner in deinem Vault, in dem Kursordner abgelegt werden (leer lassen für Vault-Stammverzeichnis).",
    baseFolderPlaceholder: "z. B. Studium oder Uni",
    optVaultRoot: "Vault-Stammverzeichnis (kein Basisordner)",
    dateFormatSetting: "Datumsformat",
    dateFormatDesc: "Wird in Dateinamen und der Variablen {date} verwendet.",
    dateFormatExample: "Beispiel: {sample}",
    noteNameFormatSetting: "Dateinamen-Format für Notizen",
    noteNameFormatDesc: "Verfügbare Variablen: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Notiz-Inhaltsvorlage",
    templateDesc: "Vorlage, die beim Anlegen einer neuen Vorlesungsnotiz angewendet wird. Unterstützt Markdown und Obsidian Properties (YAML).",
    btnOpenTemplateBuilder: "Visuellen Vorlagen-Editor öffnen",
    builderModalTitle: "Visueller Notizvorlagen-Editor",
    builderModalDesc: "Gestalte deine Notizvorlage mit Live-Vorschau und interaktiven Variablen-Chips per Drag & Drop.",
    builderPresetsLabel: "Vorlagen-Presets",
    presetStandard: "📋 Standard",
    presetProperties: "📊 Obsidian Properties (YAML)",
    presetMinimal: "📌 Minimalistisch",
    presetBlank: "📄 Leere Notiz",
    builderChipsLabel: "Verfügbare Variablen aus deinem Stundenplan (klicken oder in den Editor ziehen):",
    builderChipTooltip: "Klicken zum Einfügen oder in Vorlage ziehen: {desc}",
    builderEditorLabel: "Vorlagen-Editor (Markdown / YAML)",
    builderPreviewLabel: "Live-Vorschau mit echten Kursdaten",
    builderBlankPreview: "Vorlage ist leer. Füge Text oder Variablen oben ein.",
    btnSaveTemplate: "Vorlage speichern",
    templateSavedNotice: "Notizvorlage erfolgreich gespeichert!",
    sampleSubject: "Informatik I",
    sampleRoom: "Hörsaal A",
    sampleLecturer: "Prof. Dr. Mustermann",
    sampleDesc: "Übungsgruppe 2 - Algorithmen und Datenstrukturen",
    langTitle: "Sprache",
    langDesc: "Wähle deine bevorzugte Sprache für den Kalender, Wochentage, Zeitachse und Einstellungen.",
    langSelectLabel: "Oberflächensprache",
    regionTitle: "Regionale Formatierung",
    regionDesc: "Passe Datumsformat, ersten Wochentag und Uhrzeit (24h / 12h) an.",
    firstDayOfWeekSetting: "Erster Wochentag",
    firstDayOfWeekDesc: "Wähle, ob die Kalenderwoche am Montag oder Sonntag beginnt.",
    firstDayMonday: "Montag",
    firstDaySunday: "Sonntag",
    timeFormatSetting: "Uhrzeitformat",
    timeFormatDesc: "Wähle zwischen 24-Stunden-Format (14:30) und 12-Stunden-Format mit AM/PM (2:30 PM).",
    timeFormat24h: "24-Stunden (14:30)",
    timeFormat12h: "12-Stunden AM/PM (2:30 PM)",
    mappingTitle: "Zuordnung von Fächern zu Vault-Ordnern",
    mappingDesc: "Weise den in deinem Stundenplan erkannten Fächern Vault-Ordner zu. Vorlesungsnotizen landen automatisch im passenden Fachordner.",
    colSubject: "Fach / Lehrveranstaltung",
    colFolder: "Vault-Ordner",
    optAutoMatch: "Ordner automatisch zuweisen",
    optAutoMatchFound: "Automatisch (gefunden: {folder})",
    optNotFoundAuto: "Kein Ordner (beim Erstellen anlegen)",
    optCreateNewFolder: "➕ Neuen Ordner erstellen...",
    optNoFolder: "🚫 Kein Ordner (Fach ignorieren)",
    cleanSubjectNamesSetting: "Kurstitel bereinigen",
    cleanSubjectNamesDesc: "Entfernt Kürzel wie (VL), (UE), (PR), (wyk), [W] und Prüfungskennzeichnungen bei Ordnervorschlägen.",
    autoFindFolderSetting: "Bestehende Ordner automatisch erkennen",
    autoFindFolderDesc: "Sucht automatisch nach vorhandenen Ordnern im Vault mit passendem Fachnamen, wenn keine manuelle Zuordnung existiert.",
    autoMatchedTo: "Automatisch zugeordnet zu: {folder}",
    statusManuallyMapped: "Manuell zugeordnet",
    statusIgnored: "Ignoriert (kein Ordner)",
    noMatchFound: "Kein passender Ordner gefunden",
    folderCreatedAndAssignedNotice: "Ordner '{folder}' erstellt und Fach '{subject}' zugeordnet.",
    noSubjectsFound: "Keine Fächer im Stundenplan gefunden. Füge zuerst eine Quelle hinzu.",
    exclusionsTitle: "Ausgeschlossene Fächer & Schlüsselwort-Filter",
    exclusionsDesc: "Blende Fächer oder Gruppen aus, die du nicht besuchst. Ausgeschlossene Termine erscheinen weder im Kalender noch in Exporten.",
    detectedSubjects: "Erkannte Fächer (Umschalten zum Ausschließen)",
    keywordsTitle: "Filter-Schlüsselwörter",
    keywordsDesc: "Jede Veranstaltung, deren Titel oder Beschreibung eines dieser Wörter enthält, wird ausgeblendet.",
    keywordsPlaceholder: "Schlüsselwort eingeben (z. B. Gruppe B, Wahlfach, Sport)...",
    btnAddKeyword: "Schlüsselwort hinzufügen",
    btnEditKeyword: "Bearbeiten",
    btnSaveKeyword: "Speichern",
    btnDeleteKeyword: "Löschen",
    noKeywordsText: "Keine Filterschlüsselwörter definiert.",
    excludeToggleOn: "Fach ist ausgeschlossen (Klicken zum Anzeigen)",
    excludeToggleOff: "Fach wird angezeigt (Klicken zum Ausschließen)",
    colorsTitle: "Kategorien & Farben",
    colorsDesc: "Passe Bezeichnungen und Farben an. Das Plugin kategorisiert Termine automatisch anhand von Schlagwörtern.",
    categoryNamePlaceholder: "Standard: {default}",
    btnResetColors: "Farben auf Standard zurücksetzen",
    errHttpStatus: "Server antwortete mit Fehler {status}: {text}",
    errHttp401Google: "Fehler 401 (Zugriff verweigert auf Google Kalender): Internet-Kalender müssen öffentlich freigegeben sein, ODER kopiere unten in den Google-Kalender-Einstellungen die „Geheime Adresse im iCal-Format” (.ics), oder lade die .ics-Datei manuell hoch.",
    errHttp401General: "Fehler {status} (Nicht autorisiert): Online geteilte Kalender müssen öffentlich zugänglich sein. Gib den Kalender frei oder lade die .ics-Datei von der Festplatte hoch.",
    errNoScheduleSource: "Füge in den Einstellungen einen Stundenplan-Link hinzu oder wähle eine .ics-Datei aus.",
    errInvalidIcsContent: "Der heruntergeladene Inhalt enthält keinen gültigen iCalendar (iCal/ICS).",
    errCreateNote: "Fehler beim Erstellen der Notiz: {message}",
    conditionalRuleBuilderTitle: "Bedingte Ausschlussregel (Wenn Fach ➔ Dozent / Stichwort ausschließen)",
    conditionalRuleBuilderDesc: "Ermöglicht es, einen bestimmten Dozenten oder ein Stichwort nur aus einem bestimmten Fach auszuschließen (andere Fächer mit diesem Dozenten bleiben sichtbar).",
    selectSubjectPlaceholder: "Fach auswählen...",
    conditionalKwPlaceholder: "Name des Dozenten oder Stichwort zum Ausschließen...",
    btnAddConditionalRule: "+ Bedingte Regel hinzufügen",
    ruleIfPrefix: "Wenn",
    ruleExcludePrefix: "Ausschließen",
    ruleAllPrefix: "Alle Wörter",
    noticeSelectSubjectFirst: "Bitte wählen Sie zuerst ein Fach aus.",
    noticeEnterKeywordFirst: "Bitte geben Sie ein Stichwort oder einen Dozentennamen ein.",
    scheduleBtnTitle: "Vorlesungsplan (alle Termine)",
    scheduleBtnLabel: "Terminplan",
    scheduleStatTotal: "{count} insgesamt",
    scheduleStatPast: "{count} abgeschlossen",
    scheduleStatUpcoming: "{count} verbleibend",
    filterAll: "Alle ({count})",
    filterUpcoming: "Anstehende ({count})",
    filterPast: "Vergangene ({count})",
    nextSessionBadge: "Nächste Vorlesung",
    allSessionsHeading: "Gesamter Vorlesungsplan",
    noSessionsFoundForCourse: "Keine Termine für dieses Fach gefunden.",
    statusOngoing: "Jetzt",
    statusNext: "Als nächstes",
    statusPast: "Abgeschlossen",
    statusFuture: "Geplant",
    statusCancelled: "Ausgefallen",
    btnJumpToDayInCalendar: "Im Kalender anzeigen",
    btnViewInSchedule: "Tag anzeigen",
    btnOpenNote: "Notiz",
    btnCreateNoteShort: "Notiz",
    btnOpenCourseHub: "Fach-Ordner",
    badgeOpenNoteTooltip: "Klicken, um Notiz zu öffnen",
    badgeCreateNoteTooltip: "Klicken, um neue Notiz zu erstellen",
    badgeMapFolderTooltip: "Klicken, um Fach-Ordner zuzuweisen",
    courseHubNotFound: "Fach-Ordner nicht gefunden. Bitte in den Einstellungen zuweisen oder zuerst eine Notiz erstellen.",
    courseHubCreated: "Fachnotiz erstellt: {path}",
    countdownOngoing: "Veranstaltung läuft gerade",
    countdownToday: "Heute um {time}",
    countdownTomorrow: "Morgen um {time}",
    countdownInDays: "In {days} Tagen",
    allSessionsCompleted: "Alle geplanten Termine für dieses Fach sind bereits beendet."
  },
  fr: {
    allCalendars: "Tous les emplois du temps",
    filterCalendarLabel: "S'applique à l'emploi du temps",
    btnCollapse: "Réduire",
    btnExpand: "Développer",
    calendarCoursesCount: "{count} matières",
    noCoursesInCalendar: "Aucune matière détectée dans cet emploi du temps.",
    viewTitle: "Emploi du temps & Agenda",
    ribbonTitle: "Ouvrir l'emploi du temps universitaire",
    commandOpen: "Ouvrir l'emploi du temps dans la barre latérale",
    commandSync: "Actualiser l'emploi du temps universitaire",
    commandExportIcs: "Exporter le calendrier nettoyé (.ics)",
    today: "Aujourd'hui",
    prevMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    refreshSchedule: "Actualiser l'emploi du temps universitaire",
    refreshSuccess: "Emploi du temps mis à jour ! Nombre de cours : {count}",
    refreshError: "Erreur lors de la récupération de l'emploi du temps : ",
    weekdaysShort: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
    weekdaysFull: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthsGenitive: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    dateHeaderTemplate: "{dayName} {dayNum} {month} {year}",
    noClasses: "Aucun cours",
    oneClass: "1 cours",
    fewClasses: "{count} cours",
    manyClasses: "{count} cours",
    emptyScheduleTitle: "Aucun cours prévu pour cette journée.",
    emptyScheduleDesc: "Profitez de votre temps libre ou révisez vos cours !",
    emptyNoSourcesTitle: "Aucun emploi du temps ajouté",
    emptyNoSourcesDesc: "Ajoutez l'URL iCal de votre université (ex. ADE Campus, ENT, Moodle, Google Agenda) ou importez un fichier .ics dans les paramètres pour afficher vos cours.",
    btnAddScheduleSettings: "Ouvrir les paramètres et ajouter un horaire",
    remainingMin: "Reste {min} min",
    allDay: "Toute la journée",
    noteExists: "Note existante",
    missingNote: "Note absente",
    openNoteHint: "Ouvrir la note",
    createNoteHint: "Cliquer pour créer la note",
    noFolderBadge: "Sans dossier",
    createFolderHint: "Cliquer pour créer dossier et note",
    subjectIgnoredNotice: "Cette matière est configurée comme ignorée (aucun dossier).",
    defaultCourseName: "Matière",
    defaultCalendarName: "Emploi du temps",
    noInfo: "Aucune information",
    modalCreateTitle: "Créer une nouvelle note de cours ?",
    modalCreateDesc: "Il n'y a pas encore de note pour le {date} pour la matière :",
    modalTargetLoc: "Emplacement du fichier dans votre coffre :",
    modalCancel: "Annuler",
    modalCreateBtn: "Créer la note",
    noteCreatedNotice: "Note créée : {path}",
    noteOpenedNotice: "Note ouverte : {name}",
    modalCreateFolderTitle: "Aucun dossier trouvé pour cette matière",
    modalCreateFolderDesc: "Il n'existe pas encore de dossier pour cette matière dans votre coffre :",
    modalCreateFolderPrompt: "Souhaitez-vous créer un nouveau dossier et la première note pour le {date} ?",
    modalFolderInputLabel: "Nom ou chemin du nouveau dossier :",
    modalNotePreviewLabel: "Emplacement de la nouvelle note :",
    modalCreateFolderBtn: "Créer le dossier et la note",
    folderAndNoteCreatedNotice: "Dossier '{folder}' et note créés : {path}",
    confirmDeleteScheduleTitle: "Supprimer cet emploi du temps ?",
    confirmDeleteScheduleDesc: "Êtes-vous sûr de vouloir supprimer l'emploi du temps '{name}' ? Ses cours ne seront plus affichés. Vos notes Markdown existantes restent intactes.",
    typeLecture: "Cours magistral (CM)",
    typeExercises: "Travaux dirigés (TD)",
    typeLab: "Travaux pratiques (TP)",
    typeLanguage: "Cours de langue",
    typeLanguageExam: "Cours de langue (Examen)",
    typeProject: "Projet",
    typeSeminar: "Séminaire",
    typeExam: "Examen / Partiel",
    typeOther: "Autre cours",
    settingTimelineGapsTitle: "Pauses et créneaux libres dans l'emploi du temps",
    settingShowTimelineGapsName: "Afficher les pauses / trous sur la timeline quotidienne",
    settingShowTimelineGapsDesc: "Affiche des indicateurs visuels pour les créneaux libres entre vos cours consécutifs.",
    timelineBreakTooltip: "Temps libre : {time}",
    cardAppearanceTitle: "Apparence des pauses & créneaux libres",
    cardAppearanceDesc: "Personnalisez l'affichage des temps libres entre vos cours sur la timeline.",
    cardCategoriesTitle: "Catégories de cours & Couleurs",
    cardCategoriesDesc: "Personnalisez les noms et les couleurs des badges pour chaque type de cours (CM, TD, TP, examens).",
    breakStyleLabel: "Style d'affichage",
    breakStylePill: "Badge pilule",
    breakStyleCard: "Carte sur la timeline",
    breakStyleLine: "Ligne en pointillés",
    breakStyleText: "Texte simple",
    breakCardDefaultTitle: "Créneau libre / Pause",
    breakIconLabel: "Icône de pause",
    breakIconCoffee: "☕ Tasse de café",
    breakIconFood: "🍔 Repas / Déjeuner",
    breakIconPause: "⏸️ Pause",
    breakIconHourglass: "⏳ Sablier",
    breakIconWalk: "🚶 Marche / Déplacement",
    breakIconBook: "📖 Lecture / Livre",
    breakIconMusic: "🎵 Musique / Casque",
    breakIconSun: "☀️ Soleil",
    breakIconMoon: "🌙 Lune",
    breakIconSpark: "✨ Étincelles",
    breakIconBattery: "🔋 Recharge",
    breakIconClock: "⏰ Horloge",
    breakIconLeaf: "🍃 Feuille",
    breakIconSmile: "😊 Détente",
    breakMinMinutesLabel: "Durée minimale de pause (minutes)",
    breakMinMinutesDesc: "Les pauses plus courtes que cette durée ne seront pas affichées.",
    breakMinMinutesPlaceholder: "ex. 15",
    breakMaxMinutesLabel: "Durée maximale de pause (minutes)",
    breakMaxMinutesDesc: "0 signifie aucune limite supérieure (affiche toutes les pauses au-delà du seuil minimal).",
    breakMaxMinutesPlaceholder: "0 = sans limite",
    perCalendarGapsTitle: "Paramètres de pause par emploi du temps",
    perCalendarGapsDesc: "Personnalisez les règles de pause individuellement pour chaque calendrier.",
    enableCalendarGapOverride: "Personnaliser les pauses pour ce calendrier",
    categoryUsedInCalendars: "Utilisé dans les calendriers",
    settingShowCoffeeIconName: "Afficher l'icône de café dans l'en-tête de la barre latérale",
    settingShowCoffeeIconDesc: "Affiche une discrète icône de tasse de café à côté des paramètres dans la vue calendrier.",
    tabAbout: "À propos",
    tabGeneral: "Emplois du temps & Sync",
    tabLanguage: "Langue & Région",
    tabMapping: "Notes & Modèles",
    tabExclusions: "Exclusions",
    tabColors: "Apparence & Couleurs",
    qsTitle: "Démarrage rapide — Comment débuter ?",
    qsStep1Title: "Ajoutez votre emploi du temps : ",
    qsStep1Desc: "Dans l'onglet « Emplois du temps & Sync », collez votre lien d'abonnement iCal/ICS universitaire (ex. ADE Campus, ENT, Moodle, Google Agenda) ou téléversez un fichier .ics.",
    qsStep2Title: "Configurez vos modèles et dossiers : ",
    qsStep2Desc: "Dans l'onglet « Notes & Modèles », associez vos matières à des dossiers et personnalisez votre modèle de note avec l'éditeur visuel.",
    qsStep3Title: "Ouvrez la barre latérale : ",
    qsStep3Desc: "Cliquez sur l'icône de toque universitaire 🎓 dans la barre latérale d'Obsidian — consultez vos cours, suivez le compte à rebours et créez des notes en un clic.",
    langSelectName: "Langue de l'interface",
    langSelectDesc: "Choisissez la langue d'affichage du plugin.",
    langAuto: "Automatique (système)",
    guideTitle: "Fonctionnement et bonnes pratiques",
    guide1Title: "Intégration directe avec votre emploi du temps universitaire",
    guide1Desc: "Le plugin analyse les flux officiels iCalendar (iCal/ICS), identifie les CM, TD, TP, salles et professeurs, et décompte le temps jusqu'au prochain cours.",
    guide2Title: "Concept clé : Dossier = Matière, Fichier = Note de cours",
    guide2Desc: "Cliquer sur un cours dans la timeline ouvre directement la note du jour ou en crée une nouvelle avec les propriétés YAML pré-remplies.",
    guide3Title: "Bonne pratique : Organisation semestrielle optimale",
    guide3Desc: "Pour une prise de notes fluide tout au long du semestre :",
    guideBullet1: "🗂️ Un dossier par matière : Associez chaque cours à un dossier pour que vos notes se rangent automatiquement au bon endroit.",
    guideBullet2: "🚫 Exclusions intelligentes : Masquez les groupes de TD auxquels vous n'assistez pas ou filtrez les événements inutiles par mots-clés.",
    guideBullet3: "☕ Indicateurs de pause : Activez la détection visuelle des créneaux libres entre deux cours.",
    guideCalloutTitle: "En pratique : ",
    guideCalloutText: "Vous entrez en amphi, ouvrez Obsidian, cliquez sur le cours actif dans votre barre latérale et commencez immédiatement à taper — la date, la salle et le professeur sont déjà renseignés.",
    coffeeBannerText: "Vous aimez ce plugin ? Offrez-moi un café !",
    coffeeBannerSubtext: " Soutenez le développement et la maintenance.",
    coffeeBannerBtn: "M'offrir un café",
    coffeeBannerTitle: "Vous appréciez le plugin ? Offrez-moi un café !",
    coffeeBannerDesc: "Soutenez le développement continu, les nouvelles fonctionnalités et la maintenance.",
    btnBuyCoffee: "M'offrir un café",
    supportTitle: "Soutenir le projet",
    supportDesc: "Ce plugin est entièrement gratuit et open-source, développé avec passion sur mon temps libre. S'il vous aide au quotidien dans vos études, offrir un café est une excellente façon de dire merci !",
    supportBtnText: "M'offrir un café",
    hideSupportName: "Masquer le bandeau de soutien",
    hideSupportDesc: "Masque le bandeau de soutien en haut des paramètres et l'icône de café dans l'en-tête du calendrier.",
    linksTitle: "À propos du projet",
    heroAuthor: "Auteur",
    linksGithub: "Dépôt GitHub",
    linksIssues: "Signaler un bug ou proposer une idée",
    aboutPluginDesc: "Calendrier et emploi du temps universitaire dans la barre latérale avec compte à rebours en direct, éditeur visuel de modèles, classement par dossiers et liens automatiques.",
    aboutAuthor: "Auteur",
    aboutSupportTitle: "Soutenir le projet",
    aboutSupportDesc: "Ce plugin est gratuit et open-source. S'il vous aide dans vos études universitaires, offrir un café permet de soutenir son maintien et son développement !",
    aboutLinksTitle: "Liens utiles",
    btnGithubRepo: "Dépôt GitHub",
    btnReportIssue: "Signaler un bug ou proposer une idée",
    aboutQuickStartTitle: "Démarrage rapide — Comment débuter ?",
    aboutStep1: "Ajouter l'emploi du temps : Dans l'onglet « Emplois du temps & Sync », collez votre lien iCal/ICS ou importez un fichier .ics.",
    aboutStep2: "Configurer les modèles et dossiers : Dans « Notes & Modèles », associez vos cours à des dossiers et définissez votre modèle.",
    aboutStep3: "Ouvrir la vue latérale : Cliquez sur l'icône de toque 🎓 dans le ruban de gauche pour consulter vos cours.",
    settingsTitle: "Paramètres de l'emploi du temps universitaire",
    urlSettingName: "Ajouter un emploi du temps",
    urlSettingDesc: "Collez l'URL d'abonnement iCal/ICS de votre université (ex. ADE Campus, ENT, Moodle, Google Agenda, Outlook) ou importez un fichier .ics. Attention : les calendriers distants doivent être accessibles publiquement ou disposer d'un token d'accès.",
    urlSettingDescShort: "Ajoutez votre emploi du temps via un lien d'abonnement iCal/ICS (ex. ADE Campus, ENT, Moodle, Google Agenda, Outlook) ou téléversez un fichier .ics.",
    publicCalendarTip: "💡 Comment récupérer l'emploi du temps de votre université :\n• ADE Campus / ADE Expert (standard des universités françaises) : Connectez-vous à ADE via votre ENT → ouvrez votre emploi du temps → cliquez sur l'icône calendrier / Options → „Générer une URL iCal” / „Exporter l'agenda” → copiez l'URL de synchronisation (.ics).\n• ENT universitaire / Moodle : Dans l'ENT, rendez-vous sur „Emploi du temps” et cherchez l'option de synchronisation iCal. Sur Moodle : Calendrier → Exporter le calendrier → Obtenir l'URL du calendrier.\n• Google Agenda / Outlook 365 : Dans Google Agenda, copiez « Adresse secrète au format iCal » dans les paramètres ; dans Outlook, Paramètres → Calendrier → Calendriers partagés → Publier un calendrier (.ics).\n• Fichier .ics téléchargé : Si votre université ne propose pas de flux direct, téléchargez le fichier .ics depuis votre ENT et cliquez sur « Importer un fichier .ics » ci-dessus.",
    urlPlaceholder: "https://ade.univ.fr/jsp/custom/modules/plannings/direct_cal.jsp?...",
    btnDownloadNow: "Ajouter depuis l'URL",
    btnDownloading: "Téléchargement...",
    btnUploadIcs: "Importer un fichier .ics",
    uploadIcsDesc: "Importer un fichier d'emploi du temps .ics / iCal depuis votre appareil",
    icsLoadedSuccess: "Emploi du temps '{name}' chargé ! {count} cours ajoutés.",
    invalidIcsError: "Erreur : Le fichier ne contient pas de données iCalendar (.ics) valides.",
    fileLoadError: "Erreur lors de la lecture du fichier : ",
    addedSchedulesTitle: "Emplois du temps configurés",
    noSchedulesAdded: "Aucun emploi du temps ajouté. Collez un lien ci-dessus ou importez un fichier .ics depuis votre ordinateur.",
    scheduleTypeUrl: "Abonnement web (URL)",
    scheduleTypeFile: "Fichier local (.ics)",
    btnRefreshSource: "Synchroniser maintenant",
    btnRenameSource: "Renommer l'emploi du temps",
    renameSourcePlaceholder: "Nouveau nom...",
    scheduleRenamedNotice: "Emploi du temps renommé en : {name}",
    errDuplicateCalendarName: "Un calendrier portant ce nom existe déjà.",
    btnLockSource: "Verrouiller contre les mises à jour",
    btnUnlockSource: "Déverrouiller pour la synchronisation",
    badgeLockedSource: "Verrouillé",
    scheduleLockedNotice: "L'emploi du temps '{name}' est verrouillé contre les synchronisations automatiques.",
    scheduleUnlockedNotice: "L'emploi du temps '{name}' est déverrouillé et se synchronisera normalement.",
    allSchedulesLockedNotice: "Tous les emplois du temps sont verrouillés. Déverrouillez-en au moins un pour synchroniser.",
    btnHideSource: "Masquer les cours sur le calendrier",
    btnShowSource: "Afficher les cours sur le calendrier",
    badgeHiddenSource: "Masqué",
    scheduleHiddenNotice: "L'emploi du temps '{name}' est maintenant masqué.",
    scheduleShownNotice: "L'emploi du temps '{name}' est maintenant visible.",
    btnDeleteSource: "Supprimer l'emploi du temps",
    scheduleRemovedNotice: "Emploi du temps supprimé : {name}",
    btnExportIcs: "Exporter le calendrier nettoyé (.ics)",
    exportIcsDesc: "Exporte tous les cours actifs et non exclus vers un fichier .ics dans votre coffre.",
    exportSuccess: "{count} cours exportés vers : {path}",
    exportEmptyError: "Aucun cours à exporter. Ajoutez d'abord un emploi du temps.",
    syncStartupName: "Synchroniser au démarrage",
    syncStartupDesc: "Met à jour automatiquement les emplois du temps depuis Internet au lancement d'Obsidian.",
    btnCancelEdit: "Annuler",
    btnShowCalNameOnEvents: "Afficher le nom de l'agenda sur les cours",
    btnHideCalNameOnEvents: "Masquer le nom de l'agenda sur les cours",
    calNameShownNotice: "Le nom du calendrier sera affiché pour '{name}'.",
    calNameHiddenNotice: "Nom du calendrier masqué pour '{name}'.",
    badgeCalNameShown: "Nom visible",
    notesFolderCardTitle: "Dossiers & Emplacement dans le coffre",
    notesTemplateSectionTitle: "Modèle de note de cours",
    notesSettingsTitle: "Notes & Modèles",
    notesSettingsDesc: "Configurez le modèle de vos notes de cours, l'organisation en dossiers et le format des noms de fichiers.",
    settingDisableNoteClickName: "Désactiver le clic sur les cours de la timeline",
    settingDisableNoteClickDesc: "Empêche l'ouverture ou la création de notes lors d'un clic sur une carte de cours.",
    baseFolderSetting: "Dossier racine des cours",
    baseFolderDesc: "Dossier racine de votre coffre où seront créés les sous-dossiers de matières (laisser vide pour la racine).",
    baseFolderPlaceholder: "ex. Université ou Cours",
    optVaultRoot: "Racine du coffre (aucun dossier de base)",
    dateFormatSetting: "Format de date",
    dateFormatDesc: "Utilisé dans le nom des fichiers et la variable {date}.",
    dateFormatExample: "Exemple : {sample}",
    noteNameFormatSetting: "Format du nom de fichier",
    noteNameFormatDesc: "Variables disponibles : {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Contenu du modèle de note",
    templateDesc: "Modèle appliqué lors de la création d'une nouvelle note. Supporte le Markdown et les propriétés Obsidian (YAML).",
    btnOpenTemplateBuilder: "Ouvrir l'éditeur visuel de modèles",
    builderModalTitle: "Éditeur visuel de modèle de note",
    builderModalDesc: "Personnalisez votre modèle de cours avec aperçu en direct et variables par glisser-déposer.",
    builderPresetsLabel: "Préréglages",
    presetStandard: "📋 Standard",
    presetProperties: "📊 Propriétés Obsidian (YAML)",
    presetMinimal: "📌 Minimaliste",
    presetBlank: "📄 Note vierge",
    builderChipsLabel: "Variables disponibles depuis votre emploi du temps (cliquez ou glissez dans l'éditeur) :",
    builderChipTooltip: "Cliquer pour insérer ou glisser dans le modèle : {desc}",
    builderEditorLabel: "Éditeur de modèle (Markdown / YAML)",
    builderPreviewLabel: "Aperçu en direct avec des données réelles",
    builderBlankPreview: "Le modèle est vide. Ajoutez du texte ou des variables ci-dessus.",
    btnSaveTemplate: "Enregistrer le modèle",
    templateSavedNotice: "Modèle de note enregistré avec succès !",
    sampleSubject: "Informatique",
    sampleRoom: "Amphi 3",
    sampleLecturer: "Pr. Dupont",
    sampleDesc: "Groupe A - Algorithmes et structures de données",
    langTitle: "Langue",
    langDesc: "Sélectionnez votre langue d'affichage pour le calendrier, les jours, la timeline et les paramètres.",
    langSelectLabel: "Langue de l'interface",
    regionTitle: "Formatage régional",
    regionDesc: "Configurez le format de date, le premier jour de la semaine et le format horaire (24h / 12h).",
    firstDayOfWeekSetting: "Premier jour de la semaine",
    firstDayOfWeekDesc: "Choisissez si le calendrier commence le lundi ou le dimanche.",
    firstDayMonday: "Lundi",
    firstDaySunday: "Dimanche",
    timeFormatSetting: "Format horaire",
    timeFormatDesc: "Choisissez entre le format 24 heures (14:30) et 12 heures AM/PM (2:30 PM).",
    timeFormat24h: "24 heures (14:30)",
    timeFormat12h: "12 heures AM/PM (2:30 PM)",
    mappingTitle: "Association matières / dossiers",
    mappingDesc: "Associez les matières détectées dans votre emploi du temps aux dossiers de votre coffre. Les notes s'y rangeront automatiquement.",
    colSubject: "Matière / Cours",
    colFolder: "Dossier du coffre",
    optAutoMatch: "Associer automatiquement",
    optAutoMatchFound: "Automatique (trouvé : {folder})",
    optNotFoundAuto: "Aucun dossier (créer à la première note)",
    optCreateNewFolder: "➕ Créer un nouveau dossier...",
    optNoFolder: "🚫 Sans dossier (ignorer la matière)",
    cleanSubjectNamesSetting: "Nettoyer le titre des cours",
    cleanSubjectNamesDesc: "Supprime automatiquement les mentions de type (CM), (TD), (TP), [W] et examens pour suggérer des noms de dossiers épurés.",
    autoFindFolderSetting: "Détection automatique des dossiers existants",
    autoFindFolderDesc: "Cherche automatiquement un dossier portant le même nom dans le coffre en l'absence d'association manuelle.",
    autoMatchedTo: "Associé automatiquement à : {folder}",
    statusManuallyMapped: "Associé manuellement",
    statusIgnored: "Ignoré (aucun dossier)",
    noMatchFound: "Aucun dossier correspondant trouvé",
    folderCreatedAndAssignedNotice: "Dossier '{folder}' créé et associé à la matière '{subject}'.",
    noSubjectsFound: "Aucune matière trouvée dans votre emploi du temps. Ajoutez d'abord un emploi du temps.",
    exclusionsTitle: "Matières exclues & Filtres par mots-clés",
    exclusionsDesc: "Masquez les matières ou groupes auxquels vous n'assistez pas. Ils n'apparaîtront ni sur le calendrier, ni sur la timeline, ni dans les exports.",
    detectedSubjects: "Matières détectées (basculer pour exclure)",
    keywordsTitle: "Mots-clés de filtrage",
    keywordsDesc: "Tout événement dont le titre ou la description contient l'un de ces mots-clés sera masqué.",
    keywordsPlaceholder: "Entrez un mot-clé (ex. Groupe B, Option, Sport)...",
    btnAddKeyword: "Ajouter le mot-clé",
    btnEditKeyword: "Modifier",
    btnSaveKeyword: "Enregistrer",
    btnDeleteKeyword: "Supprimer",
    noKeywordsText: "Aucun mot-clé de filtrage défini.",
    excludeToggleOn: "La matière est exclue (cliquer pour afficher)",
    excludeToggleOff: "La matière est visible (cliquer pour exclure)",
    colorsTitle: "Catégories de cours & Couleurs",
    colorsDesc: "Personnalisez les noms et couleurs. Le plugin catégorise automatiquement les événements selon les mots-clés de leur titre et description.",
    categoryNamePlaceholder: "Défaut : {default}",
    btnResetColors: "Réinitialiser les couleurs par défaut",
    errHttpStatus: "Le serveur a répondu avec l'erreur {status} : {text}",
    errHttp401Google: "Erreur 401 (Accès refusé à Google Agenda) : Les agendas partagés en ligne doivent être publics, OU copiez en bas des paramètres Google Agenda l'« Adresse secrète au format iCal » (.ics), ou téléversez le fichier .ics manuellement.",
    errHttp401General: "Erreur {status} (Non autorisé) : Les calendriers partagés en ligne doivent être publics. Rendez l'agenda public ou importez le fichier .ics depuis votre ordinateur.",
    errNoScheduleSource: "Ajoutez un lien vers votre emploi du temps dans les paramètres ou importez un fichier .ics.",
    errInvalidIcsContent: "Le contenu téléchargé ne contient pas de calendrier iCal/ICS valide.",
    errCreateNote: "Erreur lors de la création de la note : {message}",
    conditionalRuleBuilderTitle: "Générateur de règle conditionnelle (Si cours ➔ Exclure enseignant / mot-clé)",
    conditionalRuleBuilderDesc: "Permet d'exclure un enseignant ou mot-clé spécifique uniquement pour un cours donné (les autres cours de cet enseignant restent visibles).",
    selectSubjectPlaceholder: "Sélectionner un cours...",
    conditionalKwPlaceholder: "Nom de l'enseignant ou mot-clé à exclure...",
    btnAddConditionalRule: "+ Ajouter une règle conditionnelle",
    ruleIfPrefix: "Si",
    ruleExcludePrefix: "Exclure",
    ruleAllPrefix: "Tous les mots",
    noticeSelectSubjectFirst: "Veuillez d'abord sélectionner un cours dans la liste.",
    noticeEnterKeywordFirst: "Veuillez saisir un mot-clé ou le nom d'un enseignant à exclure.",
    scheduleBtnTitle: "Planning du cours (toutes les séances)",
    scheduleBtnLabel: "Planning",
    scheduleStatTotal: "{count} au total",
    scheduleStatPast: "{count} terminées",
    scheduleStatUpcoming: "{count} à venir",
    filterAll: "Toutes ({count})",
    filterUpcoming: "À venir ({count})",
    filterPast: "Passées ({count})",
    nextSessionBadge: "Prochain cours",
    allSessionsHeading: "Chronologie de toutes les séances",
    noSessionsFoundForCourse: "Aucune séance trouvée pour ce cours.",
    statusOngoing: "En cours",
    statusNext: "Suivant",
    statusPast: "Terminé",
    statusFuture: "Planifié",
    statusCancelled: "Cours annulé",
    btnJumpToDayInCalendar: "Afficher dans le planning",
    btnViewInSchedule: "Afficher la journée",
    btnOpenNote: "Note",
    btnCreateNoteShort: "Note",
    btnOpenCourseHub: "Dossier du cours",
    badgeOpenNoteTooltip: "Cliquer pour ouvrir la note",
    badgeCreateNoteTooltip: "Cliquer pour créer une note",
    badgeMapFolderTooltip: "Cliquer pour assigner un dossier",
    courseHubNotFound: "Dossier du cours introuvable. Assignez un dossier dans les paramètres ou créez d'abord une note.",
    courseHubCreated: "Note de cours créée : {path}",
    countdownOngoing: "Cours actuellement en cours",
    countdownToday: "Aujourd'hui à {time}",
    countdownTomorrow: "Demain à {time}",
    countdownInDays: "Dans {days} jours",
    allSessionsCompleted: "Toutes les séances prévues pour ce cours sont terminées."
  },
  es: {
    allCalendars: "Todos los calendarios",
    filterCalendarLabel: "Aplica al calendario",
    btnCollapse: "Plegar",
    btnExpand: "Desplegar",
    calendarCoursesCount: "{count} asignaturas",
    noCoursesInCalendar: "No se han detectado asignaturas en este calendario.",
    viewTitle: "Horario & Calendario",
    ribbonTitle: "Abrir horario universitario",
    commandOpen: "Abrir calendario universitario en la barra lateral",
    commandSync: "Actualizar horario de la universidad",
    commandExportIcs: "Exportar calendario limpio (.ics)",
    today: "Hoy",
    prevMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    refreshSchedule: "Actualizar horario de la universidad",
    refreshSuccess: "¡Horario actualizado! Clases totales: {count}",
    refreshError: "Error al obtener el horario: ",
    weekdaysShort: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
    weekdaysFull: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsGenitive: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    dateHeaderTemplate: "{dayName}, {dayNum} de {month} de {year}",
    noClasses: "Sin clases",
    oneClass: "1 clase",
    fewClasses: "{count} clases",
    manyClasses: "{count} clases",
    emptyScheduleTitle: "No hay clases programadas para este día.",
    emptyScheduleDesc: "¡Disfruta de tu tiempo libre o repasa tus apuntes!",
    emptyNoSourcesTitle: "Aún no has añadido tu horario",
    emptyNoSourcesDesc: "Añade el enlace iCal de tu universidad (p. ej. Campus Virtual, Moodle, SIGMA, Canvas) o sube un archivo .ics en los ajustes para ver tus clases.",
    btnAddScheduleSettings: "Abrir ajustes y añadir horario",
    remainingMin: "Quedan {min} min",
    allDay: "Todo el día",
    noteExists: "Nota existente",
    missingNote: "Sin nota",
    openNoteHint: "Abrir nota",
    createNoteHint: "Haz clic para crear la nota",
    noFolderBadge: "Sin carpeta",
    createFolderHint: "Haz clic para crear carpeta y nota",
    subjectIgnoredNotice: "Esta asignatura está marcada como ignorada en los ajustes (sin carpeta).",
    defaultCourseName: "Asignatura",
    defaultCalendarName: "Calendario",
    noInfo: "Sin información",
    modalCreateTitle: "¿Crear nueva nota de clase?",
    modalCreateDesc: "Aún no hay nota para el {date} para la asignatura:",
    modalTargetLoc: "Ubicación del archivo en la bóveda:",
    modalCancel: "Cancelar",
    modalCreateBtn: "Crear nota",
    noteCreatedNotice: "Nota creada: {path}",
    noteOpenedNotice: "Nota abierta: {name}",
    modalCreateFolderTitle: "No se encontró carpeta para esta asignatura",
    modalCreateFolderDesc: "Aún no existe una carpeta para esta asignatura en tu bóveda:",
    modalCreateFolderPrompt: "¿Deseas crear una nueva carpeta y la primera nota para el {date}?",
    modalFolderInputLabel: "Nombre o ruta de la nueva carpeta:",
    modalNotePreviewLabel: "Ubicación de la nueva nota:",
    modalCreateFolderBtn: "Crear carpeta y nota",
    folderAndNoteCreatedNotice: "Carpeta '{folder}' y nota creadas: {path}",
    confirmDeleteScheduleTitle: "¿Eliminar este horario?",
    confirmDeleteScheduleDesc: "¿Seguro que deseas eliminar el horario '{name}'? Sus clases desaparecerán del calendario. Tus notas de clase existentes permanecerán intactas.",
    typeLecture: "Clase magistral",
    typeExercises: "Prácticas / Ejercicios",
    typeLab: "Laboratorio",
    typeLanguage: "Curso de idiomas",
    typeLanguageExam: "Curso de idiomas (Examen)",
    typeProject: "Proyecto",
    typeSeminar: "Seminario",
    typeExam: "Examen",
    typeOther: "Otras clases",
    settingTimelineGapsTitle: "Horas libres y descansos en el horario",
    settingShowTimelineGapsName: "Mostrar descansos / horas libres en la línea temporal",
    settingShowTimelineGapsDesc: "Muestra indicadores visuales de tiempo libre entre clases consecutivas en tu jornada.",
    timelineBreakTooltip: "Tiempo libre: {time}",
    cardAppearanceTitle: "Apariencia de descansos y horas libres",
    cardAppearanceDesc: "Configura cómo se muestran los periodos libres entre clases en la línea temporal del día.",
    cardCategoriesTitle: "Categorías de asignaturas y colores",
    cardCategoriesDesc: "Personaliza los nombres y colores de las etiquetas para cada tipo de clase (teoría, prácticas, laboratorios, exámenes).",
    breakStyleLabel: "Estilo de visualización",
    breakStylePill: "Etiqueta tipo píldora",
    breakStyleCard: "Tarjeta en la línea temporal",
    breakStyleLine: "Línea discontinua",
    breakStyleText: "Texto simple",
    breakCardDefaultTitle: "Hora libre / Descanso",
    breakIconLabel: "Icono de descanso",
    breakIconCoffee: "☕ Taza de café",
    breakIconFood: "🍔 Almuerzo / Comida",
    breakIconPause: "⏸️ Pausa",
    breakIconHourglass: "⏳ Reloj de arena",
    breakIconWalk: "🚶 Caminar",
    breakIconBook: "📖 Lectura / Libro",
    breakIconMusic: "🎵 Música / Auriculares",
    breakIconSun: "☀️ Sol",
    breakIconMoon: "🌙 Luna",
    breakIconSpark: "✨ Destellos",
    breakIconBattery: "🔋 Recargar",
    breakIconClock: "⏰ Reloj",
    breakIconLeaf: "🍃 Hoja",
    breakIconSmile: "😊 Relax",
    breakMinMinutesLabel: "Duración mínima del descanso (minutos)",
    breakMinMinutesDesc: "Los descansos más cortos que este valor no se mostrarán.",
    breakMinMinutesPlaceholder: "ej. 15",
    breakMaxMinutesLabel: "Duración máxima del descanso (minutos)",
    breakMaxMinutesDesc: "0 significa sin límite superior (muestra todos los periodos libres superiores al mínimo).",
    breakMaxMinutesPlaceholder: "0 = sin límite",
    perCalendarGapsTitle: "Configuración de descansos por calendario",
    perCalendarGapsDesc: "Anula los ajustes de descanso individualmente para calendarios específicos.",
    enableCalendarGapOverride: "Personalizar descansos para este calendario",
    categoryUsedInCalendars: "Utilizado en calendarios",
    settingShowCoffeeIconName: "Mostrar icono de café en la barra lateral",
    settingShowCoffeeIconDesc: "Muestra un icono discreto de café junto a los ajustes en la cabecera del calendario lateral.",
    tabAbout: "Acerca de",
    tabGeneral: "Horarios y sincronización",
    tabLanguage: "Idioma y región",
    tabMapping: "Notas y plantillas",
    tabExclusions: "Exclusiones",
    tabColors: "Apariencia y colores",
    qsTitle: "Inicio rápido — ¿Cómo empezar?",
    qsStep1Title: "Añade tu horario: ",
    qsStep1Desc: "En la pestaña «Horarios y sincronización», pega el enlace iCal/ICS de tu universidad (p. ej. Campus Virtual, Moodle, SIGMA, Canvas) o sube un archivo .ics descargado.",
    qsStep2Title: "Configura carpetas y plantillas: ",
    qsStep2Desc: "En la pestaña «Notas y plantillas», asigna carpetas a tus asignaturas y personaliza tu plantilla de notas.",
    qsStep3Title: "Abre la barra lateral: ",
    qsStep3Desc: "Haz clic en el icono de birrete 🎓 en la barra lateral de Obsidian — consulta tus clases, sigue la cuenta atrás en vivo y crea notas en un clic.",
    langSelectName: "Idioma de la interfaz",
    langSelectDesc: "Selecciona el idioma de visualización del complemento.",
    langAuto: "Automático (sistema)",
    guideTitle: "Cómo funciona y buenas prácticas",
    guide1Title: "Integración directa con el horario de tu universidad",
    guide1Desc: "El complemento procesa suscripciones iCalendar (iCal/ICS), reconoce clases magistrales, laboratorios, seminarios, aulas y profesores, y muestra una cuenta atrás hacia tu próxima clase.",
    guide2Title: "Principio clave: Carpeta = Asignatura, Archivo = Nota de clase",
    guide2Desc: "Al hacer clic en una clase en la línea temporal, se abre al instante la nota correspondiente o se crea una nueva con propiedades YAML preconfiguradas.",
    guide3Title: "Buena práctica: Organización óptima del semestre",
    guide3Desc: "Para mantener un flujo de estudio productivo y organizado:",
    guideBullet1: "🗂️ Una carpeta por asignatura: Asigna cada asignatura a una carpeta para que tus notas se guarden directamente en su lugar.",
    guideBullet2: "🚫 Exclusiones inteligentes: Oculta grupos de prácticas a los que no asistes o filtra eventos por palabras clave.",
    guideBullet3: "☕ Indicadores de descansos: Activa la detección visual de horas libres entre clases con duración personalizable.",
    guideCalloutTitle: "En la práctica: ",
    guideCalloutText: "Entras al aula, abres Obsidian, haces clic en la clase activa en tu barra lateral y comienzas a tomar notas al instante — con la fecha, el aula y el profesor ya rellenados.",
    coffeeBannerText: "¿Te gusta el complemento? ¡Invítame a un café!",
    coffeeBannerSubtext: " Apoya el desarrollo continuo y el mantenimiento.",
    coffeeBannerBtn: "Invítame a un café",
    coffeeBannerTitle: "¿Disfrutas del complemento? ¡Invítame a un café!",
    coffeeBannerDesc: "Apoya el desarrollo, nuevas funcionalidades y el soporte continuo del proyecto.",
    btnBuyCoffee: "Invítame a un café",
    supportTitle: "Apoyar el proyecto",
    supportDesc: "Este complemento es completamente gratuito y de código abierto, desarrollado con pasión en mi tiempo libre. Si te ayuda a organizarte en la universidad, ¡invitarme a un café es una gran forma de agradecerlo!",
    supportBtnText: "Invítame a un café",
    hideSupportName: "Ocultar soporte",
    hideSupportDesc: "Oculta el banner superior de soporte en los ajustes y el icono de café en la cabecera de la barra lateral.",
    linksTitle: "Acerca del proyecto",
    heroAuthor: "Autor",
    linksGithub: "Repositorio GitHub",
    linksIssues: "Informar de un error o sugerir función",
    aboutPluginDesc: "Horario y calendario universitario en la barra lateral con cuenta atrás en vivo, creador visual de plantillas, asignación de carpetas y enlace automático a tus notas.",
    aboutAuthor: "Autor",
    aboutSupportTitle: "Apoyar el proyecto",
    aboutSupportDesc: "Este complemento es gratuito y de código abierto. Si te resulta útil en tu vida académica, ¡invitar a un café ayuda a mantener su desarrollo!",
    aboutLinksTitle: "Enlaces útiles",
    btnGithubRepo: "Repositorio GitHub",
    btnReportIssue: "Informar de un error o sugerir función",
    aboutQuickStartTitle: "Inicio rápido — ¿Cómo empezar?",
    aboutStep1: "Añadir horario: En la pestaña «Horarios y sincronización», pega tu enlace iCal/ICS o sube un archivo .ics descargado de tu universidad.",
    aboutStep2: "Configurar plantillas y carpetas: En «Notas y plantillas», personaliza el formato y asigna las carpetas de tus materias.",
    aboutStep3: "Abrir vista lateral: Haz clic en el birrete 🎓 en la barra lateral izquierda para ver tu horario y cuenta atrás.",
    settingsTitle: "Ajustes del horario universitario",
    urlSettingName: "Añadir fuente de horario",
    urlSettingDesc: "Pega un enlace iCal/ICS de tu universidad (p. ej. Campus Virtual, Moodle, SIGMA, Canvas, Google Calendar, Outlook) o sube un archivo .ics. Atención: los calendarios web deben ser públicos o usar un token de suscripción.",
    urlSettingDescShort: "Añade tu horario mediante enlace iCal/ICS (p. ej. Campus Virtual, SIGMA, Moodle, Google Calendar, Outlook) o sube un archivo .ics.",
    publicCalendarTip: "💡 Cómo añadir el horario de tu universidad:\n• Campus Virtual (Moodle): Entra en Calendario → haz clic en „Exportar calendario” → selecciona „Todos los eventos” → pulsa „Obtener URL del calendario” y copia el enlace.\n• SIGMA / Universitas XXI (UXXI): Inicia sesión en la secretaría virtual / portal del estudiante → ve a „Horarios / Matrícula” → busca el botón „Exportar a iCal / iCalendar (.ics)”.\n• Canvas LMS: En la barra lateral izquierda pulsa Calendario → abajo a la derecha pulsa „Feed del calendario” y copia el enlace iCal.\n• Google Calendar / Outlook: En Google Calendar copia la „Dirección secreta en formato iCal”; en Outlook ve a Configuración → Calendario → Calendarios compartidos → Publicar calendario.\n• Archivo .ics descargado: Si tu universidad no ofrece un enlace web permanente, descarga el archivo .ics de tu horario en tu ordenador y pulsa el botón „Subir archivo .ics” de arriba.",
    urlPlaceholder: "https://campusvirtual.universidad.es/calendar/export.ics o enlace Google/Canvas",
    btnDownloadNow: "Añadir desde URL",
    btnDownloading: "Descargando...",
    btnUploadIcs: "Subir archivo .ics",
    uploadIcsDesc: "Sube un archivo de horario .ics / iCal descargado desde tu dispositivo",
    icsLoadedSuccess: "¡Horario '{name}' cargado! Se han añadido {count} clases.",
    invalidIcsError: "Error: El archivo no contiene una estructura iCalendar (.ics) válida.",
    fileLoadError: "Error al leer el archivo de horario: ",
    addedSchedulesTitle: "Horarios configurados",
    noSchedulesAdded: "Aún no hay horarios añadidos. Pega un enlace arriba o selecciona un archivo .ics de tu equipo.",
    scheduleTypeUrl: "Suscripción web (URL)",
    scheduleTypeFile: "Archivo local (.ics)",
    btnRefreshSource: "Sincronizar ahora",
    btnRenameSource: "Renombrar horario",
    renameSourcePlaceholder: "Nuevo nombre del horario...",
    scheduleRenamedNotice: "Horario renombrado a: {name}",
    errDuplicateCalendarName: "Ya existe un horario con este nombre.",
    btnLockSource: "Bloquear contra actualizaciones",
    btnUnlockSource: "Desbloquear para sincronizar",
    badgeLockedSource: "Bloqueado",
    scheduleLockedNotice: "El horario '{name}' está bloqueado contra sobrescritura.",
    scheduleUnlockedNotice: "El horario '{name}' se ha desbloqueado y se sincronizará con normalidad.",
    allSchedulesLockedNotice: "Todos los horarios están bloqueados. Desbloquea al menos uno para sincronizar.",
    btnHideSource: "Ocultar clases del calendario",
    btnShowSource: "Mostrar clases en el calendario",
    badgeHiddenSource: "Oculto",
    scheduleHiddenNotice: "El horario '{name}' ahora está oculto.",
    scheduleShownNotice: "El horario '{name}' ahora es visible.",
    btnDeleteSource: "Eliminar horario",
    scheduleRemovedNotice: "Horario eliminado: {name}",
    btnExportIcs: "Exportar calendario limpio (.ics)",
    exportIcsDesc: "Exporta todas las clases activas y no excluidas a un archivo .ics en tu bóveda.",
    exportSuccess: "Se exportaron {count} clases a: {path}",
    exportEmptyError: "No hay clases para exportar. Añade un horario primero.",
    syncStartupName: "Sincronizar automáticamente al iniciar",
    syncStartupDesc: "Actualiza automáticamente los horarios desde Internet al abrir Obsidian.",
    btnCancelEdit: "Cancelar",
    btnShowCalNameOnEvents: "Mostrar nombre del calendario en las clases",
    btnHideCalNameOnEvents: "Ocultar nombre del calendario en las clases",
    calNameShownNotice: "Se mostrará el nombre del calendario para '{name}'.",
    calNameHiddenNotice: "Nombre del calendario oculto para '{name}'.",
    badgeCalNameShown: "Nombre visible",
    notesFolderCardTitle: "Carpetas y almacenamiento en la bóveda",
    notesTemplateSectionTitle: "Plantilla de nota de clase",
    notesSettingsTitle: "Notas y plantillas",
    notesSettingsDesc: "Configura la plantilla de apuntes, la estructura de carpetas y el formato de nombre de archivo.",
    settingDisableNoteClickName: "Desactivar clic en tarjetas de la línea temporal",
    settingDisableNoteClickDesc: "Evita abrir o crear notas al hacer clic en las clases de la línea temporal.",
    baseFolderSetting: "Carpeta base de asignaturas",
    baseFolderDesc: "Carpeta raíz de la bóveda donde se ubicarán las subcarpetas de cursos (déjala en blanco para la raíz).",
    baseFolderPlaceholder: "ej. Universidad o Asignaturas",
    optVaultRoot: "Raíz de la bóveda (sin carpeta base)",
    dateFormatSetting: "Formato de fecha",
    dateFormatDesc: "Utilizado en el nombre de archivo y en la variable {date}.",
    dateFormatExample: "Ejemplo: {sample}",
    noteNameFormatSetting: "Formato del nombre de archivo",
    noteNameFormatDesc: "Variables disponibles: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Contenido de la plantilla de nota",
    templateDesc: "Plantilla aplicada al crear una nueva nota de clase. Admite Markdown y Obsidian Properties (YAML).",
    btnOpenTemplateBuilder: "Abrir creador visual de plantillas",
    builderModalTitle: "Creador visual de plantillas de notas",
    builderModalDesc: "Diseña tu plantilla de apuntes con vista previa en tiempo real y chips de variables arrastrables.",
    builderPresetsLabel: "Plantillas predefinidas",
    presetStandard: "📋 Estándar",
    presetProperties: "📊 Propiedades Obsidian (YAML)",
    presetMinimal: "📌 Minimalista",
    presetBlank: "📄 Nota en blanco",
    builderChipsLabel: "Variables disponibles de tu horario (haz clic o arrastra al editor):",
    builderChipTooltip: "Haz clic para insertar o arrastra a la plantilla: {desc}",
    builderEditorLabel: "Editor de plantilla (Markdown / YAML)",
    builderPreviewLabel: "Vista previa con datos reales de clase",
    builderBlankPreview: "La plantilla está vacía. Inserta texto o variables arriba.",
    btnSaveTemplate: "Guardar plantilla",
    templateSavedNotice: "¡Plantilla de nota guardada con éxito!",
    sampleSubject: "Programación I",
    sampleRoom: "Aula 204",
    sampleLecturer: "Prof. García",
    sampleDesc: "Grupo B - Algoritmos y estructuras de datos",
    langTitle: "Idioma",
    langDesc: "Selecciona el idioma de visualización para el calendario, días de la semana, línea temporal y ajustes.",
    langSelectLabel: "Idioma de la interfaz",
    regionTitle: "Formato regional",
    regionDesc: "Configura el formato de fecha, el primer día de la semana y el reloj (24h / 12h).",
    firstDayOfWeekSetting: "Primer día de la semana",
    firstDayOfWeekDesc: "Elige si la semana en el calendario comienza en lunes o domingo.",
    firstDayMonday: "Lunes",
    firstDaySunday: "Domingo",
    timeFormatSetting: "Formato de hora",
    timeFormatDesc: "Elige formato de 24 horas (14:30) o 12 horas AM/PM (2:30 PM).",
    timeFormat24h: "24 horas (14:30)",
    timeFormat12h: "12 horas AM/PM (2:30 PM)",
    mappingTitle: "Asignación de asignaturas a carpetas",
    mappingDesc: "Asigna carpetas de tu bóveda a las asignaturas detectadas en tu horario. Las notas de clase se guardarán automáticamente en su carpeta.",
    colSubject: "Asignatura / Curso",
    colFolder: "Carpeta en la bóveda",
    optAutoMatch: "Asignar carpeta automáticamente",
    optAutoMatchFound: "Automático (encontrada: {folder})",
    optNotFoundAuto: "Sin carpeta (crear al abrir la nota)",
    optCreateNewFolder: "➕ Crear nueva carpeta...",
    optNoFolder: "🚫 Sin carpeta (ignorar asignatura)",
    cleanSubjectNamesSetting: "Limpiar títulos de asignaturas",
    cleanSubjectNamesDesc: "Elimina etiquetas como (Teo), (Prac), (Lab), [W] y términos de examen al sugerir nombres de carpetas.",
    autoFindFolderSetting: "Detectar carpetas existentes automáticamente",
    autoFindFolderDesc: "Busca carpetas con el mismo nombre en la bóveda si no hay una asignación manual configurada.",
    autoMatchedTo: "Asignado automáticamente a: {folder}",
    statusManuallyMapped: "Asignado manualmente",
    statusIgnored: "Ignorado (sin carpeta)",
    noMatchFound: "No se encontró carpeta coincidente",
    folderCreatedAndAssignedNotice: "Carpeta '{folder}' creada y asignada a la asignatura '{subject}'.",
    noSubjectsFound: "No se encontraron asignaturas en tu horario. Añade un horario primero.",
    exclusionsTitle: "Asignaturas excluidas y filtros",
    exclusionsDesc: "Oculta cursos o grupos a los que no asistes. Los eventos excluidos no aparecerán en el calendario ni en las exportaciones.",
    detectedSubjects: "Asignaturas detectadas (conmuta para excluir)",
    keywordsTitle: "Palabras clave de filtrado",
    keywordsDesc: "Cualquier clase cuyo título o descripción contenga una de estas palabras clave será excluida.",
    keywordsPlaceholder: "Introduce palabra clave (ej. Grupo B, Optativa, Deporte)...",
    btnAddKeyword: "Añadir palabra clave",
    btnEditKeyword: "Editar",
    btnSaveKeyword: "Guardar",
    btnDeleteKeyword: "Eliminar",
    noKeywordsText: "No hay palabras clave de filtrado definidas.",
    excludeToggleOn: "La asignatura está excluida (clic para mostrar)",
    excludeToggleOff: "La asignatura es visible (clic para excluir)",
    colorsTitle: "Categorías de clases y colores",
    colorsDesc: "Personaliza nombres y colores. El complemento categoriza automáticamente las clases según palabras clave en su título y descripción.",
    categoryNamePlaceholder: "Predeterminado: {default}",
    btnResetColors: "Restablecer colores predeterminados",
    errHttpStatus: "El servidor respondió con error {status}: {text}",
    errHttp401Google: "Error 401 (Acceso denegado a Google Calendar): Los calendarios web deben ser públicos, O copia abajo en los ajustes de Google Calendar la „Dirección secreta en formato iCal” (.ics), o sube el archivo .ics manualmente.",
    errHttp401General: "Error {status} (No autorizado): Los calendarios compartidos en la web deben ser públicos. Hazlo público o sube el archivo .ics desde tu ordenador.",
    errNoScheduleSource: "Añade un enlace de horario en los ajustes o sube un archivo .ics.",
    errInvalidIcsContent: "El contenido descargado no contiene un calendario iCal/ICS válido.",
    errCreateNote: "Error al crear la nota: {message}",
    conditionalRuleBuilderTitle: "Generador de regla condicional (Si asignatura ➔ Excluir profesor / palabra clave)",
    conditionalRuleBuilderDesc: "Permite excluir a un profesor o palabra clave específica solo en una asignatura determinada (otras asignaturas con este profesor permanecerán visibles).",
    selectSubjectPlaceholder: "Seleccionar asignatura...",
    conditionalKwPlaceholder: "Nombre del profesor o palabra clave a excluir...",
    btnAddConditionalRule: "+ Añadir regla condicional",
    ruleIfPrefix: "Si",
    ruleExcludePrefix: "Excluir",
    ruleAllPrefix: "Todas las palabras",
    noticeSelectSubjectFirst: "Por favor selecciona primero una asignatura.",
    noticeEnterKeywordFirst: "Por favor introduce una palabra clave o nombre de profesor a excluir.",
    scheduleBtnTitle: "Horario de la asignatura (todas las sesiones)",
    scheduleBtnLabel: "Horario",
    scheduleStatTotal: "{count} en total",
    scheduleStatPast: "{count} completadas",
    scheduleStatUpcoming: "{count} restantes",
    filterAll: "Todas ({count})",
    filterUpcoming: "Próximas ({count})",
    filterPast: "Pasadas ({count})",
    nextSessionBadge: "Próxima clase",
    allSessionsHeading: "Cronograma de todas las sesiones",
    noSessionsFoundForCourse: "No se encontraron sesiones para esta asignatura.",
    statusOngoing: "En curso",
    statusNext: "Siguiente",
    statusPast: "Completada",
    statusFuture: "Planificada",
    statusCancelled: "Clase cancelada",
    btnJumpToDayInCalendar: "Mostrar en el horario",
    btnViewInSchedule: "Mostrar día",
    btnOpenNote: "Apunte",
    btnCreateNoteShort: "Apunte",
    btnOpenCourseHub: "Carpeta de asignatura",
    badgeOpenNoteTooltip: "Clic para abrir apunte",
    badgeCreateNoteTooltip: "Clic para crear apunte",
    badgeMapFolderTooltip: "Clic para asignar carpeta",
    courseHubNotFound: "Carpeta no encontrada. Asigna una carpeta en ajustes o crea primero un apunte.",
    courseHubCreated: "Apunte de asignatura creado: {path}",
    countdownOngoing: "Clase en curso ahora",
    countdownToday: "Hoy a las {time}",
    countdownTomorrow: "Mañana a las {time}",
    countdownInDays: "En {days} días",
    allSessionsCompleted: "Todas las clases programadas para esta asignatura han finalizado."
  },
  zh: {
    allCalendars: "所有日历",
    filterCalendarLabel: "适用于日历",
    btnCollapse: "折叠",
    btnExpand: "展开",
    calendarCoursesCount: "{count} 门课程",
    noCoursesInCalendar: "此日历中未检测到课程。",
    viewTitle: "课程表与日历",
    ribbonTitle: "打开大学课程表",
    commandOpen: "在侧边栏打开大学课程表",
    commandSync: "从学校刷新课程表",
    commandExportIcs: "导出整理后的日历 (.ics)",
    today: "今天",
    prevMonth: "上个月",
    nextMonth: "下个月",
    refreshSchedule: "从学校刷新课程表",
    refreshSuccess: "课程表已更新！课时总数：{count}",
    refreshError: "获取课程表失败：",
    weekdaysShort: ["一", "二", "三", "四", "五", "六", "日"],
    weekdaysFull: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsGenitive: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dateHeaderTemplate: "{year}年{month}{dayNum}日 {dayName}",
    noClasses: "无课程",
    oneClass: "1 节课",
    fewClasses: "{count} 节课",
    manyClasses: "{count} 节课",
    emptyScheduleTitle: "今天没有安排任何课程。",
    emptyScheduleDesc: "享受自由时光，或者温习功课！",
    emptyNoSourcesTitle: "尚未添加大学课程表",
    emptyNoSourcesDesc: "在设置中粘贴学校教务系统的 iCal 日历订阅链接（如正方教务、超星学习通、Canvas、Moodle）或上传 .ics 课表文件即可查看时间线与倒计时。",
    btnAddScheduleSettings: "打开设置添加课程表",
    remainingMin: "剩余 {min} 分钟",
    allDay: "全天",
    noteExists: "笔记已存在",
    missingNote: "无笔记",
    openNoteHint: "打开笔记",
    createNoteHint: "点击创建课堂笔记",
    noFolderBadge: "无文件夹",
    createFolderHint: "点击创建文件夹并新建笔记",
    subjectIgnoredNotice: "此课程在设置中已标记为忽略（不映射文件夹）。",
    defaultCourseName: "课程",
    defaultCalendarName: "日历",
    noInfo: "暂无信息",
    modalCreateTitle: "创建新课堂笔记？",
    modalCreateDesc: "尚未找到 {date} 对应课程的笔记：",
    modalTargetLoc: "在知识库中的目标存储路径：",
    modalCancel: "取消",
    modalCreateBtn: "创建笔记",
    noteCreatedNotice: "已创建笔记：{path}",
    noteOpenedNotice: "已打开笔记：{name}",
    modalCreateFolderTitle: "未找到此课程对应的文件夹",
    modalCreateFolderDesc: "您的知识库中尚未为此课程创建文件夹：",
    modalCreateFolderPrompt: "是否创建新文件夹并生成 {date} 的第一篇课堂笔记？",
    modalFolderInputLabel: "新文件夹名称或路径：",
    modalNotePreviewLabel: "新笔记存储位置：",
    modalCreateFolderBtn: "创建文件夹与笔记",
    folderAndNoteCreatedNotice: "已创建文件夹 '{folder}' 并生成笔记：{path}",
    confirmDeleteScheduleTitle: "移除此课程表？",
    confirmDeleteScheduleDesc: "确定要移除课程表 '{name}' 吗？其课程日程将从日历中移除。您已编写的 Markdown 笔记文件不受任何影响。",
    typeLecture: "理论课 / 讲座",
    typeExercises: "习题课 / 研讨",
    typeLab: "实验 / 上机",
    typeLanguage: "外语课",
    typeLanguageExam: "外语课 (考试)",
    typeProject: "课程设计 / 项目",
    typeSeminar: "学术研讨班",
    typeExam: "期末 / 期中考试",
    typeOther: "其他活动",
    settingTimelineGapsTitle: "课程表课间空档与休息时间",
    settingShowTimelineGapsName: "在每日时间线上显示空档 / 休息指示器",
    settingShowTimelineGapsDesc: "在每日时间线上以可视化的方式标示连续课程之间的空闲时间与课间休息。",
    timelineBreakTooltip: "空闲时间：{time}",
    cardAppearanceTitle: "课间空档与休息显示外观",
    cardAppearanceDesc: "自定义连续课程之间的课间休息与空档在每日时间线上的呈现样式。",
    cardCategoriesTitle: "课程分类与徽标颜色",
    cardCategoriesDesc: "为不同类型的课程（讲座、实验、研讨、考试等）自定义显示名称与色彩徽章。",
    breakStyleLabel: "呈现样式",
    breakStylePill: "胶囊徽章 (Pill)",
    breakStyleCard: "时间线卡片 (Card)",
    breakStyleLine: "虚线分隔符 (Line)",
    breakStyleText: "纯文本 (Text)",
    breakCardDefaultTitle: "课间空档 / 休息时间",
    breakIconLabel: "休息图标",
    breakIconCoffee: "☕ 咖啡杯",
    breakIconFood: "🍔 用餐 / 午餐",
    breakIconPause: "⏸️ 暂停",
    breakIconHourglass: "⏳ 沙漏",
    breakIconWalk: "🚶 散步 / 走动",
    breakIconBook: "📖 阅读 / 自习",
    breakIconMusic: "🎵 听歌 / 音乐",
    breakIconSun: "☀️ 阳光",
    breakIconMoon: "🌙 月亮",
    breakIconSpark: "✨ 闪光",
    breakIconBattery: "🔋 充电休息",
    breakIconClock: "⏰ 时钟",
    breakIconLeaf: "🍃 绿叶",
    breakIconSmile: "😊 放松",
    breakMinMinutesLabel: "最小空档时长（分钟）",
    breakMinMinutesDesc: "短于此时间的微小空隙将不显示指示器。",
    breakMinMinutesPlaceholder: "例如 15",
    breakMaxMinutesLabel: "最大空档时长（分钟）",
    breakMaxMinutesDesc: "0 表示不设上限（显示所有大于最小阈值的空档）。",
    breakMaxMinutesPlaceholder: "0 表示无上限",
    perCalendarGapsTitle: "针对各个日历单独设置空档",
    perCalendarGapsDesc: "针对特定日历单独覆盖课间休息指示器规则。",
    enableCalendarGapOverride: "为此日历单独启用空档覆盖规则",
    categoryUsedInCalendars: "所在日历",
    settingShowCoffeeIconName: "在侧边栏顶部显示咖啡杯图标",
    settingShowCoffeeIconDesc: "在侧边栏日历顶部的设置按钮旁显示一个精致的咖啡杯支持图标。",
    tabAbout: "关于项目",
    tabGeneral: "课表源与同步",
    tabLanguage: "语言与地区",
    tabMapping: "笔记与模板",
    tabExclusions: "课程排除",
    tabColors: "分类与配色",
    qsTitle: "快速入门 — 如何开始？",
    qsStep1Title: "添加课程表：",
    qsStep1Desc: "在「课表源与同步」选项卡中，粘贴学校教务系统（如正方教务、超星学习通、Canvas、Moodle 等）的 iCal/ICS 订阅链接，或直接上传下载的 .ics 文件。",
    qsStep2Title: "配置模板与文件夹映射：",
    qsStep2Desc: "在「笔记与模板」选项卡中，将课程与知识库文件夹进行配对，并通过可视化模板设计器定制笔记样式。",
    qsStep3Title: "在侧边栏展开课表：",
    qsStep3Desc: "点击 Obsidian 左侧边栏的学士帽 🎓 图标——随时查看今日课程、实时上课倒计时，一键新建课堂笔记。",
    langSelectName: "界面语言",
    langSelectDesc: "选择插件的显示语言。",
    langAuto: "跟随系统 (自动检测)",
    guideTitle: "插件运行机制与最佳实践",
    guide1Title: "与高校教务系统及日历课表直接集成",
    guide1Desc: "插件解析官方标准的 iCalendar (iCal/ICS) 订阅源，自动识别理论课、实验、习题、教室及授课教师，并在当前课程进行时实时倒计时。",
    guide2Title: "核心设计理念：文件夹 = 课程，文件 = 课堂笔记",
    guide2Desc: "点击时间线上的课程卡片，即可快速打开当天的课堂笔记；若尚不存在，则按设定模板与 YAML 属性自动生成。",
    guide3Title: "最佳实践：高效组织整个学期",
    guide3Desc: "为整个学期的学习工作流保持清晰有序：",
    guideBullet1: "🗂️ 专课专夹：将每门课程映射到指定知识库文件夹，笔记自动归档。",
    guideBullet2: "🚫 智能排除：隐藏未选的平行班级或无须关心的公共事件，支持关键词过滤。",
    guideBullet3: "☕ 课间空档提醒：开启连续课程之间的空档休息指示器，从容规划自习与午休。",
    guideCalloutTitle: "使用场景：",
    guideCalloutText: "走进教室，打开 Obsidian，点击侧边栏正在进行中的课程卡片，直接在预先填好教室、教师和日期的模板中开始速记。",
    coffeeBannerText: "喜欢这款插件？请作者喝杯咖啡吧！",
    coffeeBannerSubtext: " 支持后续功能开发与持续维护。",
    coffeeBannerBtn: "请喝咖啡",
    coffeeBannerTitle: "喜欢这款插件？请作者喝杯咖啡吧！",
    coffeeBannerDesc: "您的支持是作者利用业余时间持续维护与更新新特性的动力。",
    btnBuyCoffee: "请作者喝杯咖啡",
    supportTitle: "支持本项目",
    supportDesc: "本插件完全免费且开源，由作者利用业余时间倾力打造。如果它在大学学习与笔记整理中帮到了您，请喝杯咖啡就是对项目最好的鼓励与赞赏！",
    supportBtnText: "请作者喝咖啡",
    hideSupportName: "隐藏支持赞赏信息",
    hideSupportDesc: "隐藏设置页面顶部的赞助横幅以及侧边栏顶部的咖啡杯图标。",
    linksTitle: "关于项目",
    heroAuthor: "作者",
    linksGithub: "GitHub 仓库",
    linksIssues: "反馈问题或建议新功能",
    aboutPluginDesc: "高校课程表与日历侧边栏，支持实时上课倒计时、可视化笔记模板设计器、课程文件夹自动配对与一键笔记关联。",
    aboutAuthor: "作者",
    aboutSupportTitle: "支持本项目",
    aboutSupportDesc: "本插件完全免费且开源。如果它帮助您更有条理地度过大学时光，欢迎请作者喝杯咖啡！",
    aboutLinksTitle: "相关链接",
    btnGithubRepo: "GitHub 仓库",
    btnReportIssue: "反馈问题或建议新功能",
    aboutQuickStartTitle: "快速入门 — 如何开始？",
    aboutStep1: "添加课程表：在「课表源与同步」中粘贴大学 iCal/ICS 订阅链接，或上传 .ics 课表文件。",
    aboutStep2: "配置模板与外观：在「笔记与模板」中设置笔记内容模板及课程文件夹映射。",
    aboutStep3: "打开侧边栏视图：点击左侧功能栏的学士帽 🎓 图标即可查看日程与倒计时。",
    settingsTitle: "大学课程表与日程设置",
    urlSettingName: "添加课程表源",
    urlSettingDesc: "粘贴来自学校教务系统（如正方教务、超星学习通、Canvas、Moodle、Google 日历、Outlook）的 iCal/ICS 订阅链接，或直接上传本地 .ics 文件。注意：网络链接须公开可访问或带有专用 Token。",
    urlSettingDescShort: "从 iCal/ICS 订阅链接（如正方教务、超星、Canvas、Google、Outlook）添加课程表，或直接上传 .ics 文件。",
    publicCalendarTip: "💡 如何从你的大学教务系统获取课程表：\n• 正方教务 / 青果 / URP 等高校教务系统：登录教务系统 → 进入「我的课表 / 学期课表」→ 点击「导出日历 (.ics) / iCal 订阅」；若教务系统不支持导出，可通过开源课表转换工具（如 WakeUp课程表、小爱课程表或 GitHub 上的教务日历脚本）导出标准 .ics 格式课表文件。\n• 超星学习通 / Canvas / Moodle：进入课程日历 → 点击「日历导出 / Calendar Feed / 获取 iCal 订阅链接」复制 URL。\n• Google 日历 / Outlook：在 Google 日历设置中复制「iCal 格式的私密网址」；在 Outlook 中进入设置 → 日历 → 共享日历 → 发布日历并复制 ICS 链接。\n• 本地 .ics 文件：若学校不支持网络订阅链接，直接在教务处下载 .ics 课表文件，点击上方的「上传 .ics 文件」即可一键导入。",
    urlPlaceholder: "https://jwgl.university.edu.cn/schedule.ics 或 学习通/Canvas/Google 日历链接",
    btnDownloadNow: "从 URL 获取并添加",
    btnDownloading: "正在下载...",
    btnUploadIcs: "上传 .ics 文件",
    uploadIcsDesc: "从本地电脑或手机上传已下载的 .ics / iCal 课表文件",
    icsLoadedSuccess: "成功加载课程表 '{name}'！已导入 {count} 节课程。",
    invalidIcsError: "错误：上传的文件不包含有效的 iCalendar (.ics) 日历格式。",
    fileLoadError: "读取课表文件出错：",
    addedSchedulesTitle: "已添加的课程表列表",
    noSchedulesAdded: "尚未添加任何课程表。请在上方粘贴订阅链接或上传本地 .ics 文件。",
    scheduleTypeUrl: "网络订阅 (URL)",
    scheduleTypeFile: "本地文件 (.ics)",
    btnRefreshSource: "立即同步此课表",
    btnRenameSource: "重命名课表",
    renameSourcePlaceholder: "输入新的课表名称...",
    scheduleRenamedNotice: "课表已重命名为：{name}",
    errDuplicateCalendarName: "已存在同名的课程表。",
    btnLockSource: "锁定（防止同步覆盖）",
    btnUnlockSource: "解锁（允许正常同步）",
    badgeLockedSource: "已锁定",
    scheduleLockedNotice: "课程表 '{name}' 已锁定，将不再被网络同步覆盖。",
    scheduleUnlockedNotice: "课程表 '{name}' 已解锁，将恢复正常同步。",
    allSchedulesLockedNotice: "所有课程表均处于锁定状态。请至少解锁一个以进行同步。",
    btnHideSource: "在日历中隐藏此课表",
    btnShowSource: "在日历中显示此课表",
    badgeHiddenSource: "已隐藏",
    scheduleHiddenNotice: "课程表 '{name}' 已隐藏。",
    scheduleShownNotice: "课程表 '{name}' 现已显示。",
    btnDeleteSource: "删除课表",
    scheduleRemovedNotice: "已移除课表：{name}",
    btnExportIcs: "导出整理后的日历 (.ics)",
    exportIcsDesc: "将所有启用的、非排除状态的课程日程导出为干净的 .ics 文件，保存在知识库中。",
    exportSuccess: "已将 {count} 节课程导出至：{path}",
    exportEmptyError: "没有可导出的课程事件，请先添加课程表。",
    syncStartupName: "软件启动时自动同步",
    syncStartupDesc: "Obsidian 启动时自动从网络拉取并刷新最新课表。",
    btnCancelEdit: "取消",
    btnShowCalNameOnEvents: "在日程卡片上显示所属日历名",
    btnHideCalNameOnEvents: "隐藏日程卡片上的日历名",
    calNameShownNotice: "已为 '{name}' 开启在卡片上显示所属日历名。",
    calNameHiddenNotice: "已隐藏 '{name}' 卡片上的日历名。",
    badgeCalNameShown: "显示日历名",
    notesFolderCardTitle: "文件夹与知识库归档",
    notesTemplateSectionTitle: "课堂笔记模板",
    notesSettingsTitle: "笔记与模板",
    notesSettingsDesc: "配置新建课堂笔记的内容模板、存储文件夹结构以及文件名规则。",
    settingDisableNoteClickName: "禁用点击课程卡片打开笔记",
    settingDisableNoteClickDesc: "禁止通过点击时间线上的课程卡片打开或新建笔记。",
    baseFolderSetting: "课程根文件夹",
    baseFolderDesc: "课程子文件夹存放的基础根目录（留空表示存放在知识库根目录下）。",
    baseFolderPlaceholder: "例如 大学课程 或 课程笔记",
    optVaultRoot: "知识库根目录 (无基础文件夹)",
    dateFormatSetting: "日期格式",
    dateFormatDesc: "应用于笔记文件名以及 {date} 变量中。",
    dateFormatExample: "示例：{sample}",
    noteNameFormatSetting: "笔记文件名格式",
    noteNameFormatDesc: "可用变量：{date}, {subject}, {room}, {lecturer}, {type}。",
    templateHeader: "笔记正文模板",
    templateDesc: "新建课堂笔记时自动套用的模板，支持标准 Markdown 与 Obsidian Properties (YAML)。",
    btnOpenTemplateBuilder: "打开可视化模板设计器",
    builderModalTitle: "可视化笔记模板设计器",
    builderModalDesc: "利用实时预览以及可拖拽的变量芯片轻松定制课堂笔记模板。",
    builderPresetsLabel: "预设模版",
    presetStandard: "📋 标准模板",
    presetProperties: "📊 属性元数据 (YAML)",
    presetMinimal: "📌 极简风格",
    presetBlank: "📄 完全空白",
    builderChipsLabel: "课表中可用的动态变量（点击插入或拖入编辑器）：",
    builderChipTooltip: "点击插入或拖动到模板：{desc}",
    builderEditorLabel: "模板编辑器 (Markdown / YAML)",
    builderPreviewLabel: "结合真实课程数据的实时预览",
    builderBlankPreview: "模板为空。请在上方输入正文或点击插入变量。",
    btnSaveTemplate: "保存模板",
    templateSavedNotice: "笔记模板已保存！",
    sampleSubject: "计算机科学与技术导论",
    sampleRoom: "东一教学楼 204",
    sampleLecturer: "图灵 教授",
    sampleDesc: "A班 - 数据结构与算法实训",
    langTitle: "语言",
    langDesc: "选择日历、星期、时间线与各项设置的显示语言。",
    langSelectLabel: "界面语言",
    regionTitle: "地区格式",
    regionDesc: "自定义日期显示格式、每周起始日以及时间显示制式（24小时制 / 12小时制）。",
    firstDayOfWeekSetting: "每周第一天",
    firstDayOfWeekDesc: "选择日历视图以星期一还是星期日作为一周的开始。",
    firstDayMonday: "星期一",
    firstDaySunday: "星期日",
    timeFormatSetting: "时间制式",
    timeFormatDesc: "选择 24 小时制 (14:30) 或 12 小时制 AM/PM (2:30 PM)。",
    timeFormat24h: "24 小时制 (14:30)",
    timeFormat12h: "12 小时制 AM/PM (2:30 PM)",
    mappingTitle: "课程与知识库文件夹配对映射",
    mappingDesc: "为课表中检测到的科目指定存放的知识库文件夹，点击课程即可自动将笔记存入专属文件夹中。",
    colSubject: "课程名称",
    colFolder: "对应文件夹",
    optAutoMatch: "自动匹配同名文件夹",
    optAutoMatchFound: "自动匹配（已找到：{folder}）",
    optNotFoundAuto: "无对应文件夹（打开笔记时按提示创建）",
    optCreateNewFolder: "➕ 创建新文件夹...",
    optNoFolder: "🚫 不映射文件夹 (忽略此课程)",
    cleanSubjectNamesSetting: "自动净化课程标题",
    cleanSubjectNamesDesc: "在建议文件夹名称与笔记名时，自动去除诸如 (讲座)、(实验)、[W]、期末重修等冗余修饰词。",
    autoFindFolderSetting: "自动搜索已有文件夹",
    autoFindFolderDesc: "未设置明确映射规则时，自动在知识库中查找同名已有文件夹。",
    autoMatchedTo: "已自动匹配到文件夹：{folder}",
    statusManuallyMapped: "手动映射",
    statusIgnored: "已忽略（无文件夹）",
    noMatchFound: "未找到匹配文件夹",
    folderCreatedAndAssignedNotice: "已创建文件夹 '{folder}' 并映射给课程 '{subject}'。",
    noSubjectsFound: "课表中未检测到任何课程。请先添加课表源。",
    exclusionsTitle: "课程排除与关键词过滤",
    exclusionsDesc: "隐藏未选课程或不参加的讨论班。排除的事件不会在日历、时间线或导出文件中显示。",
    detectedSubjects: "已检测到的课程（点击开关切换排除状态）",
    keywordsTitle: "过滤关键词",
    keywordsDesc: "只要事件的标题或说明包含此处定义的任意关键词，都会被自动隐藏。",
    keywordsPlaceholder: "输入关键词（如 B组, 体育选修, 答辩等）...",
    btnAddKeyword: "添加关键词",
    btnEditKeyword: "编辑",
    btnSaveKeyword: "保存",
    btnDeleteKeyword: "删除",
    noKeywordsText: "尚未设置任何过滤关键词。",
    excludeToggleOn: "该课程已排除（点击恢复显示）",
    excludeToggleOff: "该课程正常显示（点击排除）",
    colorsTitle: "课程分类与颜色",
    colorsDesc: "自定义各类课程的名称与色块徽章。插件会根据标题与描述中的关键词智能归类。",
    categoryNamePlaceholder: "默认名称：{default}",
    btnResetColors: "恢复默认配色",
    errHttpStatus: "服务器响应错误 {status}：{text}",
    errHttp401Google: "错误 401（Google 日历无访问权限）：通过网络共享的日历必须设为公开，或者在 Google 日历设置底部复制「iCal 格式的私密网址」(.ics)，也可以手动下载并上传 .ics 文件。",
    errHttp401General: "错误 {status}（未授权）：网络日历必须具有访问权限。请公开日历或从本地电脑直接上传 .ics 文件。",
    errNoScheduleSource: "请在设置中输入课表链接，或从本地上传 .ics 文件。",
    errInvalidIcsContent: "下载的内容不是有效的 iCalendar/ICS 日历格式。",
    errCreateNote: "创建笔记时出错：{message}",
    conditionalRuleBuilderTitle: "条件排除构建器（当课程为 ➔ 排除教师 / 关键词）",
    conditionalRuleBuilderDesc: "仅在特定课程中排除指定教师或关键词（该教师在其他课程中的安排仍将正常显示）。",
    selectSubjectPlaceholder: "选择课程...",
    conditionalKwPlaceholder: "要排除的教师姓名或关键词...",
    btnAddConditionalRule: "+ 添加条件规则",
    ruleIfPrefix: "当课程为",
    ruleExcludePrefix: "排除",
    ruleAllPrefix: "匹配所有关键词",
    noticeSelectSubjectFirst: "请先从列表中选择一门课程。",
    noticeEnterKeywordFirst: "请输入要排除的关键词或教师姓名。",
    scheduleBtnTitle: "课程完整课表（所有课次）",
    scheduleBtnLabel: "课表",
    scheduleStatTotal: "共 {count} 次",
    scheduleStatPast: "已结课 {count} 次",
    scheduleStatUpcoming: "待上课 {count} 次",
    filterAll: "全部 ({count})",
    filterUpcoming: "未上课 ({count})",
    filterPast: "已结课 ({count})",
    nextSessionBadge: "下节课",
    allSessionsHeading: "所有课次时间线",
    noSessionsFoundForCourse: "未检测到该课程的排课信息。",
    statusOngoing: "进行中",
    statusNext: "下节课",
    statusPast: "已结课",
    statusFuture: "待上课",
    statusCancelled: "已调停课",
    btnJumpToDayInCalendar: "在日历中查看",
    btnViewInSchedule: "查看当天",
    btnOpenNote: "笔记",
    btnCreateNoteShort: "笔记",
    btnOpenCourseHub: "课程文件夹",
    badgeOpenNoteTooltip: "点击打开笔记",
    badgeCreateNoteTooltip: "点击新建笔记",
    badgeMapFolderTooltip: "点击绑定课程文件夹",
    courseHubNotFound: "未找到该课程的文件夹。请先在设置中映射或创建首篇笔记。",
    courseHubCreated: "已创建课程笔记：{path}",
    countdownOngoing: "当前正在上课",
    countdownToday: "今天 {time}",
    countdownTomorrow: "明天 {time}",
    countdownInDays: "{days} 天后",
    allSessionsCompleted: "该课程所有排定课次均已结束。"
  },
  ja: {
    allCalendars: "すべてのカレンダー",
    filterCalendarLabel: "対象カレンダー",
    btnCollapse: "折りたたむ",
    btnExpand: "展開する",
    calendarCoursesCount: "{count} 科目",
    noCoursesInCalendar: "このカレンダーから科目が検出されませんでした。",
    viewTitle: "時間割＆カレンダー",
    ribbonTitle: "大学の時間割を開く",
    commandOpen: "サイドバーで大学カレンダーを開く",
    commandSync: "大学の時間割を同期・更新",
    commandExportIcs: "整理した時間割を書き出し (.ics)",
    today: "今日",
    prevMonth: "前月",
    nextMonth: "翌月",
    refreshSchedule: "大学の時間割を同期・更新",
    refreshSuccess: "時間割を更新しました！授業数: {count}",
    refreshError: "時間割の取得エラー: ",
    weekdaysShort: ["月", "火", "水", "木", "金", "土", "日"],
    weekdaysFull: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthsGenitive: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dateHeaderTemplate: "{year}年{month}{dayNum}日 ({dayName})",
    noClasses: "授業なし",
    oneClass: "1 コマ",
    fewClasses: "{count} コマ",
    manyClasses: "{count} コマ",
    emptyScheduleTitle: "この日に予定されている授業はありません。",
    emptyScheduleDesc: "自由な時間を楽しむか、ノートを復習しましょう！",
    emptyNoSourcesTitle: "大学の時間割がまだ登録されていません",
    emptyNoSourcesDesc: "設定画面で大学ポータル（Manaba、CAMPUSSQUARE、Moodle、Google カレンダー等）の iCal リンクを貼り付けるか、.ics 時間割ファイルを読み込んでください。",
    btnAddScheduleSettings: "設定を開いて時間割を追加",
    remainingMin: "残り {min} 分",
    allDay: "終日",
    noteExists: "ノートあり",
    missingNote: "ノート未作成",
    openNoteHint: "ノートを開く",
    createNoteHint: "クリックして講義ノートを作成",
    noFolderBadge: "フォルダなし",
    createFolderHint: "クリックしてフォルダとノートを作成",
    subjectIgnoredNotice: "この科目は設定で無視（フォルダ割り当てなし）に指定されています。",
    defaultCourseName: "科目",
    defaultCalendarName: "カレンダー",
    noInfo: "情報なし",
    modalCreateTitle: "新しい講義ノートを作成しますか？",
    modalCreateDesc: "{date} の以下の科目に対するノートはまだ作成されていません:",
    modalTargetLoc: "保管庫内の保存先パス:",
    modalCancel: "キャンセル",
    modalCreateBtn: "ノートを作成",
    noteCreatedNotice: "ノートを作成しました: {path}",
    noteOpenedNotice: "ノートを開きました: {name}",
    modalCreateFolderTitle: "この科目のフォルダが見つかりません",
    modalCreateFolderDesc: "保管庫内にこの科目の専用フォルダがまだ存在しません:",
    modalCreateFolderPrompt: "新しいフォルダを作成し、{date} の初回講義ノートを作成しますか？",
    modalFolderInputLabel: "新しいフォルダ名またはパス:",
    modalNotePreviewLabel: "新しいノートの保存場所:",
    modalCreateFolderBtn: "フォルダとノートを作成",
    folderAndNoteCreatedNotice: "フォルダ '{folder}' とノートを作成しました: {path}",
    confirmDeleteScheduleTitle: "時間割を削除しますか？",
    confirmDeleteScheduleDesc: "時間割 '{name}' を削除してもよろしいですか？カレンダーから予定が削除されますが、作成済みの講義ノート Markdown ファイルには影響ありません。",
    typeLecture: "講義",
    typeExercises: "演習",
    typeLab: "実験 / 実習",
    typeLanguage: "語学",
    typeLanguageExam: "語学 (試験)",
    typeProject: "プロジェクト / 課題",
    typeSeminar: "ゼミ / セミナー",
    typeExam: "定期試験 / テスト",
    typeOther: "その他",
    settingTimelineGapsTitle: "時間割の空きコマ・休憩時間",
    settingShowTimelineGapsName: "タイムライン上に空きコマ・休憩を表示",
    settingShowTimelineGapsDesc: "日ごとのタイムライン上で、連続する授業間の空きコマを視覚的に表示します。",
    timelineBreakTooltip: "空きコマ: {time}",
    cardAppearanceTitle: "空きコマ・休憩の表示デザイン",
    cardAppearanceDesc: "日ごとのタイムライン上での空きコマ・休憩時間の表示スタイルを設定します。",
    cardCategoriesTitle: "科目の分類とカラー設定",
    cardCategoriesDesc: "講義、実験、演習、試験などの種別ごとに表示名やバッジカラーをカスタマイズします。",
    breakStyleLabel: "表示スタイル",
    breakStylePill: "ピルバッジ (Pill)",
    breakStyleCard: "タイムラインカード (Card)",
    breakStyleLine: "破線インジケーター (Line)",
    breakStyleText: "テキスト表示 (Text)",
    breakCardDefaultTitle: "空きコマ / 休憩",
    breakIconLabel: "休憩アイコン",
    breakIconCoffee: "☕ コーヒーカップ",
    breakIconFood: "🍔 食事 / ランチ",
    breakIconPause: "⏸️ 一時停止",
    breakIconHourglass: "⏳ 砂時計",
    breakIconWalk: "🚶 移動 / 散歩",
    breakIconBook: "📖 自習 / 読書",
    breakIconMusic: "🎵 音楽 / 休憩",
    breakIconSun: "☀️ 太陽",
    breakIconMoon: "🌙 月",
    breakIconSpark: "✨ ひらめき",
    breakIconBattery: "🔋 充電",
    breakIconClock: "⏰ 時計",
    breakIconLeaf: "🍃 葉",
    breakIconSmile: "😊 リラックス",
    breakMinMinutesLabel: "最小空き時間（分）",
    breakMinMinutesDesc: "この設定値より短い微小な空き時間は表示されません。",
    breakMinMinutesPlaceholder: "例: 15",
    breakMaxMinutesLabel: "最大空き時間（分）",
    breakMaxMinutesDesc: "0 に設定すると上限なしになります（最小値以上のすべての空きコマを表示）。",
    breakMaxMinutesPlaceholder: "0 = 上限なし",
    perCalendarGapsTitle: "カレンダーごとの空きコマ設定",
    perCalendarGapsDesc: "特定の時間割カレンダーに対して個別に空きコマ表示ルールを設定します。",
    enableCalendarGapOverride: "このカレンダーで空きコマ表示を個別設定",
    categoryUsedInCalendars: "使用カレンダー",
    settingShowCoffeeIconName: "サイドバー上部にコーヒーアイコンを表示",
    settingShowCoffeeIconDesc: "サイドバーカレンダー上部の設定ボタンの隣にコーヒー支援アイコンを表示します。",
    tabAbout: "プラグインについて",
    tabGeneral: "時間割ソース & 同期",
    tabLanguage: "言語と地域",
    tabMapping: "ノート & テンプレート",
    tabExclusions: "除外設定",
    tabColors: "表示 & カラー",
    qsTitle: "クイックスタート — はじめ方",
    qsStep1Title: "時間割を追加する: ",
    qsStep1Desc: "「時間割ソース & 同期」タブで、大学ポータル（Manaba、CAMPUSSQUARE、Moodle、Google カレンダー等）の iCal/ICS 購読リンクを貼り付けるか、ダウンロードした .ics ファイルを読み込みます。",
    qsStep2Title: "テンプレートとフォルダを設定: ",
    qsStep2Desc: "「ノート & テンプレート」タブで、科目を保管庫内のフォルダに関連付け、ビジュアルテンプレートエディタでノートの形式を調整します。",
    qsStep3Title: "サイドバーを開く: ",
    qsStep3Desc: "Obsidian の左リボンにある角帽アイコン 🎓 をクリックすると、時間割の確認、リアルタイムカウントダウン、ワンクリックでのノート作成が可能です。",
    langSelectName: "表示言語",
    langSelectDesc: "プラグインの表示言語を選択します。",
    langAuto: "自動検出（システム言語）",
    guideTitle: "機能の仕組みとおすすめの使い方",
    guide1Title: "大学の時間割・履修カレンダーとの直接連携",
    guide1Desc: "標準的な iCalendar (iCal/ICS) 形式を解析し、講義、演習、実験、教室、担当教員を自動識別して、現在の講義の終了までの残り時間をリアルタイムにカウントダウンします。",
    guide2Title: "基本設計: フォルダ = 科目、ファイル = 毎回の講義ノート",
    guide2Desc: "タイムライン上の授業カードをクリックすると、その日の講義ノートが即座に開かれます。未作成の場合は YAML プロパティ付きで自動生成されます。",
    guide3Title: "おすすめ: 学期全体のスマートな整理術",
    guide3Desc: "学期を通して快適に学習とノート作成を続けるためのコツ:",
    guideBullet1: "🗂️ 科目ごとの専用フォルダ: 保管庫内のフォルダと科目を紐付けることで、ノートが自動的に整理されます。",
    guideBullet2: "🚫 スマートな除外設定: 受講していないクラスや不要なイベントはキーワードで簡単に非表示にできます。",
    guideBullet3: "☕ 空きコマの可視化: 講義間の空き時間をタイムライン上で分かりやすく表示し、自習時間を有効活用できます。",
    guideCalloutTitle: "実際の利用シーン: ",
    guideCalloutText: "講義室に入り、Obsidian を起動してサイドバーの授業をクリックするだけで、教室名・教員名・日付がすでに入力された状態でノートを取り始められます。",
    coffeeBannerText: "プラグインを気に入っていただけましたら、ぜひコーヒーを一杯ごちそうしてください！",
    coffeeBannerSubtext: " 継続的な開発と機能改善をサポートします。",
    coffeeBannerBtn: "コーヒーをおごる",
    coffeeBannerTitle: "プラグインをご活用いただいていますか？",
    coffeeBannerDesc: "開発者の継続的なメンテナンスと新機能開発をご支援いただけますと幸いです。",
    btnBuyCoffee: "コーヒーをおごる",
    supportTitle: "プロジェクトを支援",
    supportDesc: "このプラグインは完全無料でオープンソースとして開発されています。大学の勉強やノート整理に役立っていましたら、コーヒー一杯のご支援をいただけますと大変励みになります！",
    supportBtnText: "コーヒーをおごる",
    hideSupportName: "支援案内を非表示にする",
    hideSupportDesc: "設定画面上部のバナーおよびサイドバーヘッダーのコーヒーアイコンを非表示にします。",
    linksTitle: "プロジェクトについて",
    heroAuthor: "開発者",
    linksGithub: "GitHub リポジトリ",
    linksIssues: "不具合報告 / 機能リクエスト",
    aboutPluginDesc: "講義カウントダウン、ビジュアルテンプレートエディタ、科目フォルダ自動マッピング、ワンクリックノート作成を備えた大学向け時間割サイドバープラグイン。",
    aboutAuthor: "開発者",
    aboutSupportTitle: "プロジェクトを支援",
    aboutSupportDesc: "このプラグインは完全無料のオープンソースです。皆様の大学生活を快適にするお手伝いができていれば幸いです！",
    aboutLinksTitle: "リンク",
    btnGithubRepo: "GitHub リポジトリ",
    btnReportIssue: "不具合報告 / 機能リクエスト",
    aboutQuickStartTitle: "クイックスタート — はじめ方",
    aboutStep1: "時間割の追加: 「時間割ソース & 同期」タブで大学の iCal/ICS 購読リンクを貼り付けるか、.ics ファイルを読み込みます。",
    aboutStep2: "テンプレートとフォルダの設定: 「ノート & テンプレート」で講義ノートの書式や保存先フォルダを決めます。",
    aboutStep3: "サイドバー表示: 左リボンの角帽アイコン 🎓 をクリックして時間割を確認します。",
    settingsTitle: "大学時間割 & カレンダー設定",
    urlSettingName: "時間割ソースを追加",
    urlSettingDesc: "大学ポータル（Manaba、CAMPUSSQUARE、Moodle、Google カレンダー等）の iCal/ICS 購読リンクを貼り付けるか、ダウンロードした .ics ファイルを読み込みます。※Web URL は公開アクセス可能か購読トークン付きである必要があります。",
    urlSettingDescShort: "大学の iCal/ICS 購読リンク（Manaba、CAMPUSSQUARE、Moodle、Google 等）から時間割を追加するか、.ics ファイルを読み込みます。",
    publicCalendarTip: "💡 大学の履修・時間割（スケジュール）の追加方法：\n• Manaba / Moodle：学内ポータルにログイン →「カレンダー」または「時間割」→「カレンダーのエクスポート」→「すべてのイベント」→「カレンダーのURLを取得」をクリックして iCal リンクをコピーします。\n• 教務システム（CAMPUSSQUARE / UTAS / KOAN 等）：履修確定後、時間割画面の「iCalendar エクスポート / .ics 出力」を選択するか、大学提供の連携リンクを取得します。\n• Google カレンダー / Outlook：Google カレンダーの設定で「iCal 形式の非公開 URL」をコピーするか、Outlook の「予定表の公開」から ICS リンクを取得します。\n• Canvas LMS：左メニューの「カレンダー」→ 右下の「カレンダーフィード」をクリックして iCal URL をコピーします。\n• ファイル直接読み込み：大学のシステムからダウンロードした .ics 時間割ファイルがある場合は、上部の「.ics ファイルをアップロード」ボタンをクリックしてください。",
    urlPlaceholder: "https://manaba.university.ac.jp/calendar.ics または Google/Moodle リンク",
    btnDownloadNow: "URLから時間割を追加",
    btnDownloading: "ダウンロード中...",
    btnUploadIcs: ".ics ファイルをアップロード",
    uploadIcsDesc: "端末からダウンロード済みの .ics / iCal 時間割ファイルを読み込みます",
    icsLoadedSuccess: "時間割 '{name}' を読み込みました！ {count} コマの授業を追加しました。",
    invalidIcsError: "エラー: 指定されたファイルには有効な iCalendar (.ics) データが含まれていません。",
    fileLoadError: "時間割ファイルの読み込みエラー: ",
    addedSchedulesTitle: "登録済み時間割一覧",
    noSchedulesAdded: "時間割がまだ追加されていません。上記の入力欄にリンクを貼り付けるか、.ics ファイルを読み込んでください。",
    scheduleTypeUrl: "Web 購読 (URL)",
    scheduleTypeFile: "ローカルファイル (.ics)",
    btnRefreshSource: "今すぐ同期する",
    btnRenameSource: "時間割名を変更",
    renameSourcePlaceholder: "新しい時間割名...",
    scheduleRenamedNotice: "時間割名を変更しました: {name}",
    errDuplicateCalendarName: "この名前の時間割は既に存在します。",
    btnLockSource: "同期による上書きをロック",
    btnUnlockSource: "同期ロックを解除",
    badgeLockedSource: "ロック中",
    scheduleLockedNotice: "時間割 '{name}' をロックしました（同期時に上書きされません）。",
    scheduleUnlockedNotice: "時間割 '{name}' のロックを解除しました。",
    allSchedulesLockedNotice: "すべての時間割がロックされています。同期するには少なくとも1つのロックを解除してください。",
    btnHideSource: "カレンダー上で非表示にする",
    btnShowSource: "カレンダー上に表示する",
    badgeHiddenSource: "非表示",
    scheduleHiddenNotice: "時間割 '{name}' を非表示にしました。",
    scheduleShownNotice: "時間割 '{name}' を表示しました。",
    btnDeleteSource: "時間割を削除",
    scheduleRemovedNotice: "時間割を削除しました: {name}",
    btnExportIcs: "整理した時間割を書き出し (.ics)",
    exportIcsDesc: "除外されていないすべての有効な授業予定を、整った .ics ファイルとして保管庫に保存します。",
    exportSuccess: "{count} コマの予定を書き出しました: {path}",
    exportEmptyError: "エクスポート対象の授業がありません。先に時間割を登録してください。",
    syncStartupName: "起動時に自動同期",
    syncStartupDesc: "Obsidian 起動時に自動でインターネットから最新の時間割を取得・更新します。",
    btnCancelEdit: "キャンセル",
    btnShowCalNameOnEvents: "授業カードに時間割名を表示",
    btnHideCalNameOnEvents: "授業カードの時間割名を隠す",
    calNameShownNotice: "'{name}' の授業カードに時間割名を表示します。",
    calNameHiddenNotice: "'{name}' の授業カードから時間割名を隠しました。",
    badgeCalNameShown: "名前表示中",
    notesFolderCardTitle: "フォルダと保管庫設定",
    notesTemplateSectionTitle: "講義ノート用テンプレート",
    notesSettingsTitle: "ノート & テンプレート",
    notesSettingsDesc: "講義ノートの自動生成テンプレート、科目フォルダの構成、ファイル命名規則を設定します。",
    settingDisableNoteClickName: "タイムライン上のカードクリックによるノート作成を無効化",
    settingDisableNoteClickDesc: "タイムライン上の授業カードをクリックしてもノートが開かないようにします。",
    baseFolderSetting: "科目フォルダのルート階層",
    baseFolderDesc: "各科目のフォルダを配置する保管庫内の親フォルダ（未指定の場合は保管庫のルート直下になります）。",
    baseFolderPlaceholder: "例: 大学 または 講義ノート",
    optVaultRoot: "保管庫のルート直下（親フォルダなし）",
    dateFormatSetting: "日付形式",
    dateFormatDesc: "ノートのファイル名や {date} 変数の展開時に使用されます。",
    dateFormatExample: "例: {sample}",
    noteNameFormatSetting: "ノートのファイル名規則",
    noteNameFormatDesc: "利用可能な変数: {date}, {subject}, {room}, {lecturer}, {type}。",
    templateHeader: "ノート本文テンプレート",
    templateDesc: "新しい講義ノートを作成する際に適用される雛形です。Markdown および Obsidian プロパティ (YAML) に対応しています。",
    btnOpenTemplateBuilder: "ビジュアルテンプレートエディタを開く",
    builderModalTitle: "ビジュアルテンプレートエディタ",
    builderModalDesc: "リアルタイムプレビューとドラッグ＆ドロップ対応の変数チップでノートの雛形を自由に編集できます。",
    builderPresetsLabel: "プリセット",
    presetStandard: "📋 標準テンプレート",
    presetProperties: "📊 Obsidian プロパティ (YAML)",
    presetMinimal: "📌 ミニマル",
    presetBlank: "📄 完全な空白ノート",
    builderChipsLabel: "時間割から利用可能な変数（クリックで挿入、またはエディタにドラッグ）：",
    builderChipTooltip: "クリックで挿入、またはテンプレートへドラッグ: {desc}",
    builderEditorLabel: "テンプレートエディタ (Markdown / YAML)",
    builderPreviewLabel: "実際の授業データを使ったプレビュー",
    builderBlankPreview: "テンプレートが空です。テキストを入力するか変数チップを挿入してください。",
    btnSaveTemplate: "テンプレートを保存",
    templateSavedNotice: "講義ノートテンプレートを保存しました！",
    sampleSubject: "情報科学概論",
    sampleRoom: "101 講義室",
    sampleLecturer: "山田 教授",
    sampleDesc: "A組 - アルゴリズムとデータ構造演習",
    langTitle: "言語",
    langDesc: "カレンダー、曜日、タイムライン、設定の表示言語を設定します。",
    langSelectLabel: "表示言語",
    regionTitle: "地域フォーマット",
    regionDesc: "日付の表示形式、週の始まりの曜日、時刻フォーマット（24時間 / 12時間）を設定します。",
    firstDayOfWeekSetting: "週の始まりの曜日",
    firstDayOfWeekDesc: "カレンダーグリッドの始まりを月曜日か日曜日に指定します。",
    firstDayMonday: "月曜日",
    firstDaySunday: "日曜日",
    timeFormatSetting: "時刻表示",
    timeFormatDesc: "24時間表示 (14:30) または 12時間表示 AM/PM (2:30 PM) を選択します。",
    timeFormat24h: "24時間表示 (14:30)",
    timeFormat12h: "12時間表示 AM/PM (2:30 PM)",
    mappingTitle: "科目とフォルダのマッピング",
    mappingDesc: "時間割から検出された科目を保管庫内のフォルダに関連付けます。講義ノートは自動的に該当フォルダへ保存されます。",
    colSubject: "科目名",
    colFolder: "保存先フォルダ",
    optAutoMatch: "自動検出で割り当て",
    optAutoMatchFound: "自動検出（候補: {folder}）",
    optNotFoundAuto: "フォルダなし（ノート作成時に作成）",
    optCreateNewFolder: "➕ 新しいフォルダを作成...",
    optNoFolder: "🚫 フォルダなし（この科目を無視）",
    cleanSubjectNamesSetting: "科目名の余分な表記をクリーンアップ",
    cleanSubjectNamesDesc: "フォルダ名やノート名の提案時に、(講義)、(演習)、[W]、試験表記などの余計なタグを自動で取り除きます。",
    autoFindFolderSetting: "既存フォルダの自動検出",
    autoFindFolderDesc: "個別設定がない場合、保管庫内で科目名に一致する既存フォルダを自動的に探索します。",
    autoMatchedTo: "自動検出されたフォルダ: {folder}",
    statusManuallyMapped: "手動設定済み",
    statusIgnored: "無視（フォルダなし）",
    noMatchFound: "一致するフォルダが見つかりません",
    folderCreatedAndAssignedNotice: "フォルダ '{folder}' を作成し、科目 '{subject}' に割り当てました。",
    noSubjectsFound: "時間割から科目が検出されませんでした。先に時間割を追加してください。",
    exclusionsTitle: "除外科目とキーワードフィルター",
    exclusionsDesc: "受講していないクラスやグループを非表示にします。除外された予定はカレンダー、タイムライン、エクスポートに現れません。",
    detectedSubjects: "検出された科目（スイッチで除外切り替え）",
    keywordsTitle: "除外キーワード",
    keywordsDesc: "予定のタイトルや詳細にこれらのキーワードが含まれている場合、自動的に非表示になります。",
    keywordsPlaceholder: "キーワードを入力（例: Bクラス, 体育, 選択科目）...",
    btnAddKeyword: "キーワードを追加",
    btnEditKeyword: "編集",
    btnSaveKeyword: "保存",
    btnDeleteKeyword: "削除",
    noKeywordsText: "除外キーワードは設定されていません。",
    excludeToggleOn: "除外されています（クリックして表示）",
    excludeToggleOff: "表示中（クリックして除外）",
    colorsTitle: "授業の分類とカラー",
    colorsDesc: "種別名や色をカスタマイズします。タイトルや説明に含まれるキーワードに基づいて自動分類されます。",
    categoryNamePlaceholder: "標準: {default}",
    btnResetColors: "デフォルトの配色に戻す",
    errHttpStatus: "サーバーからエラーコード {status} が返されました: {text}",
    errHttp401Google: "エラー 401（Google カレンダーへのアクセス拒否）: 共有カレンダーは「一般公開」に設定されているか、または Google カレンダー設定下部にある「iCal 形式の非公開 URL」を使用するか、.ics ファイルをダウンロードして直接追加してください。",
    errHttp401General: "エラー {status}（認証エラー）: オンライン共有カレンダーは公開されている必要があります。カレンダーを公開するか、.ics ファイルをダウンロードして直接読み込んでください。",
    errNoScheduleSource: "設定で時間割のリンクを追加するか、.ics ファイルを読み込んでください。",
    errInvalidIcsContent: "取得したデータに有効な iCalendar/ICS カレンダーが含まれていません。",
    errCreateNote: "ノート作成エラー: {message}",
    conditionalRuleBuilderTitle: "条件付き除外ルール（科目が指定の場合 ➔ 担当教員 / キーワードを除外）",
    conditionalRuleBuilderDesc: "特定の講義科目においてのみ、特定の教員やサブグループを除外します（同教員の他科目は表示されたままになります）。",
    selectSubjectPlaceholder: "科目を選択...",
    conditionalKwPlaceholder: "除外する教員名またはキーワード...",
    btnAddConditionalRule: "+ 条件付きルールを追加",
    ruleIfPrefix: "科目名が",
    ruleExcludePrefix: "除外",
    ruleAllPrefix: "すべての単語に一致",
    noticeSelectSubjectFirst: "先にリストから科目を選択してください。",
    noticeEnterKeywordFirst: "除外するキーワードまたは教員名を入力してください。",
    scheduleBtnTitle: "科目シラバス・日程（全コマ）",
    scheduleBtnLabel: "日程一覧",
    scheduleStatTotal: "全 {count} 回",
    scheduleStatPast: "終了 {count} 回",
    scheduleStatUpcoming: "残り {count} 回",
    filterAll: "すべて ({count})",
    filterUpcoming: "予定 ({count})",
    filterPast: "終了 ({count})",
    nextSessionBadge: "次回の講義",
    allSessionsHeading: "全講義日程タイムライン",
    noSessionsFoundForCourse: "この科目の講義日程が見つかりませんでした。",
    statusOngoing: "講義中",
    statusNext: "次回",
    statusPast: "終了",
    statusFuture: "予定",
    statusCancelled: "休講",
    btnJumpToDayInCalendar: "時間割で表示",
    btnViewInSchedule: "当日を表示",
    btnOpenNote: "ノート",
    btnCreateNoteShort: "ノート",
    btnOpenCourseHub: "科目フォルダ",
    badgeOpenNoteTooltip: "クリックしてノートを開く",
    badgeCreateNoteTooltip: "クリックしてノートを作成",
    badgeMapFolderTooltip: "クリックしてフォルダを割り当てる",
    courseHubNotFound: "科目フォルダが見つかりません。設定で割り当てるか、先にノートを作成してください。",
    courseHubCreated: "講義ノートを作成しました: {path}",
    countdownOngoing: "現在講義中",
    countdownToday: "本日 {time}",
    countdownTomorrow: "明日 {time}",
    countdownInDays: "{days}日後",
    allSessionsCompleted: "この科目の予定された全講義は終了しました。"
  },
  ko: {
    allCalendars: "모든 캘린더",
    filterCalendarLabel: "해당 캘린더",
    btnCollapse: "접기",
    btnExpand: "펼치기",
    calendarCoursesCount: "{count}개 과목",
    noCoursesInCalendar: "이 캘린더에서 감지된 과목이 없습니다.",
    viewTitle: "시간표 및 캘린더",
    ribbonTitle: "대학 시간표 열기",
    commandOpen: "사이드바에서 대학 캘린더 열기",
    commandSync: "대학 일정 동기화(새로고침)",
    commandExportIcs: "정리된 캘린더 내보내기 (.ics)",
    today: "오늘",
    prevMonth: "이전 달",
    nextMonth: "다음 달",
    refreshSchedule: "대학 시간표 동기화",
    refreshSuccess: "시간표가 업데이트되었습니다! 총 강의 수: {count}",
    refreshError: "시간표 가져오기 오류: ",
    weekdaysShort: ["월", "화", "수", "목", "금", "토", "일"],
    weekdaysFull: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    monthsGenitive: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    dateHeaderTemplate: "{year}년 {month} {dayNum}일 ({dayName})",
    noClasses: "수업 없음",
    oneClass: "수업 1개",
    fewClasses: "수업 {count}개",
    manyClasses: "수업 {count}개",
    emptyScheduleTitle: "오늘 예정된 수업이 없습니다.",
    emptyScheduleDesc: "여유로운 시간을 즐기거나 배운 내용을 복습해 보세요!",
    emptyNoSourcesTitle: "아직 등록된 강의 시간표가 없습니다",
    emptyNoSourcesDesc: "설정에서 에브리타임(Everytime)이나 대학 학사포털/LMS(Moodle, Canvas)의 iCal 연동 링크를 추가하거나 .ics 파일을 업로드하세요.",
    btnAddScheduleSettings: "설정 열기 및 시간표 추가",
    remainingMin: "{min}분 남음",
    allDay: "종일",
    noteExists: "노트 있음",
    missingNote: "노트 없음",
    openNoteHint: "노트 열기",
    createNoteHint: "클릭하여 강의 노트 생성",
    noFolderBadge: "폴더 없음",
    createFolderHint: "클릭하여 폴더 생성 및 노트 작성",
    subjectIgnoredNotice: "이 과목은 설정에서 제외(폴더 미매핑) 대상으로 지정되어 있습니다.",
    defaultCourseName: "과목",
    defaultCalendarName: "캘린더",
    noInfo: "정보 없음",
    modalCreateTitle: "새 강의 노트를 작성하시겠습니까?",
    modalCreateDesc: "{date} 해당 과목에 대한 노트가 아직 없습니다:",
    modalTargetLoc: "보관함 내 대상 저장 경로:",
    modalCancel: "취소",
    modalCreateBtn: "노트 생성",
    noteCreatedNotice: "노트 생성됨: {path}",
    noteOpenedNotice: "노트 열림: {name}",
    modalCreateFolderTitle: "이 과목의 전용 폴더를 찾을 수 없습니다",
    modalCreateFolderDesc: "보관함 내에 이 과목에 대한 폴더가 아직 존재하지 않습니다:",
    modalCreateFolderPrompt: "새 폴더를 만들고 {date}의 첫 강의 노트를 작성하시겠습니까?",
    modalFolderInputLabel: "새 폴더 이름 또는 경로:",
    modalNotePreviewLabel: "새 노트 저장 위치:",
    modalCreateFolderBtn: "폴더 및 노트 생성",
    folderAndNoteCreatedNotice: "'{folder}' 폴더 생성 및 노트 작성 완료: {path}",
    confirmDeleteScheduleTitle: "이 시간표를 삭제하시겠습니까?",
    confirmDeleteScheduleDesc: "'{name}' 시간표를 삭제하시겠습니까? 캘린더에서 강의 일정이 제거됩니다. 이미 작성된 강의 마크다운 노트 파일은 안전하게 유지됩니다.",
    typeLecture: "강의",
    typeExercises: "연습 / 튜토리얼",
    typeLab: "실습 / 실험",
    typeLanguage: "어학 강좌",
    typeLanguageExam: "어학 강좌 (시험)",
    typeProject: "프로젝트 / 과제",
    typeSeminar: "세미나",
    typeExam: "시험 (중간/기말)",
    typeOther: "기타 수업",
    settingTimelineGapsTitle: "시간표 공강 및 쉬는 시간 표시",
    settingShowTimelineGapsName: "일일 타임라인에 공강 / 쉬는 시간 표시",
    settingShowTimelineGapsDesc: "연속된 강의 사이의 공강 시간을 타임라인에 시각적인 배지로 표시합니다.",
    timelineBreakTooltip: "공강 시간: {time}",
    cardAppearanceTitle: "공강 및 쉬는 시간 표시 스타일",
    cardAppearanceDesc: "하루 일정 타임라인에서 강의 사이의 공강 시간 표시 방식을 맞춤 설정합니다.",
    cardCategoriesTitle: "과목 분류 및 라벨 색상",
    cardCategoriesDesc: "강의, 실습, 세미나, 시험 등 강의 유형별 표시명과 배지 색상을 변경합니다.",
    breakStyleLabel: "표시 스타일",
    breakStylePill: "알약 배지 (Pill)",
    breakStyleCard: "타임라인 카드 (Card)",
    breakStyleLine: "점선 인디케이터 (Line)",
    breakStyleText: "일반 텍스트 (Text)",
    breakCardDefaultTitle: "공강 / 휴식",
    breakIconLabel: "휴식 아이콘",
    breakIconCoffee: "☕ 커피잔",
    breakIconFood: "🍔 식사 / 점심",
    breakIconPause: "⏸️ 일시정지",
    breakIconHourglass: "⏳ 모래시계",
    breakIconWalk: "🚶 산책 / 이동",
    breakIconBook: "📖 자습 / 독서",
    breakIconMusic: "🎵 음악 / 휴식",
    breakIconSun: "☀️ 햇살",
    breakIconMoon: "🌙 달빛",
    breakIconSpark: "✨ 반짝임",
    breakIconBattery: "🔋 재충전",
    breakIconClock: "⏰ 시계",
    breakIconLeaf: "🍃 나뭇잎",
    breakIconSmile: "😊 여유",
    breakMinMinutesLabel: "최소 공강 시간 (분)",
    breakMinMinutesDesc: "이 기준보다 짧은 자투리 시간은 공강 배지를 표시하지 않습니다.",
    breakMinMinutesPlaceholder: "예: 15",
    breakMaxMinutesLabel: "최대 공강 시간 (분)",
    breakMaxMinutesDesc: "0으로 설정하면 상한 없이 모든 공강 시간을 표시합니다.",
    breakMaxMinutesPlaceholder: "0 = 제한 없음",
    perCalendarGapsTitle: "캘린더별 개별 공강 설정",
    perCalendarGapsDesc: "특정 시간표 캘린더에 대해 개별적인 공강 표시 규칙을 지정합니다.",
    enableCalendarGapOverride: "이 캘린더에 개별 공강 설정 적용",
    categoryUsedInCalendars: "사용 중인 캘린더",
    settingShowCoffeeIconName: "사이드바 헤더에 커피 후원 아이콘 표시",
    settingShowCoffeeIconDesc: "사이드바 상단 설정 버튼 옆에 은은한 커피잔 아이콘을 표시합니다.",
    tabAbout: "소개",
    tabGeneral: "시간표 소스 & 동기화",
    tabLanguage: "언어 및 지역",
    tabMapping: "노트 & 템플릿",
    tabExclusions: "과목 제외",
    tabColors: "디자인 및 색상",
    qsTitle: "빠른 시작 가이드 — 어떻게 시작하나요?",
    qsStep1Title: "시간표 추가하기: ",
    qsStep1Desc: "「시간표 소스 & 동기화」 탭에서 에브리타임이나 대학교 학사포털/LMS의 iCal(ICS) 구독 링크를 붙여넣거나 .ics 파일을 업로드하세요.",
    qsStep2Title: "폴더 및 템플릿 설정: ",
    qsStep2Desc: "「노트 & 템플릿」 탭에서 과목별 저장 폴더를 매핑하고 비주얼 템플릿 빌더로 노트 양식을 맞춤 제작하세요.",
    qsStep3Title: "사이드바에서 시간표 확인: ",
    qsStep3Desc: "옵시디언 왼쪽 리본의 학사모 🎓 아이콘을 클릭하면 실시간 수업 카운트다운과 함께 원클릭으로 강의 노트를 작성할 수 있습니다.",
    langSelectName: "인터페이스 언어",
    langSelectDesc: "플러그인의 표시 언어를 선택합니다.",
    langAuto: "자동 감지 (시스템 언어)",
    guideTitle: "기능 원리 및 추천 사용법",
    guide1Title: "대학교 강의 시간표와의 다이렉트 연동",
    guide1Desc: "표준 iCalendar(iCal/ICS) 피드를 파싱하여 강의, 실습, 강의실, 교수님 정보를 인식하고 수업 진행 중에는 종료까지의 시간을 실시간 카운트다운합니다.",
    guide2Title: "핵심 콘셉트: 폴더 = 과목, 파일 = 회차별 강의 노트",
    guide2Desc: "타임라인에서 수업 카드를 누르면 해당 일자의 강의 노트가 즉시 열리며, 없는 경우 YAML 속성이 포함된 템플릿으로 자동 생성됩니다.",
    guide3Title: "추천 워크플로: 완벽한 학기별 필기 관리",
    guide3Desc: "한 학기 동안 깔끔하고 생산적인 필기 습관을 유지하려면:",
    guideBullet1: "🗂️ 과목별 전용 폴더: 각 과목을 보관함 폴더와 매핑하여 강의 노트가 자동으로 제자리에 정리되도록 하세요.",
    guideBullet2: "🚫 스마트 필터링: 수강하지 않는 분반이나 불필요한 행사는 키워드로 손쉽게 숨기세요.",
    guideBullet3: "☕ 공강 시간 가시화: 수업 사이 공강 시간을 타임라인에서 한눈에 파악해 자습 계획을 세우세요.",
    guideCalloutTitle: "실제 활용 예시: ",
    guideCalloutText: "강의실에 도착해 옵시디언을 열고 사이드바의 진행 중인 수업을 클릭하면, 날짜·강의실·교수님 성함이 이미 채워진 서식에서 즉시 필기를 시작할 수 있습니다.",
    coffeeBannerText: "플러그인이 마음에 드셨나요? 개발자에게 커피 한 잔 선물해 주세요!",
    coffeeBannerSubtext: " 지속적인 유지보수와 기능 개선에 큰 힘이 됩니다.",
    coffeeBannerBtn: "커피 한 잔 사주기",
    coffeeBannerTitle: "플러그인을 유용하게 사용하고 계신가요?",
    coffeeBannerDesc: "개발자가 여가 시간을 활용해 프로젝트를 지속적으로 업데이트할 수 있도록 응원해 주세요.",
    btnBuyCoffee: "커피 한 잔 사주기",
    supportTitle: "프로젝트 후원하기",
    supportDesc: "이 플러그인은 열정으로 개발된 완전 무료 오픈소스입니다. 대학 생활과 학업 정리에 도움이 되었다면 커피 한 잔으로 따뜻한 응원을 전해 주세요!",
    supportBtnText: "커피 한 잔 사주기",
    hideSupportName: "후원 안내 숨기기",
    hideSupportDesc: "설정 상단의 후원 배너 및 사이드바 캘린더의 커피잔 아이콘을 숨깁니다.",
    linksTitle: "프로젝트 정보",
    heroAuthor: "제작자",
    linksGithub: "GitHub 저장소",
    linksIssues: "버그 제보 및 기능 제안",
    aboutPluginDesc: "수업 실시간 카운트다운, 비주얼 노트 템플릿 빌더, 과목 폴더 자동 매핑, 원클릭 노트 연동을 지원하는 대학생 필수 시간표 사이드바 플러그인.",
    aboutAuthor: "제작자",
    aboutSupportTitle: "프로젝트 후원하기",
    aboutSupportDesc: "이 플러그인은 무료 오픈소스입니다. 학업에 큰 도움이 되었다면 커피 한 잔으로 응원해 주세요!",
    aboutLinksTitle: "유용한 링크",
    btnGithubRepo: "GitHub 저장소",
    btnReportIssue: "버그 제보 및 기능 제안",
    aboutQuickStartTitle: "빠른 시작 — 어떻게 시작하나요?",
    aboutStep1: "시간표 등록: 「시간표 소스 & 동기화」에서 대학 iCal/ICS 링크를 입력하거나 .ics 파일을 업로드하세요.",
    aboutStep2: "템플릿 및 폴더 구성: 「노트 & 템플릿」에서 강의 노트 양식과 과목별 저장 위치를 설정하세요.",
    aboutStep3: "사이드바 확인: 왼쪽 리본의 학사모 🎓 아이콘을 눌러 실시간 시간표를 확인하세요.",
    settingsTitle: "대학교 시간표 & 캘린더 설정",
    urlSettingName: "시간표 소스 추가",
    urlSettingDesc: "에브리타임, 대학교 학사포털, LMS(Canvas, Moodle), Google 캘린더, Outlook 등의 iCal/ICS 링크를 입력하거나 다운로드한 .ics 파일을 업로드하세요. ※웹 링크는 공개 접근이 가능하거나 전용 토큰이 포함되어야 합니다.",
    urlSettingDescShort: "에브리타임, 대학 포털, Moodle, Google 캘린더 등의 iCal/ICS 구독 링크를 등록하거나 .ics 파일을 업로드하세요.",
    publicCalendarTip: "💡 대학교 시간표(강의 일정) 가져오는 방법:\n• 에브리타임 (Everytime): 에브리타임 앱/웹에서 [시간표] 접속 → 설정(아이콘) 또는 공유 메뉴 → [시간표 내보내기 / iCal(ICS) 캘린더 연동] 선택 후 생성된 링크를 복사하거나 .ics 파일로 다운로드합니다.\n• 대학 학사포털 / 종합정보시스템: 수강신청/시간표 조회 메뉴에서 'iCal/ICS 내보내기' 또는 '캘린더 연동' 링크를 복사합니다.\n• 대학 LMS (Canvas, Moodle, 코스모스): 캘린더 화면 → 'iCal 피드 / 캘린더 내보내기'를 클릭하여 구독 URL을 복사합니다.\n• Google 캘린더 / Outlook: Google 캘린더 설정의 'iCal 형식의 비공개 주소' 또는 Outlook '일정 게시'의 ICS 링크를 복사합니다.\n• .ics 파일 업로드: 학교 포털이나 에브리타임에서 다운로드한 .ics 파일이 있다면 위의 [.ics 파일 업로드] 버튼을 이용하세요.",
    urlPlaceholder: "https://everytime.kr/timetable/... 또는 대학 포털/LMS/Google 캘린더 링크",
    btnDownloadNow: "URL에서 시간표 추가",
    btnDownloading: "다운로드 중...",
    btnUploadIcs: ".ics 파일 업로드",
    uploadIcsDesc: "기기에 저장된 .ics / iCal 시간표 파일을 직접 불러옵니다",
    icsLoadedSuccess: "'{name}' 시간표를 불러왔습니다! {count}개의 수업이 추가되었습니다.",
    invalidIcsError: "오류: 제공된 파일에 유효한 iCalendar(.ics) 일정이 포함되어 있지 않습니다.",
    fileLoadError: "시간표 파일 읽기 실패: ",
    addedSchedulesTitle: "등록된 시간표 목록",
    noSchedulesAdded: "아직 추가된 시간표가 없습니다. 상단에 링크를 입력하거나 .ics 파일을 업로드해 주세요.",
    scheduleTypeUrl: "웹 구독 (URL)",
    scheduleTypeFile: "로컬 파일 (.ics)",
    btnRefreshSource: "지금 동기화",
    btnRenameSource: "시간표 이름 변경",
    renameSourcePlaceholder: "새 시간표 이름...",
    scheduleRenamedNotice: "시간표 이름이 변경되었습니다: {name}",
    errDuplicateCalendarName: "동일한 이름의 시간표가 이미 존재합니다.",
    btnLockSource: "동기화 덮어쓰기 방지 (잠금)",
    btnUnlockSource: "동기화 잠금 해제",
    badgeLockedSource: "잠김",
    scheduleLockedNotice: "'{name}' 시간표가 잠겼습니다 (동기화 시 덮어쓰지 않음).",
    scheduleUnlockedNotice: "'{name}' 시간표 잠금이 해제되었습니다.",
    allSchedulesLockedNotice: "모든 시간표가 잠겨 있습니다. 동기화하려면 최소 하나 이상의 잠금을 해제하세요.",
    btnHideSource: "캘린더에서 수업 숨기기",
    btnShowSource: "캘린더에 수업 표시",
    badgeHiddenSource: "숨김",
    scheduleHiddenNotice: "'{name}' 시간표가 숨겨졌습니다.",
    scheduleShownNotice: "'{name}' 시간표가 이제 표시됩니다.",
    btnDeleteSource: "시간표 삭제",
    scheduleRemovedNotice: "시간표 제거됨: {name}",
    btnExportIcs: "정리된 캘린더 내보내기 (.ics)",
    exportIcsDesc: "제외되지 않은 활성 강의 일정 전체를 정리된 .ics 파일로 보관함에 내보냅니다.",
    exportSuccess: "{count}개 일정을 내보냈습니다: {path}",
    exportEmptyError: "내보낼 강의 일정이 없습니다. 시간표를 먼저 추가해 주세요.",
    syncStartupName: "시작 시 자동 동기화",
    syncStartupDesc: "옵시디언 시작 시 인터넷을 통해 시간표 일정을 자동으로 최신 상태로 갱신합니다.",
    btnCancelEdit: "취소",
    btnShowCalNameOnEvents: "카드에 시간표 이름 표시",
    btnHideCalNameOnEvents: "카드에서 시간표 이름 숨기기",
    calNameShownNotice: "'{name}' 일정 카드에 시간표 이름이 표시됩니다.",
    calNameHiddenNotice: "'{name}' 일정 카드에서 시간표 이름을 숨겼습니다.",
    badgeCalNameShown: "이름 표시 중",
    notesFolderCardTitle: "폴더 및 보관함 저장 위치",
    notesTemplateSectionTitle: "강의 노트 서식",
    notesSettingsTitle: "노트 & 템플릿",
    notesSettingsDesc: "강의 필기 생성 템플릿, 과목별 폴더 구조 및 파일명 형식을 설정합니다.",
    settingDisableNoteClickName: "타임라인 카드 클릭 시 노트 열기 비활성화",
    settingDisableNoteClickDesc: "타임라인의 강의 카드를 클릭해도 노트가 열리거나 생성되지 않도록 설정합니다.",
    baseFolderSetting: "과목 기본 상위 폴더",
    baseFolderDesc: "과목별 하위 폴더들이 생성될 보관함 내 루트 폴더입니다 (공백 시 보관함 최상위 루트에 생성).",
    baseFolderPlaceholder: "예: 대학교 또는 강의노트",
    optVaultRoot: "보관함 최상위 루트 (상위 폴더 없음)",
    dateFormatSetting: "날짜 서식",
    dateFormatDesc: "노트 파일명 및 {date} 변수 치환에 사용됩니다.",
    dateFormatExample: "예시: {sample}",
    noteNameFormatSetting: "노트 파일명 서식",
    noteNameFormatDesc: "사용 가능한 변수: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "노트 본문 템플릿",
    templateDesc: "새 강의 노트를 생성할 때 적용되는 기본 서식입니다. 마크다운 및 옵시디언 프로퍼티(YAML)를 지원합니다.",
    btnOpenTemplateBuilder: "비주얼 템플릿 빌더 열기",
    builderModalTitle: "비주얼 노트 템플릿 빌더",
    builderModalDesc: "실시간 미리보기와 드래그 앤 드롭 지원 변수 칩을 이용해 강의 노트 서식을 손쉽게 디자인하세요.",
    builderPresetsLabel: "사전 설정 템플릿",
    presetStandard: "📋 표준 양식",
    presetProperties: "📊 프로퍼티 양식 (YAML)",
    presetMinimal: "📌 미니멀",
    presetBlank: "📄 빈 노트",
    builderChipsLabel: "시간표에서 사용 가능한 변수 (클릭하여 삽입하거나 에디터로 드래그):",
    builderChipTooltip: "클릭하여 삽입하거나 템플릿으로 드래그: {desc}",
    builderEditorLabel: "템플릿 에디터 (Markdown / YAML)",
    builderPreviewLabel: "실제 수업 데이터 적용 실시간 미리보기",
    builderBlankPreview: "템플릿이 비어 있습니다. 상단에 내용을 입력하거나 변수를 삽입해 주세요.",
    btnSaveTemplate: "템플릿 저장",
    templateSavedNotice: "강의 노트 템플릿이 저장되었습니다!",
    sampleSubject: "컴퓨터공학개론",
    sampleRoom: "공학관 204호",
    sampleLecturer: "김교수",
    sampleDesc: "A반 - 자료구조 및 알고리즘 실습",
    langTitle: "언어",
    langDesc: "캘린더, 요일, 타임라인 및 설정의 표시 언어를 지정합니다.",
    langSelectLabel: "인터페이스 언어",
    regionTitle: "지역 서식",
    regionDesc: "날짜 표기법, 한 주의 시작 요일, 시간 표기법(24시간제 / 12시간제)을 설정합니다.",
    firstDayOfWeekSetting: "한 주의 시작 요일",
    firstDayOfWeekDesc: "캘린더 격자가 월요일부터 시작할지 일요일부터 시작할지 결정합니다.",
    firstDayMonday: "월요일",
    firstDaySunday: "일요일",
    timeFormatSetting: "시간 표기 방식",
    timeFormatDesc: "24시간제 (14:30) 또는 12시간제 AM/PM (2:30 PM) 중 선택합니다.",
    timeFormat24h: "24시간제 (14:30)",
    timeFormat12h: "12시간제 AM/PM (2:30 PM)",
    mappingTitle: "과목 및 폴더 매핑",
    mappingDesc: "시간표에서 감지된 과목을 보관함 폴더에 연결합니다. 강의 노트가 해당 폴더로 자동 분류됩니다.",
    colSubject: "과목명",
    colFolder: "보관함 폴더",
    optAutoMatch: "폴더 자동 매칭",
    optAutoMatchFound: "자동 매칭 (발견됨: {folder})",
    optNotFoundAuto: "폴더 없음 (노트 생성 시 자동 생성)",
    optCreateNewFolder: "➕ 새 폴더 만들기...",
    optNoFolder: "🚫 폴더 없음 (이 과목 무시)",
    cleanSubjectNamesSetting: "과목명 수식어 정리",
    cleanSubjectNamesDesc: "폴더명 및 노트명 추천 시 (강의), (실습), [W], 시험 표기 등 불필요한 태그를 자동으로 정돈합니다.",
    autoFindFolderSetting: "기존 동명 폴더 자동 감지",
    autoFindFolderDesc: "수동 매핑이 없을 경우 보관함 내에서 동일한 이름의 폴더를 자동으로 탐색합니다.",
    autoMatchedTo: "자동 매칭된 폴더: {folder}",
    statusManuallyMapped: "수동 매핑됨",
    statusIgnored: "제외됨 (폴더 없음)",
    noMatchFound: "일치하는 폴더 없음",
    folderCreatedAndAssignedNotice: "'{folder}' 폴더가 생성되었으며 '{subject}' 과목에 지정되었습니다.",
    noSubjectsFound: "시간표에서 감지된 과목이 없습니다. 시간표를 먼저 등록해 주세요.",
    exclusionsTitle: "제외 과목 및 키워드 필터",
    exclusionsDesc: "수강하지 않는 분반이나 행사를 숨깁니다. 제외된 일정은 캘린더, 타임라인 및 내보내기에서 완전히 배제됩니다.",
    detectedSubjects: "감지된 과목 목록 (토글하여 제외)",
    keywordsTitle: "필터링 키워드",
    keywordsDesc: "일정의 제목이나 설명에 이 키워드가 포함되어 있으면 자동으로 숨깁니다.",
    keywordsPlaceholder: "키워드 입력 (예: B분반, 체육, 교양선택)...",
    btnAddKeyword: "키워드 추가",
    btnEditKeyword: "수정",
    btnSaveKeyword: "저장",
    btnDeleteKeyword: "삭제",
    noKeywordsText: "설정된 필터링 키워드가 없습니다.",
    excludeToggleOn: "제외된 과목입니다 (클릭하여 다시 표시)",
    excludeToggleOff: "표시 중인 과목입니다 (클릭하여 제외)",
    colorsTitle: "수업 분류 및 색상",
    colorsDesc: "강의 유형별 명칭과 라벨 색상을 변경합니다. 일정 제목과 설명의 키워드를 분석해 자동으로 분류합니다.",
    categoryNamePlaceholder: "기본값: {default}",
    btnResetColors: "기본 색상으로 초기화",
    errHttpStatus: "서버 응답 오류 {status}: {text}",
    errHttp401Google: "오류 401 (Google 캘린더 접근 불가): 인터넷 공유 캘린더는 '공개' 상태여야 합니다. 또는 Google 캘린더 설정 하단의 'iCal 형식의 비공개 주소'(.ics)를 복사하거나, .ics 파일을 다운로드하여 직접 업로드해 주세요.",
    errHttp401General: "오류 {status} (인증 실패): 웹으로 공유된 캘린더는 공개되어 있어야 합니다. 캘린더를 공개하거나 컴퓨터에서 .ics 파일을 직접 업로드해 주세요.",
    errNoScheduleSource: "설정에서 시간표 링크를 입력하거나 .ics 파일을 불러와 주세요.",
    errInvalidIcsContent: "가져온 내용에 유효한 iCal/ICS 캘린더 데이터가 없습니다.",
    errCreateNote: "노트 생성 중 오류 발생: {message}",
    conditionalRuleBuilderTitle: "조건부 제외 규칙 작성기 (과목이 지정된 경우 ➔ 교수 / 키워드 제외)",
    conditionalRuleBuilderDesc: "특정 과목에서만 특정 교수님이나 분반 키워드를 제외합니다 (해당 교수님의 다른 과목은 유지됩니다).",
    selectSubjectPlaceholder: "과목 선택...",
    conditionalKwPlaceholder: "제외할 교수명 또는 키워드...",
    btnAddConditionalRule: "+ 조건부 규칙 추가",
    ruleIfPrefix: "과목이",
    ruleExcludePrefix: "제외",
    ruleAllPrefix: "모든 단어 일치",
    noticeSelectSubjectFirst: "먼저 목록에서 과목을 선택해주세요.",
    noticeEnterKeywordFirst: "제외할 키워드나 교수명을 입력해주세요.",
    scheduleBtnTitle: "과목 전체 일정 (모든 수업)",
    scheduleBtnLabel: "수업 일정",
    scheduleStatTotal: "총 {count}회",
    scheduleStatPast: "완료 {count}회",
    scheduleStatUpcoming: "예정 {count}회",
    filterAll: "전체 ({count})",
    filterUpcoming: "예정 ({count})",
    filterPast: "완료 ({count})",
    nextSessionBadge: "다음 수업",
    allSessionsHeading: "모든 수업 일정 타임라인",
    noSessionsFoundForCourse: "이 과목의 수업 일정을 찾을 수 없습니다.",
    statusOngoing: "수업 중",
    statusNext: "다음 수업",
    statusPast: "완료",
    statusFuture: "예정",
    statusCancelled: "휴강",
    btnJumpToDayInCalendar: "시간표에서 보기",
    btnViewInSchedule: "해당 날짜 보기",
    btnOpenNote: "노트",
    btnCreateNoteShort: "노트",
    btnOpenCourseHub: "과목 폴더",
    badgeOpenNoteTooltip: "클릭하여 노트 열기",
    badgeCreateNoteTooltip: "클릭하여 노트 생성",
    badgeMapFolderTooltip: "클릭하여 과목 폴더 지정",
    courseHubNotFound: "과목 폴더를 찾을 수 없습니다. 설정에서 폴더를 매핑하거나 먼저 노트를 생성해주세요.",
    courseHubCreated: "강의 노트 생성 완료: {path}",
    countdownOngoing: "현재 수업 진행 중",
    countdownToday: "오늘 {time}",
    countdownTomorrow: "내일 {time}",
    countdownInDays: "{days}일 후",
    allSessionsCompleted: "이 과목의 모든 예정된 수업이 종료되었습니다."
  },
  pt: {
    allCalendars: "Todos os calendários",
    filterCalendarLabel: "Aplica-se ao calendário",
    btnCollapse: "Recolher",
    btnExpand: "Expandir",
    calendarCoursesCount: "{count} disciplinas",
    noCoursesInCalendar: "Nenhuma disciplina detectada neste calendário.",
    viewTitle: "Horário & Calendário",
    ribbonTitle: "Abrir horário universitário",
    commandOpen: "Abrir calendário universitário na barra lateral",
    commandSync: "Atualizar horário da universidade",
    commandExportIcs: "Exportar calendário limpo (.ics)",
    today: "Hoje",
    prevMonth: "Mês anterior",
    nextMonth: "Próximo mês",
    refreshSchedule: "Atualizar horário da universidade",
    refreshSuccess: "Horário atualizado! Total de aulas: {count}",
    refreshError: "Erro ao carregar o horário: ",
    weekdaysShort: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    weekdaysFull: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthsGenitive: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    dateHeaderTemplate: "{dayName}, {dayNum} de {month} de {year}",
    noClasses: "Sem aulas",
    oneClass: "1 aula",
    fewClasses: "{count} aulas",
    manyClasses: "{count} aulas",
    emptyScheduleTitle: "Não há aulas programadas para este dia.",
    emptyScheduleDesc: "Aproveite o tempo livre ou revise suas anotações!",
    emptyNoSourcesTitle: "Nenhum horário universitário adicionado",
    emptyNoSourcesDesc: "Adicione o link iCal da sua instituição (ex.: SIGAA, Moodle, Fénix, Google Agenda) ou envie um arquivo .ics nas configurações para ver sua grade.",
    btnAddScheduleSettings: "Abrir configurações e adicionar horário",
    remainingMin: "Restam {min} min",
    allDay: "O dia todo",
    noteExists: "Nota existente",
    missingNote: "Sem nota",
    openNoteHint: "Abrir nota",
    createNoteHint: "Clique para criar anotação",
    noFolderBadge: "Sem pasta",
    createFolderHint: "Clique para criar pasta e anotação",
    subjectIgnoredNotice: "Esta disciplina está configurada como ignorada (sem pasta).",
    defaultCourseName: "Disciplina",
    defaultCalendarName: "Calendário",
    noInfo: "Sem informação",
    modalCreateTitle: "Criar nova anotação de aula?",
    modalCreateDesc: "Ainda não há anotação para o dia {date} para a disciplina:",
    modalTargetLoc: "Local de salvamento no cofre (vault):",
    modalCancel: "Cancelar",
    modalCreateBtn: "Criar anotação",
    noteCreatedNotice: "Anotação criada: {path}",
    noteOpenedNotice: "Anotação aberta: {name}",
    modalCreateFolderTitle: "Pasta da disciplina não encontrada",
    modalCreateFolderDesc: "Ainda não existe uma pasta para esta disciplina em seu cofre:",
    modalCreateFolderPrompt: "Deseja criar uma nova pasta e a primeira nota de aula para o dia {date}?",
    modalFolderInputLabel: "Nome ou caminho da nova pasta:",
    modalNotePreviewLabel: "Local da nova anotação:",
    modalCreateFolderBtn: "Criar pasta e anotação",
    folderAndNoteCreatedNotice: "Pasta '{folder}' e anotação criadas: {path}",
    confirmDeleteScheduleTitle: "Remover horário?",
    confirmDeleteScheduleDesc: "Tem certeza de que deseja remover o horário '{name}'? As aulas serão removidas do calendário. Suas notas Markdown existentes permanecerão intactas.",
    typeLecture: "Aula teórica",
    typeExercises: "Prática / Exercícios",
    typeLab: "Laboratório",
    typeLanguage: "Curso de idioma",
    typeLanguageExam: "Curso de idioma (Exame)",
    typeProject: "Projeto",
    typeSeminar: "Seminário",
    typeExam: "Exame / Prova",
    typeOther: "Outras aulas",
    settingTimelineGapsTitle: "Intervalos e horários vagos no cronograma",
    settingShowTimelineGapsName: "Exibir intervalos / horários vagos na linha do tempo",
    settingShowTimelineGapsDesc: "Exibe indicadores visuais para tempos livres entre aulas consecutivas na linha do tempo do dia.",
    timelineBreakTooltip: "Tempo livre: {time}",
    cardAppearanceTitle: "Aparência de intervalos e horários vagos",
    cardAppearanceDesc: "Configure a exibição dos tempos livres entre as aulas na linha do tempo diária.",
    cardCategoriesTitle: "Categorias de aulas & Cores",
    cardCategoriesDesc: "Personalize os nomes e cores dos emblemas para cada tipo de aula (teoria, prática, laboratório, exames).",
    breakStyleLabel: "Estilo de exibição",
    breakStylePill: "Distintivo em pílula (Pill)",
    breakStyleCard: "Cartão na linha do tempo (Card)",
    breakStyleLine: "Linha tracejada (Line)",
    breakStyleText: "Texto simples (Text)",
    breakCardDefaultTitle: "Tempo vago / Intervalo",
    breakIconLabel: "Ícone do intervalo",
    breakIconCoffee: "☕ Xícara de café",
    breakIconFood: "🍔 Almoço / Lanche",
    breakIconPause: "⏸️ Pausa",
    breakIconHourglass: "⏳ Ampulheta",
    breakIconWalk: "🚶 Caminhada",
    breakIconBook: "📖 Leitura / Estudo",
    breakIconMusic: "🎵 Música / Fones",
    breakIconSun: "☀️ Sol",
    breakIconMoon: "🌙 Lua",
    breakIconSpark: "✨ Brilho",
    breakIconBattery: "🔋 Recarga",
    breakIconClock: "⏰ Relógio",
    breakIconLeaf: "🍃 Folha",
    breakIconSmile: "😊 Relaxar",
    breakMinMinutesLabel: "Duração mínima do intervalo (minutos)",
    breakMinMinutesDesc: "Intervalos menores que este valor não serão exibidos.",
    breakMinMinutesPlaceholder: "ex.: 15",
    breakMaxMinutesLabel: "Duração máxima do intervalo (minutos)",
    breakMaxMinutesDesc: "0 significa sem limite máximo (exibe todos os intervalos acima do mínimo).",
    breakMaxMinutesPlaceholder: "0 = sem limite",
    perCalendarGapsTitle: "Configuração de intervalos por calendário",
    perCalendarGapsDesc: "Substitua as configurações de intervalo individualmente para calendários específicos.",
    enableCalendarGapOverride: "Personalizar intervalos para este calendário",
    categoryUsedInCalendars: "Utilizado nos calendários",
    settingShowCoffeeIconName: "Exibir ícone de café no cabeçalho lateral",
    settingShowCoffeeIconDesc: "Exibe um discreto ícone de café de apoio ao lado das configurações no cabeçalho do calendário.",
    tabAbout: "Sobre",
    tabGeneral: "Horários & Sincronização",
    tabLanguage: "Idioma & Região",
    tabMapping: "Notas & Modelos",
    tabExclusions: "Exclusões",
    tabColors: "Aparência & Cores",
    qsTitle: "Início Rápido — Como começar?",
    qsStep1Title: "Adicione sua grade horária: ",
    qsStep1Desc: "Na aba «Horários & Sincronização», cole o link de subscrição iCal/ICS da sua universidade (ex.: SIGAA, Moodle, Fénix, Google Agenda) ou envie um arquivo .ics baixado.",
    qsStep2Title: "Configure modelos e pastas: ",
    qsStep2Desc: "Na aba «Notas & Modelos», vincule suas matérias a pastas do cofre e personalize seu modelo de anotação com o construtor visual.",
    qsStep3Title: "Abra a barra lateral: ",
    qsStep3Desc: "Clique no ícone de capelo 🎓 na barra lateral do Obsidian — visualize suas aulas, acompanhe o cronômetro regressivo e crie anotações em um clique.",
    langSelectName: "Idioma da interface",
    langSelectDesc: "Escolha o idioma de exibição do plugin.",
    langAuto: "Automático (sistema)",
    guideTitle: "Como funciona e boas práticas",
    guide1Title: "Integração direta com a grade horária da faculdade",
    guide1Desc: "O plugin interpreta feeds oficiais iCalendar (iCal/ICS), reconhecendo aulas teóricas, práticas, laboratórios, salas e professores, exibindo uma contagem regressiva em tempo real.",
    guide2Title: "Conceito central: Pasta = Disciplina, Arquivo = Nota de aula",
    guide2Desc: "Clicar em um cartão de aula na linha do tempo abre imediatamente a nota daquele dia ou cria um novo documento pré-formatado com metadados YAML.",
    guide3Title: "Boa prática: Organização semestral impecável",
    guide3Desc: "Para um fluxo de estudos produtivo durante todo o semestre:",
    guideBullet1: "🗂️ Uma pasta por disciplina: Mapeie cada matéria a uma pasta do cofre para que as anotações fiquem sempre organizadas.",
    guideBullet2: "🚫 Exclusões inteligentes: Oculte turmas que você não frequenta ou filtre eventos indesejados por palavras-chave.",
    guideBullet3: "☕ Indicadores de horários vagos: Ative a detecção visual de intervalos entre aulas com duração personalizável.",
    guideCalloutTitle: "Na prática: ",
    guideCalloutText: "Você entra na sala de aula, abre o Obsidian, clica na matéria ativa na barra lateral e começa a anotar na hora — com sala, professor e data já preenchidos.",
    coffeeBannerText: "Gostando do plugin? Me pague um café!",
    coffeeBannerSubtext: " Apoie o desenvolvimento e manutenção contínua.",
    coffeeBannerBtn: "Pagar um café",
    coffeeBannerTitle: "Aproveitando o plugin? Me pague um café!",
    coffeeBannerDesc: "Apoie o desenvolvimento contínuo, novos recursos e correções do projeto.",
    btnBuyCoffee: "Pagar um café",
    supportTitle: "Apoiar o projeto",
    supportDesc: "Este plugin é 100% gratuito e open-source, desenvolvido com paixão no meu tempo livre. Se ele ajuda você a se organizar na faculdade, pagar um café é uma excelente forma de agradecer!",
    supportBtnText: "Pagar um café",
    hideSupportName: "Ocultar aviso de apoio",
    hideSupportDesc: "Oculta o banner de apoio no topo das configurações e o ícone de café no cabeçalho da barra lateral.",
    linksTitle: "Sobre o projeto",
    heroAuthor: "Autor",
    linksGithub: "Repositório no GitHub",
    linksIssues: "Relatar problema ou sugerir recurso",
    aboutPluginDesc: "Calendário e grade horária universitária na barra lateral com contagem regressiva ao vivo, construtor visual de modelos, mapeamento de pastas e anotações com um clique.",
    aboutAuthor: "Autor",
    aboutSupportTitle: "Apoiar o projeto",
    aboutSupportDesc: "Este plugin é totalmente gratuito e de código aberto. Se ele tem sido útil na sua rotina universitária, me pagar um café ajuda a mantê-lo sempre atualizado!",
    aboutLinksTitle: "Links úteis",
    btnGithubRepo: "Repositório no GitHub",
    btnReportIssue: "Relatar problema ou sugerir recurso",
    aboutQuickStartTitle: "Início Rápido — Como começar?",
    aboutStep1: "Adicionar horário: Na aba «Horários & Sincronização», cole o link iCal/ICS da sua universidade ou envie um arquivo .ics.",
    aboutStep2: "Configurar modelos e pastas: Em «Notas & Modelos», defina o padrão das anotações e pastas das matérias.",
    aboutStep3: "Abrir barra lateral: Clique no ícone de capelo 🎓 no menu esquerdo para visualizar a grade e a contagem regressiva.",
    settingsTitle: "Configurações do Horário Universitário",
    urlSettingName: "Adicionar fonte de horário",
    urlSettingDesc: "Cole o link iCal/ICS da sua universidade (ex.: SIGAA, Moodle, Fénix, Google Agenda, Outlook) ou carregue um arquivo .ics. Atenção: calendários remotos devem ser públicos ou conter um token de acesso secreto.",
    urlSettingDescShort: "Adicione sua grade de aulas por link iCal/ICS (SIGAA, Moodle, Fénix, Google Agenda, Outlook) ou envie um arquivo .ics.",
    publicCalendarTip: "💡 Como adicionar o horário da sua universidade:\n• SIGAA (Sistema Integrado de Gestão de Atividades Acadêmicas - Brasil): Acesse o Portal do Discente no SIGAA → Ensino → Consultar Minhas Turmas ou Horário Individual → localize a opção de sincronização ou exportação para calendário (iCal/ICS).\n• Moodle / Aprender / Campus Virtual: Vá em Calendário → Exportar calendário → Todos os eventos → Obter URL do calendário (ou baixe o .ics).\n• FénixEdu (Portugal): No portal do estudante, aceda a Estudante → Horário → clique no botão de subscrição iCal para copiar o link de sincronização.\n• Google Agenda / Outlook: No Google Agenda, copie o „Endereço secreto em formato iCal”; no Outlook, acesse Configurações → Calendário → Calendários compartilhados → Publicar calendário.\n• Arquivo .ics do computador: Se a sua instituição não fornecer um link de sincronização em tempo real, baixe o arquivo .ics do portal do aluno e clique no botão „Carregar arquivo .ics” acima.",
    urlPlaceholder: "https://sigaa.universidade.edu.br/calendario.ics ou link Moodle/Google/Fénix",
    btnDownloadNow: "Adicionar via URL",
    btnDownloading: "Baixando...",
    btnUploadIcs: "Carregar arquivo .ics",
    uploadIcsDesc: "Envie um arquivo de horário .ics / iCal baixado do seu dispositivo",
    icsLoadedSuccess: "Horário '{name}' carregado! {count} aulas adicionadas.",
    invalidIcsError: "Erro: O arquivo selecionado não contém uma estrutura iCalendar (.ics) válida.",
    fileLoadError: "Erro ao ler o arquivo de horário: ",
    addedSchedulesTitle: "Horários configurados",
    noSchedulesAdded: "Nenhum horário adicionado ainda. Cole um link acima ou selecione um arquivo .ics do seu dispositivo.",
    scheduleTypeUrl: "Subscrição Web (URL)",
    scheduleTypeFile: "Arquivo local (.ics)",
    btnRefreshSource: "Sincronizar agora",
    btnRenameSource: "Renomear horário",
    renameSourcePlaceholder: "Novo nome do horário...",
    scheduleRenamedNotice: "Horário renomeado para: {name}",
    errDuplicateCalendarName: "Já existe um horário com este nome.",
    btnLockSource: "Bloquear contra atualizações de sync",
    btnUnlockSource: "Desbloquear para sincronização",
    badgeLockedSource: "Bloqueado",
    scheduleLockedNotice: "O horário '{name}' está bloqueado contra sobrescrita de sincronização.",
    scheduleUnlockedNotice: "O horário '{name}' foi desbloqueado e sincronizará normalmente.",
    allSchedulesLockedNotice: "Todos os horários estão bloqueados. Desbloqueie pelo menos um para sincronizar.",
    btnHideSource: "Ocultar aulas do calendário",
    btnShowSource: "Exibir aulas no calendário",
    badgeHiddenSource: "Oculto",
    scheduleHiddenNotice: "O horário '{name}' agora está oculto.",
    scheduleShownNotice: "O horário '{name}' agora está visível.",
    btnDeleteSource: "Excluir horário",
    scheduleRemovedNotice: "Horário removido: {name}",
    btnExportIcs: "Exportar calendário limpo (.ics)",
    exportIcsDesc: "Exporta todas as aulas ativas e não excluídas para um arquivo .ics limpo em seu cofre.",
    exportSuccess: "{count} aulas exportadas para: {path}",
    exportEmptyError: "Nenhuma aula para exportar. Adicione um horário primeiro.",
    syncStartupName: "Sincronizar automaticamente ao iniciar",
    syncStartupDesc: "Atualiza automaticamente os horários via internet ao abrir o Obsidian.",
    btnCancelEdit: "Cancelar",
    btnShowCalNameOnEvents: "Mostrar nome do calendário nos cartões",
    btnHideCalNameOnEvents: "Ocultar nome do calendário nos cartões",
    calNameShownNotice: "O nome do calendário será exibido nos eventos de '{name}'.",
    calNameHiddenNotice: "Nome do calendário ocultado nos eventos de '{name}'.",
    badgeCalNameShown: "Nome visível",
    notesFolderCardTitle: "Pastas e armazenamento no cofre",
    notesTemplateSectionTitle: "Modelo de anotação de aula",
    notesSettingsTitle: "Notas & Modelos",
    notesSettingsDesc: "Configure o modelo das anotações de aula, a estrutura de pastas e o formato de nome dos arquivos.",
    settingDisableNoteClickName: "Desativar clique para abrir notas na linha do tempo",
    settingDisableNoteClickDesc: "Evita a abertura ou criação de anotações ao clicar nos cartões de aula na linha do tempo.",
    baseFolderSetting: "Pasta raiz das disciplinas",
    baseFolderDesc: "Pasta no cofre onde ficarão as subpastas das matérias (deixe em branco para a raiz do cofre).",
    baseFolderPlaceholder: "ex.: Faculdade ou Disciplinas",
    optVaultRoot: "Raiz do cofre (sem pasta base)",
    dateFormatSetting: "Formato de data",
    dateFormatDesc: "Utilizado no nome dos arquivos e na variável {date}.",
    dateFormatExample: "Exemplo: {sample}",
    noteNameFormatSetting: "Formato do nome de arquivo da nota",
    noteNameFormatDesc: "Variáveis disponíveis: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Conteúdo do modelo de anotação",
    templateDesc: "Modelo aplicado ao criar uma nova anotação de aula. Suporta Markdown e Propriedades do Obsidian (YAML).",
    btnOpenTemplateBuilder: "Abrir construtor visual de modelos",
    builderModalTitle: "Construtor visual de modelos de anotação",
    builderModalDesc: "Personalize o modelo de anotações com visualização em tempo real e blocos de variáveis arrastáveis.",
    builderPresetsLabel: "Modelos predefinidos",
    presetStandard: "📋 Padrão",
    presetProperties: "📊 Propriedades do Obsidian (YAML)",
    presetMinimal: "📌 Minimalista",
    presetBlank: "📄 Nota em branco",
    builderChipsLabel: "Variáveis disponíveis do seu horário (clique ou arraste para o editor):",
    builderChipTooltip: "Clique para inserir ou arraste para o modelo: {desc}",
    builderEditorLabel: "Editor de modelo (Markdown / YAML)",
    builderPreviewLabel: "Prévia em tempo real com dados reais de aula",
    builderBlankPreview: "O modelo está vazio. Insira texto ou variáveis acima.",
    btnSaveTemplate: "Salvar modelo",
    templateSavedNotice: "Modelo de anotação salvo com sucesso!",
    sampleSubject: "Algoritmos e Estruturas de Dados",
    sampleRoom: "Sala 204",
    sampleLecturer: "Prof. Silva",
    sampleDesc: "Turma A - Laboratório de Programação",
    langTitle: "Idioma",
    langDesc: "Selecione o idioma de exibição para o calendário, dias da semana, linha do tempo e configurações.",
    langSelectLabel: "Idioma da interface",
    regionTitle: "Formatação regional",
    regionDesc: "Configure o formato de data, primeiro dia da semana e formato de hora (24h / 12h).",
    firstDayOfWeekSetting: "Primeiro dia da semana",
    firstDayOfWeekDesc: "Escolha se a grade do calendário começa na segunda-feira ou no domingo.",
    firstDayMonday: "Segunda-feira",
    firstDaySunday: "Domingo",
    timeFormatSetting: "Formato de hora",
    timeFormatDesc: "Escolha entre formato de 24 horas (14:30) ou 12 horas AM/PM (2:30 PM).",
    timeFormat24h: "24 horas (14:30)",
    timeFormat12h: "12 horas AM/PM (2:30 PM)",
    mappingTitle: "Mapeamento de disciplinas para pastas",
    mappingDesc: "Vincule disciplinas da sua grade a pastas do cofre. As notas de aula serão salvas automaticamente na pasta designada.",
    colSubject: "Disciplina / Matéria",
    colFolder: "Pasta no cofre",
    optAutoMatch: "Vincular automaticamente",
    optAutoMatchFound: "Automático (encontrada: {folder})",
    optNotFoundAuto: "Sem pasta (criar ao abrir nota)",
    optCreateNewFolder: "➕ Criar nova pasta...",
    optNoFolder: "🚫 Sem pasta (ignorar disciplina)",
    cleanSubjectNamesSetting: "Limpar títulos das disciplinas",
    cleanSubjectNamesDesc: "Remove sufixos como (Teo), (Lab), [W], (Prat) e termos de prova ao sugerir nomes de pastas.",
    autoFindFolderSetting: "Detectar pastas existentes automaticamente",
    autoFindFolderDesc: "Busca pastas com o mesmo nome da matéria no cofre caso não haja mapeamento manual configurado.",
    autoMatchedTo: "Vinculado automaticamente a: {folder}",
    statusManuallyMapped: "Mapeado manualmente",
    statusIgnored: "Ignorado (sem pasta)",
    noMatchFound: "Nenhuma pasta correspondente encontrada",
    folderCreatedAndAssignedNotice: "Pasta '{folder}' criada e associada à disciplina '{subject}'.",
    noSubjectsFound: "Nenhuma disciplina encontrada na sua grade. Adicione um horário primeiro.",
    exclusionsTitle: "Disciplinas excluídas & Filtros",
    exclusionsDesc: "Oculte disciplinas ou turmas que você não frequenta. Eventos excluídos não aparecerão no calendário nem nas exportações.",
    detectedSubjects: "Disciplinas detectadas (alterne para excluir)",
    keywordsTitle: "Palavras-chave de filtro",
    keywordsDesc: "Qualquer aula cujo título ou descrição contenha uma destas palavras será ocultada.",
    keywordsPlaceholder: "Digite palavra-chave (ex.: Turma B, Optativa, Educação Física)...",
    btnAddKeyword: "Adicionar palavra-chave",
    btnEditKeyword: "Editar",
    btnSaveKeyword: "Salvar",
    btnDeleteKeyword: "Excluir",
    noKeywordsText: "Nenhuma palavra-chave de filtro configurada.",
    excludeToggleOn: "Disciplina excluída (clique para exibir)",
    excludeToggleOff: "Disciplina visível (clique para excluir)",
    colorsTitle: "Categorias de aulas & Cores",
    colorsDesc: "Personalize nomes e cores. O plugin classifica os eventos automaticamente com base em palavras-chave no título e descrição.",
    categoryNamePlaceholder: "Padrão: {default}",
    btnResetColors: "Restaurar cores padrão",
    errHttpStatus: "O servidor respondeu com o erro {status}: {text}",
    errHttp401Google: "Erro 401 (Acesso negado ao Google Agenda): Calendários compartilhados na web devem ser públicos, OU copie no rodapé das configurações do Google Agenda o „Endereço secreto em formato iCal” (.ics), ou faça o upload manual do arquivo .ics.",
    errHttp401General: "Erro {status} (Não autorizado): Calendários compartilhados via internet devem ser públicos. Torne-o público ou envie o arquivo .ics manualmente do seu computador.",
    errNoScheduleSource: "Adicione um link de horário nas configurações ou envie um arquivo .ics.",
    errInvalidIcsContent: "O conteúdo baixado não contém um calendário iCal/ICS válido.",
    errCreateNote: "Erro ao criar anotação: {message}",
    conditionalRuleBuilderTitle: "Criador de regras condicionais (Se disciplina ➔ Excluir professor / palavra-chave)",
    conditionalRuleBuilderDesc: "Permite excluir um professor ou palavra-chave específica apenas em uma determinada disciplina (outras disciplinas com este professor permanecerão visíveis).",
    selectSubjectPlaceholder: "Selecionar disciplina...",
    conditionalKwPlaceholder: "Nome do professor ou palavra-chave a excluir...",
    btnAddConditionalRule: "+ Adicionar regra condicional",
    ruleIfPrefix: "Se",
    ruleExcludePrefix: "Excluir",
    ruleAllPrefix: "Todas as palavras",
    noticeSelectSubjectFirst: "Por favor, selecione primeiro uma disciplina na lista.",
    noticeEnterKeywordFirst: "Por favor, insira uma palavra-chave ou nome de professor a excluir.",
    scheduleBtnTitle: "Horário da disciplina (todas as aulas)",
    scheduleBtnLabel: "Horário",
    scheduleStatTotal: "{count} no total",
    scheduleStatPast: "{count} concluídas",
    scheduleStatUpcoming: "{count} restantes",
    filterAll: "Todas ({count})",
    filterUpcoming: "Próximas ({count})",
    filterPast: "Passadas ({count})",
    nextSessionBadge: "Próxima aula",
    allSessionsHeading: "Cronograma de todas as aulas",
    noSessionsFoundForCourse: "Nenhuma aula encontrada para esta disciplina.",
    statusOngoing: "Em andamento",
    statusNext: "Próxima",
    statusPast: "Concluída",
    statusFuture: "Agendada",
    statusCancelled: "Aula cancelada",
    btnJumpToDayInCalendar: "Ver no horário",
    btnViewInSchedule: "Ver dia",
    btnOpenNote: "Anotação",
    btnCreateNoteShort: "Anotação",
    btnOpenCourseHub: "Pasta da disciplina",
    badgeOpenNoteTooltip: "Clique para abrir a anotação",
    badgeCreateNoteTooltip: "Clique para criar anotação",
    badgeMapFolderTooltip: "Clique para atribuir pasta",
    courseHubNotFound: "Pasta da disciplina não encontrada. Atribua nas configurações ou crie uma anotação primeiro.",
    courseHubCreated: "Anotação criada: {path}",
    countdownOngoing: "Aula em andamento agora",
    countdownToday: "Hoje às {time}",
    countdownTomorrow: "Amanhã às {time}",
    countdownInDays: "Em {days} dias",
    allSessionsCompleted: "Todas as aulas programadas para esta disciplina já foram concluídas."
  },
  it: {
    allCalendars: "Tutti i calendari",
    filterCalendarLabel: "Si applica al calendario",
    btnCollapse: "Comprimi",
    btnExpand: "Espandi",
    calendarCoursesCount: "{count} materie",
    noCoursesInCalendar: "Nessuna materia rilevata in questo calendario.",
    viewTitle: "Orario & Calendario",
    ribbonTitle: "Apri orario universitario",
    commandOpen: "Apri calendario universitario nella barra laterale",
    commandSync: "Aggiorna orario dall'università",
    commandExportIcs: "Esporta calendario pulito (.ics)",
    today: "Oggi",
    prevMonth: "Mese precedente",
    nextMonth: "Mese successivo",
    refreshSchedule: "Aggiorna orario dall'università",
    refreshSuccess: "Orario aggiornato! Lezioni totali: {count}",
    refreshError: "Errore nel recupero dell'orario: ",
    weekdaysShort: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    weekdaysFull: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    monthsGenitive: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    dateHeaderTemplate: "{dayName} {dayNum} {month} {year}",
    noClasses: "Nessuna lezione",
    oneClass: "1 lezione",
    fewClasses: "{count} lezioni",
    manyClasses: "{count} lezioni",
    emptyScheduleTitle: "Nessuna lezione prevista per questa giornata.",
    emptyScheduleDesc: "Goditi il tempo libero o ripassa gli appunti!",
    emptyNoSourcesTitle: "Nessun orario universitario aggiunto",
    emptyNoSourcesDesc: "Aggiungi il link iCal del tuo ateneo (es. Esse3, EasyAcademy, Moodle, Google Calendar) o carica un file .ics nelle impostazioni per visualizzare le lezioni.",
    btnAddScheduleSettings: "Apri impostazioni e aggiungi orario",
    remainingMin: "Mancano {min} min",
    allDay: "Tutto il giorno",
    noteExists: "Appunti presenti",
    missingNote: "Nessun appunto",
    openNoteHint: "Apri appunti",
    createNoteHint: "Clicca per creare appunti di lezione",
    noFolderBadge: "Senza cartella",
    createFolderHint: "Clicca per creare cartella e nota",
    subjectIgnoredNotice: "Questa materia è contrassegnata come ignorata nelle impostazioni (nessuna cartella).",
    defaultCourseName: "Materia",
    defaultCalendarName: "Calendario",
    noInfo: "Nessuna informazione",
    modalCreateTitle: "Creare una nuova nota per questa lezione?",
    modalCreateDesc: "Non ci sono ancora appunti per il {date} per la materia:",
    modalTargetLoc: "Percorso di salvataggio nel vault:",
    modalCancel: "Annulla",
    modalCreateBtn: "Crea appunto",
    noteCreatedNotice: "Nota creata: {path}",
    noteOpenedNotice: "Nota aperta: {name}",
    modalCreateFolderTitle: "Nessuna cartella trovata per questa materia",
    modalCreateFolderDesc: "Nel tuo vault non esiste ancora una cartella per questo corso:",
    modalCreateFolderPrompt: "Desideri creare una nuova cartella e la prima nota per il {date}?",
    modalFolderInputLabel: "Nome o percorso della nuova cartella:",
    modalNotePreviewLabel: "Percorso della nuova nota:",
    modalCreateFolderBtn: "Crea cartella e nota",
    folderAndNoteCreatedNotice: "Cartella '{folder}' e nota create: {path}",
    confirmDeleteScheduleTitle: "Rimuovere questo orario?",
    confirmDeleteScheduleDesc: "Sei sicuro di voler rimuovere l'orario '{name}'? Le relative lezioni scompariranno dal calendario. I tuoi appunti Markdown esistenti rimarranno intatti.",
    typeLecture: "Lezione",
    typeExercises: "Esercitazione",
    typeLab: "Laboratorio",
    typeLanguage: "Corso di lingua",
    typeLanguageExam: "Corso di lingua (Esame)",
    typeProject: "Progetto",
    typeSeminar: "Seminario",
    typeExam: "Esame / Appello",
    typeOther: "Altre lezioni",
    settingTimelineGapsTitle: "Ore buche e pause nell'orario",
    settingShowTimelineGapsName: "Mostra pause / ore buche sulla timeline giornaliera",
    settingShowTimelineGapsDesc: "Mostra indicatori visivi per i periodi liberi tra lezioni consecutive nella timeline.",
    timelineBreakTooltip: "Ora buca: {time}",
    cardAppearanceTitle: "Aspetto delle pause e ore buche",
    cardAppearanceDesc: "Configura come visualizzare i periodi liberi tra le lezioni nella timeline del giorno.",
    cardCategoriesTitle: "Categorie delle lezioni & Colori",
    cardCategoriesDesc: "Personalizza i nomi delle etichette e i colori per i diversi tipi di lezione (teoria, esercitazioni, laboratori, esami).",
    breakStyleLabel: "Stile di visualizzazione",
    breakStylePill: "Badge a pillola (Pill)",
    breakStyleCard: "Scheda timeline (Card)",
    breakStyleLine: "Linea tratteggiata (Line)",
    breakStyleText: "Testo semplice (Text)",
    breakCardDefaultTitle: "Ora buca / Pausa",
    breakIconLabel: "Icona della pausa",
    breakIconCoffee: "☕ Tazzina di caffè",
    breakIconFood: "🍔 Pranzo / Spuntino",
    breakIconPause: "⏸️ Pausa",
    breakIconHourglass: "⏳ Clessidra",
    breakIconWalk: "🚶 Camminata",
    breakIconBook: "📖 Studio / Lettura",
    breakIconMusic: "🎵 Musica / Cuffie",
    breakIconSun: "☀️ Sole",
    breakIconMoon: "🌙 Luna",
    breakIconSpark: "✨ Idee",
    breakIconBattery: "🔋 Ricarica",
    breakIconClock: "⏰ Orologio",
    breakIconLeaf: "🍃 Foglia",
    breakIconSmile: "😊 Relax",
    breakMinMinutesLabel: "Durata minima della pausa (minuti)",
    breakMinMinutesDesc: "I tempi liberi inferiori a questa durata non verranno mostrati.",
    breakMinMinutesPlaceholder: "es. 15",
    breakMaxMinutesLabel: "Durata massima della pausa (minuti)",
    breakMaxMinutesDesc: "0 indica nessun limite massimo (mostra tutte le pause oltre il minimo).",
    breakMaxMinutesPlaceholder: "0 = nessun limite",
    perCalendarGapsTitle: "Impostazioni pause per singolo calendario",
    perCalendarGapsDesc: "Sostituisci le impostazioni di pausa singolarmente per calendari specifici.",
    enableCalendarGapOverride: "Personalizza pause per questo calendario",
    categoryUsedInCalendars: "Utilizzato nei calendari",
    settingShowCoffeeIconName: "Mostra icona del caffè nell'intestazione della barra laterale",
    settingShowCoffeeIconDesc: "Mostra una sobria icona del caffè accanto alle impostazioni nella testata del calendario.",
    tabAbout: "Info",
    tabGeneral: "Orari & Sincronizzazione",
    tabLanguage: "Lingua & Regione",
    tabMapping: "Note & Modelli",
    tabExclusions: "Esclusioni",
    tabColors: "Aspetto & Colori",
    qsTitle: "Guida rapida — Come iniziare?",
    qsStep1Title: "Aggiungi il tuo orario: ",
    qsStep1Desc: "Nella scheda «Orari & Sincronizzazione», incolla il link iCal/ICS del tuo ateneo (es. Esse3, EasyAcademy, Moodle, Google Calendar) oppure carica un file .ics scaricato.",
    qsStep2Title: "Configura modelli e cartelle: ",
    qsStep2Desc: "Nella scheda «Note & Modelli», assegna le materie alle cartelle del vault e personalizza la struttura degli appunti con l'editor visivo.",
    qsStep3Title: "Apri la vista laterale: ",
    qsStep3Desc: "Clicca sull'icona del tocco accademico 🎓 nella barra laterale di Obsidian per consultare le lezioni, seguire il countdown in tempo reale e prendere appunti in un clic.",
    langSelectName: "Lingua dell'interfaccia",
    langSelectDesc: "Seleziona la lingua di visualizzazione del plugin.",
    langAuto: "Automatica (di sistema)",
    guideTitle: "Come funziona e consigli pratici",
    guide1Title: "Integrazione diretta con l'orario delle lezioni universitarie",
    guide1Desc: "Il plugin elabora i feed iCalendar ufficiali (iCal/ICS), riconosce lezioni, esercitazioni, aule e docenti, mostrando un conto alla rovescia in tempo reale per la lezione in corso.",
    guide2Title: "Concetto chiave: Cartella = Materia, File = Appunti di lezione",
    guide2Desc: "Cliccando su una lezione nella timeline si apre subito la nota di quel giorno o se ne crea una nuova con metadati YAML già impostati.",
    guide3Title: "Consiglio pratico: Organizzazione ottimale per il semestre",
    guide3Desc: "Per mantenere gli appunti ordinati durante tutti i mesi di corso:",
    guideBullet1: "🗂️ Una cartella per corso: Collega ciascun insegnamento a una cartella del vault per archiviare le note nel posto giusto.",
    guideBullet2: "🚫 Esclusioni intelligenti: Nascondi canali o turni di laboratorio che non frequenti filtrandoli per parole chiave.",
    guideBullet3: "☕ Rilevamento ore buche: Visualizza i tempi liberi tra una lezione e l'altra per organizzare le pause studio.",
    guideCalloutTitle: "In pratica: ",
    guideCalloutText: "Entri in aula, apri Obsidian, clicchi sulla lezione attiva nella barra laterale e inizi subito a prendere appunti con data, aula e docente già inseriti.",
    coffeeBannerText: "Ti piace il plugin? Offrimi un caffè!",
    coffeeBannerSubtext: " Supporta lo sviluppo continuo e la manutenzione.",
    coffeeBannerBtn: "Offrimi un caffè",
    coffeeBannerTitle: "Trovi utile questo plugin? Offrimi un caffè!",
    coffeeBannerDesc: "Supporta lo sviluppo, nuove funzionalità e gli aggiornamenti del progetto.",
    btnBuyCoffee: "Offrimi un caffè",
    supportTitle: "Supporta il progetto",
    supportDesc: "Questo plugin è gratuito e open-source, sviluppato con passione nel tempo libero. Se ti aiuta nella vita universitaria, offrirmi un caffè è il modo migliore per dire grazie!",
    supportBtnText: "Offrimi un caffè",
    hideSupportName: "Nascondi avviso di supporto",
    hideSupportDesc: "Nasconde il banner in cima alle impostazioni e l'icona del caffè nella barra laterale.",
    linksTitle: "Informazioni sul progetto",
    heroAuthor: "Autore",
    linksGithub: "Repository GitHub",
    linksIssues: "Segnala un bug o proponi una funzione",
    aboutPluginDesc: "Calendario e orario universitario nella barra laterale con countdown in tempo reale, editor visuale di modelli, mappatura cartelle e collegamento automatico agli appunti.",
    aboutAuthor: "Autore",
    aboutSupportTitle: "Supporta il progetto",
    aboutSupportDesc: "Questo plugin è gratuito e open-source. Se ti è utile nello studio universitario, un caffè è sempre molto apprezzato!",
    aboutLinksTitle: "Link utili",
    btnGithubRepo: "Repository GitHub",
    btnReportIssue: "Segnala un bug o proponi una funzione",
    aboutQuickStartTitle: "Guida rapida — Come iniziare?",
    aboutStep1: "Aggiungi orario: Nella scheda «Orari & Sincronizzazione», incolla il link iCal/ICS o carica un file .ics del tuo ateneo.",
    aboutStep2: "Configura modelli e cartelle: In «Note & Modelli», imposta il formato degli appunti e abbina le materie alle cartelle.",
    aboutStep3: "Apri pannello laterale: Clicca sul tocco 🎓 nella barra sinistra per visualizzare orari e countdown.",
    settingsTitle: "Impostazioni Orario Universitario",
    urlSettingName: "Aggiungi sorgente orario",
    urlSettingDesc: "Incolla il link iCal/ICS del tuo ateneo (es. Esse3, EasyAcademy, Moodle, Google Calendar, Outlook) o carica un file .ics. Nota: i calendari online devono essere pubblici o provvisti di token privato.",
    urlSettingDescShort: "Aggiungi l'orario universitario da link iCal/ICS (Esse3, EasyAcademy, Moodle, Google Calendar, Outlook) o carica un file .ics.",
    publicCalendarTip: "💡 Come aggiungere l'orario delle lezioni del tuo ateneo:\n• Esse3 / EasyAcademy / University Planner (Cineca / UP): Accedi alla tua area riservata Esse3 o al portale orari EasyAcademy dell'ateneo → vai su „Orario lezioni / Il mio orario” → clicca su „Esporta orario (.ics / iCal)” o „Sincronizza agenda” e copia il link generato.\n• Moodle (Piattaforma didattica d'ateneo): Vai su Calendario → Esporta calendario → Tutti gli eventi → Ottieni URL del calendario.\n• Google Calendar / Outlook: In Google Calendar copia l'«Indirizzo segreto in formato iCal» dalle impostazioni; in Outlook vai su Impostazioni → Calendario → Calendari condivisi → Pubblica calendario.\n• Canvas LMS: Nel menu di navigazione clicca su Calendario → in basso a destra clicca su „Feed calendario” e copia il link iCal.\n• File .ics scaricato: Se il portale della tua università permette solo il download del file orario, scarica il file .ics sul tuo computer e clicca su „Carica file .ics” qui sopra.",
    urlPlaceholder: "https://esse3.unirand.it/orari.ics o link EasyAcademy/Moodle/Google",
    btnDownloadNow: "Aggiungi da URL",
    btnDownloading: "Download in corso...",
    btnUploadIcs: "Carica file .ics",
    uploadIcsDesc: "Carica un file di orario .ics / iCal scaricato sul tuo dispositivo",
    icsLoadedSuccess: "Orario '{name}' caricato con successo! Aggiunte {count} lezioni.",
    invalidIcsError: "Errore: Il file fornito non contiene una struttura iCalendar (.ics) valida.",
    fileLoadError: "Errore nella lettura del file orario: ",
    addedSchedulesTitle: "Orari configurati",
    noSchedulesAdded: "Nessun orario aggiunto finora. Incolla un link sopra o carica un file .ics dal computer.",
    scheduleTypeUrl: "Sottoscrizione Web (URL)",
    scheduleTypeFile: "File locale (.ics)",
    btnRefreshSource: "Sincronizza ora",
    btnRenameSource: "Rinomina orario",
    renameSourcePlaceholder: "Nuovo nome dell'orario...",
    scheduleRenamedNotice: "Orario rinominato in: {name}",
    errDuplicateCalendarName: "Esiste già un orario con questo nome.",
    btnLockSource: "Blocca modifiche da sincronizzazione",
    btnUnlockSource: "Sblocca per sincronizzare",
    badgeLockedSource: "Bloccato",
    scheduleLockedNotice: "L'orario '{name}' è bloccato e non verrà sovrascritto dalla sincronizzazione.",
    scheduleUnlockedNotice: "L'orario '{name}' è stato sbloccato e si sincronizzerà regolarmente.",
    allSchedulesLockedNotice: "Tutti gli orari sono bloccati. Sbloccane almeno uno per sincronizzare.",
    btnHideSource: "Nascondi lezioni dal calendario",
    btnShowSource: "Mostra lezioni nel calendario",
    badgeHiddenSource: "Nascosto",
    scheduleHiddenNotice: "L'orario '{name}' è ora nascosto.",
    scheduleShownNotice: "L'orario '{name}' è ora visibile.",
    btnDeleteSource: "Elimina orario",
    scheduleRemovedNotice: "Orario rimosso: {name}",
    btnExportIcs: "Esporta calendario pulito (.ics)",
    exportIcsDesc: "Esporta tutte le lezioni attive e non escluse in un file .ics pulito all'interno del tuo vault.",
    exportSuccess: "Esportate {count} lezioni in: {path}",
    exportEmptyError: "Nessuna lezione da esportare. Aggiungi prima un orario.",
    syncStartupName: "Sincronizza all'avvio",
    syncStartupDesc: "Aggiorna automaticamente gli orari da Internet quando apri Obsidian.",
    btnCancelEdit: "Annulla",
    btnShowCalNameOnEvents: "Mostra nome calendario sulle schede",
    btnHideCalNameOnEvents: "Nascondi nome calendario sulle schede",
    calNameShownNotice: "Il nome del calendario verrà mostrato per '{name}'.",
    calNameHiddenNotice: "Nome del calendario nascosto per '{name}'.",
    badgeCalNameShown: "Nome visibile",
    notesFolderCardTitle: "Cartelle e archiviazione nel vault",
    notesTemplateSectionTitle: "Modello appunti di lezione",
    notesSettingsTitle: "Note & Modelli",
    notesSettingsDesc: "Configura il modello degli appunti, l'organizzazione delle cartelle e il formato dei file.",
    settingDisableNoteClickName: "Disattiva apertura nota al clic sulle schede della timeline",
    settingDisableNoteClickDesc: "Evita di aprire o creare note quando clicchi su una lezione nella timeline.",
    baseFolderSetting: "Cartella radice dei corsi",
    baseFolderDesc: "Cartella principale del vault in cui verranno create le sottocartelle dei singoli corsi (lascia vuoto per la radice del vault).",
    baseFolderPlaceholder: "es. Università o Corsi",
    optVaultRoot: "Radice del vault (nessuna cartella base)",
    dateFormatSetting: "Formato data",
    dateFormatDesc: "Utilizzato nei nomi dei file e nella variabile {date}.",
    dateFormatExample: "Esempio: {sample}",
    noteNameFormatSetting: "Formato del nome file della nota",
    noteNameFormatDesc: "Variabili disponibili: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Contenuto del modello appunti",
    templateDesc: "Modello applicato alla creazione di un nuovo appunto. Supporta Markdown e Proprietà di Obsidian (YAML).",
    btnOpenTemplateBuilder: "Apri editor visuale dei modelli",
    builderModalTitle: "Editor visuale modello appunti",
    builderModalDesc: "Personalizza il tuo schema di appunti con anteprima in tempo reale e tag variabili trascinabili.",
    builderPresetsLabel: "Modelli predefiniti",
    presetStandard: "📋 Standard",
    presetProperties: "📊 Proprietà Obsidian (YAML)",
    presetMinimal: "📌 Minimale",
    presetBlank: "📄 Nota vuota",
    builderChipsLabel: "Variabili disponibili dall'orario (clicca o trascina nell'editor):",
    builderChipTooltip: "Clicca per inserire o trascina nel modello: {desc}",
    builderEditorLabel: "Editor modello (Markdown / YAML)",
    builderPreviewLabel: "Anteprima in tempo reale con dati reali del corso",
    builderBlankPreview: "Il modello è vuoto. Inserisci del testo o delle variabili sopra.",
    btnSaveTemplate: "Salva modello",
    templateSavedNotice: "Modello note salvato con successo!",
    sampleSubject: "Informatica Generale",
    sampleRoom: "Aula Magna",
    sampleLecturer: "Prof. Rossi",
    sampleDesc: "Canale A - Algoritmi e strutture dati",
    langTitle: "Lingua",
    langDesc: "Scegli la lingua per calendario, giorni della settimana, timeline e impostazioni.",
    langSelectLabel: "Lingua dell'interfaccia",
    regionTitle: "Formattazione regionale",
    regionDesc: "Configura formato data, primo giorno della settimana e formato orario (24h / 12h).",
    firstDayOfWeekSetting: "Primo giorno della settimana",
    firstDayOfWeekDesc: "Scegli se iniziare la griglia del calendario dal lunedì o dalla domenica.",
    firstDayMonday: "Lunedì",
    firstDaySunday: "Domenica",
    timeFormatSetting: "Formato orario",
    timeFormatDesc: "Scegli tra orario a 24 ore (14:30) o a 12 ore AM/PM (2:30 PM).",
    timeFormat24h: "24 ore (14:30)",
    timeFormat12h: "12 ore AM/PM (2:30 PM)",
    mappingTitle: "Abbinamento materie alle cartelle",
    mappingDesc: "Assegna le materie rilevate nell'orario alle cartelle del tuo vault. Le note di lezione verranno salvate automaticamente nella cartella corretta.",
    colSubject: "Materia / Insegnamento",
    colFolder: "Cartella nel vault",
    optAutoMatch: "Abbina cartella automaticamente",
    optAutoMatchFound: "Automatico (trovata: {folder})",
    optNotFoundAuto: "Senza cartella (crea all'apertura nota)",
    optCreateNewFolder: "➕ Crea nuova cartella...",
    optNoFolder: "🚫 Senza cartella (ignora materia)",
    cleanSubjectNamesSetting: "Pulisci i titoli delle materie",
    cleanSubjectNamesDesc: "Rimuove sigle come (Teoria), (Lab), [W], (Eserc) e diciture di appelli quando suggerisce nomi di cartelle.",
    autoFindFolderSetting: "Rileva cartelle esistenti automaticamente",
    autoFindFolderDesc: "Cerca cartelle con lo stesso nome nel vault quando non è presente una mappatura manuale.",
    autoMatchedTo: "Abbinata automaticamente a: {folder}",
    statusManuallyMapped: "Abbinata manualmente",
    statusIgnored: "Ignorata (senza cartella)",
    noMatchFound: "Nessuna cartella corrispondente trovata",
    folderCreatedAndAssignedNotice: "Cartella '{folder}' creata e abbinata alla materia '{subject}'.",
    noSubjectsFound: "Nessuna materia trovata nell'orario. Aggiungi prima un orario.",
    exclusionsTitle: "Materie escluse & Filtri",
    exclusionsDesc: "Nascondi corsi o turni che non frequenti. Gli eventi esclusi non appariranno nel calendario, nella timeline o nei file esportati.",
    detectedSubjects: "Materie rilevate (attiva/disattiva per escludere)",
    keywordsTitle: "Parole chiave di filtro",
    keywordsDesc: "Qualsiasi lezione il cui titolo o descrizione contenga una di queste parole verrà nascosta.",
    keywordsPlaceholder: "Inserisci parola chiave (es. Canale B, Idoneità, Tirocinio)...",
    btnAddKeyword: "Aggiungi parola chiave",
    btnEditKeyword: "Modifica",
    btnSaveKeyword: "Salva",
    btnDeleteKeyword: "Elimina",
    noKeywordsText: "Nessuna parola chiave di filtro definita.",
    excludeToggleOn: "La materia è esclusa (clicca per visualizzare)",
    excludeToggleOff: "La materia è visibile (clicca per escludere)",
    colorsTitle: "Categorie lezioni & Colori",
    colorsDesc: "Personalizza nomi e colori. Il plugin categorizza automaticamente le lezioni in base alle parole chiave nel titolo e nella descrizione.",
    categoryNamePlaceholder: "Predefinito: {default}",
    btnResetColors: "Ripristina colori predefiniti",
    errHttpStatus: "Il server ha risposto con l'errore {status}: {text}",
    errHttp401Google: "Errore 401 (Accesso negato a Google Calendar): I calendari condivisi via web devono essere pubblici, OPPURE copia in fondo alle impostazioni di Google Calendar l'«Indirizzo segreto in formato iCal» (.ics), o carica manualmente il file .ics.",
    errHttp401General: "Errore {status} (Non autorizzato): I calendari condivisi via web devono essere pubblici. Rendi pubblico il calendario o carica manualmente il file .ics dal computer.",
    errNoScheduleSource: "Aggiungi un link all'orario nelle impostazioni o carica un file .ics.",
    errInvalidIcsContent: "I dati scaricati non contengono un calendario iCal/ICS valido.",
    errCreateNote: "Errore nella creazione della nota: {message}",
    conditionalRuleBuilderTitle: "Generatore di regole condizionali (Se corso ➔ Escludi docente / parola chiave)",
    conditionalRuleBuilderDesc: "Consente di escludere un docente o una parola chiave specifica solo in un determinato corso (altri corsi con questo docente rimarranno visibili).",
    selectSubjectPlaceholder: "Seleziona corso...",
    conditionalKwPlaceholder: "Nome del docente o parola chiave da escludere...",
    btnAddConditionalRule: "+ Aggiungi regola condizionale",
    ruleIfPrefix: "Se",
    ruleExcludePrefix: "Escludi",
    ruleAllPrefix: "Tutte le parole",
    noticeSelectSubjectFirst: "Seleziona prima un corso dall'elenco.",
    noticeEnterKeywordFirst: "Inserisci una parola chiave o il nome di un docente da escludere.",
    scheduleBtnTitle: "Orario del corso (tutte le lezioni)",
    scheduleBtnLabel: "Orario",
    scheduleStatTotal: "{count} totali",
    scheduleStatPast: "{count} completate",
    scheduleStatUpcoming: "{count} rimanenti",
    filterAll: "Tutte ({count})",
    filterUpcoming: "Prossime ({count})",
    filterPast: "Passate ({count})",
    nextSessionBadge: "Prossima lezione",
    allSessionsHeading: "Cronologia di tutte le lezioni",
    noSessionsFoundForCourse: "Nessuna lezione trovata per questo corso.",
    statusOngoing: "In corso",
    statusNext: "Prossima",
    statusPast: "Completata",
    statusFuture: "Pianificata",
    statusCancelled: "Lezione annullata",
    btnJumpToDayInCalendar: "Mostra nell'orario",
    btnViewInSchedule: "Mostra giorno",
    btnOpenNote: "Appunto",
    btnCreateNoteShort: "Appunto",
    btnOpenCourseHub: "Cartella del corso",
    badgeOpenNoteTooltip: "Clicca per aprire l'appunto",
    badgeCreateNoteTooltip: "Clicca per creare l'appunto",
    badgeMapFolderTooltip: "Clicca per assegnare la cartella",
    courseHubNotFound: "Cartella del corso non trovata. Assegna una cartella nelle impostazioni o crea prima un appunto.",
    courseHubCreated: "Appunto del corso creato: {path}",
    countdownOngoing: "Lezione attualmente in corso",
    countdownToday: "Oggi alle {time}",
    countdownTomorrow: "Domani alle {time}",
    countdownInDays: "Tra {days} giorni",
    allSessionsCompleted: "Tutte le lezioni programmate per questo corso si sono già concluse."
  },
  ru: {
    allCalendars: "Все календари",
    filterCalendarLabel: "Относится к календарю",
    btnCollapse: "Свернуть",
    btnExpand: "Развернуть",
    calendarCoursesCount: "{count} предметов",
    noCoursesInCalendar: "В этом календаре не обнаружено предметов.",
    viewTitle: "Расписание и Календарь",
    ribbonTitle: "Открыть расписание занятий",
    commandOpen: "Открыть расписание занятий в боковой панели",
    commandSync: "Обновить расписание из вуза",
    commandExportIcs: "Экспортировать очищенный календарь (.ics)",
    today: "Сегодня",
    prevMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    refreshSchedule: "Обновить расписание из вуза",
    refreshSuccess: "Расписание обновлено! Всего занятий: {count}",
    refreshError: "Ошибка загрузки расписания: ",
    weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    weekdaysFull: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthsGenitive: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    dateHeaderTemplate: "{dayName}, {dayNum} {month} {year} г.",
    noClasses: "Нет занятий",
    oneClass: "1 занятие",
    fewClasses: "{count} занятия",
    manyClasses: "{count} занятий",
    emptyScheduleTitle: "На этот день занятия не запланированы.",
    emptyScheduleDesc: "Наслаждайтесь свободным временем или повторите пройденный материал!",
    emptyNoSourcesTitle: "Расписание занятий еще не добавлено",
    emptyNoSourcesDesc: "Добавьте ссылку подписки iCal своего вуза (РУЗ, Модеус, Moodle, Google Календарь) или загрузите файл .ics в настройках, чтобы увидеть занятия.",
    btnAddScheduleSettings: "Открыть настройки и добавить расписание",
    remainingMin: "Осталось {min} мин.",
    allDay: "Весь день",
    noteExists: "Заметка создана",
    missingNote: "Нет заметки",
    openNoteHint: "Открыть заметку",
    createNoteHint: "Нажмите, чтобы создать заметку к паре",
    noFolderBadge: "Нет папки",
    createFolderHint: "Нажмите, чтобы создать папку и заметку",
    subjectIgnoredNotice: "Этот предмет помечен в настройках как игнорируемый (без папки).",
    defaultCourseName: "Предмет",
    defaultCalendarName: "Календарь",
    noInfo: "Нет информации",
    modalCreateTitle: "Создать новую заметку к занятию?",
    modalCreateDesc: "Еще нет конспекта на {date} по предмету:",
    modalTargetLoc: "Путь сохранения файла в хранилище:",
    modalCancel: "Отмена",
    modalCreateBtn: "Создать заметку",
    noteCreatedNotice: "Создана заметка: {path}",
    noteOpenedNotice: "Открыта заметка: {name}",
    modalCreateFolderTitle: "Не найдена папка для этого предмета",
    modalCreateFolderDesc: "В вашем хранилище еще нет папки для этого курса:",
    modalCreateFolderPrompt: "Хотите создать новую папку и первую заметку к паре на {date}?",
    modalFolderInputLabel: "Имя или путь новой папки:",
    modalNotePreviewLabel: "Расположение новой заметки:",
    modalCreateFolderBtn: "Создать папку и заметку",
    folderAndNoteCreatedNotice: "Создана папка '{folder}' и заметка: {path}",
    confirmDeleteScheduleTitle: "Удалить расписание?",
    confirmDeleteScheduleDesc: "Вы уверены, что хотите удалить расписание '{name}'? Его пары перестанут отображаться в календаре. Ваши созданные заметки Markdown останутся нетронутыми.",
    typeLecture: "Лекция",
    typeExercises: "Семинар / Практика",
    typeLab: "Лабораторная работа",
    typeLanguage: "Иностранный язык",
    typeLanguageExam: "Иностранный язык (Экзамен)",
    typeProject: "Проект / Курсовая",
    typeSeminar: "Научный семинар",
    typeExam: "Экзамен / Зачет",
    typeOther: "Другие занятия",
    settingTimelineGapsTitle: "Окна и перерывы в расписании",
    settingShowTimelineGapsName: "Показывать окна / перерывы на временной шкале дня",
    settingShowTimelineGapsDesc: "Отображает визуальные индикаторы окон между парами на шкале дня.",
    timelineBreakTooltip: "Окно: {time}",
    cardAppearanceTitle: "Внешний вид перерывов и окон",
    cardAppearanceDesc: "Настройте стиль отображения окон между занятиями на шкале дня.",
    cardCategoriesTitle: "Категории предметов & Цвета",
    cardCategoriesDesc: "Настройте названия и цвета бейджей для различных видов занятий (лекции, семинары, лаборатории, экзамены).",
    breakStyleLabel: "Стиль отображения",
    breakStylePill: "Капсула (Pill)",
    breakStyleCard: "Карточка на шкале (Card)",
    breakStyleLine: "Пунктирная линия (Line)",
    breakStyleText: "Простой текст (Text)",
    breakCardDefaultTitle: "Окно между парами / Перерыв",
    breakIconLabel: "Иконка перерыва",
    breakIconCoffee: "☕ Чашка кофе",
    breakIconFood: "🍔 Обед / Перекус",
    breakIconPause: "⏸️ Пауза",
    breakIconHourglass: "⏳ Песочные часы",
    breakIconWalk: "🚶 Прогулка",
    breakIconBook: "📖 Чтение / Учеба",
    breakIconMusic: "🎵 Музыка / Наушники",
    breakIconSun: "☀️ Солнце",
    breakIconMoon: "🌙 Луна",
    breakIconSpark: "✨ Искры",
    breakIconBattery: "🔋 Подзарядка",
    breakIconClock: "⏰ Часы",
    breakIconLeaf: "🍃 Лист",
    breakIconSmile: "😊 Отдых",
    breakMinMinutesLabel: "Минимальная длина окна (минут)",
    breakMinMinutesDesc: "Перерывы короче указанного значения отображаться не будут.",
    breakMinMinutesPlaceholder: "напр. 15",
    breakMaxMinutesLabel: "Максимальная длина окна (минут)",
    breakMaxMinutesDesc: "0 означает отсутствие ограничения (показывать все окна больше минимума).",
    breakMaxMinutesPlaceholder: "0 = без ограничения",
    perCalendarGapsTitle: "Настройки окон для каждого календаря",
    perCalendarGapsDesc: "Переопределите правила показа окон индивидуально для конкретных расписаний.",
    enableCalendarGapOverride: "Переопределить настройки окон для этого календаря",
    categoryUsedInCalendars: "Используется в календарях",
    settingShowCoffeeIconName: "Показывать иконку кофе в заголовке боковой панели",
    settingShowCoffeeIconDesc: "Отображает аккуратную иконку кофе поддержки рядом с настройками в календаре.",
    tabAbout: "О плагине",
    tabGeneral: "Расписания & Синхронизация",
    tabLanguage: "Язык & Регион",
    tabMapping: "Заметки & Шаблоны",
    tabExclusions: "Исключения",
    tabColors: "Категории & Цвета",
    qsTitle: "Быстрый старт — С чего начать?",
    qsStep1Title: "Добавьте расписание: ",
    qsStep1Desc: "Во вкладке «Расписания & Синхронизация» вставьте ссылку подписки iCal/ICS своего вуза (РУЗ, Модеус, Moodle, Google Календарь) или загрузите скачанный файл .ics.",
    qsStep2Title: "Настройте папки и шаблоны: ",
    qsStep2Desc: "Во вкладке «Заметки & Шаблоны» свяжите предметы с папками хранилища и настройте оформление конспектов в визуальном редакторе.",
    qsStep3Title: "Откройте боковую панель: ",
    qsStep3Desc: "Нажмите на иконку конфедератки 🎓 на левой панели Obsidian — просматривайте расписание, следите за таймером пар и создавайте конспекты в один клик.",
    langSelectName: "Язык интерфейса",
    langSelectDesc: "Выберите язык отображения плагина.",
    langAuto: "Автоматически (язык системы)",
    guideTitle: "Принцип работы и лучшие практики",
    guide1Title: "Прямая интеграция с университетским расписанием",
    guide1Desc: "Плагин считывает официальные подписки iCalendar (iCal/ICS), определяет лекции, семинары, лабораторные, аудитории и преподавателей, а во время пары ведет обратный отсчет времени до конца занятия.",
    guide2Title: "Главный принцип: Папка = Предмет, Файл = Конспект пары",
    guide2Desc: "Клик по паре на шкале дня открывает конспект на эту дату или создает новый документ с метаданными YAML.",
    guide3Title: "Рекомендация: Идеальная организация семестра",
    guide3Desc: "Чтобы конспекты всегда оставались в идеальном порядке:",
    guideBullet1: "🗂️ Отдельная папка на каждый предмет: Свяжите каждую дисциплину с папкой хранилища, чтобы конспекты сразу сохранялись на свои места.",
    guideBullet2: "🚫 Умные исключения: Скройте чужие подгруппы или отфильтруйте ненужные события по ключевым словам.",
    guideBullet3: "☕ Индикаторы окон: Включите визуальное отображение перерывов между парами для планирования времени.",
    guideCalloutTitle: "На практике: ",
    guideCalloutText: "Вы заходите в аудиторию, открываете Obsidian, кликаете по текущей паре на боковой панели и сразу начинаете вести конспект — с уже заполненными датой, аудиторией и именем преподавателя.",
    coffeeBannerText: "Нравится плагин? Угостите автора кофе!",
    coffeeBannerSubtext: " Поддержите дальнейшую разработку и поддержку.",
    coffeeBannerBtn: "Угостить кофе",
    coffeeBannerTitle: "Пользуетесь плагином с удовольствием? Угостите автора кофе!",
    coffeeBannerDesc: "Поддержите развитие проекта, добавление новых функций и своевременные обновления.",
    btnBuyCoffee: "Угостить кофе",
    supportTitle: "Поддержать проект",
    supportDesc: "Этот плагин полностью бесплатен и имеет открытый исходный код, созданный в свободное время. Если он помогает вам в учебе, чашка кофе — отличный способ сказать спасибо!",
    supportBtnText: "Угостить кофе",
    hideSupportName: "Скрыть блок поддержки",
    hideSupportDesc: "Скрывает баннер поддержки вверху настроек и значок кофе в заголовке календаря.",
    linksTitle: "О проекте",
    heroAuthor: "Автор",
    linksGithub: "Репозиторий на GitHub",
    linksIssues: "Сообщить об ошибке или предложить идею",
    aboutPluginDesc: "Университетское расписание в боковой панели с таймером пар в реальном времени, визуальным редактором шаблонов конспектов, автопривязкой папок и созданием заметок в один клик.",
    aboutAuthor: "Автор",
    aboutSupportTitle: "Поддержать проект",
    aboutSupportDesc: "Плагин бесплатен и открыт. Если он помогает вам организовать учебный процесс, чашка кофе будет отличной поддержкой!",
    aboutLinksTitle: "Полезные ссылки",
    btnGithubRepo: "Репозиторий на GitHub",
    btnReportIssue: "Сообщить об ошибке или предложить идею",
    aboutQuickStartTitle: "Быстрый старт — С чего начать?",
    aboutStep1: "Добавить расписание: Во вкладке «Расписания & Синхронизация» вставьте ссылку iCal/ICS или загрузите файл .ics.",
    aboutStep2: "Настроить папки и шаблоны: В «Заметки & Шаблоны» настройте шаблон конспекта и привязку папок предметов.",
    aboutStep3: "Открыть боковую панель: Нажмите на иконку 🎓 на левой панели, чтобы открыть расписание.",
    settingsTitle: "Настройки университетского расписания",
    urlSettingName: "Добавить источник расписания",
    urlSettingDesc: "Вставьте ссылку iCal/ICS вашего вуза (РУЗ, Модеус, Moodle, Google Календарь, Outlook) или загрузите файл .ics. Внимание: ссылка должна быть общедоступной или содержать токен доступа.",
    urlSettingDescShort: "Добавьте расписание по ссылке iCal/ICS (РУЗ, Модеус, Moodle, Google Календарь, Outlook) или загрузите файл .ics.",
    publicCalendarTip: "💡 Как добавить расписание занятий своего университета:\n• РУЗ / Личный кабинет студента (ВШЭ, МГУ, МФТИ, СПбГУ и др.): Откройте страницу своего расписания → нажмите «Экспорт расписания / Синхронизация с календарем (iCal / .ics)» → скопируйте полученную ссылку подписки.\n• Модеус (Modeus): Авторизуйтесь в личном кабинете Modeus → перейдите в «Расписание» → нажмите на значок синхронизации / «Экспорт в iCal» и скопируйте URL.\n• Moodle (ЭИОС вуза): Перейдите в раздел «Календарь» → «Экспорт календаря» → «Все события» → «Получить URL календаря».\n• Google Календарь / Яндекс / Outlook: В Google Календаре скопируйте «Закрытый адрес в формате iCal» из настроек; в Outlook выберите «Опубликовать календарь».\n• Локальный файл .ics: Если ваш вуз не предоставляет постоянную веб-ссылку, скачайте файл расписания .ics из личного кабинета и нажмите кнопку «Загрузить файл .ics» выше.",
    urlPlaceholder: "https://ruz.hse.ru/api/schedule.ics или ссылка Moodle/Google/Модеус",
    btnDownloadNow: "Добавить по URL",
    btnDownloading: "Загрузка...",
    btnUploadIcs: "Загрузить файл .ics",
    uploadIcsDesc: "Загрузить скачанный файл расписания .ics / iCal с вашего компьютера",
    icsLoadedSuccess: "Расписание '{name}' успешно загружено! Добавлено занятий: {count}.",
    invalidIcsError: "Ошибка: Загруженный файл не содержит корректных данных iCalendar (.ics).",
    fileLoadError: "Ошибка при чтении файла расписания: ",
    addedSchedulesTitle: "Подключенные расписания",
    noSchedulesAdded: "Расписания еще не добавлены. Вставьте ссылку выше или загрузите файл .ics.",
    scheduleTypeUrl: "Интернет-подписка (URL)",
    scheduleTypeFile: "Локальный файл (.ics)",
    btnRefreshSource: "Синхронизировать сейчас",
    btnRenameSource: "Переименовать расписание",
    renameSourcePlaceholder: "Новое имя расписания...",
    scheduleRenamedNotice: "Расписание переименовано в: {name}",
    errDuplicateCalendarName: "Расписание с таким именем уже существует.",
    btnLockSource: "Заблокировать от перезаписи при синхронизации",
    btnUnlockSource: "Разблокировать для синхронизации",
    badgeLockedSource: "Заблокировано",
    scheduleLockedNotice: "Расписание '{name}' заблокировано от изменений при синхронизации.",
    scheduleUnlockedNotice: "Расписание '{name}' разблокировано и будет синхронизироваться штатно.",
    allSchedulesLockedNotice: "Все расписания заблокированы. Разблокируйте хотя бы одно для синхронизации.",
    btnHideSource: "Скрыть занятия из календаря",
    btnShowSource: "Показывать занятия в календаре",
    badgeHiddenSource: "Скрыто",
    scheduleHiddenNotice: "Расписание '{name}' скрыто.",
    scheduleShownNotice: "Расписание '{name}' теперь отображается.",
    btnDeleteSource: "Удалить расписание",
    scheduleRemovedNotice: "Расписание удалено: {name}",
    btnExportIcs: "Экспортировать очищенный календарь (.ics)",
    exportIcsDesc: "Экспортирует все активные и неисключенные пары в чистый файл .ics в ваше хранилище.",
    exportSuccess: "Экспортировано {count} занятий в: {path}",
    exportEmptyError: "Нет занятий для экспорта. Сначала добавьте расписание.",
    syncStartupName: "Автосинхронизация при запуске",
    syncStartupDesc: "Автоматически обновлять расписания из Интернета при запуске Obsidian.",
    btnCancelEdit: "Отмена",
    btnShowCalNameOnEvents: "Показывать имя календаря на карточках пар",
    btnHideCalNameOnEvents: "Скрыть имя календаря на карточках пар",
    calNameShownNotice: "Имя календаря будет отображаться для '{name}'.",
    calNameHiddenNotice: "Имя календаря скрыто для '{name}'.",
    badgeCalNameShown: "Имя видно",
    notesFolderCardTitle: "Папки и сохранение в хранилище",
    notesTemplateSectionTitle: "Шаблон конспекта занятия",
    notesSettingsTitle: "Заметки & Шаблоны",
    notesSettingsDesc: "Настройте шаблон конспектов, структуру папок предметов и формат имен файлов.",
    settingDisableNoteClickName: "Отключить открытие конспекта по клику на пару",
    settingDisableNoteClickDesc: "Предотвращает открытие или создание конспекта при клике по карточке пары на шкале дня.",
    baseFolderSetting: "Базовая папка предметов",
    baseFolderDesc: "Корневая папка в хранилище, в которой будут создаваться папки предметов (оставьте пустым для корня хранилища).",
    baseFolderPlaceholder: "напр. Учеба или Университет",
    optVaultRoot: "Корень хранилища (без базовой папки)",
    dateFormatSetting: "Формат даты",
    dateFormatDesc: "Используется в именах файлов конспектов и в переменной {date}.",
    dateFormatExample: "Пример: {sample}",
    noteNameFormatSetting: "Формат имени файла конспекта",
    noteNameFormatDesc: "Доступные переменные: {date}, {subject}, {room}, {lecturer}, {type}.",
    templateHeader: "Содержимое шаблона заметки",
    templateDesc: "Шаблон, применяемый при создании нового конспекта. Поддерживает Markdown и свойства Obsidian (YAML).",
    btnOpenTemplateBuilder: "Открыть визуальный редактор шаблонов",
    builderModalTitle: "Визуальный конструктор шаблона конспекта",
    builderModalDesc: "Настройте шаблон конспекта с предпросмотром в реальном времени и перетаскиваемыми переменными.",
    builderPresetsLabel: "Готовые пресеты",
    presetStandard: "📋 Стандартный",
    presetProperties: "📊 Свойства Obsidian (YAML)",
    presetMinimal: "📌 Минималистичный",
    presetBlank: "📄 Пустая заметка",
    builderChipsLabel: "Доступные переменные из вашего расписания (кликните или перетащите в редактор):",
    builderChipTooltip: "Нажмите для вставки или перетащите в шаблон: {desc}",
    builderEditorLabel: "Редактор шаблона (Markdown / YAML)",
    builderPreviewLabel: "Предпросмотр с реальными данными пары",
    builderBlankPreview: "Шаблон пуст. Введите текст или вставьте переменные выше.",
    btnSaveTemplate: "Сохранить шаблон",
    templateSavedNotice: "Шаблон конспекта успешно сохранен!",
    sampleSubject: "Информатика и программирование",
    sampleRoom: "Ауд. 204",
    sampleLecturer: "Проф. Иванов",
    sampleDesc: "Группа 1 - Алгоритмы и структуры данных",
    langTitle: "Язык",
    langDesc: "Выберите язык интерфейса для календаря, дней недели, шкалы занятий и настроек.",
    langSelectLabel: "Язык интерфейса",
    regionTitle: "Региональные форматы",
    regionDesc: "Настройте формат даты, первый день недели и формат времени (24ч / 12ч).",
    firstDayOfWeekSetting: "Первый день недели",
    firstDayOfWeekDesc: "Выберите, с какого дня начинается неделя в календаре: с понедельника или воскресенья.",
    firstDayMonday: "Понедельник",
    firstDaySunday: "Воскресенье",
    timeFormatSetting: "Формат времени",
    timeFormatDesc: "Выберите 24-часовой формат (14:30) или 12-часовой AM/PM (2:30 PM).",
    timeFormat24h: "24-часовой (14:30)",
    timeFormat12h: "12-часовой AM/PM (2:30 PM)",
    mappingTitle: "Привязка предметов к папкам хранилища",
    mappingDesc: "Свяжите предметы из расписания с папками вашего хранилища. Заметки к парам будут автоматически сохраняться в нужные папки.",
    colSubject: "Предмет / Дисциплина",
    colFolder: "Папка в хранилище",
    optAutoMatch: "Привязать папку автоматически",
    optAutoMatchFound: "Автоматически (найдена: {folder})",
    optNotFoundAuto: "Без папки (создавать при открытии)",
    optCreateNewFolder: "➕ Создать новую папку...",
    optNoFolder: "🚫 Без папки (игнорировать предмет)",
    cleanSubjectNamesSetting: "Очищать названия предметов",
    cleanSubjectNamesDesc: "Удаляет пометки (лек), (лаб), [W], (сем) и слова экзаменов при предложении имен папок и файлов.",
    autoFindFolderSetting: "Автопоиск существующих папок",
    autoFindFolderDesc: "Ищет в хранилище папку с подходящим именем предмета, если не задана ручная привязка.",
    autoMatchedTo: "Автоматически привязано к: {folder}",
    statusManuallyMapped: "Вручную привязано",
    statusIgnored: "Игнорируется (без папки)",
    noMatchFound: "Подходящая папка не найдена",
    folderCreatedAndAssignedNotice: "Создана папка '{folder}' и привязана к предмету '{subject}'.",
    noSubjectsFound: "В расписании не найдено предметов. Сначала добавьте расписание.",
    exclusionsTitle: "Исключенные предметы & Фильтры",
    exclusionsDesc: "Скройте предметы или подгруппы, на которые вы не ходите. Они не будут отображаться в календаре и экспорте.",
    detectedSubjects: "Обнаруженные предметы (переключите для исключения)",
    keywordsTitle: "Ключевые слова для фильтрации",
    keywordsDesc: "Любая пара, название или описание которой содержит это слово, будет скрыта.",
    keywordsPlaceholder: "Введите ключевое слово (напр. Подгруппа 2, Физкультура)...",
    btnAddKeyword: "Добавить ключевое слово",
    btnEditKeyword: "Изменить",
    btnSaveKeyword: "Сохранить",
    btnDeleteKeyword: "Удалить",
    noKeywordsText: "Ключевые слова фильтрации не заданы.",
    excludeToggleOn: "Предмет исключен (нажмите для отображения)",
    excludeToggleOff: "Предмет отображается (нажмите для исключения)",
    colorsTitle: "Категории занятий & Цвета",
    colorsDesc: "Настройте названия и цвета бейджей. Плагин автоматически классифицирует пары по ключевым словам.",
    categoryNamePlaceholder: "По умолчанию: {default}",
    btnResetColors: "Сбросить цвета по умолчанию",
    errHttpStatus: "Сервер ответил ошибкой {status}: {text}",
    errHttp401Google: "Ошибка 401 (Нет доступа к Google Календарю): Интернет-календари должны быть общедоступными, ЛИБО скопируйте внизу настроек Google Календаря «Закрытый адрес в формате iCal» (.ics), либо загрузите файл .ics вручную.",
    errHttp401General: "Ошибка {status} (Не авторизовано): Публикуемые в сети календари должны быть открытыми. Сделайте календарь общедоступным или загрузите файл .ics с диска.",
    errNoScheduleSource: "Добавьте ссылку на расписание в настройках или загрузите файл .ics с диска.",
    errInvalidIcsContent: "Загруженные данные не содержат корректного календаря iCal/ICS.",
    errCreateNote: "Ошибка при создании заметки: {message}",
    conditionalRuleBuilderTitle: "Конструктор условных исключений (Если предмет ➔ Исключить преподавателя / слово)",
    conditionalRuleBuilderDesc: "Позволяет скрыть конкретного преподавателя или подгруппу только в рамках одного предмета (в других предметах этот преподаватель останется видимым).",
    selectSubjectPlaceholder: "Выберите предмет...",
    conditionalKwPlaceholder: "Фамилия преподавателя или слово для исключения...",
    btnAddConditionalRule: "+ Добавить условное правило",
    ruleIfPrefix: "Если",
    ruleExcludePrefix: "Исключить",
    ruleAllPrefix: "Все слова",
    noticeSelectSubjectFirst: "Пожалуйста, сначала выберите предмет из списка.",
    noticeEnterKeywordFirst: "Введите ключевое слово или фамилию преподавателя для исключения.",
    scheduleBtnTitle: "Расписание предмета (все занятия)",
    scheduleBtnLabel: "Расписание",
    scheduleStatTotal: "{count} всего",
    scheduleStatPast: "{count} завершено",
    scheduleStatUpcoming: "{count} осталось",
    filterAll: "Все ({count})",
    filterUpcoming: "Предстоящие ({count})",
    filterPast: "Прошедшие ({count})",
    nextSessionBadge: "Следующее занятие",
    allSessionsHeading: "Хронология всех занятий",
    noSessionsFoundForCourse: "Занятия по этому предмету не найдены.",
    statusOngoing: "Идет сейчас",
    statusNext: "Следующее",
    statusPast: "Завершено",
    statusFuture: "Запланировано",
    statusCancelled: "Занятие отменено",
    btnJumpToDayInCalendar: "Показать в расписании",
    btnViewInSchedule: "Показать день",
    btnOpenNote: "Заметка",
    btnCreateNoteShort: "Заметка",
    btnOpenCourseHub: "Папка предмета",
    badgeOpenNoteTooltip: "Нажмите, чтобы открыть заметку",
    badgeCreateNoteTooltip: "Нажмите, чтобы создать заметку",
    badgeMapFolderTooltip: "Нажмите, чтобы назначить папку",
    courseHubNotFound: "Папка предмета не найдена. Назначьте папку в настройках или сначала создайте заметку.",
    courseHubCreated: "Заметка по предмету создана: {path}",
    countdownOngoing: "Занятие идет прямо сейчас",
    countdownToday: "Сегодня в {time}",
    countdownTomorrow: "Завтра в {time}",
    countdownInDays: "Через {days} дн.",
    allSessionsCompleted: "Все запланированные занятия по этому предмету уже завершились."
  },
  pl: {
    allCalendars: "Wszystkie kalendarze",
    filterCalendarLabel: "Dotyczy kalendarza",
    btnCollapse: "Zwiń",
    btnExpand: "Rozwiń",
    calendarCoursesCount: "{count} przedmiotów",
    noCoursesInCalendar: "Brak wykrytych przedmiotów w tym kalendarzu.",
    viewTitle: "Harmonogram & Kalendarz",
    ribbonTitle: "Otwórz harmonogram uczelniany",
    commandOpen: "Otwórz kalendarz uczelniany w panelu bocznym",
    commandSync: "Odśwież harmonogram z uczelni",
    commandExportIcs: "Eksportuj oczyszczony kalendarz (.ics)",
    today: "Dzisiaj",
    prevMonth: "Poprzedni miesiąc",
    nextMonth: "Następny miesiąc",
    refreshSchedule: "Odśwież harmonogram z uczelni",
    refreshSuccess: "Harmonogram zaktualizowany! Liczba zajęć: {count}",
    refreshError: "Błąd pobierania planu: ",
    weekdaysShort: ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
    weekdaysFull: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    monthsGenitive: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"],
    noClasses: "Brak zajęć",
    oneClass: "1 zajęcia",
    fewClasses: "{count} zajęcia",
    manyClasses: "{count} zajęć",
    emptyScheduleTitle: "Brak zaplanowanych zajęć w tym dniu.",
    emptyScheduleDesc: "Ciesz się wolnym czasem lub powtórz materiał!",
    remainingMin: "Pozostało {min} min",
    allDay: "Cały dzień",
    noteExists: "Notatka istnieje",
    missingNote: "Brak notatki",
    openNoteHint: "Otwórz notatkę",
    createNoteHint: "Kliknij, aby utworzyć notatkę",
    noFolderBadge: "Brak folderu",
    createFolderHint: "Kliknij, aby utworzyć folder i notatkę",
    subjectIgnoredNotice: "Ten przedmiot jest oznaczony w ustawieniach jako ignorowany (brak folderu).",
    defaultCourseName: "Przedmiot",
    defaultCalendarName: "Kalendarz",
    noInfo: "Brak informacji",

    // Modal Note (folder exists)
    modalCreateTitle: "Utworzyć nową notatkę z zajęć?",
    modalCreateDesc: "Nie ma jeszcze notatki na dzień {date} dla przedmiotu:",
    modalTargetLoc: "Docelowa lokalizacja pliku w skarbcu:",
    modalCancel: "Anuluj",
    modalCreateBtn: "Utwórz notatkę",
    noteCreatedNotice: "Utworzono notatkę: {path}",
    noteOpenedNotice: "Otwarto notatkę: {name}",

    // Modal Folder & Note (folder does not exist)
    modalCreateFolderTitle: "Nie znaleziono folderu dla tego przedmiotu",
    modalCreateFolderDesc: "W Twoim notatniku nie ma jeszcze folderu dla przedmiotu:",
    modalCreateFolderPrompt: "Czy chcesz utworzyć nowy folder i pierwszą notatkę na dzień {date}?",
    modalFolderInputLabel: "Nazwa lub ścieżka nowego folderu:",
    modalNotePreviewLabel: "Lokalizacja nowej notatki:",
    modalCreateFolderBtn: "Utwórz folder i notatkę",
    folderAndNoteCreatedNotice: "Utworzono folder '{folder}' oraz notatkę: {path}",

    // Class types
    typeLecture: "Wykład",
    typeExercises: "Ćwiczenia",
    typeLab: "Laboratorium",
    typeLanguage: "Lektorat",
    typeLanguageExam: "Lektorat (Egzamin)",
    typeProject: "Projekt",
    typeSeminar: "Seminarium",
    typeExam: "Egzamin",
    typeOther: "Inne zajęcia",

    // Settings tabs
    settingTimelineGapsTitle: "Przerwy i okienka w harmonogramie",
    settingShowTimelineGapsName: "Pokaż okienka / przerwy na osi dnia",
    settingShowTimelineGapsDesc: "Wyświetla wskaźniki przerw między zajęciami na osi dnia (automatycznie uwzględnia wykluczone przedmioty).",
    timelineBreakTooltip: "Przerwa między zajęciami: {time}",
    cardAppearanceTitle: "Przerwy i okienka w harmonogramie",
    cardAppearanceDesc: "Skonfiguruj wykrywanie i wygląd okienek oraz przerw między zajęciami na osi dnia.",
    cardCategoriesTitle: "Kategorie zajęć i kolory",
    cardCategoriesDesc: "Dostosuj własne nazwy kategorii, próbniki kolorów oraz sprawdź, z których kalendarzy pochodzi dany kafelek.",
    breakStyleLabel: "Wygląd wskaźnika przerwy",
    breakStylePill: "Dyskretna pigułka z przerywaną linią",
    notesFolderCardTitle: "Dedykowane foldery dla przedmiotów",
    notesTemplateSectionTitle: "Szablon zawartości notatki",
    notesSettingsDesc: "Domyślny folder zapisu oraz format nazwy plików dla notatek tworzonych po kliknięciu w zajęcia.",
    notesSettingsTitle: "Ustawienia plików notatek z zajęć",
    settingDisableNoteClickName: "Wyłącz otwieranie notatek po kliknięciu w zajęcia",
    settingDisableNoteClickDesc: "Kliknięcie w zajęcia w harmonogramie nie będzie otwierać ani tworzyć notatek. Kafelki działają w trybie czystego kalendarza (ukryte zostają również plakietki tworzenia notatek). Domyślnie wyłączone.",
    breakCardDefaultTitle: "Przerwa między zajęciami",
    breakStyleCard: "Karta jak inne wydarzenia w kalendarzu",
    breakStyleLine: "Ikonka na linii osi czasu z minutami",
    breakStyleText: "Minimalistyczny tekst z linią",
    breakIconLabel: "Ikona wskaźnika przerwy",
    breakIconCoffee: "☕ Kawa (Coffee break)",
    breakIconFood: "🥪 Przekąska / Obiad",
    breakIconPause: "⏸️ Pauza",
    breakIconHourglass: "⏳ Czas wolny",
    breakIconWalk: "🚶 Spacer / Rozciąganie",
    breakIconBook: "📖 Książka / Nauka własna",
    breakIconMusic: "🎧 Muzyka / Relaks",
    breakIconSun: "☀️ Świeże powietrze / Słońce",
    breakIconMoon: "🌙 Odpoczynek",
    breakIconSpark: "⚡ Szybka przerwa",
    breakIconBattery: "🔋 Ładowanie baterii",
    breakIconClock: "🕒 Okienko / Zegar",
    breakIconLeaf: "🍃 Spokój / Natura",
    breakIconSmile: "😊 Odpoczynek & Relaks",
    breakMinMinutesLabel: "Minimalny czas trwania przerwy (min)",
    breakMinMinutesDesc: "Wskaźnik pojawi się tylko wtedy, gdy przerwa między zajęciami trwa co najmniej tyle minut.",
    breakMinMinutesPlaceholder: "np. 15",
    breakMaxMinutesLabel: "Maksymalny czas trwania przerwy (min)",
    breakMaxMinutesDesc: "Opcjonalny limit górny. Puste lub 0 oznacza brak ograniczenia maksymalnego.",
    breakMaxMinutesPlaceholder: "0 (brak limitu)",
    perCalendarGapsTitle: "Reguły przerw dla poszczególnych kalendarzy",
    perCalendarGapsDesc: "Ustaw różne czasy przerw i ikony dla poszczególnych kalendarzy (np. ze studiów vs prywatny).",
    enableCalendarGapOverride: "Osobne reguły przerw dla tego kalendarza",
    categoryUsedInCalendars: "Wykryto w",
    settingShowCoffeeIconName: "Pokaż ikonę kawy w nagłówku kalendarza",
    settingShowCoffeeIconDesc: "Wyświetla małą ikonę filiżanki kawy obok zębatki w górnym pasku kalendarza.",
    tabAbout: "Informacje",

    // Szybki start (Quick Start)
    qsTitle: "Szybki start — jak zacząć?",
    qsStep1Title: "Dodaj plan zajęć: ",
    qsStep1Desc: "W zakładce „Plany zajęć i synchronizacja” wklej bezpośredni link iCal/ICS ze swojej uczelni (np. USOSweb, Moodle, Kalendarz Google) lub wgraj pobrany z uczelni plik .ics.",
    qsStep2Title: "Dostosuj szablony i foldery: ",
    qsStep2Desc: "W zakładce „Notatki i szablony” przypisz foldery do przedmiotów i skonfiguruj szablon notatek w wizualnym kreatorze szablonu.",
    qsStep3Title: "Otwórz harmonogram w panelu bocznym: ",
    qsStep3Desc: "Kliknij ikonę biretu akademickiego 🎓 na lewym pasku bocznym Obsidiana — przeglądaj plan, śledź odliczanie do zajęć i twórz notatki jednym kliknięciem.",

    // Wybór języka
    langSelectName: "Język interfejsu",
    langSelectDesc: "Wybierz język wyświetlania wtyczki.",
    langAuto: "Automatyczny (systemowy)",

    // Jak działa wtyczka / Poradnik
    guideTitle: "Jak działa harmonogram uczelniany & Dobre praktyki",
    guide1Title: "Automatyczna synchronizacja z planem uczelni",
    guide1Desc: "Wtyczka pobiera i parsuje oficjalne plany zajęć w formacie iCalendar (iCal/ICS). Rozpoznaje wykłady, ćwiczenia, laboratoria, sale, wykładowców oraz odlicza czas do najbliższego wydarzenia.",
    guide2Title: "Zasada działania: Folder = Przedmiot, Plik = Notatka z zajęć",
    guide2Desc: "Kliknięcie w kafelek zajęć na osi czasu automatycznie tworzy lub otwiera dedykowaną notatkę z danego dnia w odpowiednim folderze przedmiotu, uzupełniając właściwości YAML (frontmatter) i treść notatki.",
    guide3Title: "Dobra praktyka: optymalna organizacja semestru",
    guide3Desc: "Aby uzyskać maksymalny komfort podczas nauki i codziennych zajęć, skorzystaj z wbudowanych mechanizmów:",
    guideBullet1: "🗂️ Dedykowany folder na każdy przedmiot: Przypisz przedmioty do folderów w notatniku, aby notatki z wykładów i laboratoriów trafiały wprost na swoje miejsce.",
    guideBullet2: "🚫 Inteligentne wykluczenia: Ukryj grupy ćwiczeniowe, na które nie chodzisz, lub wyklucz niepotrzebne zajęcia za pomocą słów kluczowych.",
    guideBullet3: "☕ Wskaźniki przerw i okienek: Włącz wykrywanie okienek między zajęciami na osi dnia z wybraną minimalną długością i ikoną.",
    guideCalloutTitle: "W praktyce: ",
    guideCalloutText: "Wchodzisz na salę wykładową, otwierasz Obsidian, klikasz w bieżące zajęcia na pasku bocznym i natychmiast notujesz w gotowym dokumencie — z salą, nazwiskiem prowadzącego i datą.",

    // Kawa i wsparcie
    coffeeBannerText: "Podoba Ci się wtyczka? Postaw mi kawę!",
    coffeeBannerSubtext: " Wspieraj rozwój i utrzymanie projektu.",
    coffeeBannerBtn: "Postaw mi kawę",
    coffeeBannerTitle: "Podoba Ci się wtyczka? Postaw mi kawę!",
    coffeeBannerDesc: "Wspieraj rozwój wtyczki, nowe funkcje oraz bieżące utrzymanie projektu.",
    btnBuyCoffee: "Postaw mi kawę",
    supportTitle: "Wesprzyj rozwój projektu",
    supportDesc: "Wtyczka jest całkowicie bezpłatna i otwartoźródłowa, rozwijana z pasją w wolnym czasie. Jeśli pomaga Ci w organizacji studiów i planu zajęć, postawienie kawy to wspaniały sposób, aby powiedzieć „dzięki” i wesprzeć dalszy rozwój!",
    supportBtnText: "Postaw mi kawę",
    hideSupportName: "Ukryj wsparcie",
    hideSupportDesc: "Ukrywa pasek wsparcia na samej górze ustawień oraz ikonę filiżanki kawy w nagłówku panelu bocznego.",

    // O projekcie
    linksTitle: "O projekcie",
    heroAuthor: "Twórca",
    linksGithub: "Repozytorium GitHub",
    linksIssues: "Zgłoś błąd lub propozycję",
    aboutPluginDesc: "Boczny pasek planu zajęć i kalendarza dla Obsidian z odliczaniem na żywo, wizualnym edytorem szablonów notatek, mapowaniem folderów i automatycznym linkowaniem notatek.",
    aboutAuthor: "Twórca",
    aboutSupportTitle: "Wesprzyj projekt",
    aboutSupportDesc: "Ta wtyczka jest całkowicie bezpłatna i otwartoźródłowa, tworzona z pasji w wolnym czasie. Jeśli ułatwia Ci organizację studiów lub codziennych zajęć, postawienie kawy to świetny sposób, aby podziękować i zmotywować do dalszego rozwoju!",
    aboutLinksTitle: "Przydatne linki",
    btnGithubRepo: "Repozytorium GitHub",
    btnReportIssue: "Zgłoś błąd lub propozycję",
    aboutQuickStartTitle: "Szybki start — jak zacząć?",
    aboutStep1: "Dodaj plan zajęć: W zakładce „Plany zajęć i synchronizacja” wklej bezpośredni link iCal/ICS ze swojej uczelni (np. USOSweb, Moodle, Kalendarz Google) lub wgraj pobrany z uczelni plik .ics.",
    aboutStep2: "Dostosuj szablony i wygląd: W zakładce „Notatki i szablony” skonfiguruj szablon notatki oraz foldery dla przedmiotów. W zakładce „Wygląd i kategorie” możesz dostosować kolory zajęć oraz czas trwania przerw i okienek.",
    aboutStep3: "Otwórz widok w panelu bocznym: Kliknij ikonę biretu akademickiego 🎓 na lewym pasku bocznym (ribbon) Obsidiana. Wtyczka wyświetli Twój plan zajęć, odliczanie do najbliższego wykładu oraz pozwoli tworzyć notatki jednym kliknięciem.",
    tabGeneral: "Plany zajęć i synchronizacja",
    tabLanguage: "Język i region",
    tabMapping: "Notatki i szablony",
    tabExclusions: "Wykluczenia",
    tabColors: "Wygląd i kategorie",

    // General tab & Multi-Schedule list
    settingsTitle: "Ustawienia Harmonogramu Uczelnianego",
    urlSettingName: "Dodaj plan zajęć",
    urlSettingDesc: "Wklej link do planu ze swojej uczelni (np. z USOS, Wirtualnego Dziekanatu, Moodle, Canvas lub Kalendarza Google) albo wgraj plik .ics z dysku. Uwaga: Kalendarze udostępniane z internetu przez link muszą być publiczne — w przeciwnym razie pobierz i dodaj ręcznie plik .ics z dysku.",
    publicCalendarTip: "💡 Jak dodać plan ze swojej uczelni:\n• USOSweb: Wejdź w Mój USOSweb → Kalendarz → Eksportuj kalendarz (iCal/ICS) i wklej wygenerowany link subskrypcji.\n• Moodle / Wirtualny Dziekanat: Przejdź do Kalendarza → Eksportuj kalendarz → Pobierz URL kalendarza.\n• Google Calendar / Outlook: W Google skopiuj „Tajny adres w formacie iCal” (.ics) z ustawień kalendarza; w Outlooku wybierz Ustawienia → Kalendarz → Udostępnione kalendarze → Publikuj kalendarz.\n• Jeśli Twoja uczelnia nie udostępnia linku subskrypcji: po prostu pobierz plik .ics ze swojego dziekanatu/portalu i kliknij „Dodaj plik z dysku (.ics)”.",
    urlPlaceholder: "https://usosweb.uczelnia.edu.pl/kalendarz.ics lub link Google/Canvas/Outlook",
    btnDownloadNow: "+ Dodaj z linku",
    btnDownloading: "Pobieranie...",
    btnUploadIcs: "Dodaj plik z dysku (.ics)",
    uploadIcsDesc: "Wczytaj plik kalendarza (.ics) pobrany ze strony uczelni na dysk.",
    icsLoadedSuccess: "Dodano plan '{name}'! Łączna liczba zajęć: {count}",
    invalidIcsError: "Wybrany plik nie zawiera poprawnego kalendarza iCal/ICS.",
    fileLoadError: "Błąd wczytywania pliku: ",
    addedSchedulesTitle: "Dodane plany zajęć",
    noSchedulesAdded: "Brak dodanych planów zajęć. Wklej link powyżej lub wybierz plik .ics z dysku.",
    scheduleTypeUrl: "Link internetowy",
    scheduleTypeFile: "Plik .ics z dysku",
    btnRefreshSource: "Odśwież",
    btnRenameSource: "Zmień nazwę planu",
    renameSourcePlaceholder: "Wpisz nazwę kalendarza...",
    scheduleRenamedNotice: "Zmieniono nazwę planu na: {name}",
    errDuplicateCalendarName: "Kalendarz o nazwie „{name}” już istnieje. Wybierz unikalną nazwę, aby uniknąć pomyłek.",
    btnLockSource: "Zablokuj aktualizację (nie odświeżaj tego kalendarza)",
    btnUnlockSource: "Odblokuj aktualizację kalendarza",
    badgeLockedSource: "🔒 Zablokowany",
    scheduleLockedNotice: "Zablokowano aktualizację planu: {name}",
    scheduleUnlockedNotice: "Odblokowano aktualizację planu: {name}",
    allSchedulesLockedNotice: "Wszystkie plany są zablokowane przed aktualizacją. Odblokuj plan w ustawieniach, aby go odświeżyć.",
    btnHideSource: "Ukryj",
    btnShowSource: "Pokaż",
    badgeHiddenSource: "Ukryty",
    scheduleHiddenNotice: "Ukryto plan: {name}",
    scheduleShownNotice: "Przywrócono widoczność planu: {name}",
    btnDeleteSource: "Usuń",
    scheduleRemovedNotice: "Usunięto plan zajęć: {name}",
    btnExportIcs: "Eksportuj plan (.ics)",
    exportIcsDesc: "Zapisuje Twój połączony plan (bez przedmiotów, które wykluczyłeś) do pliku schedule-export.ics w Twoim notatniku. Możesz go wrzucić do kalendarza w telefonie!",
    exportSuccess: "Wyeksportowano oczyszczony kalendarz do: {path}",
    exportEmptyError: "Brak zajęć do wyeksportowania. Dodaj najpierw harmonogram.",
    syncStartupName: "Aktualizuj plany przy otwieraniu Obsidian",
    syncStartupDesc: "Gdy włączone, wtyczka sama sprawdza po uruchomieniu programu, czy w dodanych linkach do planów nie pojawiły się zmiany.",
    urlSettingDescShort: "Dodaj swój plan zajęć z linku subskrypcji iCal/ICS (np. USOS, Wirtualny Dziekanat, Moodle, Kalendarz Google, Outlook) lub wgraj pobrany plik .ics z dysku.",
    btnCancelEdit: "Anuluj",
    btnShowCalNameOnEvents: "Pokazuj nazwę tego kalendarza przy wydarzeniach",
    btnHideCalNameOnEvents: "Ukryj nazwę tego kalendarza przy wydarzeniach",
    calNameShownNotice: "Włączono wyświetlanie nazwy kalendarza przy wydarzeniach: {name}",
    calNameHiddenNotice: "Wyłączono wyświetlanie nazwy kalendarza przy wydarzeniach: {name}",
    badgeCalNameShown: "🏷️ Nazwa widoczna",
    confirmDeleteScheduleTitle: "Usunąć plan zajęć?",
    confirmDeleteScheduleDesc: "Czy na pewno chcesz trwale usunąć kalendarz „{name}”? (Wskazówka: możesz też tymczasowo ukryć kalendarz ikoną oka bez jego usuwania.)",
    baseFolderSetting: "Główny folder na przedmioty (opcjonalnie)",
    baseFolderDesc: "Wybierz z listy główny katalog, w którym trzymasz foldery z przedmiotami (np. 'Studia'). Jeśli foldery przedmiotów masz bezpośrednio w głównym notatniku, wybierz 'Główny katalog notatnika'.",
    baseFolderPlaceholder: "np. Studia (lub zostaw puste)",
    optVaultRoot: "📂 Główny katalog notatnika (brak podfolderu)",

    // Date & Note naming & template
    dateFormatSetting: "Format zapisu daty",
    dateFormatDesc: "Wybierz sposób zapisu daty w nazwach i treści notatek.",
    dateFormatExample: "np.",
    noteNameFormatSetting: "Format nazwy nowej notatki",
    noteNameFormatDesc: "Wzór nazwy pliku dla nowych notatek. Domyślnie: {date} - {subject} (np. 2026-11-14 - Informatyka.md).\nDostępne znaczniki: {date}, {subject}, {type}, {time}.",
    templateHeader: "Treść nowo tworzonej notatki",
    templateDesc: "Tekst wstawiany do nowego pliku po kliknięciu w zajęcia. Jeśli zostawisz to pole całkowicie puste, wtyczka utworzy czysty, pusty plik.",
    btnOpenTemplateBuilder: "🎨 Otwórz kreator szablonu notatki",

    // Visual Template Builder Modal
    builderModalTitle: "Kreator szablonu notatki z zajęć",
    builderModalDesc: "Zbuduj swój idealny szablon notatki! Kliknij dowolny kafelek ze zmienną lub przeciągnij go do edytora poniżej. W podglądzie na żywo zobaczysz, jak będzie wyglądać Twoja notatka z prawdziwymi danymi z planu.",
    builderPresetsLabel: "Szybkie gotowe szablony:",
    presetStandard: "📋 Standardowy",
    presetProperties: "📊 Z właściwościami (YAML)",
    presetMinimal: "📌 Minimalistyczny",
    presetBlank: "📄 Pusta notatka",
    builderChipsLabel: "Dostępne zmienne z Twojego harmonogramu (kliknij lub przeciągnij do edytora):",
    builderChipTooltip: "Kliknij, aby wstawić lub przeciągnij do edytora",
    builderEditorLabel: "Edytor szablonu Markdown:",
    builderPreviewLabel: "Podgląd na żywo z danymi z planu:",
    builderBlankPreview: "📄 (Notatka będzie całkowicie pusta)",
    btnSaveTemplate: "Zapisz szablon",
    templateSavedNotice: "Pomyślnie zapisano szablon notatki!",
    sampleSubject: "Informatyka",
    sampleRoom: "Sala 204",
    sampleLecturer: "dr Jan Kowalski",
    sampleDesc: "Grupa A - Lab 2",

    // Language & Region tab
    langTitle: "Język wtyczki",
    langDesc: "Wtyczka działa w języku polskim (kalendarz, dni tygodnia, harmonogram i ustawienia).",
    langSelectLabel: "Język interfejsu",
    regionTitle: "Region i formatowanie",
    regionDesc: "Dostosuj format zapisu daty, pierwszy dzień tygodnia w kalendarzu oraz format zegara (24-godzinny lub 12-godzinny AM/PM) do swojego regionu.",
    firstDayOfWeekSetting: "Pierwszy dzień tygodnia",
    firstDayOfWeekDesc: "Wybierz, czy siatka kalendarza miesięcznego ma zaczynać się od poniedziałku czy od niedzieli.",
    firstDayMonday: "Poniedziałek",
    firstDaySunday: "Niedziela",
    timeFormatSetting: "Format czasu (Zegar)",
    timeFormatDesc: "Wyświetlaj godziny zajęć na osi czasu i w notatkach w formacie 24-godzinnym (14:30) lub 12-godzinnym AM/PM (2:30 PM).",
    timeFormat24h: "24-godzinny (14:30)",
    timeFormat12h: "12-godzinny AM/PM (2:30 PM)",

    // Mapping tab
    mappingTitle: "Przypisanie przedmiotów do folderów",
    mappingDesc: "Wybierz, do którego folderu w notatniku mają trafiać notatki z danego przedmiotu. Jeśli wtyczka nie znalazła folderu automatycznie, możesz wybrać go ręcznie z listy lub kliknąć 'Stwórz nowy folder', aby wtyczka sama go utworzyła i przypisała.",
    colSubject: "Przedmiot w planie",
    colFolder: "Folder w notatniku",
    optAutoMatch: "⚡ Automatyczne dopasowanie",
    optAutoMatchFound: "⚡ Automatyczne dopasowanie ({folder})",
    optNotFoundAuto: "⚠️ Nie znaleziono automatycznie — wybierz lub stwórz",
    optCreateNewFolder: "➕ Stwórz nowy folder ({folder}) i przypisz",
    optNoFolder: "🚫 Brak folderu (ignoruj ten przedmiot)",
    cleanSubjectNamesSetting: "Inteligentne skracanie nazw",
    cleanSubjectNamesDesc: "Automatycznie usuwa dopiski typu '(wyk)', '(ćw)', '[W]' przy szukaniu odpowiedniego folderu (np. dla 'Psychologia (wyk)' wyszuka folder 'Psychologia').",
    autoFindFolderSetting: "Automatycznie dopasowuj istniejące foldery",
    autoFindFolderDesc: "Wtyczka sama przeszukuje notatnik i dopasowuje folder, jeśli ma taką samą lub bardzo podobną nazwę jak przedmiot w planie.",
    autoMatchedTo: "Dopasowano automatycznie do:",
    statusManuallyMapped: "Przypisano do:",
    statusIgnored: "Ignorowany (brak folderu)",
    noMatchFound: "Nie znaleziono automatycznie",
    folderCreatedAndAssignedNotice: "Utworzono i przypisano nowy folder: {folder}",
    noSubjectsFound: "Nie wykryto jeszcze żadnych przedmiotów. Dodaj najpierw plan w zakładce „Plany zajęć i synchronizacja”.",

    // Exclusions tab
    exclusionsTitle: "Wykluczanie przedmiotów z planu",
    exclusionsDesc: "Wyłącz przedmioty, na które nie chodzisz (np. druga grupa językowa lub WF). Wybrane zajęcia natychmiast znikną z kalendarza, kropek i osi czasu.",
    detectedSubjects: "Wykryte przedmioty w Twoim planie:",
    keywordsTitle: "Słowa kluczowe i reguły wykluczeń",
    keywordsDesc: "Wpisz słowo (np. 'Grupa B' albo 'WF') lub wpisz regułę warunkową np. 'jeśli Statystyka wyklucz Oczeretko'. Możesz też skorzystać z poniższego kreatora.",
    keywordsPlaceholder: "np. WF, Grupa B lub jeśli Statystyka wyklucz Oczeretko...",
    btnAddKeyword: "+ Dodaj",
    btnEditKeyword: "Edytuj",
    btnSaveKeyword: "Zapisz",
    btnDeleteKeyword: "Usuń",
    noKeywordsText: "Brak zdefiniowanych słów kluczowych lub reguł wykluczeń.",
    conditionalRuleBuilderTitle: "Kreator reguły warunkowej (Jeśli przedmiot ➔ Wyklucz prowadzącego / słowo)",
    conditionalRuleBuilderDesc: "Pozwala wykluczyć konkretnego prowadzącego lub zajęcia tylko z jednego wskazanego przedmiotu (pozostałe przedmioty z tym prowadzącym pozostaną widoczne).",
    selectSubjectPlaceholder: "Wybierz przedmiot...",
    conditionalKwPlaceholder: "Nazwisko prowadzącego lub słowo do wykluczenia (np. Oczeretko)...",
    btnAddConditionalRule: "+ Dodaj regułę warunkową",
    ruleIfPrefix: "Jeśli",
    ruleExcludePrefix: "Wyklucz",
    ruleAllPrefix: "Wszystkie słowa",
    noticeSelectSubjectFirst: "Wybierz najpierw przedmiot z listy.",
    noticeEnterKeywordFirst: "Wpisz słowo kluczowe lub nazwisko prowadzącego do wykluczenia.",
    excludeToggleOn: "Wykluczony (ukryty z planu)",
    excludeToggleOff: "Widoczny w planie",

    // Categories & Colors tab
    colorsTitle: "Edycja kategorii zajęć i kolorów",
    colorsDesc: "Możesz zmienić wyświetlaną nazwę oraz kolor dla każdej kategorii zajęć (np. zmienić 'Lektorat (Egzamin)' na własną nazwę). Zostaw pole tekstowe puste, aby używać nazwy domyślnej.",
    categoryNamePlaceholder: "Własna nazwa (domyślnie: {default})",
    btnResetColors: "Przywróć domyślne nazwy i kolory",

    // Errors
    errHttpStatus: "Serwer uczelni zwrócił błąd HTTP {status}",
    errHttp401Google: "Błąd 401 (Brak dostępu do Kalendarza Google): Kalendarze udostępniane z internetu muszą być publiczne (w ustawieniach Kalendarza Google zaznacz „Udostępnij publicznie → Zobacz wszystkie szczegóły wydarzeń”), LUB skopiuj na dole ustawień Google „Tajny adres w formacie iCal” (.ics), albo pobierz i dodaj ręcznie plik .ics z dysku.",
    errHttp401General: "Błąd {status} (Brak autoryzacji): Kalendarze udostępniane z internetu muszą być publiczne. Udostępnij kalendarz publicznie lub pobierz i dodaj ręcznie plik .ics z dysku.",
    errNoScheduleSource: "Dodaj link do planu w ustawieniach lub wczytaj plik .ics z dysku.",
    errInvalidIcsContent: "Pobrana zawartość nie zawiera poprawnego kalendarza iCal/ICS.",
    errCreateNote: "Błąd podczas tworzenia notatki: {message}",
    emptyNoSourcesTitle: "Brak dodanego planu zajęć",
    emptyNoSourcesDesc: "Dodaj bezpośredni link iCal ze swojej uczelni (np. USOSweb, Moodle, Kalendarz Google) lub wgraj plik .ics w ustawieniach, aby zobaczyć swoje zajęcia i odliczanie.",
    btnAddScheduleSettings: "Otwórz ustawienia i dodaj plan",
    dateHeaderTemplate: "{dayName}, {dayNum} {month} {year}",
    scheduleBtnTitle: "Harmonogram przedmiotu (wszystkie terminy)",
    scheduleBtnLabel: "Harmonogram",
    scheduleStatTotal: "{count} łącznie",
    scheduleStatPast: "{count} odbytych",
    scheduleStatUpcoming: "{count} nadchodzących",
    filterAll: "Wszystkie ({count})",
    filterUpcoming: "Nadchodzące ({count})",
    filterPast: "Odbyte ({count})",
    nextSessionBadge: "Najbliższe kolejne zajęcia",
    allSessionsHeading: "Harmonogram wszystkich zjazdów",
    noSessionsFoundForCourse: "Brak wykrytych terminów dla tego przedmiotu.",
    statusOngoing: "Trwa teraz",
    statusNext: "Najbliższe",
    statusPast: "Odbyte",
    statusFuture: "Zaplanowane",
    statusCancelled: "Zajęcia odwołane",
    btnJumpToDayInCalendar: "Pokaż w planie",
    btnViewInSchedule: "Pokaż w planie",
    btnOpenNote: "Notatka",
    btnCreateNoteShort: "Notatka",
    btnOpenCourseHub: "Przejdź do przedmiotu",
    badgeOpenNoteTooltip: "Kliknij, aby otworzyć notatkę",
    badgeCreateNoteTooltip: "Kliknij, aby utworzyć nową notatkę",
    badgeMapFolderTooltip: "Kliknij, aby przypisać folder przedmiotu",
    courseHubNotFound: "Nie znaleziono folderu przedmiotu. Przypisz folder w ustawieniach lub utwórz najpierw notatkę.",
    courseHubCreated: "Utworzono notatkę przedmiotu: {path}",
    countdownOngoing: "Zajęcia trwają teraz",
    countdownToday: "Dzisiaj o {time}",
    countdownTomorrow: "Jutro o {time}",
    countdownInDays: "Za {days} dni",
    allSessionsCompleted: "Wszystkie zaplanowane zajęcia z tego przedmiotu już się odbyły."
  }
};

const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es", "zh", "ja", "ko", "pt", "it", "ru", "pl"];

function getLang(plugin) {
  if (plugin && plugin.settings && plugin.settings.language && plugin.settings.language !== "auto") {
    return plugin.settings.language;
  }
  let loc = "";
  if (typeof window !== "undefined") {
    if (window.localStorage) {
      loc = window.localStorage.getItem("language") || "";
    }
    if (!loc && window.moment && typeof window.moment.locale === "function") {
      loc = window.moment.locale() || "";
    }
  }
  if (!loc && typeof navigator !== "undefined" && navigator.language) {
    loc = navigator.language || "";
  }
  loc = (loc || "en").toLowerCase();

  if (loc.startsWith("pl")) return "pl";
  if (loc.startsWith("de")) return "de";
  if (loc.startsWith("fr")) return "fr";
  if (loc.startsWith("es")) return "es";
  if (loc.startsWith("zh")) return "zh";
  if (loc.startsWith("ja")) return "ja";
  if (loc.startsWith("ko")) return "ko";
  if (loc.startsWith("pt")) return "pt";
  if (loc.startsWith("it")) return "it";
  if (loc.startsWith("ru")) return "ru";
  return "en";
}

function getObsidianLanguage() {
  return getLang(null);
}

function getEffectiveLanguage(plugin) {
  return getLang(plugin);
}

function t(pluginOrKey, keyOrParams, maybeParams = {}) {
  let plugin = null;
  let key = "";
  let params = {};
  if (typeof pluginOrKey === "string") {
    key = pluginOrKey;
    params = keyOrParams && typeof keyOrParams === "object" ? keyOrParams : {};
  } else {
    plugin = pluginOrKey;
    key = keyOrParams;
    params = maybeParams && typeof maybeParams === "object" ? maybeParams : {};
  }
  const lang = getLang(plugin);
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en || TRANSLATIONS.pl || {};
  let text = dict[key];
  if (text === undefined) {
    text = (TRANSLATIONS.en && TRANSLATIONS.en[key]) || (TRANSLATIONS.pl && TRANSLATIONS.pl[key]) || key;
  }
  if (typeof text === "string" && params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

function formatLocalizedDateHeader(plugin, dObj) {
  const fullWeekdays = t(plugin, "weekdaysFull");
  const monthsGenitive = t(plugin, "monthsGenitive");
  const monthsStandard = t(plugin, "months");

  const dayName = Array.isArray(fullWeekdays) ? fullWeekdays[dObj.getDay()] : "";
  const dayNum = dObj.getDate();
  const monthGen = Array.isArray(monthsGenitive) ? monthsGenitive[dObj.getMonth()] : (Array.isArray(monthsStandard) ? monthsStandard[dObj.getMonth()] : "");
  const year = dObj.getFullYear();

  const tmpl = t(plugin, "dateHeaderTemplate");
  if (tmpl && tmpl !== "dateHeaderTemplate" && tmpl.includes("{")) {
    return tmpl
      .replace(/\{dayName\}/g, dayName)
      .replace(/\{dayNum\}/g, String(dayNum))
      .replace(/\{month\}/g, monthGen)
      .replace(/\{year\}/g, String(year));
  }

  return `${dayName}, ${dayNum} ${monthGen} ${year}`;
}

const DEFAULT_CLASS_COLORS = {
  wyklad: "#3b82f6",
  cwiczenia: "#10b981",
  laboratorium: "#8b5cf6",
  lektorat: "#06b6d4",
  lektorat_egzamin: "#0891b2",
  projekt: "#f59e0b",
  seminarium: "#ec4899",
  egzamin: "#ef4444",
  inne: "#6b7280"
};

const DEFAULT_SETTINGS = {
  language: "auto",
  dateFormat: "YYYY-MM-DD",
  firstDayOfWeek: "monday",
  timeFormat: "24h",
  calendarUrl: "",
  localIcsPath: "schedule.ics",
  scheduleSources: [],
  baseFolder: "",
  noteNameFormat: "{date} - {subject}",
  cleanSubjectNames: true,
  autoFindFolder: true,
  subjectFolderMappings: {},
  excludedSubjects: [],
  excludedKeywords: [],
  classColors: Object.assign({}, DEFAULT_CLASS_COLORS),
  classCustomNames: {},
  autoSyncOnStartup: true,
  showCoffeeIcon: true,
  showCoffeeBanner: true,
  hideSupport: false,
  activeTab: "about",
  showTimelineGaps: false,
  timelineGapThreshold: "15",
  timelineGaps: {
    enabled: false,
    style: "pill",
    icon: "coffee",
    minMinutes: 15,
    maxMinutes: 0,
    calendarOverrides: {}
  },
  disableNoteClick: false,
  lastSyncTimestamp: 0,
  cachedIcs: "",
  noteTemplate: DEFAULT_NOTE_TEMPLATES.en
};

// ==========================================================================
// Helpers: Date, String Formatting, Delayed Tooltips & Path Normalization
// ==========================================================================

let activeUniTooltipEl = null;
let activeUniTooltipTimer = null;

function clearActiveUniTooltip() {
  if (activeUniTooltipTimer) {
    clearTimeout(activeUniTooltipTimer);
    activeUniTooltipTimer = null;
  }
  if (activeUniTooltipEl) {
    activeUniTooltipEl.remove();
    activeUniTooltipEl = null;
  }
}

function attachDelayedTooltip(el, text, delayMs = 700) {
  if (!el || !text) return;
  el.removeAttribute("aria-label");
  el.removeAttribute("title");
  el.setAttribute("data-uni-tooltip", text);

  let hoverTimer = null;

  const showTooltip = () => {
    if (!el.isConnected) return;
    clearActiveUniTooltip();

    const doc = el.ownerDocument || document;
    const win = doc.defaultView || window;

    const tip = doc.body.createDiv({
      cls: "tooltip uni-delayed-tooltip",
      text: text
    });
    activeUniTooltipEl = tip;

    const rect = el.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let top = rect.top - tipRect.height - 8;
    if (top < 8) {
      top = rect.bottom + 8;
    }

    let left = rect.left + (rect.width / 2) - (tipRect.width / 2);
    const maxLeft = (win.innerWidth || 800) - tipRect.width - 8;
    if (left > maxLeft) left = maxLeft;
    if (left < 8) left = 8;

    tip.style.top = `${Math.round(top)}px`;
    tip.style.left = `${Math.round(left)}px`;
  };

  const cancelTooltip = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    clearActiveUniTooltip();
  };

  el.addEventListener("mouseenter", () => {
    cancelTooltip();
    hoverTimer = setTimeout(showTooltip, delayMs);
    activeUniTooltipTimer = hoverTimer;
  });

  el.addEventListener("mouseleave", cancelTooltip);
  el.addEventListener("mousedown", cancelTooltip);
  el.addEventListener("click", cancelTooltip);
  el.addEventListener("blur", cancelTooltip);
}

function normalizeVaultPath(p) {
  if (!p) return "";
  return normalizePath(p);
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDateFormatOptions(pluginOrLang) {
  const sampleKey = "2026-11-14";
  const formattedDMMMM = formatCustomDate(sampleKey, "D MMMM YYYY", pluginOrLang);
  const formattedDdddDMMMM = formatCustomDate(sampleKey, "dddd, D MMMM YYYY", pluginOrLang);

  return [
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2026-11-14)" },
    { value: "DD.MM.YYYY", label: "DD.MM.YYYY (14.11.2026)" },
    { value: "DD-MM-YYYY", label: "DD-MM-YYYY (14-11-2026)" },
    { value: "MM-DD-YYYY", label: "MM-DD-YYYY (11-14-2026)" },
    { value: "YYYY.MM.DD", label: "YYYY.MM.DD (2026.11.14)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (14/11/2026)" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (11/14/2026)" },
    { value: "YYYY/MM/DD", label: "YYYY/MM/DD (2026/11/14)" },
    { value: "YYYYMMDD",   label: "YYYYMMDD (20261114)" },
    { value: "DD.MM.YY",   label: "DD.MM.YY (14.11.26)" },
    { value: "DD-MM-YY",   label: "DD-MM-YY (14-11-26)" },
    { value: "MM-DD-YY",   label: "MM-DD-YY (11-14-26)" },
    { value: "YY-MM-DD",   label: "YY-MM-DD (26-11-14)" },
    { value: "D MMMM YYYY", label: `D MMMM YYYY (${formattedDMMMM})` },
    { value: "dddd, D MMMM YYYY", label: `dddd, D MMMM YYYY (${formattedDdddDMMMM})` },
    { value: "MMMM D, YYYY", label: `MMMM D, YYYY (${formatCustomDate(sampleKey, "MMMM D, YYYY")})` },
    { value: "dddd, MMMM D, YYYY", label: `dddd, MMMM D, YYYY (${formatCustomDate(sampleKey, "dddd, MMMM D, YYYY")})` }
  ];
}

function populateDateFormatDropdown(dropdown, currentVal, pluginOrLang) {
  const options = getDateFormatOptions(pluginOrLang);
  for (const opt of options) {
    dropdown.addOption(opt.value, opt.label);
  }
  dropdown.setValue(currentVal || "YYYY-MM-DD");
  return dropdown;
}

function normalizeKeywordRule(raw) {
  if (!raw) return null;
  let rawStr = "";
  let sourceId = "__ALL__";
  let subjectCondition = null;
  let keywordsAll = null;

  if (typeof raw === "string") {
    rawStr = raw.trim();
  } else if (typeof raw === "object") {
    rawStr = String(raw.keyword || "").trim();
    sourceId = raw.sourceId || "__ALL__";
    if (raw.subjectCondition) {
      subjectCondition = String(raw.subjectCondition).trim();
    }
    if (Array.isArray(raw.keywordsAll) && raw.keywordsAll.length > 0) {
      keywordsAll = raw.keywordsAll.map(k => String(k).trim()).filter(Boolean);
    }
  }

  if (!rawStr) return null;

  // If not already explicitly parsed, check for conditional and compound exclusion syntax
  if (!subjectCondition && (!keywordsAll || keywordsAll.length === 0)) {
    // 1. "jeśli / jesli / if ... wyklucz / exclude / -> / => / : ..."
    const ifExcludeMatch = rawStr.match(
      /^(?:je[sś]li|if)\s*[-:]?\s*(.+?)\s*(?:wyklucz(?:[\s-]+prowadz[aą]cego)?[:]?|exclude(?:[\s-]+lecturer)?[:]?|->|=>|:)\s*(.+)$/i
    );
    if (ifExcludeMatch) {
      subjectCondition = ifExcludeMatch[1].trim();
      rawStr = ifExcludeMatch[2].trim();
    } else {
      // 2. Compound "A + B", "A & B", "A and B"
      const plusParts = rawStr.split(/\s*(?:\+|\band\b|&)\s*/i).map(s => s.trim()).filter(Boolean);
      if (plusParts.length >= 2) {
        keywordsAll = plusParts;
      } else {
        // 3. Colon or arrow: "Subject : Keyword" or "Subject -> Keyword"
        const colonMatch = rawStr.match(/^([^:]+?)\s*(?:->|=>|:)\s*(.+)$/);
        if (colonMatch && colonMatch[1].trim().length > 1 && colonMatch[2].trim().length > 1) {
          subjectCondition = colonMatch[1].trim();
          rawStr = colonMatch[2].trim();
        }
      }
    }
  }

  const isConditional = Boolean(subjectCondition || (keywordsAll && keywordsAll.length > 1));

  return {
    keyword: rawStr,
    sourceId,
    subjectCondition: subjectCondition || null,
    keywordsAll: (keywordsAll && keywordsAll.length > 1) ? keywordsAll : null,
    isConditional
  };
}

function getSourceNameById(plugin, sourceId) {
  if (!sourceId || sourceId === "__ALL__") {
    return t(plugin, "allCalendars");
  }
  const sources = (plugin && plugin.settings && plugin.settings.scheduleSources) || [];
  const found = sources.find(s => s.id === sourceId);
  if (found) {
    return found.name || (found.type === "url" ? deriveSourceLabelFromUrl(found.url || "", found.cachedIcs) : "schedule.ics");
  }
  return t(plugin, "allCalendars");
}

function formatCustomDate(dateKey, format, pluginOrLang) {
  if (!dateKey) return "";
  const parts = dateKey.split("-");
  if (parts.length !== 3) return dateKey;
  const [yearStr, monthStr, dayStr] = parts;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const yy = yearStr.length >= 2 ? yearStr.slice(-2) : yearStr;

  switch (format) {
    case "DD.MM.YYYY":
      return `${dayStr}.${monthStr}.${yearStr}`;
    case "DD-MM-YYYY":
      return `${dayStr}-${monthStr}-${yearStr}`;
    case "MM-DD-YYYY":
      return `${monthStr}-${dayStr}-${yearStr}`;
    case "YYYY.MM.DD":
      return `${yearStr}.${monthStr}.${dayStr}`;
    case "DD/MM/YYYY":
      return `${dayStr}/${monthStr}/${yearStr}`;
    case "MM/DD/YYYY":
      return `${monthStr}/${dayStr}/${yearStr}`;
    case "YYYY/MM/DD":
      return `${yearStr}/${monthStr}/${dayStr}`;
    case "YYYYMMDD":
      return `${yearStr}${monthStr}${dayStr}`;
    case "DD.MM.YY":
      return `${dayStr}.${monthStr}.${yy}`;
    case "DD-MM-YY":
      return `${dayStr}-${monthStr}-${yy}`;
    case "MM-DD-YY":
      return `${monthStr}-${dayStr}-${yy}`;
    case "YY-MM-DD":
      return `${yy}-${monthStr}-${dayStr}`;
    case "YYYY-MM-DD":
      return `${yearStr}-${monthStr}-${dayStr}`;
  }

  // Textual Month and Weekday Formats (e.g. "14 listopada 2026" or "sobota, 14 listopada 2026")
  if (format && (format.includes("MMMM") || format.includes("dddd"))) {
    const dObj = new Date(year, month - 1, day);
    const lang = typeof pluginOrLang === "string" ? pluginOrLang : getLang(pluginOrLang);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en || TRANSLATIONS.pl || {};
    const fullWeekdays = (dict && dict.weekdaysFull) || [];
    const monthsGen = (dict && dict.monthsGenitive) || (dict && dict.months) || [];

    let weekdayName = (fullWeekdays[dObj.getDay()] || "").toLowerCase();
    const monthWord = monthsGen[month - 1] || "";

    let dayMonthYear = `${day} ${monthWord} ${year}`;

    if (format === "dddd, D MMMM YYYY") {
      return `${weekdayName}, ${dayMonthYear}`;
    }

    if (format === "dddd, MMMM D, YYYY") {
      return `${weekdayName}, ${monthWord} ${day}, ${year}`;
    }

    if (format === "MMMM D, YYYY") {
      return `${monthWord} ${day}, ${year}`;
    }

    if (format === "D MMMM YYYY") {
      return dayMonthYear;
    }
  }

  return `${yearStr}-${monthStr}-${dayStr}`;
}

function formatClassesCount(plugin, count) {
  const n = typeof count === "number" ? count : 0;
  if (n === 0) {
    return t(plugin, "noClasses");
  } else if (n === 1) {
    return t(plugin, "oneClass");
  } else if (n >= 2 && n <= 4) {
    return t(plugin, "fewClasses", { count: n });
  } else {
    return t(plugin, "manyClasses", { count: n });
  }
}

function formatTime(date, pluginOrFormat) {
  // Support accidental inverted arguments formatTime(plugin, date)
  if (date && !(date instanceof Date) && (pluginOrFormat instanceof Date)) {
    const temp = date;
    date = pluginOrFormat;
    pluginOrFormat = temp;
  }
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "--:--";
  let fmt = "24h";
  if (typeof pluginOrFormat === "string") {
    fmt = pluginOrFormat;
  } else if (pluginOrFormat && pluginOrFormat.settings && pluginOrFormat.settings.timeFormat) {
    fmt = pluginOrFormat.settings.timeFormat;
  }
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  if (fmt === "12h") {
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }
  const h = String(hours24).padStart(2, "0");
  return `${h}:${minutes}`;
}

function sanitizeFileName(name, fallback = "Course") {
  if (!name) return fallback;
  const cleaned = String(name)
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/[\x00-\x1f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
}

function decodeBase64Ascii(input) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let str = String(input || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/=]/g, "");
  while (str.length % 4 !== 0) {
    str += "=";
  }
  let output = "";
  for (let i = 0; i < str.length; i += 4) {
    const e1 = chars.indexOf(str.charAt(i));
    const e2 = chars.indexOf(str.charAt(i + 1));
    const e3 = str.charAt(i + 2) === "=" ? -1 : chars.indexOf(str.charAt(i + 2));
    const e4 = str.charAt(i + 3) === "=" ? -1 : chars.indexOf(str.charAt(i + 3));
    if (e1 < 0 || e2 < 0) break;
    const c1 = (e1 << 2) | (e2 >> 4);
    output += String.fromCharCode(c1);
    if (e3 >= 0) {
      const c2 = ((e2 & 15) << 4) | (e3 >> 2);
      output += String.fromCharCode(c2);
      if (e4 >= 0) {
        const c3 = ((e3 & 3) << 6) | e4;
        output += String.fromCharCode(c3);
      }
    }
  }
  return output;
}

function tryDecodeGoogleCid(rawCid) {
  if (!rawCid) return null;
  let trimmed = rawCid.trim();
  try {
    trimmed = decodeURIComponent(trimmed);
  } catch (e) {
    // ignore decodeURIComponent error
  }
  if (trimmed.includes("@")) {
    return trimmed;
  }
  try {
    const decoded = decodeBase64Ascii(trimmed).trim();
    if (decoded && (decoded.includes("@") || decoded.includes(".calendar.google.com"))) {
      return decoded;
    }
  } catch (e) {
    // ignore decoding error
  }
  return null;
}

function extractQueryParam(urlStr, paramName) {
  const qIdx = urlStr.indexOf("?");
  if (qIdx < 0) return null;
  const query = urlStr.substring(qIdx + 1).split("#")[0];
  const pairs = query.split("&");
  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    const key = eqIdx >= 0 ? pair.substring(0, eqIdx) : pair;
    if (key === paramName) {
      const rawVal = eqIdx >= 0 ? pair.substring(eqIdx + 1) : "";
      try {
        return decodeURIComponent(rawVal.replace(/\+/g, " "));
      } catch (e) {
        return rawVal;
      }
    }
  }
  return null;
}

function normalizeCalendarUrl(rawUrl) {
  if (!rawUrl) return "";
  const url = rawUrl.trim().replace(/^webcal:\/\//i, "https://");

  if (/calendar\.google\.com/i.test(url)) {
    const isIcalPath = /\/calendar\/ical\//i.test(url);

    // 1. Shareable link with ?cid=... (e.g. /calendar/u/0?cid=... or /calendar/render?cid=...)
    const cid = extractQueryParam(url, "cid");
    if (cid && !isIcalPath) {
      const calId = tryDecodeGoogleCid(cid);
      if (calId) {
        return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calId)}/public/basic.ics`;
      }
    }

    // 2. Public embed URL with ?src=... (e.g. /calendar/embed?src=...)
    const src = extractQueryParam(url, "src");
    if (src && !isIcalPath) {
      return `https://calendar.google.com/calendar/ical/${encodeURIComponent(src.trim())}/public/basic.ics`;
    }

    // 3. Deprecated /full feed -> /basic.ics
    if (isIcalPath && /\/(public|private[^\/]*)\/full(\.ics)?(\?.*)?$/i.test(url)) {
      return url.replace(/\/full(\.ics)?(\?.*)?$/i, "/basic.ics");
    }
  }

  return url;
}

function extractCalendarNameFromIcs(icsContent) {
  if (!icsContent) return "";
  const match = icsContent.match(/^X-WR-CALNAME(?:;[^:]*)?:(.+)$/im);
  if (match && match[1]) {
    return unescapeICS(match[1].trim());
  }
  return "";
}

function deriveSourceLabelFromUrl(url, icsContent) {
  const calName = extractCalendarNameFromIcs(icsContent);
  try {
    const clean = url.trim().replace(/^webcal:\/\//i, "https://");
    const hostMatch = clean.match(/^https?:\/\/([^\/?#]+)(\/[^?#]*)?/i);
    if (hostMatch) {
      const hostname = hostMatch[1];
      const pathname = hostMatch[2] || "";
      if (calName) {
        return `${calName} (${hostname})`;
      }
      const pathParts = pathname.split("/").filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1] || "";
      if (lastPart) {
        return `${hostname} (${decodeURIComponent(lastPart)})`;
      }
      return hostname;
    }
  } catch (e) {
    // ignore parse error
  }
  return calName || url.substring(0, 45);
}

function extractLineValue(text, labels) {
  if (!text) return "";
  const labelList = Array.isArray(labels) ? labels : [labels];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    for (const label of labelList) {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`^${escaped}(?:[:\\s–—\\-]+|$)`, "i");
      if (re.test(trimmed)) {
        const val = trimmed.replace(re, "").trim();
        if (val) return val;
      }
    }
  }
  return "";
}

function cleanSubjectTitle(rawTitle) {
  if (!rawTitle) return "";
  const cleaned = rawTitle
    .replace(/^(egzamin(\s+poprawkowy)?|kolokwium|zaliczenie|exam|retake\s+exam|klausur|prüfung|examen|partiel|test)\s*[:\-–—]\s*/gi, "")
    .replace(/\s*-\s*(I|II|III|1|2|3)\s*(termin|term|prüfungstermin)$/gi, "")
    .replace(/\s*\((wyk(ład)?|lec(ture)?|vorlesung|vl|cm)\)/gi, "")
    .replace(/\s*\((lab(oratorium|oratory)?|praktikum|pr|tp)\)/gi, "")
    .replace(/\s*\((ćw(iczenia)?|cw(iczenia)?|ex(ercises)?|tut(orial)?|übung|ue|üb|td)\)/gi, "")
    .replace(/\s*\((lekt(orat)?|lang(uage)?|sprachkurs)\)/gi, "")
    .replace(/\s*\((proj(ekt|ect)?|projet)\)/gi, "")
    .replace(/\s*\((sem(inarium|inar)?|séminaire)\)/gi, "")
    .replace(/\s*\[[WwLlCcPpSsEe]\]/g, "")
    .replace(/\s*-\s*(wykład|ćwiczenia|laboratorium|projekt|seminarium|lektorat|egzamin|kolokwium|zaliczenie|lecture|laboratory|exercises|tutorial|seminar|project|exam|vorlesung|übung|praktikum|klausur|cours|travaux\s+dirigés|travaux\s+pratiques|examen)/gi, "")
    .trim();
  return cleaned || rawTitle;
}

function parseUniDetails(summary, description, location) {
  const cleanDesc = unescapeICS(description || "");

  const lecturer = extractLineValue(cleanDesc, [
    "Prowadzący", "Wykładowca", "Nauczyciel",
    "Lecturer", "Instructor", "Professor", "Teacher",
    "Dozent", "Lehrkraft", "Lehrende",
    "Enseignant", "Professeur", "Intervenant",
    "Docente", "Profesor", "Catedrático",
    "Professore",
    "Professor",
    "Преподаватель", "Лектор",
    "教师", "老师", "讲师", "教授",
    "担当教員", "講師", "教授",
    "교수", "강사"
  ]);

  let room = location ? location.trim() : "";
  if (!room) {
    room = extractLineValue(cleanDesc, [
      "Sala", "Miejsce", "Budynek",
      "Room", "Location", "Hall", "Building", "Venue",
      "Raum", "Gebäude", "Hörsaal",
      "Salle", "Bâtiment", "Amphi", "Amphithéâtre",
      "Aula", "Edificio", "Lugar",
      "Edifício", "Prédio",
      "Аудитория", "Корпус", "Кабинет",
      "教室", "地点", "教学楼",
      "講義室", "場所",
      "강의실", "장소", "호실"
    ]);
  }
  const remarks = extractLineValue(cleanDesc, [
    "Uwagi", "Notatki", "Informacje",
    "Remarks", "Notes", "Info",
    "Hinweise", "Anmerkungen", "Informationen",
    "Remarques", "Informations",
    "Notas", "Observaciones", "Información",
    "Observações", "Anotações",
    "Note", "Osservazioni",
    "Примечания", "Заметки", "Информация",
    "备注", "说明", "信息",
    "備考", "連絡事項",
    "비고", "참고사항", "안내"
  ]);
  if (!room && remarks) {
    room = remarks;
  }

  const group = extractLineValue(cleanDesc, [
    "Grupa", "Grupy",
    "Group", "Groups", "Section",
    "Gruppe", "Zug",
    "Groupe",
    "Grupo",
    "Gruppo",
    "Группа",
    "组", "班级", "分班",
    "グループ", "クラス",
    "분반", "그룹"
  ]).toLowerCase();
  const textAll = `${summary || ""} ${description || ""}`.toLowerCase();

  let category = "inne";

  if (
    group.includes("lekt") || group.includes("lang") || group.includes("sprach") ||
    textAll.includes("lektorat") || textAll.includes("język obcy") || textAll.includes("jezyk obcy") ||
    textAll.includes("language course") || textAll.includes("foreign language") ||
    textAll.includes("sprachkurs") || textAll.includes("cours de langue") || textAll.includes("langue vivante") ||
    textAll.includes("curso de idiomas") || textAll.includes("lingua straniera") || textAll.includes("língua estrangeira") ||
    textAll.includes("иностранный язык") || textAll.includes("外语") || textAll.includes("大学英语") ||
    textAll.includes("語学") || textAll.includes("外国語") || textAll.includes("어학") || textAll.includes("외국어")
  ) {
    category = "lektorat";
  } else if (
    group.includes("wyk") || group.includes("lec") || group.includes("vorl") || group.includes("cm") ||
    textAll.includes("wykład") || textAll.includes("(wyk)") || textAll.includes("[w]") ||
    textAll.includes("lecture") || textAll.includes("(lec)") ||
    textAll.includes("vorlesung") || textAll.includes("(vl)") ||
    textAll.includes("cours magistral") || textAll.includes("(cm)") ||
    textAll.includes("clase magistral") || textAll.includes("aula teórica") || textAll.includes("lezione") ||
    textAll.includes("лекция") || textAll.includes("讲座") || textAll.includes("理论课") ||
    textAll.includes("講義") || textAll.includes("강의")
  ) {
    category = "wyklad";
  } else if (
    group.includes("lab") || group.includes("inf") || group.includes("prac") || group.includes("prak") || group.includes("tp") ||
    textAll.includes("laboratorium") || textAll.includes("laboratory") || textAll.includes("(lab)") ||
    textAll.includes("praktikum") || textAll.includes("(pr)") ||
    textAll.includes("travaux pratiques") || textAll.includes("(tp)") ||
    textAll.includes("laboratorio") || textAll.includes("лабораторная") ||
    textAll.includes("实验") || textAll.includes("上机") || textAll.includes("実験") || textAll.includes("실습")
  ) {
    category = "laboratorium";
  } else if (
    group.includes("ćw") || group.includes("cw") || group.includes("ex") || group.includes("tut") || group.includes("üb") || group.includes("td") ||
    textAll.includes("ćwiczenia") || textAll.includes("(ćw)") ||
    textAll.includes("exercises") || textAll.includes("tutorial") ||
    textAll.includes("übung") || textAll.includes("(ue)") || textAll.includes("(üb)") ||
    textAll.includes("travaux dirigés") || textAll.includes("(td)") ||
    textAll.includes("prácticas") || textAll.includes("esercitazione") ||
    textAll.includes("практика") || textAll.includes("семинар") ||
    textAll.includes("习题") || textAll.includes("演習") || textAll.includes("연습")
  ) {
    category = "cwiczenia";
  } else if (
    group.includes("sem") ||
    textAll.includes("seminarium") || textAll.includes("seminar") || textAll.includes("séminaire") ||
    textAll.includes("seminario") || textAll.includes("семинар") ||
    textAll.includes("研讨") || textAll.includes("讨论班") || textAll.includes("ゼミ") || textAll.includes("세미나")
  ) {
    category = "seminarium";
  } else if (
    group.includes("proj") ||
    textAll.includes("projekt") || textAll.includes("project") || textAll.includes("projet") ||
    textAll.includes("proyecto") || textAll.includes("progetto") || textAll.includes("projeto") ||
    textAll.includes("проект") || textAll.includes("项目") || textAll.includes("大作业") ||
    textAll.includes("プロジェクト") || textAll.includes("프로젝트")
  ) {
    category = "projekt";
  }

  let isExam = false;
  if (
    remarks.toLowerCase().includes("egzamin") || remarks.toLowerCase().includes("exam") ||
    remarks.toLowerCase().includes("klausur") || remarks.toLowerCase().includes("prüfung") ||
    textAll.includes("egzamin") || textAll.includes("kolokwium") || textAll.includes("zaliczenie") ||
    textAll.includes("exam") || textAll.includes("midterm") || textAll.includes("final") || /\btest\b/i.test(textAll) ||
    textAll.includes("klausur") || textAll.includes("prüfung") ||
    textAll.includes("examen") || textAll.includes("partiel") ||
    textAll.includes("esame") || textAll.includes("prova") ||
    textAll.includes("экзамен") || textAll.includes("зачет") || textAll.includes("сессия") ||
    textAll.includes("考试") || textAll.includes("期末") || textAll.includes("期中") ||
    textAll.includes("試験") || textAll.includes("テスト") ||
    textAll.includes("시험") || textAll.includes("중간고사") || textAll.includes("기말고사")
  ) {
    isExam = true;
    if (category === "lektorat") {
      category = "lektorat_egzamin";
    } else if (category === "inne") {
      category = "egzamin";
    } else {
      category = `${category}_egzamin`;
    }
  }

  return {
    lecturer,
    room: room || "",
    category,
    isExam
  };
}

function getDefaultCategoryLabel(plugin, category) {
  const baseMap = {
    wyklad: t(plugin, "typeLecture"),
    cwiczenia: t(plugin, "typeExercises"),
    laboratorium: t(plugin, "typeLab"),
    lektorat: t(plugin, "typeLanguage"),
    lektorat_egzamin: t(plugin, "typeLanguageExam"),
    projekt: t(plugin, "typeProject"),
    seminarium: t(plugin, "typeSeminar"),
    egzamin: t(plugin, "typeExam"),
    inne: t(plugin, "typeOther")
  };

  if (baseMap[category]) {
    return baseMap[category];
  }

  if (category && category.endsWith("_egzamin")) {
    const baseCat = category.replace(/_egzamin$/, "");
    const baseLabel = baseMap[baseCat] || t(plugin, "typeOther");
    return `${baseLabel} (${t(plugin, "typeExam")})`;
  }

  return t(plugin, "typeOther");
}

function getLocalizedClassType(plugin, category, isExam) {
  let effectiveCat = category || "inne";
  if (isExam && effectiveCat !== "egzamin" && !effectiveCat.endsWith("_egzamin")) {
    effectiveCat = `${effectiveCat}_egzamin`;
  }

  const customNames = (plugin && plugin.settings && plugin.settings.classCustomNames) || {};
  if (customNames[effectiveCat] && customNames[effectiveCat].trim() !== "") {
    return customNames[effectiveCat].trim();
  }

  return getDefaultCategoryLabel(plugin, effectiveCat);
}

function getNoteFileName(plugin, event, dateKey) {
  const format = (plugin.settings.noteNameFormat && plugin.settings.noteNameFormat.trim()) || "{date} - {subject}";
  const details = parseUniDetails(event.summary, event.description, event.location);
  const localizedType = getLocalizedClassType(plugin, details.category, details.isExam);
  const formattedDate = formatCustomDate(dateKey, plugin.settings.dateFormat || "YYYY-MM-DD", plugin);

  const rawSubject = event.summary || t(plugin, "defaultCourseName");
  const subjectForName = (plugin && plugin.settings && plugin.settings.cleanSubjectNames)
    ? cleanSubjectTitle(rawSubject)
    : rawSubject;

  const timeStartStr = event.isAllDay ? "" : formatTime(event.dtstart, plugin).replace(":", "-");
  const timeEndStr = event.isAllDay ? "" : formatTime(event.dtend, plugin).replace(":", "-");
  const timeStr = event.isAllDay ? t(plugin, "allDay") : timeStartStr;

  let name = format
    .replace(/\{date\}|\{data\}/gi, formattedDate)
    .replace(/\{subject\}|\{przedmiot\}|\{title\}|\{nazwa\}/gi, sanitizeFileName(subjectForName, ""))
    .replace(/\{type\}|\{typ\}/gi, sanitizeFileName(localizedType, ""))
    .replace(/\{time\}|\{godzina\}/gi, sanitizeFileName(timeStr, ""))
    .replace(/\{time_start\}|\{godzina_od\}/gi, sanitizeFileName(timeStartStr, ""))
    .replace(/\{time_end\}|\{godzina_do\}/gi, sanitizeFileName(timeEndStr, ""))
    .replace(/\{room\}|\{sala\}|\{miejsce\}/gi, sanitizeFileName(details.room || "", ""))
    .replace(/\{lecturer\}|\{prowadzacy\}|\{prowadzący\}|\{wykladowca\}|\{wykładowca\}/gi, sanitizeFileName(details.lecturer || "", ""))
    .replace(/\{description\}|\{opis\}/gi, sanitizeFileName(event.description || "", ""));

  name = sanitizeFileName(name, formattedDate);
  if (!name) name = formattedDate;
  return `${name}.md`;
}

// ==========================================================================
// ICS / iCalendar Parser & Recurrence Expander
// ==========================================================================

function unescapeICS(val) {
  if (!val) return "";
  return val
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseICSDate(val) {
  if (!val) return null;
  const clean = val.trim();
  let dObj = null;
  if (clean.includes("T")) {
    const parts = clean.split("T");
    const d = parts[0];
    const tPart = parts[1].replace("Z", "");
    const year = parseInt(d.substring(0, 4), 10);
    const month = parseInt(d.substring(4, 6), 10) - 1;
    const day = parseInt(d.substring(6, 8), 10);
    const hours = parseInt(tPart.substring(0, 2), 10);
    const minutes = parseInt(tPart.substring(2, 4), 10);
    const seconds = parseInt(tPart.substring(4, 6), 10) || 0;
    if (clean.endsWith("Z")) {
      dObj = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    } else {
      dObj = new Date(year, month, day, hours, minutes, seconds);
    }
  } else {
    const year = parseInt(clean.substring(0, 4), 10);
    const month = parseInt(clean.substring(4, 6), 10) - 1;
    const day = parseInt(clean.substring(6, 8), 10);
    dObj = new Date(year, month, day, 0, 0, 0);
  }
  if (!dObj || isNaN(dObj.getTime())) return null;
  return dObj;
}

function parseICS(icsContent) {
  if (!icsContent) return [];
  const unfolded = icsContent.replace(/\r\n[ \t]|\r[ \t]|\n[ \t]/g, "");
  const lines = unfolded.split(/\r\n|\r|\n/);

  const rawEvents = [];
  let currentEvent = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line === "BEGIN:VEVENT") {
      currentEvent = { exdates: [] };
      continue;
    }

    if (line === "END:VEVENT") {
      if (currentEvent && currentEvent.dtstart) {
        if (currentEvent.status === "CANCELLED") {
          if (currentEvent.uid && currentEvent.recurrenceId) {
            rawEvents.push(currentEvent);
          }
        } else if (currentEvent.summary || currentEvent.recurrenceId) {
          rawEvents.push(currentEvent);
        }
      }
      currentEvent = null;
      continue;
    }

    if (currentEvent) {
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;
      const propPart = line.substring(0, colonIdx);
      const valuePart = line.substring(colonIdx + 1);

      const propTokens = propPart.split(";");
      const propName = propTokens[0].toUpperCase();

      switch (propName) {
        case "STATUS":
          currentEvent.status = valuePart.trim().toUpperCase();
          break;
        case "SUMMARY":
          currentEvent.summary = unescapeICS(valuePart);
          break;
        case "DTSTART": {
          const isDateOnly = !valuePart.includes("T") || propTokens.some(tok => tok.toUpperCase() === "VALUE=DATE");
          if (isDateOnly) currentEvent.isAllDay = true;
          currentEvent.dtstart = parseICSDate(valuePart);
          break;
        }
        case "DTEND": {
          const isDateOnly = !valuePart.includes("T") || propTokens.some(tok => tok.toUpperCase() === "VALUE=DATE");
          if (isDateOnly) currentEvent.isAllDay = true;
          currentEvent.dtend = parseICSDate(valuePart);
          break;
        }
        case "RECURRENCE-ID": {
          currentEvent.recurrenceId = parseICSDate(valuePart);
          break;
        }
        case "LOCATION":
          currentEvent.location = unescapeICS(valuePart);
          break;
        case "DESCRIPTION":
          currentEvent.description = unescapeICS(valuePart);
          break;
        case "RRULE":
          currentEvent.rrule = valuePart;
          break;
        case "EXDATE": {
          const exDates = valuePart.split(",");
          for (const ed of exDates) {
            const parsed = parseICSDate(ed);
            if (parsed) currentEvent.exdates.push(formatDateKey(parsed));
          }
          break;
        }
        case "UID":
          currentEvent.uid = valuePart;
          break;
      }
    }
  }

  return rawEvents;
}

function expandRecurringEvents(baseEvents, windowStart, windowEnd) {
  const result = [];

  // Index overrides by UID (RECURRENCE-ID support)
  const overridesByUid = new Map();
  for (const ev of baseEvents) {
    if (ev.uid && ev.recurrenceId) {
      if (!overridesByUid.has(ev.uid)) {
        overridesByUid.set(ev.uid, []);
      }
      overridesByUid.get(ev.uid).push(ev);
    }
  }

  // Inherit missing details from parent recurring event
  for (const ev of baseEvents) {
    if (ev.uid && ev.recurrenceId) {
      const parent = baseEvents.find(p => p.uid === ev.uid && p.rrule);
      if (parent) {
        if (!ev.summary && parent.summary) ev.summary = parent.summary;
        if (!ev.location && parent.location) ev.location = parent.location;
        if (!ev.description && parent.description) ev.description = parent.description;
      }
    }
  }

  const isOccurrenceOverridden = (uid, occDate) => {
    const list = overridesByUid.get(uid);
    if (!list) return false;
    const occTime = occDate.getTime();
    const occDateKey = formatDateKey(occDate);
    return list.some(o => {
      if (!o.recurrenceId) return false;
      if (Math.abs(o.recurrenceId.getTime() - occTime) < 60000) return true;
      if (formatDateKey(o.recurrenceId) === occDateKey &&
          o.recurrenceId.getHours() === 0 && o.recurrenceId.getMinutes() === 0 &&
          occDate.getHours() === 0 && occDate.getMinutes() === 0) {
        return true;
      }
      return false;
    });
  };

  for (const ev of baseEvents) {
    // If it's a cancelled override instance, it has already been used to suppress the recurring event occurrence
    if (ev.status === "CANCELLED") {
      continue;
    }

    const durationMs = ev.dtend
      ? (ev.dtend.getTime() - ev.dtstart.getTime())
      : (ev.isAllDay ? (24 * 60 * 60 * 1000) : (90 * 60 * 1000));

    if (!ev.rrule) {
      if (ev.isAllDay) {
        const startDay = new Date(ev.dtstart.getFullYear(), ev.dtstart.getMonth(), ev.dtstart.getDate());
        let endDay = ev.dtend
          ? new Date(ev.dtend.getFullYear(), ev.dtend.getMonth(), ev.dtend.getDate())
          : new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + 1);
        if (endDay <= startDay) {
          endDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate() + 1);
        }
        const curDate = new Date(startDay.getTime());
        while (curDate < endDay) {
          if (curDate >= windowStart && curDate <= windowEnd) {
            const dateKey = formatDateKey(curDate);
            result.push({
              ...ev,
              dateKey,
              dtstart: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 0, 0, 0),
              dtend: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 23, 59, 59),
              isAllDay: true
            });
          }
          curDate.setDate(curDate.getDate() + 1);
        }
      } else {
        result.push({
          ...ev,
          dateKey: formatDateKey(ev.dtstart),
          dtend: ev.dtend || new Date(ev.dtstart.getTime() + durationMs),
          isAllDay: Boolean(ev.isAllDay)
        });
      }
      continue;
    }

    const ruleParts = {};
    ev.rrule.split(";").forEach(p => {
      const [k, v] = p.split("=");
      if (k && v) ruleParts[k.toUpperCase()] = v;
    });

    const freq = ruleParts["FREQ"] || "WEEKLY";
    const interval = Math.max(1, parseInt(ruleParts["INTERVAL"] || "1", 10) || 1);
    const count = ruleParts["COUNT"] ? parseInt(ruleParts["COUNT"], 10) : null;
    let until = null;
    if (ruleParts["UNTIL"]) {
      until = parseICSDate(ruleParts["UNTIL"]);
    }

    let occurrences = 0;
    const curr = new Date(ev.dtstart.getTime());
    const limitDate = until && until < windowEnd ? until : windowEnd;

    if (freq === "WEEKLY") {
      const byDayStr = ruleParts["BYDAY"] || "";
      const dayTokens = byDayStr ? byDayStr.split(",").map(s => s.trim().toUpperCase()).filter(Boolean) : [];
      const dayCodeToJsDay = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
      const targetDays = dayTokens
        .map(tok => dayCodeToJsDay[tok.slice(-2)])
        .filter(d => d !== undefined);

      if (targetDays.length >= 1) {
        const startDayTime = new Date(ev.dtstart.getTime());
        const baseHours = startDayTime.getHours();
        const baseMinutes = startDayTime.getMinutes();
        const baseSeconds = startDayTime.getSeconds();
        const dayCursor = new Date(
          startDayTime.getFullYear(),
          startDayTime.getMonth(),
          startDayTime.getDate(),
          baseHours,
          baseMinutes,
          baseSeconds
        );

        const startMonday = new Date(startDayTime.getFullYear(), startDayTime.getMonth(), startDayTime.getDate());
        const dayOffset = (startDayTime.getDay() + 6) % 7;
        startMonday.setDate(startMonday.getDate() - dayOffset);
        startMonday.setHours(0, 0, 0, 0);

        while (dayCursor <= limitDate && (!count || occurrences < count)) {
          if (targetDays.includes(dayCursor.getDay())) {
            const cursorDay = new Date(dayCursor.getFullYear(), dayCursor.getMonth(), dayCursor.getDate());
            cursorDay.setHours(0, 0, 0, 0);
            const diffDaysFromMonday = Math.round((cursorDay.getTime() - startMonday.getTime()) / (24 * 3600 * 1000));
            const weekIndex = Math.floor(diffDaysFromMonday / 7);
            const diffDays = Math.round((dayCursor.getTime() - startDayTime.getTime()) / (24 * 3600 * 1000));
            if (diffDays >= 0 && weekIndex % interval === 0) {
              const dateKey = formatDateKey(dayCursor);
              const isExcluded = (ev.exdates && ev.exdates.includes(dateKey)) ||
                                 (ev.uid && isOccurrenceOverridden(ev.uid, dayCursor));
              if (!isExcluded && dayCursor >= windowStart && dayCursor <= windowEnd) {
                result.push({
                  ...ev,
                  dateKey: dateKey,
                  dtstart: ev.isAllDay ? new Date(dayCursor.getFullYear(), dayCursor.getMonth(), dayCursor.getDate(), 0, 0, 0) : new Date(dayCursor.getTime()),
                  dtend: ev.isAllDay ? new Date(dayCursor.getFullYear(), dayCursor.getMonth(), dayCursor.getDate(), 23, 59, 59) : new Date(dayCursor.getTime() + durationMs),
                  isRecurringInstance: true,
                  isAllDay: Boolean(ev.isAllDay)
                });
              }
              occurrences++;
            }
          }
          dayCursor.setDate(dayCursor.getDate() + 1);
        }
      } else {
        while (curr <= limitDate && (!count || occurrences < count)) {
          const dateKey = formatDateKey(curr);
          const isExcluded = (ev.exdates && ev.exdates.includes(dateKey)) ||
                             (ev.uid && isOccurrenceOverridden(ev.uid, curr));

          if (!isExcluded && curr >= windowStart && curr <= windowEnd) {
            result.push({
              ...ev,
              dateKey: dateKey,
              dtstart: ev.isAllDay ? new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 0, 0, 0) : new Date(curr.getTime()),
              dtend: ev.isAllDay ? new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 23, 59, 59) : new Date(curr.getTime() + durationMs),
              isRecurringInstance: true,
              isAllDay: Boolean(ev.isAllDay)
            });
          }
          occurrences++;
          curr.setDate(curr.getDate() + 7 * interval);
        }
      }
    } else if (freq === "DAILY") {
      const step = Math.max(1, interval);
      while (curr <= limitDate && (!count || occurrences < count)) {
        const dateKey = formatDateKey(curr);
        const isExcluded = (ev.exdates && ev.exdates.includes(dateKey)) ||
                           (ev.uid && isOccurrenceOverridden(ev.uid, curr));

        if (!isExcluded && curr >= windowStart && curr <= windowEnd) {
          result.push({
            ...ev,
            dateKey: dateKey,
            dtstart: ev.isAllDay ? new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 0, 0, 0) : new Date(curr.getTime()),
            dtend: ev.isAllDay ? new Date(curr.getFullYear(), curr.getMonth(), curr.getDate(), 23, 59, 59) : new Date(curr.getTime() + durationMs),
            isRecurringInstance: true,
            isAllDay: Boolean(ev.isAllDay)
          });
        }
        occurrences++;
        curr.setDate(curr.getDate() + step);
      }
    } else if (freq === "MONTHLY") {
      const step = Math.max(1, interval);
      const targetDay = ev.dtstart.getDate();
      const targetHours = ev.dtstart.getHours();
      const targetMinutes = ev.dtstart.getMinutes();
      const targetSeconds = ev.dtstart.getSeconds();
      const baseYear = ev.dtstart.getFullYear();
      const baseMonth = ev.dtstart.getMonth();
      let monthOffset = 0;

      while (true) {
        const targetYear = baseYear;
        const targetMonth = baseMonth + monthOffset;
        const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        const actualDay = Math.min(targetDay, daysInTargetMonth);
        const occurrenceDate = new Date(targetYear, targetMonth, actualDay, targetHours, targetMinutes, targetSeconds);

        if (occurrenceDate > limitDate) break;
        if (count && occurrences >= count) break;

        const dateKey = formatDateKey(occurrenceDate);
        const isExcluded = (ev.exdates && ev.exdates.includes(dateKey)) ||
                           (ev.uid && isOccurrenceOverridden(ev.uid, occurrenceDate));

        if (!isExcluded && occurrenceDate >= windowStart && occurrenceDate <= windowEnd) {
          result.push({
            ...ev,
            dateKey: dateKey,
            dtstart: ev.isAllDay ? new Date(occurrenceDate.getFullYear(), occurrenceDate.getMonth(), occurrenceDate.getDate(), 0, 0, 0) : new Date(occurrenceDate.getTime()),
            dtend: ev.isAllDay ? new Date(occurrenceDate.getFullYear(), occurrenceDate.getMonth(), occurrenceDate.getDate(), 23, 59, 59) : new Date(occurrenceDate.getTime() + durationMs),
            isRecurringInstance: true,
            isAllDay: Boolean(ev.isAllDay)
          });
        }
        occurrences++;
        monthOffset += step;
      }
    } else {
      result.push({
        ...ev,
        dateKey: formatDateKey(ev.dtstart),
        dtend: ev.dtend || (ev.isAllDay ? new Date(ev.dtstart.getFullYear(), ev.dtstart.getMonth(), ev.dtstart.getDate(), 23, 59, 59) : new Date(ev.dtstart.getTime() + durationMs)),
        isAllDay: Boolean(ev.isAllDay)
      });
    }
  }

  result.sort((a, b) => a.dtstart.getTime() - b.dtstart.getTime());
  return result;
}

// ==========================================================================
// Modal: Visual Note Template Builder (Responsive on Desktop, Tablet & Mobile)
// ==========================================================================

class NoteTemplateBuilderModal extends Modal {
  constructor(app, plugin, onSave) {
    super(app);
    this.plugin = plugin;
    this.onSave = onSave;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    if (modalEl) {
      modalEl.addClass("uni-builder-modal-wrapper");
    }
    contentEl.addClass("uni-builder-modal");

    contentEl.createEl("h2", {
      text: t(this.plugin, "builderModalTitle"),
      cls: "uni-create-modal-header"
    });

    contentEl.createEl("p", {
      text: t(this.plugin, "builderModalDesc"),
      cls: "uni-builder-desc"
    });

    const sampleEvent = (this.plugin.events && this.plugin.events.length > 0)
      ? this.plugin.events[0]
      : {
          summary: t(this.plugin, "sampleSubject"),
          dtstart: new Date(2026, 10, 14, 10, 45),
          dtend: new Date(2026, 10, 14, 12, 15),
          location: t(this.plugin, "sampleRoom"),
          description: `Lecturer: ${t(this.plugin, "sampleLecturer")}\n${t(this.plugin, "sampleDesc")}`
        };

    const details = parseUniDetails(sampleEvent.summary, sampleEvent.description, sampleEvent.location);
    const localizedType = getLocalizedClassType(this.plugin, details.category, details.isExam);
    const sampleDateKey = sampleEvent.dateKey || formatDateKey(sampleEvent.dtstart || new Date());

    let currentDateFormat = this.plugin.settings.dateFormat || "YYYY-MM-DD";

    new Setting(contentEl)
      .setName(t(this.plugin, "dateFormatSetting"))
      .setDesc(t(this.plugin, "dateFormatDesc"))
      .addDropdown(dropdown => {
        populateDateFormatDropdown(dropdown, currentDateFormat, this.plugin);
        dropdown.onChange(val => {
          currentDateFormat = val;
          updateChipsAndPreview();
        });
      });

    const presetsSection = contentEl.createDiv({ cls: "uni-builder-presets-section" });
    presetsSection.createSpan({
      text: t(this.plugin, "builderPresetsLabel"),
      cls: "uni-builder-presets-label"
    });

    const curLang = getLang(this.plugin);
    const presets = [
      {
        id: "standard",
        label: t(this.plugin, "presetStandard"),
        template: DEFAULT_NOTE_TEMPLATES[curLang] || DEFAULT_NOTE_TEMPLATES.en || DEFAULT_NOTE_TEMPLATES.pl
      },
      {
        id: "properties",
        label: t(this.plugin, "presetProperties"),
        template: YAML_NOTE_TEMPLATES[curLang] || YAML_NOTE_TEMPLATES.en || YAML_NOTE_TEMPLATES.pl
      },
      {
        id: "minimal",
        label: t(this.plugin, "presetMinimal"),
        template: `# {subject} ({date})\n\n`
      },
      {
        id: "blank",
        label: t(this.plugin, "presetBlank"),
        template: ``
      }
    ];

    const chipsSection = contentEl.createDiv({ cls: "uni-builder-chips-section" });
    chipsSection.createDiv({
      text: t(this.plugin, "builderChipsLabel"),
      cls: "uni-builder-chips-label"
    });
    const chipsContainer = chipsSection.createDiv({ cls: "uni-builder-chips-container" });

    const editorSection = contentEl.createDiv({ cls: "uni-builder-editor-container" });
    editorSection.createDiv({
      text: t(this.plugin, "builderEditorLabel"),
      cls: "uni-builder-editor-label"
    });
    const textarea = editorSection.createEl("textarea", {
      cls: "uni-builder-textarea"
    });
    textarea.value = this.plugin.settings.noteTemplate || "";

    const previewSection = contentEl.createDiv({ cls: "uni-builder-preview-section" });
    previewSection.createDiv({
      text: t(this.plugin, "builderPreviewLabel"),
      cls: "uni-builder-preview-label"
    });
    const previewBox = previewSection.createDiv({ cls: "uni-builder-preview-box" });

    const renderChips = () => {
      chipsContainer.empty();
      const formattedDate = formatCustomDate(sampleDateKey, currentDateFormat, this.plugin);
      const isAllDay = Boolean(sampleEvent.isAllDay);
      const timeFormatted = isAllDay ? t(this.plugin, "allDay") : `${formatTime(sampleEvent.dtstart, this.plugin)} – ${formatTime(sampleEvent.dtend, this.plugin)}`;
      const timeStartFormatted = isAllDay ? "" : formatTime(sampleEvent.dtstart, this.plugin);
      const timeEndFormatted = isAllDay ? "" : formatTime(sampleEvent.dtend, this.plugin);

      const variables = [
        { tag: "{subject}", sample: sampleEvent.summary || t(this.plugin, "sampleSubject") },
        { tag: "{date}", sample: formattedDate },
        { tag: "{time}", sample: timeFormatted },
        { tag: "{time_start}", sample: timeStartFormatted },
        { tag: "{time_end}", sample: timeEndFormatted },
        { tag: "{room}", sample: details.room || t(this.plugin, "sampleRoom") },
        { tag: "{lecturer}", sample: details.lecturer || t(this.plugin, "sampleLecturer") },
        { tag: "{type}", sample: localizedType },
        { tag: "{description}", sample: t(this.plugin, "sampleDesc") }
      ];

      variables.forEach(v => {
        const chip = chipsContainer.createDiv({ cls: "uni-builder-chip" });
        chip.setAttribute("draggable", "true");
        chip.setAttribute("title", t(this.plugin, "builderChipTooltip"));

        chip.createSpan({ cls: "uni-builder-chip-tag", text: v.tag });
        if (v.sample) {
          chip.createSpan({ cls: "uni-builder-chip-sample", text: `(${v.sample})` });
        }

        chip.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", v.tag);
        });

        chip.addEventListener("click", () => {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          textarea.value = text.substring(0, start) + v.tag + text.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + v.tag.length;
          textarea.focus();
          updateLivePreview();
        });
      });
    };

    const updateLivePreview = () => {
      const formattedDate = formatCustomDate(sampleDateKey, currentDateFormat, this.plugin);
      const isAllDay = Boolean(sampleEvent.isAllDay);
      const timeFormatted = isAllDay ? t(this.plugin, "allDay") : `${formatTime(sampleEvent.dtstart, this.plugin)} – ${formatTime(sampleEvent.dtend, this.plugin)}`;
      const timeStartFormatted = isAllDay ? "" : formatTime(sampleEvent.dtstart, this.plugin);
      const timeEndFormatted = isAllDay ? "" : formatTime(sampleEvent.dtend, this.plugin);

      let previewText = textarea.value;
      if (!previewText.trim()) {
        previewBox.setText(t(this.plugin, "builderBlankPreview"));
        previewBox.addClass("is-blank");
        return;
      }

      previewBox.removeClass("is-blank");

      const isYaml = previewText.trimStart().startsWith("---");
      const yamlMatch = isYaml ? previewText.match(/^(\s*---[\s\S]*?\n---)([\s\S]*)$/) : null;
      const escapeYaml = str => (str ? String(str).replace(/\\"/g, '"').replace(/"/g, '\\"') : "");

      const replacements = [
        { regex: /\{subject\}|\{przedmiot\}/gi, raw: sampleEvent.summary || t(this.plugin, "sampleSubject") },
        { regex: /\{date\}|\{data\}/gi, raw: formattedDate },
        { regex: /\{time\}|\{godzina\}/gi, raw: timeFormatted },
        { regex: /\{time_start\}|\{godzina_od\}/gi, raw: timeStartFormatted },
        { regex: /\{time_end\}|\{godzina_do\}/gi, raw: timeEndFormatted },
        { regex: /\{room\}|\{sala\}/gi, raw: details.room || t(this.plugin, "sampleRoom") },
        { regex: /\{lecturer\}|\{prowadzacy\}|\{wykladowca\}/gi, raw: details.lecturer || t(this.plugin, "sampleLecturer") },
        { regex: /\{type\}|\{typ\}/gi, raw: localizedType },
        { regex: /\{description\}|\{opis\}/gi, raw: sampleEvent.description || "" }
      ];

      if (yamlMatch) {
        let fm = yamlMatch[1];
        let body = yamlMatch[2];
        for (const r of replacements) {
          fm = fm.replace(r.regex, escapeYaml(r.raw));
          body = body.replace(r.regex, r.raw);
        }
        previewText = fm + body;
      } else {
        for (const r of replacements) {
          previewText = previewText.replace(r.regex, r.raw);
        }
      }

      previewBox.setText(previewText);
    };

    const updateChipsAndPreview = () => {
      renderChips();
      updateLivePreview();
    };

    presets.forEach(p => {
      const btn = presetsSection.createEl("button", {
        cls: "uni-builder-preset-btn",
        text: p.label
      });
      btn.addEventListener("click", () => {
        textarea.value = p.template;
        updateLivePreview();
      });
    });

    textarea.addEventListener("input", updateLivePreview);

    updateChipsAndPreview();

    const btnContainer = contentEl.createDiv({ cls: "uni-create-modal-buttons" });

    const cancelBtn = btnContainer.createEl("button", { text: t(this.plugin, "modalCancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const saveBtn = btnContainer.createEl("button", {
      text: t(this.plugin, "btnSaveTemplate"),
      cls: "mod-cta"
    });

    saveBtn.addEventListener("click", async () => {
      this.plugin.settings.noteTemplate = textarea.value;
      this.plugin.settings.dateFormat = currentDateFormat;
      await this.plugin.saveSettings();
      new Notice(t(this.plugin, "templateSavedNotice"));
      this.close();
      if (this.onSave) this.onSave();
    });

    saveBtn.focus();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ==========================================================================
// Modal: Confirm Schedule Deletion
// ==========================================================================

class ConfirmDeleteScheduleModal extends Modal {
  constructor(app, plugin, scheduleName, onConfirm) {
    super(app);
    this.plugin = plugin;
    this.scheduleName = scheduleName;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    if (modalEl) {
      modalEl.addClass("uni-compact-modal-wrapper");
    }
    contentEl.addClass("uni-create-modal");

    const header = contentEl.createEl("div", { cls: "uni-create-modal-header" });
    header.setText(t(this.plugin, "confirmDeleteScheduleTitle"));

    const info = contentEl.createEl("div", { cls: "uni-create-modal-info" });
    const p = info.createEl("p");
    p.setText(t(this.plugin, "confirmDeleteScheduleDesc", { name: this.scheduleName }));

    const btnContainer = contentEl.createEl("div", { cls: "uni-create-modal-buttons" });

    const cancelBtn = btnContainer.createEl("button", {
      cls: "uni-keyword-btn",
      text: t(this.plugin, "modalCancel")
    });
    cancelBtn.addEventListener("click", () => this.close());

    const deleteBtn = btnContainer.createEl("button", {
      text: t(this.plugin, "btnDeleteSource"),
      cls: "mod-warning"
    });
    deleteBtn.addEventListener("click", async () => {
      this.close();
      if (this.onConfirm) {
        await this.onConfirm();
      }
    });

    cancelBtn.focus();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ==========================================================================
// Modal: Create Note Confirmation (Folder already mapped)
// ==========================================================================

class CreateNoteModal extends Modal {
  constructor(app, plugin, options) {
    super(app);
    this.plugin = plugin;
    this.options = options;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    if (modalEl) {
      modalEl.addClass("uni-compact-modal-wrapper");
    }
    contentEl.addClass("uni-create-modal");

    const header = contentEl.createEl("div", { cls: "uni-create-modal-header" });
    header.setText(t(this.plugin, "modalCreateTitle"));

    const info = contentEl.createEl("div", { cls: "uni-create-modal-info" });
    const p = info.createEl("p");
    const formattedDate = formatCustomDate(this.options.dateKey, this.plugin.settings.dateFormat || "YYYY-MM-DD", this.plugin);
    p.setText(t(this.plugin, "modalCreateDesc", { date: formattedDate }));

    info.createEl("h3", { cls: "uni-modal-subject-title", text: this.options.event.summary });

    info.createEl("p", { text: t(this.plugin, "modalTargetLoc") });
    const targetBox = info.createEl("div", { cls: "uni-create-modal-target" });
    targetBox.setText(this.options.targetPath);

    const btnContainer = contentEl.createEl("div", { cls: "uni-create-modal-buttons" });

    const cancelBtn = btnContainer.createEl("button", { text: t(this.plugin, "modalCancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const createBtn = btnContainer.createEl("button", {
      text: t(this.plugin, "modalCreateBtn"),
      cls: "mod-cta"
    });
    createBtn.addEventListener("click", async () => {
      this.close();
      if (this.options.onConfirm) {
        await this.options.onConfirm();
      }
    });

    createBtn.focus();
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ==========================================================================
// Modal: Create Folder & Note (Subject has no folder yet)
// ==========================================================================

class CreateFolderAndNoteModal extends Modal {
  constructor(app, plugin, options) {
    super(app);
    this.plugin = plugin;
    this.options = options;
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    if (modalEl) {
      modalEl.addClass("uni-compact-modal-wrapper");
    }
    contentEl.addClass("uni-create-modal");

    const header = contentEl.createEl("div", { cls: "uni-create-modal-header" });
    header.setText(t(this.plugin, "modalCreateFolderTitle"));

    const info = contentEl.createEl("div", { cls: "uni-create-modal-info" });
    const p1 = info.createEl("p");
    p1.setText(t(this.plugin, "modalCreateFolderDesc"));

    info.createEl("h3", { cls: "uni-modal-subject-title", text: this.options.event.summary });

    const p2 = info.createEl("p");
    const formattedDate = formatCustomDate(this.options.dateKey, this.plugin.settings.dateFormat || "YYYY-MM-DD", this.plugin);
    p2.setText(t(this.plugin, "modalCreateFolderPrompt", { date: formattedDate }));

    const rawSubj = this.options.event.summary || t(this.plugin, "defaultCourseName");
    const subjectTitle = (this.plugin && this.plugin.settings && this.plugin.settings.cleanSubjectNames)
      ? cleanSubjectTitle(rawSubj)
      : rawSubj;
    const cleaned = sanitizeFileName(subjectTitle);
    const suggestedFolder = this.plugin.settings.baseFolder
      ? `${normalizeVaultPath(this.plugin.settings.baseFolder)}/${cleaned}`
      : cleaned;

    new Setting(contentEl)
      .setName(t(this.plugin, "modalFolderInputLabel"))
      .addText(text => {
        text.setValue(suggestedFolder);
        text.inputEl.addClass("uni-input-full");
        this.folderInput = text;
      });

    const previewContainer = contentEl.createEl("div", { cls: "uni-modal-preview-box" });
    previewContainer.createEl("div", {
      text: t(this.plugin, "modalNotePreviewLabel"),
      cls: "uni-modal-preview-label"
    });
    const previewText = previewContainer.createEl("div", { cls: "uni-create-modal-target" });

    const fileName = getNoteFileName(this.plugin, this.options.event, this.options.dateKey);

    const updatePreview = () => {
      const folderVal = normalizeVaultPath(this.folderInput.getValue().trim() || suggestedFolder);
      previewText.setText(`${folderVal}/${fileName}`);
    };
    updatePreview();

    this.folderInput.onChange(() => {
      updatePreview();
    });

    const btnContainer = contentEl.createEl("div", { cls: "uni-create-modal-buttons" });

    const cancelBtn = btnContainer.createEl("button", { text: t(this.plugin, "modalCancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const createBtn = btnContainer.createEl("button", {
      text: t(this.plugin, "modalCreateFolderBtn"),
      cls: "mod-cta"
    });

    createBtn.addEventListener("click", async () => {
      const folderVal = normalizeVaultPath(this.folderInput.getValue().trim() || suggestedFolder);
      const targetPath = `${folderVal}/${fileName}`;

      this.close();

      try {
        await this.plugin.ensureFolderExists(folderVal);
        this.plugin.settings.subjectFolderMappings[this.options.event.summary] = folderVal;
        await this.plugin.saveSettings();

        await this.plugin.createAndOpenNote(this.options.event, this.options.dateKey, targetPath);

        new Notice(t(this.plugin, "folderAndNoteCreatedNotice", { folder: folderVal, path: targetPath }));

        if (this.options.onConfirm) {
          this.options.onConfirm(targetPath);
        }
      } catch (err) {
        new Notice(t(this.plugin, "errCreateNote", { message: err.message }));
        console.error(err);
      }
    });

    createBtn.focus();
  }

  onClose() {
    this.contentEl.empty();
  }
}

function isSessionCancelled(session) {
  if (!session) return false;
  if (session.status && String(session.status).toUpperCase() === "CANCELLED") return true;
  const combined = `${session.summary || ""} ${session.description || ""} ${session.location || ""}`.toLowerCase();
  return /odwołan|odwolane|cancelled|canceled/i.test(combined);
}

// ==========================================================================
// Modal: Course Schedule (Full semester timetable & countdown)
// ==========================================================================

class CourseScheduleModal extends Modal {
  constructor(app, plugin, event) {
    super(app);
    this.plugin = plugin;
    this.event = event;
    this.activeFilter = "all";
  }

  onOpen() {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    if (modalEl) {
      modalEl.addClass("uni-schedule-modal-wrapper");
    }
    contentEl.addClass("uni-course-schedule-modal");

    const rawSummary = (this.event.summary || "").trim();
    const cleanSummary = cleanSubjectTitle(rawSummary);

    // Collect all sessions of this course from non-excluded events
    const allSessions = (this.plugin.events || []).filter(ev => {
      if (!ev || !ev.summary) return false;
      const evRaw = ev.summary.trim();
      const evClean = cleanSubjectTitle(evRaw);
      return (
        evRaw.toLowerCase() === rawSummary.toLowerCase() ||
        evClean.toLowerCase() === cleanSummary.toLowerCase() ||
        evRaw.toLowerCase() === cleanSummary.toLowerCase()
      );
    });

    allSessions.sort((a, b) => (a.dtstart ? a.dtstart.getTime() : 0) - (b.dtstart ? b.dtstart.getTime() : 0));

    const now = new Date();
    const pastSessions = allSessions.filter(s => s.dtend ? s.dtend < now : (s.dtstart ? s.dtstart < now : false));
    const upcomingSessions = allSessions.filter(s => s.dtend ? s.dtend >= now : (s.dtstart ? s.dtstart >= now : true));
    const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

    // Default to "upcoming" if there are upcoming sessions, otherwise "all"
    this.activeFilter = (upcomingSessions.length > 0) ? "upcoming" : "all";

    // Header
    const header = contentEl.createDiv({ cls: "uni-modal-header" });
    const headerTop = header.createDiv({ cls: "uni-modal-header-top" });
    const headerTitleRow = headerTop.createDiv({ cls: "uni-modal-header-title-row" });
    const headerIcon = headerTitleRow.createSpan({ cls: "uni-modal-header-icon is-clickable" });
    setIcon(headerIcon, "calendar-range");
    const titleEl = headerTitleRow.createEl("h2", {
      cls: "uni-modal-title is-clickable",
      text: rawSummary,
      attr: {
        "title": t(this.plugin, "btnOpenCourseHub"),
        "role": "button",
        "tabindex": "0"
      }
    });

    const openCourseHub = async (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      await this.openSubjectFolderNote();
    };

    titleEl.addEventListener("click", openCourseHub);
    headerIcon.addEventListener("click", openCourseHub);
    titleEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        openCourseHub(e);
      }
    });

    const hubBtn = headerTop.createEl("button", {
      cls: "uni-modal-hub-btn mod-cta",
      attr: {
        "title": t(this.plugin, "btnOpenCourseHub"),
        "aria-label": t(this.plugin, "btnOpenCourseHub")
      }
    });
    setIcon(hubBtn, "folder");
    hubBtn.createSpan({ text: t(this.plugin, "btnOpenCourseHub") });
    hubBtn.addEventListener("click", openCourseHub);

    // Stats Bar
    const statsBar = header.createDiv({ cls: "uni-modal-stats-bar" });
    const totalPill = statsBar.createSpan({ cls: "uni-modal-stat-pill is-total" });
    setIcon(totalPill, "calendar");
    totalPill.createSpan({ text: t(this.plugin, "scheduleStatTotal", { count: allSessions.length }) });

    const pastPill = statsBar.createSpan({ cls: "uni-modal-stat-pill is-past" });
    setIcon(pastPill, "check-circle");
    pastPill.createSpan({ text: t(this.plugin, "scheduleStatPast", { count: pastSessions.length }) });

    const upcomingPill = statsBar.createSpan({ cls: "uni-modal-stat-pill is-upcoming" });
    setIcon(upcomingPill, "clock");
    upcomingPill.createSpan({ text: t(this.plugin, "scheduleStatUpcoming", { count: upcomingSessions.length }) });

    // Next Session Hero Banner
    if (nextSession) {
      const hero = contentEl.createDiv({ cls: "uni-next-session-hero" });
      const heroHeader = hero.createDiv({ cls: "uni-next-session-header" });
      const heroBadge = heroHeader.createSpan({ cls: "uni-next-session-badge" });
      setIcon(heroBadge, "sparkles");
      heroBadge.createSpan({ text: t(this.plugin, "nextSessionBadge") });

      const countdownStr = this.getCountdownLabel(nextSession.dtstart, nextSession.dtend, now);
      heroHeader.createSpan({ cls: "uni-next-session-countdown", text: countdownStr });

      const heroBody = hero.createDiv({ cls: "uni-next-session-body" });
      const heroDetails = parseUniDetails(nextSession.summary, nextSession.description, nextSession.location);
      const heroColor = this.plugin.getClassColor(heroDetails.category);
      hero.style.setProperty("--session-accent", heroColor);

      const heroTimeRow = heroBody.createDiv({ cls: "uni-hero-time-row" });
      const heroDateSpan = heroTimeRow.createSpan({ cls: "uni-hero-date" });
      setIcon(heroDateSpan, "calendar");
      heroDateSpan.createSpan({ text: formatLocalizedDateHeader(this.plugin, nextSession.dtstart) });

      const heroHoursSpan = heroTimeRow.createSpan({ cls: "uni-hero-hours" });
      setIcon(heroHoursSpan, "clock");
      heroHoursSpan.createSpan({
        text: `${formatTime(nextSession.dtstart, this.plugin)} – ${formatTime(nextSession.dtend, this.plugin)}`
      });

      const heroMetaRow = heroBody.createDiv({ cls: "uni-hero-meta-row" });
      if (heroDetails.category) {
        const catBadge = heroMetaRow.createSpan({
          cls: "uni-event-type-badge",
          text: getLocalizedClassType(this.plugin, heroDetails.category, heroDetails.isExam)
        });
        catBadge.style.backgroundColor = heroColor;
      }
      if (heroDetails.room) {
        const roomSpan = heroMetaRow.createSpan({ cls: "uni-hero-meta-item" });
        setIcon(roomSpan, "map-pin");
        roomSpan.createSpan({ text: heroDetails.room });
      }
      if (heroDetails.lecturer) {
        const lecSpan = heroMetaRow.createSpan({ cls: "uni-hero-meta-item" });
        setIcon(lecSpan, "user");
        lecSpan.createSpan({ text: heroDetails.lecturer });
      }

      const heroActionsRow = hero.createDiv({ cls: "uni-hero-actions-row" });

      const heroJumpBtn = heroActionsRow.createEl("button", {
        cls: "uni-hero-action-btn is-jump",
        attr: { "title": t(this.plugin, "btnJumpToDayInCalendar") }
      });
      setIcon(heroJumpBtn, "calendar");
      heroJumpBtn.createSpan({ text: t(this.plugin, "btnJumpToDayInCalendar") });
      heroJumpBtn.addEventListener("click", () => {
        this.jumpToDate(nextSession.dtstart);
      });

      const heroDateKey = nextSession.dateKey || formatDateKey(nextSession.dtstart);
      const heroTargetPath = this.plugin.resolveNotePath(nextSession, heroDateKey);
      const heroFileExists = heroTargetPath ? this.plugin.checkFileExists(heroTargetPath) : false;

      const heroNoteBtn = heroActionsRow.createEl("button", {
        cls: `uni-hero-action-btn is-note ${heroFileExists ? "has-note" : "missing-note"}`,
        attr: { "title": heroFileExists ? t(this.plugin, "btnOpenNote") : t(this.plugin, "btnCreateNoteShort") }
      });
      setIcon(heroNoteBtn, heroFileExists ? "file-text" : "plus");
      heroNoteBtn.createSpan({ text: heroFileExists ? t(this.plugin, "btnOpenNote") : t(this.plugin, "btnCreateNoteShort") });
      heroNoteBtn.addEventListener("click", async () => {
        this.close();
        if (heroTargetPath) {
          await this.plugin.handleEventClick(nextSession, heroDateKey, heroTargetPath);
        } else {
          new CreateFolderAndNoteModal(this.app, this.plugin, {
            event: nextSession,
            dateKey: heroDateKey
          }).open();
        }
      });
    } else if (allSessions.length > 0) {
      const finishedNotice = contentEl.createDiv({ cls: "uni-finished-course-notice" });
      setIcon(finishedNotice.createSpan({ cls: "uni-finished-icon" }), "check-circle");
      finishedNotice.createSpan({ text: t(this.plugin, "allSessionsCompleted") });
    }

    // Sessions Timeline Section
    const listSection = contentEl.createDiv({ cls: "uni-modal-sessions-section" });
    const listHeaderRow = listSection.createDiv({ cls: "uni-modal-sessions-header-row" });
    listHeaderRow.createEl("h3", { text: t(this.plugin, "allSessionsHeading") });

    if (allSessions.length === 0) {
      listSection.createEl("p", { cls: "uni-empty-schedule-text", text: t(this.plugin, "noSessionsFoundForCourse") });
      return;
    }

    // Filter pills (All / Upcoming / Past)
    const filterPills = listHeaderRow.createDiv({ cls: "uni-modal-filter-pills" });
    const filterAllBtn = filterPills.createEl("button", {
      cls: `uni-filter-btn ${this.activeFilter === "all" ? "is-active" : ""}`,
      text: t(this.plugin, "filterAll", { count: allSessions.length })
    });
    const filterUpcomingBtn = filterPills.createEl("button", {
      cls: `uni-filter-btn ${this.activeFilter === "upcoming" ? "is-active" : ""}`,
      text: t(this.plugin, "filterUpcoming", { count: upcomingSessions.length })
    });
    const filterPastBtn = filterPills.createEl("button", {
      cls: `uni-filter-btn ${this.activeFilter === "past" ? "is-active" : ""}`,
      text: t(this.plugin, "filterPast", { count: pastSessions.length })
    });

    const listContainer = listSection.createDiv({ cls: "uni-modal-sessions-list" });

    const renderRows = () => {
      listContainer.empty();
      const sessionsToRender = allSessions.filter(s => {
        const isPast = s.dtend ? s.dtend < now : (s.dtstart ? s.dtstart < now : false);
        if (this.activeFilter === "upcoming") return !isPast;
        if (this.activeFilter === "past") return isPast;
        return true;
      });

      if (sessionsToRender.length === 0) {
        listContainer.createEl("p", { cls: "uni-empty-schedule-text", text: t(this.plugin, "noSessionsFoundForCourse") });
        return;
      }

      sessionsToRender.forEach(session => {
        const originalIdx = allSessions.indexOf(session);
        const isPast = session.dtend ? session.dtend < now : (session.dtstart ? session.dtstart < now : false);
        const isNext = (session === nextSession);
        const isOngoing = session.dtstart && session.dtend && (now >= session.dtstart && now < session.dtend);

        const isCancelled = isSessionCancelled(session);

        const item = listContainer.createDiv({
          cls: `uni-session-row ${isCancelled ? "is-cancelled" : ""} ${isPast ? "is-past" : ""} ${isNext ? "is-next" : ""} ${isOngoing ? "is-ongoing" : ""}`
        });

        const details = parseUniDetails(session.summary, session.description, session.location);
        const color = this.plugin.getClassColor(details.category);
        item.style.setProperty("--row-accent", color);

        // Left Col
        const leftCol = item.createDiv({ cls: "uni-session-left-col" });
        leftCol.createSpan({ cls: "uni-session-index", text: `#${originalIdx + 1}` });

        const statusBadge = leftCol.createSpan({
          cls: `uni-session-status-badge ${
            isCancelled
              ? "is-cancelled"
              : (isOngoing ? "is-ongoing" : (isNext ? "is-next" : (isPast ? "is-past" : "is-future")))
          }`
        });

        let statusLabel = "";
        if (isCancelled) {
          setIcon(statusBadge, "x");
          statusLabel = t(this.plugin, "statusCancelled");
        } else if (isOngoing) {
          setIcon(statusBadge, "radio");
          statusLabel = t(this.plugin, "statusOngoing");
        } else if (isNext) {
          setIcon(statusBadge, "arrow-right");
          statusLabel = t(this.plugin, "statusNext");
        } else if (isPast) {
          setIcon(statusBadge, "check");
          statusLabel = t(this.plugin, "statusPast");
        } else {
          setIcon(statusBadge, "calendar");
          statusLabel = t(this.plugin, "statusFuture");
        }

        statusBadge.setAttribute("title", statusLabel);
        statusBadge.setAttribute("aria-label", statusLabel);

        // Center Col
        const centerCol = item.createDiv({ cls: "uni-session-center-col" });
        const dateRow = centerCol.createDiv({ cls: "uni-session-date-row" });
        dateRow.createSpan({
          cls: "uni-session-date-text",
          text: formatLocalizedDateHeader(this.plugin, session.dtstart)
        });
        dateRow.createSpan({
          cls: "uni-session-time-text",
          text: `${formatTime(session.dtstart, this.plugin)} – ${formatTime(session.dtend, this.plugin)}`
        });

        const metaRow = centerCol.createDiv({ cls: "uni-session-meta-row" });
        if (details.category) {
          const typeBadge = metaRow.createSpan({
            cls: "uni-event-type-badge",
            text: getLocalizedClassType(this.plugin, details.category, details.isExam)
          });
          typeBadge.style.backgroundColor = color;
        }
        if (details.room) {
          const roomSpan = metaRow.createSpan({ cls: "uni-session-meta-item" });
          setIcon(roomSpan, "map-pin");
          roomSpan.createSpan({ text: details.room });
        }
        if (details.lecturer) {
          const lecSpan = metaRow.createSpan({ cls: "uni-session-meta-item" });
          setIcon(lecSpan, "user");
          lecSpan.createSpan({ text: details.lecturer });
        }

        // Right Col
        const rightCol = item.createDiv({ cls: "uni-session-right-col" });

        const dateKey = session.dateKey || formatDateKey(session.dtstart);
        const targetPath = this.plugin.resolveNotePath(session, dateKey);
        const fileExists = targetPath ? this.plugin.checkFileExists(targetPath) : false;

        const noteBtn = rightCol.createEl("button", {
          cls: `uni-session-btn ${fileExists ? "is-has-note" : "is-missing-note"}`,
          attr: { "title": fileExists ? t(this.plugin, "btnOpenNote") : t(this.plugin, "btnCreateNoteShort") }
        });
        setIcon(noteBtn, fileExists ? "file-text" : "plus");
        noteBtn.createSpan({ text: fileExists ? t(this.plugin, "btnOpenNote") : t(this.plugin, "btnCreateNoteShort") });
        noteBtn.addEventListener("click", async e => {
          e.stopPropagation();
          this.close();
          if (targetPath) {
            await this.plugin.handleEventClick(session, dateKey, targetPath);
          } else {
            new CreateFolderAndNoteModal(this.app, this.plugin, {
              event: session,
              dateKey: dateKey
            }).open();
          }
        });

        const jumpBtn = rightCol.createEl("button", {
          cls: "uni-session-btn is-jump",
          attr: { "title": t(this.plugin, "btnJumpToDayInCalendar") }
        });
        setIcon(jumpBtn, "calendar");
        jumpBtn.createSpan({ text: t(this.plugin, "btnViewInSchedule") });
        jumpBtn.addEventListener("click", e => {
          e.stopPropagation();
          this.jumpToDate(session.dtstart);
        });
      });
    };

    filterAllBtn.addEventListener("click", () => {
      this.activeFilter = "all";
      filterAllBtn.addClass("is-active");
      filterUpcomingBtn.removeClass("is-active");
      filterPastBtn.removeClass("is-active");
      renderRows();
    });

    filterUpcomingBtn.addEventListener("click", () => {
      this.activeFilter = "upcoming";
      filterUpcomingBtn.addClass("is-active");
      filterAllBtn.removeClass("is-active");
      filterPastBtn.removeClass("is-active");
      renderRows();
    });

    filterPastBtn.addEventListener("click", () => {
      this.activeFilter = "past";
      filterPastBtn.addClass("is-active");
      filterAllBtn.removeClass("is-active");
      filterUpcomingBtn.removeClass("is-active");
      renderRows();
    });

    renderRows();
  }

  async jumpToDate(dtObj) {
    if (!dtObj) return;
    this.close();
    let leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    if (!leaves || leaves.length === 0) {
      await this.plugin.activateView();
      leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    }
    for (const leaf of leaves) {
      if (leaf.view) {
        leaf.view.selectedDate = new Date(dtObj.getTime());
        leaf.view.viewMonth = new Date(dtObj.getFullYear(), dtObj.getMonth(), 1);
        if (typeof leaf.view.render === "function") {
          leaf.view.render();
        }
      }
    }
  }

  getCountdownLabel(dtstart, dtend, now) {
    if (!dtstart) return "";
    if (dtend && now >= dtstart && now < dtend) {
      return t(this.plugin, "countdownOngoing");
    }
    const sessionDay = new Date(dtstart.getFullYear(), dtstart.getMonth(), dtstart.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((sessionDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      return t(this.plugin, "countdownToday", { time: formatTime(dtstart, this.plugin) });
    } else if (diffDays === 1) {
      return t(this.plugin, "countdownTomorrow", { time: formatTime(dtstart, this.plugin) });
    } else if (diffDays > 1) {
      return t(this.plugin, "countdownInDays", { days: diffDays });
    } else {
      return "";
    }
  }

  async openSubjectFolderNote() {
    const folderPath = this.plugin.resolveSubjectFolder(this.event);
    if (!folderPath) {
      new Notice(t(this.plugin, "courseHubNotFound"));
      return;
    }

    const existingFile = this.plugin.getSubjectFolderNoteFile(this.event);
    if (existingFile) {
      this.close();
      await this.plugin.openMarkdownFile(existingFile);
      return;
    }

    const cleanFolder = normalizeVaultPath(folderPath);
    const folderBaseName = cleanFolder.split("/").pop() || "";
    const cleanSummary = cleanSubjectTitle(this.event.summary || "");
    const targetFilePath = normalizeVaultPath(`${cleanFolder}/${folderBaseName || cleanSummary}.md`);

    try {
      await this.plugin.ensureFolderExists(cleanFolder);
      const initialContent = `# ${folderBaseName || cleanSummary}\n\n> 🎓 **Przedmiot:** ${cleanSummary}\n\n## 📚 Materiały i linki\n- [ ] Moodle: \n- [ ] Sylabus: \n\n## 📝 Spis notatek z zajęć\n\`\`\`dataview\nTABLE file.mtime AS "Ostatnia zmiana"\nFROM "${cleanFolder}"\nWHERE file.name != "${folderBaseName || cleanSummary}"\nSORT file.name ASC\n\`\`\`\n`;
      const createdFile = await this.app.vault.create(targetFilePath, initialContent);
      this.close();
      await this.plugin.openMarkdownFile(createdFile);
      new Notice(t(this.plugin, "courseHubCreated", { path: createdFile.basename }));
    } catch (err) {
      new Notice(`Błąd: ${err.message}`);
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

// ==========================================================================
// Main Calendar ItemView (Sidebar View)
// ==========================================================================

class UniCalendarView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.selectedDate = new Date();
    this.viewMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
  }

  getViewType() {
    return VIEW_TYPE_CALENDAR;
  }

  getDisplayText() {
    return t(this.plugin, "viewTitle");
  }

  getIcon() {
    return "graduation-cap";
  }

  async onOpen() {
    this.render();

    this.registerInterval(
      window.setInterval(() => {
        const todayKey = formatDateKey(new Date());
        const selectedKey = formatDateKey(this.selectedDate);
        if (todayKey === selectedKey) {
          this.render();
        }
      }, 30000)
    );
  }

  async onClose() {
    // Interval is automatically cleaned up via this.registerInterval
  }

  render() {
    clearActiveUniTooltip();
    const container = this.contentEl;
    container.empty();
    container.addClass("uni-calendar-container");

    this.renderMonthCard(container);
    this.renderScheduleSection(container);
  }

  renderMonthCard(parent) {
    const card = parent.createDiv({ cls: "uni-month-card" });

    const header = card.createDiv({ cls: "uni-month-header" });
    const title = header.createDiv({ cls: "uni-month-title" });
    const monthNames = t(this.plugin, "months");
    const monthName = monthNames[this.viewMonth.getMonth()];
    const year = this.viewMonth.getFullYear();
    title.setText(`${monthName} ${year}`);

    const controls = header.createDiv({ cls: "uni-header-controls" });

    const prevBtn = controls.createEl("button", {
      cls: "uni-nav-btn"
    });
    setIcon(prevBtn, "chevron-left");
    attachDelayedTooltip(prevBtn, t(this.plugin, "prevMonth"), 2000);
    prevBtn.addEventListener("click", () => {
      this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() - 1, 1);
      this.render();
    });

    const todayBtn = controls.createEl("button", {
      cls: "uni-nav-btn uni-today-btn",
      text: t(this.plugin, "today")
    });
    attachDelayedTooltip(todayBtn, t(this.plugin, "today"), 2000);
    todayBtn.addEventListener("click", () => {
      const now = new Date();
      this.selectedDate = new Date();
      this.viewMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      this.render();
    });

    const nextBtn = controls.createEl("button", {
      cls: "uni-nav-btn"
    });
    setIcon(nextBtn, "chevron-right");
    attachDelayedTooltip(nextBtn, t(this.plugin, "nextMonth"), 2000);
    nextBtn.addEventListener("click", () => {
      this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + 1, 1);
      this.render();
    });

    const syncBtn = controls.createEl("button", {
      cls: "uni-nav-btn uni-sync-btn"
    });
    setIcon(syncBtn, "refresh-cw");
    attachDelayedTooltip(syncBtn, t(this.plugin, "refreshSchedule"), 2000);
    syncBtn.addEventListener("click", async () => {
      syncBtn.addClass("is-syncing");
      try {
        const res = await this.plugin.syncCalendar(false);
        if (res && res.allLocked) {
          new Notice(t(this.plugin, "allSchedulesLockedNotice"), 6000);
        } else {
          new Notice(t(this.plugin, "refreshSuccess", { count: this.plugin.events.length }));
        }
        this.render();
      } catch (err) {
        new Notice(t(this.plugin, "refreshError") + err.message, 9000);
      } finally {
        syncBtn.removeClass("is-syncing");
      }
    });

    const settingsBtn = controls.createEl("button", {
      cls: "uni-nav-btn uni-settings-btn"
    });
    setIcon(settingsBtn, "settings");
    attachDelayedTooltip(settingsBtn, t(this.plugin, "settingsTitle"), 2000);
    settingsBtn.addEventListener("click", () => {
      this.plugin.openPluginSettings();
    });

    if (!this.plugin.settings.hideSupport) {
      const coffeeNavBtn = controls.createEl("button", {
        cls: "uni-nav-btn ai-nav-btn ai-btn-coffee uni-coffee-nav-btn",
        attr: { title: t(this.plugin, "btnBuyCoffee"), "aria-label": t(this.plugin, "btnBuyCoffee") }
      });
      setIcon(coffeeNavBtn, "coffee");
      if (!coffeeNavBtn.querySelector("svg")) {
        coffeeNavBtn.textContent = "☕";
      }
      attachDelayedTooltip(coffeeNavBtn, t(this.plugin, "btnBuyCoffee"), 2000);
      coffeeNavBtn.addEventListener("click", () => {
        window.open("https://buymeacoffee.com/cesemess", "_blank");
      });
    }

    const startOnSunday = (this.plugin.settings.firstDayOfWeek === "sunday");
    const weekdaysRow = card.createDiv({ cls: "uni-weekdays-row" });
    const baseDayLabels = t(this.plugin, "weekdaysShort");
    const dayLabels = startOnSunday
      ? [baseDayLabels[6], ...baseDayLabels.slice(0, 6)]
      : baseDayLabels;
    dayLabels.forEach(d => {
      weekdaysRow.createDiv({ text: d });
    });

    const grid = card.createDiv({ cls: "uni-days-grid" });

    const viewY = this.viewMonth.getFullYear();
    const viewM = this.viewMonth.getMonth();

    const rawFirstDay = new Date(viewY, viewM, 1).getDay();
    const firstDayIndex = startOnSunday ? rawFirstDay : ((rawFirstDay + 6) % 7);
    const daysInCurrentMonth = new Date(viewY, viewM + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewY, viewM, 0).getDate();

    const todayDateKey = formatDateKey(new Date());
    const selectedDateKey = formatDateKey(this.selectedDate);

    const eventsByDate = this.plugin.getEventsMap();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const cellDate = new Date(viewY, viewM - 1, dayNum);
      const dateKey = formatDateKey(cellDate);
      this.createDayCell(grid, cellDate, dateKey, dayNum, true, todayDateKey, selectedDateKey, eventsByDate);
    }

    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const cellDate = new Date(viewY, viewM, dayNum);
      const dateKey = formatDateKey(cellDate);
      this.createDayCell(grid, cellDate, dateKey, dayNum, false, todayDateKey, selectedDateKey, eventsByDate);
    }

    const totalRendered = firstDayIndex + daysInCurrentMonth;
    const remainingCells = (totalRendered % 7 === 0) ? 0 : (7 - (totalRendered % 7));
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const cellDate = new Date(viewY, viewM + 1, dayNum);
      const dateKey = formatDateKey(cellDate);
      this.createDayCell(grid, cellDate, dateKey, dayNum, true, todayDateKey, selectedDateKey, eventsByDate);
    }
  }

  createDayCell(grid, cellDate, dateKey, dayNum, isOtherMonth, todayDateKey, selectedDateKey, eventsByDate) {
    const cell = grid.createDiv({ cls: "uni-day-cell" });
    if (isOtherMonth) cell.addClass("is-other-month");
    if (dateKey === todayDateKey) cell.addClass("is-today");
    if (dateKey === selectedDateKey) cell.addClass("is-selected");

    cell.createSpan({ text: String(dayNum) });

    const dayEvents = eventsByDate.get(dateKey) || [];
    if (dayEvents.length > 0) {
      const dots = cell.createDiv({ cls: "uni-event-dots-container" });
      const maxDots = Math.min(dayEvents.length, 3);
      for (let k = 0; k < maxDots; k++) {
        const dot = dots.createDiv({ cls: "uni-event-dot" });
        const ev = dayEvents[k];
        if (ev) {
          const details = parseUniDetails(ev.summary, ev.description, ev.location);
          const color = this.plugin.getClassColor(details.category);
          dot.style.backgroundColor = color;
        }
      }
    }

    cell.addEventListener("click", () => {
      this.selectedDate = new Date(cellDate.getTime());
      if (isOtherMonth) {
        this.viewMonth = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
      }
      this.render();
    });
  }

  renderScheduleSection(parent) {
    const selectedDateKey = formatDateKey(this.selectedDate);
    this.plugin.renderScheduleTimeline(parent, selectedDateKey, () => this.render());
  }
}

// ==========================================================================
// Settings Tab (Tabbed Sub-Views)
// ==========================================================================

// --------------------------------------------------------------------------
// Helper: Ensure unique schedule source names (prevents duplicate calendar collisions)
// --------------------------------------------------------------------------
function getUniqueScheduleSourceName(sources, baseName, excludeSourceId = null, plugin = null) {
  const fallback = plugin ? t(plugin, "defaultCalendarName") : "Calendar";
  const cleanBase = (baseName || fallback).trim();
  const existingNames = new Set(
    (sources || [])
      .filter(s => s && s.id !== excludeSourceId && s.name)
      .map(s => s.name.trim().toLowerCase())
  );

  if (!existingNames.has(cleanBase.toLowerCase())) {
    return cleanBase;
  }

  const match = cleanBase.match(/^(.*?)\s*\((\d+)\)$/);
  const root = match ? match[1].trim() : cleanBase;
  let counter = match ? parseInt(match[2], 10) + 1 : 2;

  while (existingNames.has(`${root} (${counter})`.toLowerCase())) {
    counter++;
  }
  return `${root} (${counter})`;
}

class UniCalendarSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.activeTab = (plugin.settings && plugin.settings.activeTab) || "about";
    this.collapsedMappingSources = new Set();
    this.collapsedExclusionSources = new Set();
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("ai-settings-container");
    containerEl.addClass("uni-settings-container");

    // 1. Sleek Single-Line Coffee Bar at the Very Top (Strictly preserved Buy Me a Coffee element)
    if (!this.plugin.settings.hideSupport) {
      const coffeeBanner = containerEl.createDiv({ cls: "ai-coffee-banner uni-coffee-banner" });
      const barLeft = coffeeBanner.createDiv({ cls: "ai-coffee-banner-left uni-coffee-banner-left" });
      barLeft.createSpan({ cls: "ai-coffee-banner-icon uni-coffee-banner-icon", text: "☕" });
      const barText = barLeft.createDiv({ cls: "ai-coffee-banner-text uni-coffee-banner-text" });
      barText.createEl("strong", { text: t(this.plugin, "coffeeBannerText") });

      const coffeeBtn = coffeeBanner.createEl("a", {
        cls: "ai-coffee-btn uni-coffee-btn",
        attr: { href: "https://buymeacoffee.com/cesemess", target: "_blank" }
      });
      appendCoffeeButtonContent(coffeeBtn, t(this.plugin, "coffeeBannerBtn"));
    }

    // 2. Compact Tab Bar
    const tabBar = containerEl.createDiv({ cls: "ai-settings-tab-bar uni-settings-tab-bar" });

    const tabs = [
      { id: "about", label: t(this.plugin, "tabAbout"), icon: "sparkles" },
      { id: "general", label: t(this.plugin, "tabGeneral"), icon: "calendar" },
      { id: "mapping", label: t(this.plugin, "tabMapping"), icon: "file-text" },
      { id: "exclusions", label: t(this.plugin, "tabExclusions"), icon: "eye-off" },
      { id: "colors", label: t(this.plugin, "tabColors"), icon: "palette" },
      { id: "language", label: t(this.plugin, "tabLanguage"), icon: "globe" }
    ];

    tabs.forEach(tab => {
      const btn = tabBar.createEl("button", {
        cls: `ai-settings-tab-btn uni-settings-tab-btn ${this.activeTab === tab.id ? "is-active" : ""}`
      });
      setIcon(btn.createSpan(), tab.icon);
      btn.createSpan({ text: tab.label });

      btn.addEventListener("click", () => {
        this.activeTab = tab.id;
        this.plugin.settings.activeTab = tab.id;
        this.plugin.saveSettings();
        this.display();
      });
    });

    const content = containerEl.createDiv({ cls: "ai-settings-tab-content uni-settings-content" });

    switch (this.activeTab) {
      case "about":
        this.renderAboutTab(content);
        break;
      case "general":
        this.renderGeneralTab(content);
        break;
      case "language":
        this.renderLanguageTab(content);
        break;
      case "mapping":
        this.renderMappingTab(content);
        break;
      case "exclusions":
        this.renderExclusionsTab(content);
        break;
      case "colors":
        this.renderCategoriesTab(content);
        break;
    }
  }

  // ------------------------------------------------------------------------
  // Tab 1: Informacje (Szybki start, Język, Poradnik, Wsparcie, O projekcie)
  // ------------------------------------------------------------------------
  renderAboutTab(container) {
    const wrap = container.createDiv({ cls: "ai-about-container uni-about-container" });

    // 1. Szybki start
    const qsCard = wrap.createDiv({ cls: "ai-card uni-card" });
    const qsHeader = qsCard.createDiv({ cls: "ai-card-header uni-card-header" });
    setIcon(qsHeader.createSpan(), "rocket");
    qsHeader.createDiv({ cls: "ai-card-title uni-card-title", text: t(this.plugin, "qsTitle") });

    const steps = qsCard.createDiv({ cls: "ai-about-steps uni-about-steps" });

    // Step 1
    const s1 = steps.createDiv({ cls: "ai-about-step uni-about-step" });
    s1.createSpan({ cls: "ai-about-step-num uni-about-step-num", text: "1" });
    const s1Text = s1.createDiv();
    s1Text.createEl("strong", { text: t(this.plugin, "qsStep1Title") });
    s1Text.createSpan({ text: t(this.plugin, "qsStep1Desc") });

    // Step 2
    const s2 = steps.createDiv({ cls: "ai-about-step uni-about-step" });
    s2.createSpan({ cls: "ai-about-step-num uni-about-step-num", text: "2" });
    const s2Text = s2.createDiv();
    s2Text.createEl("strong", { text: t(this.plugin, "qsStep2Title") });
    s2Text.createSpan({ text: t(this.plugin, "qsStep2Desc") });

    // Step 3
    const s3 = steps.createDiv({ cls: "ai-about-step uni-about-step" });
    s3.createSpan({ cls: "ai-about-step-num uni-about-step-num", text: "3" });
    const s3Text = s3.createDiv();
    s3Text.createEl("strong", { text: t(this.plugin, "qsStep3Title") });
    s3Text.createSpan({ text: t(this.plugin, "qsStep3Desc") });

    // 2. Jak działa wtyczka / Poradnik
    const guideCard = wrap.createDiv({ cls: "ai-card ai-guide-card uni-card uni-guide-card" });
    const guideHeader = guideCard.createDiv({ cls: "ai-card-header uni-card-header" });
    setIcon(guideHeader.createSpan(), "book-open");
    guideHeader.createDiv({ cls: "ai-card-title uni-card-title", text: t(this.plugin, "guideTitle") });

    const g1 = guideCard.createDiv({ cls: "ai-guide-item uni-guide-item" });
    const g1Icon = g1.createDiv({ cls: "ai-guide-item-icon uni-guide-item-icon" });
    setIcon(g1Icon, "calendar");
    const g1Content = g1.createDiv({ cls: "ai-guide-item-content uni-guide-item-content" });
    g1Content.createEl("div", { cls: "ai-guide-item-title uni-guide-item-title", text: t(this.plugin, "guide1Title") });
    g1Content.createEl("p", { text: t(this.plugin, "guide1Desc") });

    const g2 = guideCard.createDiv({ cls: "ai-guide-item uni-guide-item" });
    const g2Icon = g2.createDiv({ cls: "ai-guide-item-icon uni-guide-item-icon" });
    setIcon(g2Icon, "file-text");
    const g2Content = g2.createDiv({ cls: "ai-guide-item-content uni-guide-item-content" });
    g2Content.createEl("div", { cls: "ai-guide-item-title uni-guide-item-title", text: t(this.plugin, "guide2Title") });
    g2Content.createEl("p", { text: t(this.plugin, "guide2Desc") });

    const g3 = guideCard.createDiv({ cls: "ai-guide-item uni-guide-item" });
    const g3Icon = g3.createDiv({ cls: "ai-guide-item-icon uni-guide-item-icon" });
    setIcon(g3Icon, "graduation-cap");
    const g3Content = g3.createDiv({ cls: "ai-guide-item-content uni-guide-item-content" });
    g3Content.createEl("div", { cls: "ai-guide-item-title uni-guide-item-title", text: t(this.plugin, "guide3Title") });
    g3Content.createEl("p", { text: t(this.plugin, "guide3Desc") });
    const bullets = g3Content.createEl("ul", { cls: "ai-guide-bullets uni-guide-bullets" });
    bullets.createEl("li", { text: t(this.plugin, "guideBullet1") });
    bullets.createEl("li", { text: t(this.plugin, "guideBullet2") });
    bullets.createEl("li", { text: t(this.plugin, "guideBullet3") });

    const callout = guideCard.createDiv({ cls: "ai-guide-callout uni-guide-callout" });
    const calloutIcon = callout.createDiv({ cls: "ai-guide-callout-icon uni-guide-callout-icon" });
    setIcon(calloutIcon, "check-circle-2");
    const calloutText = callout.createDiv({ cls: "ai-guide-callout-text uni-guide-callout-text" });
    calloutText.createEl("strong", { text: t(this.plugin, "guideCalloutTitle") });
    calloutText.createSpan({ text: t(this.plugin, "guideCalloutText") });

    // 4. Karta wsparcia
    const coffeeCard = wrap.createDiv({ cls: "ai-card ai-about-coffee-card uni-card uni-about-coffee-card" });
    const coffeeHeader = coffeeCard.createDiv({ cls: "ai-card-header uni-card-header" });
    coffeeHeader.createSpan({ text: "☕", cls: "ai-about-coffee-icon uni-about-coffee-icon" });
    coffeeHeader.createDiv({ cls: "ai-card-title uni-card-title", text: t(this.plugin, "supportTitle") });

    coffeeCard.createEl("p", {
      cls: "ai-card-desc uni-card-desc",
      text: t(this.plugin, "supportDesc")
    });

    const coffeeBtnRow = coffeeCard.createDiv({ cls: "ai-about-coffee-btn-wrap uni-about-coffee-btn-wrap" });
    const coffeeBtn = coffeeBtnRow.createEl("a", {
      cls: "ai-coffee-btn ai-coffee-btn-full uni-coffee-btn uni-coffee-btn-full",
      attr: { href: "https://buymeacoffee.com/cesemess", target: "_blank" }
    });
    appendCoffeeButtonContent(coffeeBtn, t(this.plugin, "supportBtnText"));

    new Setting(coffeeCard)
      .setName(t(this.plugin, "hideSupportName"))
      .setDesc(t(this.plugin, "hideSupportDesc"))
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.hideSupport === true)
          .onChange(async val => {
            this.plugin.settings.hideSupport = val;
            this.plugin.settings.showCoffeeBanner = !val;
            this.plugin.settings.showCoffeeIcon = !val;
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
            this.display();
          });
      });

    // 5. O projekcie
    const linksCard = wrap.createDiv({ cls: "ai-card uni-card" });
    const linksHeader = linksCard.createDiv({ cls: "ai-card-header ai-project-header uni-card-header uni-project-header" });

    const headerLeft = linksHeader.createDiv({ cls: "ai-project-header-left uni-project-header-left" });
    setIcon(headerLeft.createSpan(), "info");
    headerLeft.createDiv({ cls: "ai-card-title uni-card-title", text: t(this.plugin, "linksTitle") });

    const badges = linksHeader.createDiv({ cls: "ai-project-header-badges uni-project-header-badges" });
    const vBadge = badges.createSpan({ cls: "ai-about-badge ai-about-badge-version uni-about-badge uni-about-badge-version" });
    vBadge.textContent = "v" + (this.plugin.manifest?.version || "1.1.0");

    badges.createEl("a", {
      cls: "ai-about-badge uni-about-badge",
      text: `${t(this.plugin, "heroAuthor")}: Cesemess`,
      attr: { href: "https://github.com/Cesemess", target: "_blank" }
    });

    const btnRow = linksCard.createDiv({ cls: "ai-about-btn-row uni-about-btn-row" });

    const ghBtn = btnRow.createEl("a", {
      cls: "ai-about-action-btn uni-about-action-btn",
      attr: { href: "https://github.com/Cesemess/obsidian-uni-calendar", target: "_blank" }
    });
    setIcon(ghBtn.createSpan(), "github");
    ghBtn.createSpan({ text: t(this.plugin, "linksGithub") });

    const issueBtn = btnRow.createEl("a", {
      cls: "ai-about-action-btn uni-about-action-btn",
      attr: { href: "https://github.com/Cesemess/obsidian-uni-calendar/issues", target: "_blank" }
    });
    setIcon(issueBtn.createSpan(), "bug");
    issueBtn.createSpan({ text: t(this.plugin, "linksIssues") });
  }

  // ------------------------------------------------------------------------
  // Tab 1: General (Multi-Schedule Manager, Folder Dropdown, Note Format)
  // ------------------------------------------------------------------------
  renderGeneralTab(container) {
    let urlInputValue = "";

    // Clean, structured "Add Class Schedule" card
    const addCard = container.createDiv({ cls: "uni-add-schedule-card" });

    const addHeader = addCard.createDiv({ cls: "uni-add-schedule-header" });
    const addTitleRow = addHeader.createDiv({ cls: "uni-add-schedule-title-row" });
    const addTitleIcon = addTitleRow.createSpan({ cls: "uni-add-schedule-title-icon" });
    setIcon(addTitleIcon, "calendar-plus");
    addTitleRow.createSpan({
      cls: "uni-add-schedule-title",
      text: t(this.plugin, "urlSettingName")
    });

    addHeader.createDiv({
      cls: "uni-add-schedule-desc",
      text: t(this.plugin, "urlSettingDescShort")
    });

    const urlRow = addCard.createDiv({ cls: "uni-add-schedule-url-row" });
    const urlInputEl = urlRow.createEl("input", {
      type: "text",
      cls: "uni-add-schedule-url-input",
      attr: { placeholder: t(this.plugin, "urlPlaceholder") }
    });
    urlInputEl.addEventListener("input", e => {
      urlInputValue = e.target.value.trim();
    });

    const downloadBtn = urlRow.createEl("button", {
      cls: "mod-cta uni-add-url-btn",
      text: t(this.plugin, "btnDownloadNow")
    });
    attachDelayedTooltip(downloadBtn, t(this.plugin, "btnDownloadNow"));

    const triggerDownloadFromUrl = async () => {
      const val = urlInputEl.value.trim();
      if (!val) {
        new Notice(t(this.plugin, "errNoScheduleSource"));
        return;
      }
      downloadBtn.setText(t(this.plugin, "btnDownloading"));
      downloadBtn.disabled = true;
      try {
        await this.plugin.addUrlScheduleSource(val);
        new Notice(t(this.plugin, "refreshSuccess", { count: this.plugin.events.length }));
        this.display();
      } catch (err) {
        new Notice(t(this.plugin, "refreshError") + err.message, 9000);
      } finally {
        downloadBtn.setText(t(this.plugin, "btnDownloadNow"));
        downloadBtn.disabled = false;
      }
    };

    downloadBtn.addEventListener("click", triggerDownloadFromUrl);
    urlInputEl.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerDownloadFromUrl();
      }
    });

    const hiddenFileInput = addCard.createEl("input", {
      type: "file",
      attr: { accept: ".ics,text/calendar" }
    });
    hiddenFileInput.addClass("uni-hidden-input");
    hiddenFileInput.addEventListener("change", async e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async ev => {
        try {
          const content = ev.target.result;
          if (!content || !content.includes("BEGIN:VCALENDAR")) {
            new Notice(t(this.plugin, "invalidIcsError"));
            return;
          }

          await this.plugin.addFileScheduleSource(file.name, content);
          new Notice(t(this.plugin, "icsLoadedSuccess", { name: file.name, count: this.plugin.events.length }));
          this.display();
        } catch (err) {
          new Notice(t(this.plugin, "fileLoadError") + err.message);
        }
      };
      reader.readAsText(file);
    });

    const uploadRow = addCard.createDiv({ cls: "uni-add-schedule-upload-row" });
    const uploadBtn = uploadRow.createEl("button", {
      cls: "uni-keyword-btn uni-action-btn uni-upload-ics-btn"
    });
    const uploadIconSpan = uploadBtn.createSpan({ cls: "uni-btn-icon-wrap" });
    setIcon(uploadIconSpan, "file-up");
    uploadBtn.createSpan({ text: t(this.plugin, "btnUploadIcs") });
    attachDelayedTooltip(uploadBtn, t(this.plugin, "uploadIcsDesc"));
    uploadBtn.addEventListener("click", () => {
      hiddenFileInput.click();
    });

    const publicTipBox = addCard.createDiv({ cls: "uni-public-calendar-hint" });
    const tipIcon = publicTipBox.createSpan({ cls: "uni-public-calendar-hint-icon" });
    setIcon(tipIcon, "info");
    publicTipBox.createSpan({
      cls: "uni-public-calendar-hint-text",
      text: t(this.plugin, "publicCalendarTip")
    });

    // Added Schedules List Section
    const schedulesBox = container.createDiv({ cls: "uni-schedules-section" });
    schedulesBox.createDiv({
      cls: "uni-schedules-section-title",
      text: t(this.plugin, "addedSchedulesTitle")
    });

    const sources = this.plugin.settings.scheduleSources || [];
    if (sources.length === 0) {
      schedulesBox.createDiv({
        cls: "uni-schedules-empty",
        text: t(this.plugin, "noSchedulesAdded")
      });
    } else {
      const listEl = schedulesBox.createDiv({ cls: "uni-schedules-list" });

      sources.forEach(src => {
        const isHidden = Boolean(src.hidden);
        const isLocked = Boolean(src.locked);
        const isShowCalName = Boolean(src.showNameOnEvent);
        const displayName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : "schedule.ics");

        const itemEl = listEl.createDiv({
          cls: `uni-schedule-source-item ${isHidden ? "is-hidden-source" : ""} ${isLocked ? "is-locked-source" : ""}`
        });

        const leftInfo = itemEl.createDiv({ cls: "uni-schedule-source-info" });
        const titleRow = leftInfo.createDiv({ cls: "uni-schedule-source-title-row" });

        const iconSpan = titleRow.createSpan({ cls: "uni-schedule-source-icon" });
        setIcon(iconSpan, src.type === "url" ? "globe" : "file-text");
        attachDelayedTooltip(iconSpan, src.type === "url" ? t(this.plugin, "scheduleTypeUrl") : t(this.plugin, "scheduleTypeFile"));

        const nameSpan = titleRow.createSpan({
          cls: "uni-schedule-source-name",
          text: displayName
        });
        attachDelayedTooltip(nameSpan, t(this.plugin, "btnRenameSource"));

        const parsedEventsCount = (this.plugin.sourceRawEventCounts && this.plugin.sourceRawEventCounts.get(src.id)) ?? 0;
        titleRow.createSpan({
          cls: "uni-schedule-source-badge",
          text: formatClassesCount(this.plugin, parsedEventsCount)
        });

        if (isShowCalName) {
          titleRow.createSpan({
            cls: "uni-schedule-source-calname-badge",
            text: t(this.plugin, "badgeCalNameShown")
          });
        }

        if (isLocked) {
          titleRow.createSpan({
            cls: "uni-schedule-source-locked-badge",
            text: t(this.plugin, "badgeLockedSource")
          });
        }

        if (isHidden) {
          titleRow.createSpan({
            cls: "uni-schedule-source-hidden-badge",
            text: t(this.plugin, "badgeHiddenSource")
          });
        }

        const subText = src.type === "url"
          ? `${t(this.plugin, "scheduleTypeUrl")}: ${src.url}`
          : t(this.plugin, "scheduleTypeFile");
        leftInfo.createDiv({
          cls: "uni-schedule-source-sub",
          text: subText
        });

        const actionsEl = itemEl.createDiv({ cls: "uni-schedule-source-actions" });

        const startRename = () => {
          clearActiveUniTooltip();
          leftInfo.empty();
          actionsEl.empty();

          const editInput = leftInfo.createEl("input", {
            type: "text",
            cls: "uni-schedule-rename-input",
            value: displayName,
            attr: { placeholder: t(this.plugin, "renameSourcePlaceholder") }
          });

          const saveBtn = actionsEl.createEl("button", {
            cls: "uni-keyword-btn mod-cta",
            text: t(this.plugin, "btnSaveKeyword")
          });
          const cancelBtn = actionsEl.createEl("button", {
            cls: "uni-keyword-btn",
            text: t(this.plugin, "modalCancel")
          });

          const commitRename = async () => {
            const newVal = editInput.value.trim();
            if (!newVal) return;

            const isDuplicate = (this.plugin.settings.scheduleSources || []).some(
              s => s.id !== src.id && s.name && s.name.trim().toLowerCase() === newVal.toLowerCase()
            );

            if (isDuplicate) {
              new Notice(t(this.plugin, "errDuplicateCalendarName", { name: newVal }), 5000);
              editInput.addClass("is-invalid");
              editInput.focus();
              return;
            }

            await this.plugin.renameScheduleSource(src.id, newVal);
            new Notice(t(this.plugin, "scheduleRenamedNotice", { name: newVal }));
            this.display();
          };

          editInput.focus();
          editInput.select();

          editInput.addEventListener("input", () => {
            const testVal = editInput.value.trim().toLowerCase();
            const isDup = (this.plugin.settings.scheduleSources || []).some(
              s => s.id !== src.id && s.name && s.name.trim().toLowerCase() === testVal
            );
            if (isDup) {
              editInput.addClass("is-invalid");
              saveBtn.disabled = true;
            } else {
              editInput.removeClass("is-invalid");
              saveBtn.disabled = false;
            }
          });

          editInput.addEventListener("keydown", async e => {
            if (e.key === "Enter") {
              e.preventDefault();
              await commitRename();
            } else if (e.key === "Escape") {
              this.display();
            }
          });

          saveBtn.addEventListener("click", commitRename);
          cancelBtn.addEventListener("click", () => this.display());
        };

        nameSpan.addEventListener("click", startRename);

        const renameBtn = actionsEl.createEl("button", {
          cls: "uni-keyword-btn btn-rename-source"
        });
        setIcon(renameBtn, "pencil");
        attachDelayedTooltip(renameBtn, t(this.plugin, "btnRenameSource"));
        renameBtn.addEventListener("click", startRename);

        const toggleCalNameBtn = actionsEl.createEl("button", {
          cls: `uni-keyword-btn ${isShowCalName ? "btn-calname-active" : "btn-calname-inactive"}`
        });
        setIcon(toggleCalNameBtn, "calendar");
        attachDelayedTooltip(
          toggleCalNameBtn,
          t(this.plugin, isShowCalName ? "btnHideCalNameOnEvents" : "btnShowCalNameOnEvents")
        );
        toggleCalNameBtn.addEventListener("click", async () => {
          const nowShown = await this.plugin.toggleScheduleSourceShowName(src.id);
          new Notice(t(this.plugin, nowShown ? "calNameShownNotice" : "calNameHiddenNotice", { name: displayName }));
          this.display();
        });

        const toggleLockBtn = actionsEl.createEl("button", {
          cls: `uni-keyword-btn ${isLocked ? "btn-locked-source" : "btn-unlock-source"}`
        });
        setIcon(toggleLockBtn, isLocked ? "lock" : "unlock");
        attachDelayedTooltip(toggleLockBtn, t(this.plugin, isLocked ? "btnUnlockSource" : "btnLockSource"));
        toggleLockBtn.addEventListener("click", async () => {
          const nowLocked = await this.plugin.toggleScheduleSourceLock(src.id);
          new Notice(t(this.plugin, nowLocked ? "scheduleLockedNotice" : "scheduleUnlockedNotice", { name: displayName }));
          this.display();
        });

        const toggleHideBtn = actionsEl.createEl("button", {
          cls: `uni-keyword-btn ${isHidden ? "btn-show-source" : "btn-hide-source"}`
        });
        setIcon(toggleHideBtn, isHidden ? "eye" : "eye-off");
        attachDelayedTooltip(toggleHideBtn, t(this.plugin, isHidden ? "btnShowSource" : "btnHideSource"));
        toggleHideBtn.addEventListener("click", async () => {
          const nowHidden = await this.plugin.toggleScheduleSourceVisibility(src.id);
          new Notice(t(this.plugin, nowHidden ? "scheduleHiddenNotice" : "scheduleShownNotice", { name: displayName }));
          this.display();
        });

        if (src.type === "url" && src.url) {
          const refreshBtn = actionsEl.createEl("button", {
            cls: `uni-keyword-btn btn-refresh-source uni-btn-refresh-source ${isLocked ? "is-disabled-locked" : ""}`
          });
          setIcon(refreshBtn, "refresh-cw");
          attachDelayedTooltip(refreshBtn, isLocked ? t(this.plugin, "btnUnlockSource") : t(this.plugin, "btnRefreshSource"));
          refreshBtn.addEventListener("click", async () => {
            if (src.locked) {
              new Notice(t(this.plugin, "allSchedulesLockedNotice"));
              return;
            }
            refreshBtn.disabled = true;
            try {
              await this.plugin.refreshSingleSource(src.id);
              new Notice(t(this.plugin, "refreshSuccess", { count: this.plugin.events.length }));
              this.display();
            } catch (err) {
              new Notice(t(this.plugin, "refreshError") + err.message, 9000);
            } finally {
              refreshBtn.disabled = false;
            }
          });
        }

        const delBtn = actionsEl.createEl("button", {
          cls: "uni-keyword-btn btn-delete"
        });
        setIcon(delBtn, "trash-2");
        attachDelayedTooltip(delBtn, t(this.plugin, "btnDeleteSource"));
        delBtn.addEventListener("click", () => {
          clearActiveUniTooltip();
          new ConfirmDeleteScheduleModal(this.app, this.plugin, displayName, async () => {
            await this.plugin.removeScheduleSource(src.id);
            new Notice(t(this.plugin, "scheduleRemovedNotice", { name: displayName }));
            this.display();
          }).open();
        });
      });
    }

    const exportSetting = new Setting(container)
      .setName(t(this.plugin, "btnExportIcs"))
      .setDesc(t(this.plugin, "exportIcsDesc"));

    const exportBtn = exportSetting.controlEl.createEl("button", {
      cls: "uni-keyword-btn uni-action-btn uni-export-ics-btn"
    });
    const exportIconSpan = exportBtn.createSpan({ cls: "uni-btn-icon-wrap" });
    setIcon(exportIconSpan, "download");
    exportBtn.createSpan({ text: t(this.plugin, "btnExportIcs") });
    attachDelayedTooltip(exportBtn, t(this.plugin, "btnExportIcs"));
    exportBtn.addEventListener("click", async () => {
      await this.plugin.exportCleanIcs();
    });

    // Automatic Synchronization Card
    const syncCard = container.createDiv({ cls: "uni-settings-card uni-sync-card" });
    new Setting(syncCard)
      .setName(t(this.plugin, "syncStartupName"))
      .setDesc(t(this.plugin, "syncStartupDesc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoSyncOnStartup)
        .onChange(async value => {
          this.plugin.settings.autoSyncOnStartup = value;
          await this.plugin.saveSettings();
        }));


  }

  // ------------------------------------------------------------------------
  // Tab 2: Język i region (Polski, Format daty, Pierwszy dzień, 24h/12h)
  // ------------------------------------------------------------------------
  renderLanguageTab(container) {
    new Setting(container).setName(t(this.plugin, "langTitle")).setHeading();
    container.createEl("p", {
      cls: "uni-settings-section-desc",
      text: t(this.plugin, "langDesc")
    });

    new Setting(container)
      .setName(t(this.plugin, "langSelectLabel"))
      .setDesc(t(this.plugin, "langSelectDesc"))
      .addDropdown(dropdown => {
        dropdown
          .addOption("auto", `🌐 ${t(this.plugin, "langAuto")}`)
          .addOption("en", "🇺🇸/🇬🇧 English")
          .addOption("de", "🇩🇪 Deutsch")
          .addOption("fr", "🇫🇷 Français")
          .addOption("es", "🇪🇸 Español")
          .addOption("zh", "🇨🇳 简体中文")
          .addOption("ja", "🇯🇵 日本語")
          .addOption("ko", "🇰🇷 한국어")
          .addOption("pt", "🇧🇷/🇵🇹 Português")
          .addOption("it", "🇮🇹 Italiano")
          .addOption("ru", "🇷🇺 Русский")
          .addOption("pl", "🇵🇱 Polski")
          .setValue(this.plugin.settings.language || "auto")
          .onChange(async val => {
            this.plugin.settings.language = val;
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
            this.display();
          });
      });

    new Setting(container).setName(t(this.plugin, "regionTitle")).setHeading();
    container.createEl("p", {
      cls: "uni-settings-section-desc",
      text: t(this.plugin, "regionDesc")
    });

    new Setting(container)
      .setName(t(this.plugin, "dateFormatSetting"))
      .setDesc(t(this.plugin, "dateFormatDesc"))
      .addDropdown(dropdown => {
        populateDateFormatDropdown(dropdown, this.plugin.settings.dateFormat, this.plugin);
        dropdown.onChange(async val => {
          this.plugin.settings.dateFormat = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        });
      });

    new Setting(container)
      .setName(t(this.plugin, "firstDayOfWeekSetting"))
      .setDesc(t(this.plugin, "firstDayOfWeekDesc"))
      .addDropdown(dropdown => dropdown
        .addOption("monday", `📅 ${t(this.plugin, "firstDayMonday")}`)
        .addOption("sunday", `☀️ ${t(this.plugin, "firstDaySunday")}`)
        .setValue(this.plugin.settings.firstDayOfWeek || "monday")
        .onChange(async val => {
          this.plugin.settings.firstDayOfWeek = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    new Setting(container)
      .setName(t(this.plugin, "timeFormatSetting"))
      .setDesc(t(this.plugin, "timeFormatDesc"))
      .addDropdown(dropdown => dropdown
        .addOption("24h", `🕒 ${t(this.plugin, "timeFormat24h")}`)
        .addOption("12h", `🕧 ${t(this.plugin, "timeFormat12h")}`)
        .setValue(this.plugin.settings.timeFormat || "24h")
        .onChange(async val => {
          this.plugin.settings.timeFormat = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));
  }

  // ------------------------------------------------------------------------
  // Tab 3: Folder Mapping (Two-Column List with Auto-Status & 1-Click Create)
  // ------------------------------------------------------------------------
  renderMappingTab(container) {
    const notesContainer = container.createDiv({ cls: "uni-notes-container" });

    // ------------------------------------------------------------------------
    // Card 1: Ustawienia plików notatek (Folder & Filename)
    // ------------------------------------------------------------------------
    const filesCard = notesContainer.createDiv({ cls: "uni-settings-card uni-notes-files-card" });
    const filesHeader = filesCard.createDiv({ cls: "uni-settings-card-header" });
    filesHeader.createSpan({ cls: "uni-settings-card-icon", text: "📁" });
    const filesTitleGroup = filesHeader.createDiv({ cls: "uni-settings-card-title-group" });
    filesTitleGroup.createDiv({ cls: "uni-settings-card-title", text: t(this.plugin, "notesSettingsTitle") });
    filesTitleGroup.createEl("p", { cls: "uni-settings-card-desc", text: t(this.plugin, "notesSettingsDesc") });

    const vaultFolders = this.plugin.app.vault.getAllLoadedFiles()
      .filter(f => f instanceof TFolder)
      .map(f => normalizeVaultPath(f.path))
      .filter(p => p.length > 0 && !/(^|\/)(bez nazwy|untitled)(\s+\d+)?$/i.test(p))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    new Setting(filesCard)
      .setName(t(this.plugin, "baseFolderSetting"))
      .setDesc(t(this.plugin, "baseFolderDesc"))
      .addDropdown(dropdown => {
        dropdown.addOption("", t(this.plugin, "optVaultRoot"));

        const currentBase = normalizeVaultPath(this.plugin.settings.baseFolder || "");
        if (currentBase && !vaultFolders.includes(currentBase)) {
          dropdown.addOption(currentBase, `📁 ${currentBase}`);
        }

        vaultFolders.forEach(folderPath => {
          dropdown.addOption(folderPath, `📁 ${folderPath}`);
        });

        dropdown.setValue(currentBase);
        dropdown.onChange(async value => {
          this.plugin.settings.baseFolder = normalizeVaultPath(value);
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        });
      });

    new Setting(filesCard)
      .setName(t(this.plugin, "noteNameFormatSetting"))
      .setDesc(t(this.plugin, "noteNameFormatDesc"))
      .addText(text => text
        .setPlaceholder("{date} - {subject}")
        .setValue(this.plugin.settings.noteNameFormat || "{date} - {subject}")
        .onChange(async value => {
          this.plugin.settings.noteNameFormat = value.trim() || "{date} - {subject}";
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    // ------------------------------------------------------------------------
    // Card 2: Szablon treści notatki (Markdown Template)
    // ------------------------------------------------------------------------
    const tplCard = notesContainer.createDiv({ cls: "uni-settings-card uni-notes-template-card" });
    const tplHeader = tplCard.createDiv({ cls: "uni-settings-card-header" });
    tplHeader.createSpan({ cls: "uni-settings-card-icon", text: "📝" });
    const tplTitleGroup = tplHeader.createDiv({ cls: "uni-settings-card-title-group" });
    tplTitleGroup.createDiv({ cls: "uni-settings-card-title", text: t(this.plugin, "notesTemplateSectionTitle") });
    tplTitleGroup.createEl("p", { cls: "uni-settings-card-desc", text: t(this.plugin, "templateDesc") });

    const templateHeaderSetting = new Setting(tplCard)
      .setName(t(this.plugin, "templateHeader"))
      .setDesc(t(this.plugin, "templateDesc"))
      .addButton(btn => btn
        .setButtonText(t(this.plugin, "btnOpenTemplateBuilder"))
        .setIcon("sparkles")
        .setCta()
        .onClick(() => {
          new NoteTemplateBuilderModal(this.app, this.plugin, () => this.display()).open();
        }));

    templateHeaderSetting.settingEl.addClass("uni-template-header-setting");

    new Setting(tplCard)
      .addTextArea(area => {
        area.inputEl.rows = 7;
        area.inputEl.addClass("uni-template-textarea");
        area.setValue(this.plugin.settings.noteTemplate || "")
          .onChange(async value => {
            this.plugin.settings.noteTemplate = value;
            await this.plugin.saveSettings();
          });
      });

    // ------------------------------------------------------------------------
    // Card 3: Mapowanie folderów dla przedmiotów
    // ------------------------------------------------------------------------
    const mapCard = notesContainer.createDiv({ cls: "uni-settings-card uni-notes-mapping-card" });
    const mapHeader = mapCard.createDiv({ cls: "uni-settings-card-header" });
    mapHeader.createSpan({ cls: "uni-settings-card-icon", text: "🗂️" });
    const mapTitleGroup = mapHeader.createDiv({ cls: "uni-settings-card-title-group" });
    mapTitleGroup.createDiv({ cls: "uni-settings-card-title", text: t(this.plugin, "notesFolderCardTitle") });
    mapTitleGroup.createEl("p", { cls: "uni-settings-card-desc", text: t(this.plugin, "mappingDesc") });

    new Setting(mapCard)
      .setName(t(this.plugin, "cleanSubjectNamesSetting"))
      .setDesc(t(this.plugin, "cleanSubjectNamesDesc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.cleanSubjectNames)
        .onChange(async value => {
          this.plugin.settings.cleanSubjectNames = value;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
          this.display();
        }));

    new Setting(mapCard)
      .setName(t(this.plugin, "autoFindFolderSetting"))
      .setDesc(t(this.plugin, "autoFindFolderDesc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoFindFolder)
        .onChange(async value => {
          this.plugin.settings.autoFindFolder = value;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
          this.display();
        }));

    const sources = this.plugin.settings.scheduleSources || [];
    if (sources.length === 0) {
      mapCard.createEl("div", {
        cls: "uni-empty-schedule",
        text: t(this.plugin, "noSubjectsFound")
      });
    } else {
      const groupsContainer = mapCard.createDiv({ cls: "uni-calendar-groups-container" });
      const renderedSubjectsAll = new Set();

      const renderMappingRow = (parentTable, subjectName) => {
        const row = parentTable.createDiv({ cls: "uni-mapping-row" });

        const leftCol = row.createDiv({ cls: "uni-mapping-subject" });
        leftCol.createDiv({ cls: "uni-mapping-subject-title", text: subjectName });

        const cleanedTitle = this.plugin.settings.cleanSubjectNames ? cleanSubjectTitle(subjectName) : subjectName;
        const cleaned = sanitizeFileName(cleanedTitle || t(this.plugin, "defaultCourseName"));
        const suggestedFolder = this.plugin.settings.baseFolder
          ? `${normalizeVaultPath(this.plugin.settings.baseFolder)}/${cleaned}`
          : cleaned;

        const rawTarget = this.plugin.settings.subjectFolderMappings[subjectName] || "";
        const currentTarget = rawTarget.replace(/\/(bez nazwy|untitled)(\s+\d+)?$/gi, "");
        if (rawTarget && rawTarget !== currentTarget) {
          this.plugin.settings.subjectFolderMappings[subjectName] = currentTarget;
        }

        let autoMatchedFolder = null;
        if (this.plugin.settings.autoFindFolder) {
          autoMatchedFolder = this.plugin.findExistingVaultFolder(cleanSubjectTitle(subjectName), subjectName);
        }

        // Status tag
        let statusTagText = "";
        let isMatched = false;

        if (currentTarget && currentTarget !== "__NONE__") {
          statusTagText = `${t(this.plugin, "statusManuallyMapped")} ${currentTarget}`;
          isMatched = true;
        } else if (currentTarget === "__NONE__") {
          statusTagText = t(this.plugin, "statusIgnored");
          isMatched = false;
        } else if (autoMatchedFolder) {
          statusTagText = `${t(this.plugin, "autoMatchedTo")} ${autoMatchedFolder}`;
          isMatched = true;
        } else {
          statusTagText = t(this.plugin, "noMatchFound");
          isMatched = false;
        }

        const statusTag = leftCol.createDiv({
          cls: `uni-mapping-status-tag ${isMatched ? "is-matched" : "is-unmatched"}`
        });
        statusTag.setText(statusTagText);

        const controls = row.createDiv({ cls: "uni-mapping-controls" });
        const selectEl = controls.createEl("select", { cls: "dropdown uni-mapping-select" });

        // Option 1: Auto-match
        if (autoMatchedFolder) {
          selectEl.createEl("option", {
            value: "",
            text: t(this.plugin, "optAutoMatchFound", { folder: autoMatchedFolder })
          });
        } else {
          selectEl.createEl("option", {
            value: "",
            text: t(this.plugin, "optNotFoundAuto")
          });
        }

        // Option 2: Create new folder
        selectEl.createEl("option", {
          value: "__CREATE_NEW__",
          text: t(this.plugin, "optCreateNewFolder", { folder: suggestedFolder })
        });

        // Option 3: No folder (ignore)
        selectEl.createEl("option", {
          value: "__NONE__",
          text: t(this.plugin, "optNoFolder")
        });

        // Vault folders
        if (currentTarget && currentTarget !== "__NONE__" && !vaultFolders.includes(currentTarget)) {
          selectEl.createEl("option", {
            value: currentTarget,
            text: `📁 ${currentTarget}`
          });
        }

        vaultFolders.forEach(folderPath => {
          selectEl.createEl("option", {
            value: folderPath,
            text: `📁 ${folderPath}`
          });
        });

        selectEl.value = currentTarget;

        selectEl.addEventListener("change", async e => {
          const val = e.target.value;
          if (!this.plugin.settings.subjectFolderMappings) {
            this.plugin.settings.subjectFolderMappings = {};
          }

          if (val === "__CREATE_NEW__") {
            await this.plugin.ensureFolderExists(suggestedFolder);
            this.plugin.settings.subjectFolderMappings[subjectName] = suggestedFolder;
            await this.plugin.saveSettings();
            new Notice(t(this.plugin, "folderCreatedAndAssignedNotice", { folder: suggestedFolder }));
          } else if (val === "__NONE__") {
            this.plugin.settings.subjectFolderMappings[subjectName] = "__NONE__";
            await this.plugin.saveSettings();
          } else if (val === "") {
            delete this.plugin.settings.subjectFolderMappings[subjectName];
            await this.plugin.saveSettings();
          } else {
            this.plugin.settings.subjectFolderMappings[subjectName] = val;
            await this.plugin.saveSettings();
          }

          this.plugin.refreshOpenViews();
          this.display();
        });
      };

      // Render calendar groups with collapsible toggles
      sources.forEach(src => {
        const srcId = src.id;
        const srcName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : (src.fileName || t(this.plugin, "defaultCalendarName")));
        const subjects = this.plugin.getDetectedSubjectsForSource(srcId);
        subjects.forEach(s => renderedSubjectsAll.add(s));

        const isCollapsed = this.collapsedMappingSources.has(srcId);

        const groupCard = groupsContainer.createDiv({
          cls: `uni-calendar-group-card ${isCollapsed ? "is-collapsed" : ""}`
        });

        const groupHeader = groupCard.createDiv({ cls: "uni-calendar-group-header" });
        const titleRow = groupHeader.createDiv({ cls: "uni-calendar-group-title-row" });
        const iconSpan = titleRow.createSpan({ cls: "uni-calendar-group-icon" });
        setIcon(iconSpan, src.type === "url" ? "globe" : "file-text");

        titleRow.createSpan({ cls: "uni-calendar-group-name", text: srcName });
        titleRow.createSpan({
          cls: "uni-calendar-group-badge",
          text: t(this.plugin, "calendarCoursesCount", { count: subjects.length })
        });

        const collapseBtn = groupHeader.createEl("button", {
          cls: "uni-keyword-btn uni-calendar-group-collapse-btn"
        });
        const collapseIcon = collapseBtn.createSpan({ cls: "uni-btn-icon-wrap" });
        setIcon(collapseIcon, isCollapsed ? "chevron-down" : "chevron-up");
        collapseBtn.createSpan({ text: isCollapsed ? t(this.plugin, "btnExpand") : t(this.plugin, "btnCollapse") });

        const toggleCollapse = () => {
          if (this.collapsedMappingSources.has(srcId)) {
            this.collapsedMappingSources.delete(srcId);
          } else {
            this.collapsedMappingSources.add(srcId);
          }
          this.display();
        };

        groupHeader.addEventListener("click", e => {
          if (e.target.closest("button") === collapseBtn) return;
          toggleCollapse();
        });
        collapseBtn.addEventListener("click", e => {
          e.stopPropagation();
          toggleCollapse();
        });

        const groupContent = groupCard.createDiv({
          cls: `uni-calendar-group-content ${isCollapsed ? "is-collapsed" : ""}`
        });

        if (subjects.length === 0) {
          groupContent.createEl("div", {
            cls: "uni-calendar-group-empty",
            text: t(this.plugin, "noCoursesInCalendar")
          });
        } else {
          const table = groupContent.createDiv({ cls: "uni-mapping-container" });
          const headerRow = table.createDiv({ cls: "uni-mapping-header-row" });
          headerRow.createDiv({ text: t(this.plugin, "colSubject") });
          headerRow.createDiv({ text: t(this.plugin, "colFolder") });

          subjects.forEach(subj => {
            renderMappingRow(table, subj);
          });
        }
      });

      // Extra subjects from settings not in current sources
      const extraSubjects = Object.keys(this.plugin.settings.subjectFolderMappings || {})
        .filter(s => s && !renderedSubjectsAll.has(s))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      if (extraSubjects.length > 0) {
        const extraCard = groupsContainer.createDiv({ cls: "uni-calendar-group-card" });
        const extraHeader = extraCard.createDiv({ cls: "uni-calendar-group-header" });
        const extraTitleRow = extraHeader.createDiv({ cls: "uni-calendar-group-title-row" });
        const extraIcon = extraTitleRow.createSpan({ cls: "uni-calendar-group-icon" });
        setIcon(extraIcon, "folder");
        extraTitleRow.createSpan({ cls: "uni-calendar-group-name", text: t(this.plugin, "typeOther") });
        extraTitleRow.createSpan({
          cls: "uni-calendar-group-badge",
          text: t(this.plugin, "calendarCoursesCount", { count: extraSubjects.length })
        });

        const contentDiv = extraCard.createDiv({ cls: "uni-calendar-group-content" });
        const table = contentDiv.createDiv({ cls: "uni-mapping-container" });
        const headerRow = table.createDiv({ cls: "uni-mapping-header-row" });
        headerRow.createDiv({ text: t(this.plugin, "colSubject") });
        headerRow.createDiv({ text: t(this.plugin, "colFolder") });

        extraSubjects.forEach(subj => {
          renderMappingRow(table, subj);
        });
      }
    }

    // ------------------------------------------------------------------------
    // Bottom Section: Tryb samego kalendarza (Pure Calendar Mode)
    // ------------------------------------------------------------------------
    const pureCalCard = notesContainer.createDiv({ cls: "uni-settings-card uni-pure-calendar-card" });
    new Setting(pureCalCard)
      .setName(t(this.plugin, "settingDisableNoteClickName"))
      .setDesc(t(this.plugin, "settingDisableNoteClickDesc"))
      .addToggle(toggle => toggle
        .setValue(Boolean(this.plugin.settings.disableNoteClick))
        .onChange(async val => {
          this.plugin.settings.disableNoteClick = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));
  }

  // ------------------------------------------------------------------------
  // Tab 4: Exclusions (Excluded Subjects & Interactive Keywords)
  // ------------------------------------------------------------------------
  renderExclusionsTab(container) {
    new Setting(container).setName(t(this.plugin, "exclusionsTitle")).setHeading();
    container.createEl("p", {
      cls: "uni-settings-section-desc",
      text: t(this.plugin, "exclusionsDesc")
    });

    // 1. Manual Keyword Exclusions (Top) with Calendar Target Selection
    new Setting(container).setName(t(this.plugin, "keywordsTitle")).setHeading();
    container.createEl("p", {
      cls: "uni-settings-section-desc",
      text: t(this.plugin, "keywordsDesc")
    });

    const sources = this.plugin.settings.scheduleSources || [];

    const addRow = container.createDiv({ cls: "uni-keyword-input-row" });
    const keywordInput = addRow.createEl("input", {
      type: "text",
      cls: "uni-keyword-input-text",
      attr: { placeholder: t(this.plugin, "keywordsPlaceholder") }
    });

    const calSelect = addRow.createEl("select", { cls: "dropdown uni-keyword-cal-select" });
    calSelect.createEl("option", {
      value: "__ALL__",
      text: `🌐 ${t(this.plugin, "allCalendars")}`
    });
    sources.forEach(src => {
      const srcName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : "schedule.ics");
      calSelect.createEl("option", {
        value: src.id,
        text: `📅 ${srcName}`
      });
    });

    const addBtn = addRow.createEl("button", {
      cls: "mod-cta uni-keyword-add-btn",
      text: t(this.plugin, "btnAddKeyword")
    });

    const doAddKeyword = async () => {
      const val = keywordInput.value.trim();
      if (!val) return;
      const targetSourceId = calSelect.value || "__ALL__";

      if (!Array.isArray(this.plugin.settings.excludedKeywords)) {
        this.plugin.settings.excludedKeywords = [];
      }

      const parsed = normalizeKeywordRule(val);
      if (!parsed) return;

      let ruleObj;
      if (parsed.subjectCondition) {
        ruleObj = {
          keyword: parsed.keyword,
          subjectCondition: parsed.subjectCondition,
          sourceId: targetSourceId
        };
      } else if (parsed.keywordsAll && parsed.keywordsAll.length > 1) {
        ruleObj = {
          keyword: parsed.keyword,
          keywordsAll: parsed.keywordsAll,
          sourceId: targetSourceId
        };
      } else {
        ruleObj = {
          keyword: parsed.keyword,
          sourceId: targetSourceId
        };
      }

      const exists = this.plugin.settings.excludedKeywords.some(item => {
        const r = normalizeKeywordRule(item);
        if (!r || r.sourceId !== targetSourceId) return false;
        if (ruleObj.subjectCondition) {
          return (
            r.subjectCondition &&
            r.subjectCondition.toLowerCase() === ruleObj.subjectCondition.toLowerCase() &&
            r.keyword.toLowerCase() === ruleObj.keyword.toLowerCase()
          );
        }
        if (ruleObj.keywordsAll) {
          return (
            r.keywordsAll &&
            r.keywordsAll.map(k => k.toLowerCase()).sort().join("+") ===
            ruleObj.keywordsAll.map(k => k.toLowerCase()).sort().join("+")
          );
        }
        return !r.subjectCondition && !r.keywordsAll && r.keyword.toLowerCase() === ruleObj.keyword.toLowerCase();
      });

      if (!exists) {
        this.plugin.settings.excludedKeywords.push(ruleObj);
        await this.plugin.saveSettings();
        this.plugin.parseAndCacheAllSources();
        this.plugin.refreshOpenViews();
      }
      keywordInput.value = "";
      this.display();
    };

    addBtn.addEventListener("click", doAddKeyword);
    keywordInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        doAddKeyword();
      }
    });

    // Conditional rule builder section
    const allDetectedSubjects = this.plugin.getAllDetectedSubjects();
    if (allDetectedSubjects.length > 0) {
      const condBox = container.createDiv({ cls: "uni-conditional-builder-box" });
      const condHeader = condBox.createDiv({ cls: "uni-conditional-builder-title" });
      const condIcon = condHeader.createSpan({ cls: "uni-conditional-title-icon" });
      setIcon(condIcon, "filter");
      condHeader.createSpan({ text: t(this.plugin, "conditionalRuleBuilderTitle") });

      condBox.createEl("p", {
        cls: "uni-settings-section-desc",
        text: t(this.plugin, "conditionalRuleBuilderDesc")
      });

      const condRow = condBox.createDiv({ cls: "uni-keyword-input-row uni-conditional-input-row" });

      const condSubjSelect = condRow.createEl("select", { cls: "dropdown uni-conditional-subj-select" });
      condSubjSelect.createEl("option", {
        value: "",
        text: `-- ${t(this.plugin, "selectSubjectPlaceholder")} --`
      });
      allDetectedSubjects.forEach(sName => {
        condSubjSelect.createEl("option", {
          value: sName,
          text: sName
        });
      });

      const condKwInput = condRow.createEl("input", {
        type: "text",
        cls: "uni-keyword-input-text uni-conditional-kw-input",
        attr: { placeholder: t(this.plugin, "conditionalKwPlaceholder") }
      });

      const condCalSelect = condRow.createEl("select", { cls: "dropdown uni-keyword-cal-select" });
      condCalSelect.createEl("option", {
        value: "__ALL__",
        text: `🌐 ${t(this.plugin, "allCalendars")}`
      });
      sources.forEach(src => {
        const srcName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : "schedule.ics");
        condCalSelect.createEl("option", {
          value: src.id,
          text: `📅 ${srcName}`
        });
      });

      const condAddBtn = condRow.createEl("button", {
        cls: "mod-cta uni-keyword-add-btn",
        text: t(this.plugin, "btnAddConditionalRule")
      });

      const doAddConditional = async () => {
        const chosenSubj = condSubjSelect.value.trim();
        const kwVal = condKwInput.value.trim();
        if (!chosenSubj) {
          new Notice(t(this.plugin, "noticeSelectSubjectFirst"));
          return;
        }
        if (!kwVal) {
          new Notice(t(this.plugin, "noticeEnterKeywordFirst"));
          return;
        }
        const targetSourceId = condCalSelect.value || "__ALL__";

        if (!Array.isArray(this.plugin.settings.excludedKeywords)) {
          this.plugin.settings.excludedKeywords = [];
        }

        const exists = this.plugin.settings.excludedKeywords.some(item => {
          const r = normalizeKeywordRule(item);
          return (
            r &&
            r.sourceId === targetSourceId &&
            r.subjectCondition &&
            r.subjectCondition.toLowerCase() === chosenSubj.toLowerCase() &&
            r.keyword.toLowerCase() === kwVal.toLowerCase()
          );
        });

        if (!exists) {
          this.plugin.settings.excludedKeywords.push({
            keyword: kwVal,
            subjectCondition: chosenSubj,
            sourceId: targetSourceId
          });
          await this.plugin.saveSettings();
          this.plugin.parseAndCacheAllSources();
          this.plugin.refreshOpenViews();
        }
        condKwInput.value = "";
        this.display();
      };

      condAddBtn.addEventListener("click", doAddConditional);
      condKwInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          doAddConditional();
        }
      });
    }

    const keywordsList = Array.isArray(this.plugin.settings.excludedKeywords)
      ? this.plugin.settings.excludedKeywords
      : (this.plugin.settings.excludedKeywords || "").split(/[,\n]/).map(k => k.trim()).filter(k => k.length > 0);

    if (keywordsList.length === 0) {
      container.createEl("p", {
        cls: "uni-empty-schedule-text",
        text: t(this.plugin, "noKeywordsText")
      });
    } else {
      const listEl = container.createDiv({ cls: "uni-keyword-list" });

      keywordsList.forEach((rawKw, index) => {
        const rule = normalizeKeywordRule(rawKw);
        if (!rule) return;

        const itemEl = listEl.createDiv({ cls: "uni-keyword-item" });

        const leftWrap = itemEl.createDiv({ cls: "uni-keyword-left-wrap" });
        const badge = leftWrap.createSpan({
          cls: `uni-keyword-badge ${rule.isConditional ? "is-conditional" : ""}`
        });

        if (rule.subjectCondition) {
          setIcon(badge, "filter");
          const condText = badge.createSpan({ cls: "uni-keyword-badge-cond-text" });
          condText.createSpan({ cls: "uni-cond-label", text: `${t(this.plugin, "ruleIfPrefix")}: ` });
          condText.createSpan({ cls: "uni-cond-subj", text: rule.subjectCondition });
          condText.createSpan({ cls: "uni-cond-arrow", text: " ➔ " });
          condText.createSpan({ cls: "uni-cond-kw-label", text: `${t(this.plugin, "ruleExcludePrefix")}: ` });
          condText.createSpan({ cls: "uni-cond-kw", text: rule.keyword });
        } else if (rule.keywordsAll && rule.keywordsAll.length > 1) {
          setIcon(badge, "filter");
          const condText = badge.createSpan({ cls: "uni-keyword-badge-cond-text" });
          condText.createSpan({ cls: "uni-cond-label", text: `${t(this.plugin, "ruleAllPrefix")}: ` });
          condText.createSpan({ cls: "uni-cond-kw", text: rule.keywordsAll.join(" + ") });
        } else {
          setIcon(badge, "tag");
          badge.createSpan({ text: rule.keyword });
        }

        const calBadge = leftWrap.createSpan({ cls: "uni-keyword-cal-badge" });
        setIcon(calBadge, rule.sourceId === "__ALL__" ? "globe" : "calendar");
        calBadge.createSpan({ text: getSourceNameById(this.plugin, rule.sourceId) });

        const actions = itemEl.createDiv({ cls: "uni-keyword-actions" });

        const editBtn = actions.createEl("button", {
          cls: "uni-keyword-btn btn-edit-keyword"
        });
        setIcon(editBtn, "pencil");
        attachDelayedTooltip(editBtn, t(this.plugin, "btnEditKeyword"), 2000);

        const deleteBtn = actions.createEl("button", {
          cls: "uni-keyword-btn btn-delete"
        });
        setIcon(deleteBtn, "trash-2");
        attachDelayedTooltip(deleteBtn, t(this.plugin, "btnDeleteKeyword"), 2000);

        editBtn.addEventListener("click", () => {
          clearActiveUniTooltip();
          itemEl.empty();
          const editRow = itemEl.createDiv({ cls: "uni-keyword-edit-row" });
          
          let initialEditVal = rule.keyword;
          if (rule.subjectCondition) {
            initialEditVal = `jeśli ${rule.subjectCondition} wyklucz ${rule.keyword}`;
          } else if (rule.keywordsAll && rule.keywordsAll.length > 1) {
            initialEditVal = rule.keywordsAll.join(" + ");
          }

          const editInput = editRow.createEl("input", {
            type: "text",
            cls: "uni-keyword-edit-input",
            value: initialEditVal
          });
          editInput.focus();

          const editCalSelect = editRow.createEl("select", { cls: "dropdown uni-keyword-cal-select" });
          editCalSelect.createEl("option", {
            value: "__ALL__",
            text: `🌐 ${t(this.plugin, "allCalendars")}`
          });
          sources.forEach(s => {
            const sName = s.name || (s.type === "url" ? deriveSourceLabelFromUrl(s.url || "", s.cachedIcs) : "schedule.ics");
            editCalSelect.createEl("option", {
              value: s.id,
              text: `📅 ${sName}`
            });
          });
          editCalSelect.value = rule.sourceId || "__ALL__";

          const saveBtn = editRow.createEl("button", {
            cls: "uni-keyword-btn mod-cta",
            text: t(this.plugin, "btnSaveKeyword")
          });
          setIcon(saveBtn, "check");

          const cancelBtn = editRow.createEl("button", {
            cls: "uni-keyword-btn",
            text: t(this.plugin, "modalCancel")
          });

          const doSave = async () => {
            const newVal = editInput.value.trim();
            const newSourceId = editCalSelect.value || "__ALL__";
            if (newVal) {
              const parsed = normalizeKeywordRule(newVal);
              let ruleToSave;
              if (parsed && parsed.subjectCondition) {
                ruleToSave = {
                  keyword: parsed.keyword,
                  subjectCondition: parsed.subjectCondition,
                  sourceId: newSourceId
                };
              } else if (parsed && parsed.keywordsAll && parsed.keywordsAll.length > 1) {
                ruleToSave = {
                  keyword: parsed.keyword,
                  keywordsAll: parsed.keywordsAll,
                  sourceId: newSourceId
                };
              } else if (parsed && parsed.keyword) {
                ruleToSave = {
                  keyword: parsed.keyword,
                  sourceId: newSourceId
                };
              }
              if (ruleToSave) {
                this.plugin.settings.excludedKeywords[index] = ruleToSave;
                await this.plugin.saveSettings();
                this.plugin.parseAndCacheAllSources();
                this.plugin.refreshOpenViews();
              }
            }
            this.display();
          };

          saveBtn.addEventListener("click", doSave);
          editInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
              e.preventDefault();
              doSave();
            } else if (e.key === "Escape") {
              this.display();
            }
          });
          cancelBtn.addEventListener("click", () => this.display());
        });

        deleteBtn.addEventListener("click", async () => {
          this.plugin.settings.excludedKeywords.splice(index, 1);
          await this.plugin.saveSettings();
          this.plugin.parseAndCacheAllSources();
          this.plugin.refreshOpenViews();
          this.display();
        });
      });
    }

    // 2. Automatically Detected Subjects Divided by Calendar Source
    new Setting(container).setName(t(this.plugin, "detectedSubjects")).setHeading();

    if (sources.length === 0) {
      container.createEl("p", {
        cls: "uni-empty-schedule-text",
        text: t(this.plugin, "noSubjectsFound")
      });
      return;
    }

    const groupsContainer = container.createDiv({ cls: "uni-calendar-groups-container" });
    const renderedSubjectsAll = new Set();

    sources.forEach(src => {
      const srcName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : "schedule.ics");
      const subjects = this.plugin.getDetectedSubjectsForSource(src.id);
      subjects.forEach(s => renderedSubjectsAll.add(s));

      const isCollapsed = this.collapsedExclusionSources.has(src.id);

      const groupCard = groupsContainer.createDiv({
        cls: `uni-calendar-group-card ${isCollapsed ? "is-collapsed" : ""}`
      });

      const groupHeader = groupCard.createDiv({ cls: "uni-calendar-group-header" });
      const titleRow = groupHeader.createDiv({ cls: "uni-calendar-group-title-row" });
      const iconSpan = titleRow.createSpan({ cls: "uni-calendar-group-icon" });
      setIcon(iconSpan, src.type === "url" ? "globe" : "file-text");

      titleRow.createSpan({ cls: "uni-calendar-group-name", text: srcName });
      titleRow.createSpan({
        cls: "uni-calendar-group-badge",
        text: t(this.plugin, "calendarCoursesCount", { count: subjects.length })
      });

      const collapseBtn = groupHeader.createEl("button", {
        cls: "uni-keyword-btn uni-calendar-group-collapse-btn"
      });
      const collapseIcon = collapseBtn.createSpan({ cls: "uni-btn-icon-wrap" });
      setIcon(collapseIcon, isCollapsed ? "chevron-down" : "chevron-up");
      collapseBtn.createSpan({ text: isCollapsed ? t(this.plugin, "btnExpand") : t(this.plugin, "btnCollapse") });

      const toggleCollapse = () => {
        if (this.collapsedExclusionSources.has(src.id)) {
          this.collapsedExclusionSources.delete(src.id);
        } else {
          this.collapsedExclusionSources.add(src.id);
        }
        this.display();
      };

      groupHeader.addEventListener("click", e => {
        if (e.target.closest("button") === collapseBtn) return;
        toggleCollapse();
      });
      collapseBtn.addEventListener("click", e => {
        e.stopPropagation();
        toggleCollapse();
      });

      const contentDiv = groupCard.createDiv({ cls: `uni-calendar-group-content ${isCollapsed ? "is-collapsed" : ""}` });
      if (subjects.length === 0) {
          contentDiv.createDiv({
            cls: "uni-calendar-group-empty",
            text: t(this.plugin, "noCoursesInCalendar")
          });
        } else {
          const listContainer = contentDiv.createDiv({ cls: "uni-exclusion-list" });

          subjects.forEach(subjectName => {
            const isExcluded = this.plugin.settings.excludedSubjects.includes(subjectName);
            const item = listContainer.createDiv({
              cls: `uni-exclusion-item ${isExcluded ? "is-excluded" : ""}`
            });

            item.createDiv({ cls: "uni-exclusion-title", text: subjectName });

            const toggleWrapper = item.createDiv({ cls: "uni-exclusion-toggle" });
            new Setting(toggleWrapper)
              .addToggle(toggle => toggle
                .setValue(isExcluded)
                .setTooltip(isExcluded ? t(this.plugin, "excludeToggleOn") : t(this.plugin, "excludeToggleOff"))
                .onChange(async val => {
                  if (val) {
                    if (!this.plugin.settings.excludedSubjects.includes(subjectName)) {
                      this.plugin.settings.excludedSubjects.push(subjectName);
                    }
                    item.addClass("is-excluded");
                  } else {
                    this.plugin.settings.excludedSubjects = this.plugin.settings.excludedSubjects.filter(
                      s => s !== subjectName
                    );
                    item.removeClass("is-excluded");
                  }
                  await this.plugin.saveSettings();
                  this.plugin.rebuildEventsMap();
                  this.plugin.refreshOpenViews();
                }));
          });
        }
      });

    // Check for any extra subjects in settings not in current sources
    const allDetected = this.plugin.getAllDetectedSubjects();
    const extraSubjects = allDetected.filter(s => !renderedSubjectsAll.has(s));
    if (extraSubjects.length > 0) {
      const extraCard = groupsContainer.createDiv({ cls: "uni-calendar-group-card" });
      const extraHeader = extraCard.createDiv({ cls: "uni-calendar-group-header" });
      const extraTitleRow = extraHeader.createDiv({ cls: "uni-calendar-group-title-row" });
      const extraIcon = extraTitleRow.createSpan({ cls: "uni-calendar-group-icon" });
      setIcon(extraIcon, "folder");
      extraTitleRow.createSpan({ cls: "uni-calendar-group-name", text: t(this.plugin, "typeOther") });
      extraTitleRow.createSpan({
        cls: "uni-calendar-group-badge",
        text: t(this.plugin, "calendarCoursesCount", { count: extraSubjects.length })
      });

      const contentDiv = extraCard.createDiv({ cls: "uni-calendar-group-content" });
      const listContainer = contentDiv.createDiv({ cls: "uni-exclusion-list" });
      extraSubjects.forEach(subjectName => {
        const isExcluded = this.plugin.settings.excludedSubjects.includes(subjectName);
        const item = listContainer.createDiv({
          cls: `uni-exclusion-item ${isExcluded ? "is-excluded" : ""}`
        });
        item.createDiv({ cls: "uni-exclusion-title", text: subjectName });
        const toggleWrapper = item.createDiv({ cls: "uni-exclusion-toggle" });
        new Setting(toggleWrapper)
          .addToggle(toggle => toggle
            .setValue(isExcluded)
            .setTooltip(isExcluded ? t(this.plugin, "excludeToggleOn") : t(this.plugin, "excludeToggleOff"))
            .onChange(async val => {
              if (val) {
                if (!this.plugin.settings.excludedSubjects.includes(subjectName)) {
                  this.plugin.settings.excludedSubjects.push(subjectName);
                }
                item.addClass("is-excluded");
              } else {
                this.plugin.settings.excludedSubjects = this.plugin.settings.excludedSubjects.filter(
                  s => s !== subjectName
                );
                item.removeClass("is-excluded");
              }
              await this.plugin.saveSettings();
              this.plugin.rebuildEventsMap();
              this.plugin.refreshOpenViews();
            }));
      });
    }
  }

  // ------------------------------------------------------------------------
  // Tab 5: Edit Class Categories & Colors
  // ------------------------------------------------------------------------
  renderCategoriesTab(container) {
    const custContainer = container.createDiv({ cls: "uni-customization-container" });

    // ------------------------------------------------------------------------
    // Card 1: Przerwy i okienka w harmonogramie
    // ------------------------------------------------------------------------
    const gapsCard = custContainer.createDiv({ cls: "uni-settings-card uni-gaps-card" });
    const gapsHeader = gapsCard.createDiv({ cls: "uni-settings-card-header" });
    gapsHeader.createSpan({ cls: "uni-settings-card-icon", text: "☕" });
    const gapsTitleGroup = gapsHeader.createDiv({ cls: "uni-settings-card-title-group" });
    gapsTitleGroup.createDiv({ cls: "uni-settings-card-title", text: t(this.plugin, "cardAppearanceTitle") });
    gapsTitleGroup.createEl("p", { cls: "uni-settings-card-desc", text: t(this.plugin, "cardAppearanceDesc") });

    if (!this.plugin.settings.timelineGaps) {
      this.plugin.settings.timelineGaps = Object.assign({}, DEFAULT_SETTINGS.timelineGaps);
    }
    const gapsSettings = this.plugin.settings.timelineGaps;

    let gapsDetailsContainer = null;

    new Setting(gapsCard)
      .setName(t(this.plugin, "settingShowTimelineGapsName"))
      .setDesc(t(this.plugin, "settingShowTimelineGapsDesc"))
      .addToggle(toggle => toggle
        .setValue(Boolean(gapsSettings.enabled))
        .onChange(async val => {
          gapsSettings.enabled = val;
          this.plugin.settings.showTimelineGaps = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
          if (gapsDetailsContainer) {
            gapsDetailsContainer.toggleClass("is-hidden", !val);
          }
        }));

    gapsDetailsContainer = gapsCard.createDiv({
      cls: `uni-gaps-details-container ${gapsSettings.enabled ? "" : "is-hidden"}`
    });

    // Break appearance style
    new Setting(gapsDetailsContainer)
      .setName(t(this.plugin, "breakStyleLabel"))
      .addDropdown(dd => dd
        .addOption("pill", t(this.plugin, "breakStylePill"))
        .addOption("line", t(this.plugin, "breakStyleLine"))
        .addOption("card", t(this.plugin, "breakStyleCard"))
        .addOption("text", t(this.plugin, "breakStyleText"))
        .setValue(gapsSettings.style === "card" ? "card" : (gapsSettings.style === "line" ? "line" : (gapsSettings.style === "text" ? "text" : "pill")))
        .onChange(async val => {
          gapsSettings.style = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    // Break icon dropdown
    new Setting(gapsDetailsContainer)
      .setName(t(this.plugin, "breakIconLabel"))
      .addDropdown(dd => dd
        .addOption("coffee", t(this.plugin, "breakIconCoffee"))
        .addOption("food", t(this.plugin, "breakIconFood"))
        .addOption("pause", t(this.plugin, "breakIconPause"))
        .addOption("hourglass", t(this.plugin, "breakIconHourglass"))
        .addOption("walk", t(this.plugin, "breakIconWalk"))
        .addOption("book", t(this.plugin, "breakIconBook"))
        .addOption("music", t(this.plugin, "breakIconMusic"))
        .addOption("sun", t(this.plugin, "breakIconSun"))
        .addOption("moon", t(this.plugin, "breakIconMoon"))
        .addOption("spark", t(this.plugin, "breakIconSpark"))
        .addOption("battery", t(this.plugin, "breakIconBattery"))
        .addOption("clock", t(this.plugin, "breakIconClock"))
        .addOption("leaf", t(this.plugin, "breakIconLeaf"))
        .addOption("smile", t(this.plugin, "breakIconSmile"))
        .setValue(gapsSettings.icon || "coffee")
        .onChange(async val => {
          gapsSettings.icon = val;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }));

    // Min & Max manual inputs
    const timeRow = gapsDetailsContainer.createDiv({ cls: "uni-gaps-inputs-row" });

    const minGroup = timeRow.createDiv({ cls: "uni-gap-input-group" });
    minGroup.createEl("label", { cls: "uni-gap-input-label", text: t(this.plugin, "breakMinMinutesLabel") });
    const minInput = minGroup.createEl("input", {
      type: "number",
      cls: "uni-gap-number-input",
      value: String(gapsSettings.minMinutes !== undefined ? gapsSettings.minMinutes : 15),
      attr: { min: "1", step: "5", placeholder: t(this.plugin, "breakMinMinutesPlaceholder") }
    });
    minGroup.createDiv({ cls: "uni-gap-input-desc", text: t(this.plugin, "breakMinMinutesDesc") });

    const maxGroup = timeRow.createDiv({ cls: "uni-gap-input-group" });
    maxGroup.createEl("label", { cls: "uni-gap-input-label", text: t(this.plugin, "breakMaxMinutesLabel") });
    const maxInput = maxGroup.createEl("input", {
      type: "number",
      cls: "uni-gap-number-input",
      value: gapsSettings.maxMinutes ? String(gapsSettings.maxMinutes) : "",
      attr: { min: "0", step: "5", placeholder: t(this.plugin, "breakMaxMinutesPlaceholder") }
    });
    maxGroup.createDiv({ cls: "uni-gap-input-desc", text: t(this.plugin, "breakMaxMinutesDesc") });

    minInput.addEventListener("change", async () => {
      let val = parseInt(minInput.value, 10);
      if (isNaN(val) || val < 1) val = 5;
      gapsSettings.minMinutes = val;
      this.plugin.settings.timelineGapThreshold = String(val);
      await this.plugin.saveSettings();
      this.plugin.refreshOpenViews();
    });

    maxInput.addEventListener("change", async () => {
      let val = parseInt(maxInput.value, 10);
      if (isNaN(val) || val < 0) val = 0;
      gapsSettings.maxMinutes = val;
      await this.plugin.saveSettings();
      this.plugin.refreshOpenViews();
    });

    // Per-calendar break rules
    const sources = this.plugin.settings.scheduleSources || [];
    if (sources.length > 0) {
      const perCalSection = gapsDetailsContainer.createDiv({ cls: "uni-per-cal-gaps-section" });
      perCalSection.createDiv({ cls: "uni-per-cal-title", text: t(this.plugin, "perCalendarGapsTitle") });
      perCalSection.createEl("p", { cls: "uni-per-cal-desc", text: t(this.plugin, "perCalendarGapsDesc") });

      if (!gapsSettings.calendarOverrides) {
        gapsSettings.calendarOverrides = {};
      }

      sources.forEach(src => {
        const srcId = src.id;
        const srcName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : (src.fileName || t(this.plugin, "defaultCalendarName")));
        const calOverride = gapsSettings.calendarOverrides[srcId] || {
          enabled: false,
          minMinutes: gapsSettings.minMinutes || 15,
          maxMinutes: gapsSettings.maxMinutes || 0,
          icon: "coffee"
        };

        const calCard = perCalSection.createDiv({ cls: "uni-calendar-gap-override-card" });
        const calCardHeader = calCard.createDiv({ cls: "uni-cal-gap-header" });
        calCardHeader.createSpan({ cls: "uni-cal-gap-name", text: `📅 ${srcName}` });

        let calControls = null;

        new Setting(calCardHeader)
          .setName(t(this.plugin, "enableCalendarGapOverride"))
          .addToggle(toggle => toggle
            .setValue(calOverride.enabled === true)
            .onChange(async val => {
              calOverride.enabled = val;
              gapsSettings.calendarOverrides[srcId] = calOverride;
              await this.plugin.saveSettings();
              this.plugin.refreshOpenViews();
              if (calControls) {
                calControls.toggleClass("is-hidden", !val);
              }
            }));

        calControls = calCard.createDiv({ cls: `uni-cal-gap-controls ${calOverride.enabled ? "" : "is-hidden"}` });

        const calTimeRow = calControls.createDiv({ cls: "uni-gaps-inputs-row uni-cal-gap-row" });
        
        const calMinGroup = calTimeRow.createDiv({ cls: "uni-gap-input-group" });
        calMinGroup.createEl("label", { cls: "uni-gap-input-label", text: t(this.plugin, "breakMinMinutesLabel") });
        const calMinInput = calMinGroup.createEl("input", {
          type: "number",
          cls: "uni-gap-number-input",
          value: String(calOverride.minMinutes !== undefined ? calOverride.minMinutes : (gapsSettings.minMinutes || 15)),
          attr: { min: "1", step: "5", placeholder: "15" }
        });

        const calMaxGroup = calTimeRow.createDiv({ cls: "uni-gap-input-group" });
        calMaxGroup.createEl("label", { cls: "uni-gap-input-label", text: t(this.plugin, "breakMaxMinutesLabel") });
        const calMaxInput = calMaxGroup.createEl("input", {
          type: "number",
          cls: "uni-gap-number-input",
          value: calOverride.maxMinutes ? String(calOverride.maxMinutes) : "",
          attr: { min: "0", step: "5", placeholder: "0" }
        });

        calMinInput.addEventListener("change", async () => {
          let v = parseInt(calMinInput.value, 10);
          if (isNaN(v) || v < 1) v = 5;
          calOverride.minMinutes = v;
          gapsSettings.calendarOverrides[srcId] = calOverride;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        });

        calMaxInput.addEventListener("change", async () => {
          let v = parseInt(calMaxInput.value, 10);
          if (isNaN(v) || v < 0) v = 0;
          calOverride.maxMinutes = v;
          gapsSettings.calendarOverrides[srcId] = calOverride;
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        });

        new Setting(calControls)
          .setName(t(this.plugin, "breakStyleLabel"))
          .addDropdown(dd => {
            dd.addOption("pill", t(this.plugin, "breakStylePill"))
              .addOption("line", t(this.plugin, "breakStyleLine"))
              .addOption("card", t(this.plugin, "breakStyleCard"))
              .addOption("text", t(this.plugin, "breakStyleText"))
              .setValue(calOverride.style || gapsSettings.style || "pill")
              .onChange(async val => {
                calOverride.style = val;
                gapsSettings.calendarOverrides[srcId] = calOverride;
                await this.plugin.saveSettings();
                this.plugin.refreshOpenViews();
              });
          });

        new Setting(calControls)
          .setName(t(this.plugin, "breakIconLabel"))
          .addDropdown(dd => {
            dd.addOption("coffee", t(this.plugin, "breakIconCoffee"))
              .addOption("food", t(this.plugin, "breakIconFood"))
              .addOption("pause", t(this.plugin, "breakIconPause"))
              .addOption("hourglass", t(this.plugin, "breakIconHourglass"))
              .addOption("walk", t(this.plugin, "breakIconWalk"))
              .addOption("book", t(this.plugin, "breakIconBook"))
              .addOption("music", t(this.plugin, "breakIconMusic"))
              .addOption("sun", t(this.plugin, "breakIconSun"))
              .addOption("moon", t(this.plugin, "breakIconMoon"))
              .addOption("spark", t(this.plugin, "breakIconSpark"))
              .addOption("battery", t(this.plugin, "breakIconBattery"))
              .addOption("clock", t(this.plugin, "breakIconClock"))
              .addOption("leaf", t(this.plugin, "breakIconLeaf"))
              .addOption("smile", t(this.plugin, "breakIconSmile"))
              .setValue(calOverride.icon || "coffee")
              .onChange(async val => {
                calOverride.icon = val;
                gapsSettings.calendarOverrides[srcId] = calOverride;
                await this.plugin.saveSettings();
                this.plugin.refreshOpenViews();
              });
          });
      });
    }

    // ------------------------------------------------------------------------
    // Card 2: Kategorie zajęć i kolory (with calendar source tags)
    // ------------------------------------------------------------------------
    const catCard = custContainer.createDiv({ cls: "uni-settings-card uni-categories-card" });
    const catHeader = catCard.createDiv({ cls: "uni-settings-card-header" });
    catHeader.createSpan({ cls: "uni-settings-card-icon", text: "🎨" });
    const catTitleGroup = catHeader.createDiv({ cls: "uni-settings-card-title-group" });
    catTitleGroup.createDiv({ cls: "uni-settings-card-title", text: t(this.plugin, "cardCategoriesTitle") });
    catTitleGroup.createEl("p", { cls: "uni-settings-card-desc", text: t(this.plugin, "cardCategoriesDesc") });

    const catCalendarMap = new Map();
    const detectedCatIds = new Set();

    const sourceEvents = (this.plugin.allSourcesExpandedEvents && this.plugin.allSourcesExpandedEvents.length > 0)
      ? this.plugin.allSourcesExpandedEvents
      : ((this.plugin.rawExpandedEvents && this.plugin.rawExpandedEvents.length > 0)
        ? this.plugin.rawExpandedEvents
        : (this.plugin.events || []));

    for (const ev of sourceEvents) {
      const d = parseUniDetails(ev.summary, ev.description, ev.location);
      if (d && d.category) {
        detectedCatIds.add(d.category);
        let calName = "";
        if (ev.sourceId) {
          const matchedSrc = sources.find(s => s.id === ev.sourceId);
          if (matchedSrc) calName = matchedSrc.name || (matchedSrc.type === "url" ? deriveSourceLabelFromUrl(matchedSrc.url || "", matchedSrc.cachedIcs) : (matchedSrc.fileName || t(this.plugin, "defaultCalendarName")));
        }
        if (!calName && (ev.sourceName || ev.sourceTitle)) calName = ev.sourceName || ev.sourceTitle;
        if (calName) {
          if (!catCalendarMap.has(d.category)) {
            catCalendarMap.set(d.category, new Set());
          }
          catCalendarMap.get(d.category).add(calName);
        }
      }
    }

    if (detectedCatIds.size === 0) {
      catCard.createEl("p", {
        cls: "uni-empty-schedule-text",
        text: t(this.plugin, "noSubjectsFound")
      });
      return;
    }

    const rows = catCard.createDiv({ cls: "uni-color-rows-container" });

    Array.from(detectedCatIds).forEach(catId => {
      const row = rows.createDiv({ cls: "uni-color-row uni-category-edit-row" });

      const defaultLabel = getDefaultCategoryLabel(this.plugin, catId);
      const customVal = (this.plugin.settings.classCustomNames && this.plugin.settings.classCustomNames[catId]) || "";
      const currentColor = this.plugin.getClassColor(catId);

      const info = row.createDiv({ cls: "uni-color-info" });
      const liveBadge = info.createSpan({
        cls: "uni-category-live-badge",
        text: (customVal.trim() || defaultLabel)
      });
      liveBadge.style.borderColor = currentColor;
      liveBadge.style.color = currentColor;
      liveBadge.style.backgroundColor = `${currentColor}1a`;

      // Calendar origin indicator pills (Requirement 7)
      const cals = Array.from(catCalendarMap.get(catId) || []);
      const calPillsContainer = info.createDiv({ cls: "uni-category-source-row" });
      calPillsContainer.createSpan({ cls: "uni-category-source-label", text: `${t(this.plugin, "categoryUsedInCalendars")}: ` });
      if (cals.length > 0) {
        cals.forEach(cName => {
          calPillsContainer.createSpan({ cls: "uni-category-source-pill", text: `📅 ${cName}` });
        });
      } else {
        calPillsContainer.createSpan({ cls: "uni-category-source-pill is-fallback", text: "📅 Standard" });
      }

      const controlsWrapper = row.createDiv({ cls: "uni-category-controls" });

      const nameInput = controlsWrapper.createEl("input", {
        type: "text",
        cls: "uni-category-name-input",
        value: customVal,
        attr: {
          placeholder: t(this.plugin, "categoryNamePlaceholder", { default: defaultLabel })
        }
      });

      const colorInput = controlsWrapper.createEl("input", {
        type: "color",
        cls: "uni-color-input",
        value: currentColor
      });

      let nameDebounceTimer = null;
      nameInput.addEventListener("input", e => {
        const val = e.target.value;
        if (!this.plugin.settings.classCustomNames) {
          this.plugin.settings.classCustomNames = {};
        }
        if (val.trim()) {
          this.plugin.settings.classCustomNames[catId] = val;
          liveBadge.setText(val.trim());
        } else {
          delete this.plugin.settings.classCustomNames[catId];
          liveBadge.setText(defaultLabel);
        }
        if (nameDebounceTimer) clearTimeout(nameDebounceTimer);
        nameDebounceTimer = setTimeout(async () => {
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
        }, 300);
      });

      colorInput.addEventListener("input", e => {
        const newColor = e.target.value;
        liveBadge.style.borderColor = newColor;
        liveBadge.style.color = newColor;
        liveBadge.style.backgroundColor = `${newColor}1a`;
      });

      colorInput.addEventListener("change", async e => {
        const newColor = e.target.value;
        this.plugin.settings.classColors[catId] = newColor;
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });

    new Setting(catCard)
      .addButton(btn => btn
        .setButtonText(t(this.plugin, "btnResetColors"))
        .onClick(async () => {
          this.plugin.settings.classColors = Object.assign({}, DEFAULT_CLASS_COLORS);
          this.plugin.settings.classCustomNames = {};
          await this.plugin.saveSettings();
          this.plugin.refreshOpenViews();
          this.display();
        }));
  }

}

// ==========================================================================
// Main Plugin Class
// ==========================================================================

// --------------------------------------------------------------------------
// Break & Free Period ("Okienka") Helper Functions
// --------------------------------------------------------------------------
function renderBreakIcon(container, iconType) {
  const span = container.createSpan({ cls: "uni-timeline-gap-icon" });
  switch (iconType) {
    case "hourglass":
      setIcon(span, "hourglass");
      break;
    case "pause":
      setIcon(span, "pause");
      break;
    case "food":
      setIcon(span, "utensils");
      break;
    case "walk":
      setIcon(span, "footprints");
      break;
    case "book":
      setIcon(span, "book-open");
      break;
    case "music":
      setIcon(span, "music");
      break;
    case "sun":
      setIcon(span, "sun");
      break;
    case "moon":
      setIcon(span, "moon");
      break;
    case "spark":
      setIcon(span, "zap");
      break;
    case "battery":
      setIcon(span, "battery-charging");
      break;
    case "clock":
      setIcon(span, "clock");
      break;
    case "leaf":
      setIcon(span, "leaf");
      break;
    case "smile":
      setIcon(span, "smile");
      break;
    case "coffee":
    default:
      setIcon(span, "coffee");
      break;
  }
}

function getBreakConfigForEvents(plugin, eventA, eventB) {
  const g = plugin.settings.timelineGaps || {};
  const isEnabled = Boolean(g.enabled);
  if (!isEnabled) return null;

  let cfg = {
    enabled: true,
    style: g.style || "pill",
    icon: g.icon || "coffee",
    minMinutes: (g.minMinutes !== undefined) ? parseInt(g.minMinutes, 10) : (parseInt(plugin.settings.timelineGapThreshold || "15", 10) || 15),
    maxMinutes: (g.maxMinutes !== undefined) ? parseInt(g.maxMinutes, 10) : 0
  };

  const sourceId = (eventA && eventA.sourceId) ? eventA.sourceId : (eventB ? eventB.sourceId : null);
  if (sourceId && g.calendarOverrides && g.calendarOverrides[sourceId]) {
    const o = g.calendarOverrides[sourceId];
    if (o.enabled) {
      if (o.style) cfg.style = o.style;
      if (o.icon) cfg.icon = o.icon;
      if (o.minMinutes !== undefined && !isNaN(parseInt(o.minMinutes, 10))) {
        cfg.minMinutes = parseInt(o.minMinutes, 10);
      }
      if (o.maxMinutes !== undefined && !isNaN(parseInt(o.maxMinutes, 10))) {
        cfg.maxMinutes = parseInt(o.maxMinutes, 10);
      }
    }
  }

  if (isNaN(cfg.minMinutes) || cfg.minMinutes < 1) cfg.minMinutes = 5;
  if (isNaN(cfg.maxMinutes) || cfg.maxMinutes < 0) cfg.maxMinutes = 0;

  return cfg;
}

module.exports = class UniCalendarPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.sourceRawEventCounts = new Map();
    this.rawExpandedEvents = [];
    this.events = [];
    this.eventsMap = new Map();

    this.parseAndCacheAllSources();

    this.registerView(VIEW_TYPE_CALENDAR, leaf => new UniCalendarView(leaf, this));

    this.addRibbonIcon("graduation-cap", t(this, "ribbonTitle"), () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-sidebar",
      name: t(this, "commandOpen"),
      callback: () => this.activateView()
    });

    this.addCommand({
      id: "sync",
      name: t(this, "commandSync"),
      callback: async () => {
        try {
          const res = await this.syncCalendar(false);
          if (res && res.allLocked) {
            new Notice(t(this, "allSchedulesLockedNotice"), 6000);
          } else {
            new Notice(t(this, "refreshSuccess", { count: this.events.length }));
          }
          this.refreshOpenViews();
        } catch (err) {
          new Notice(t(this, "refreshError") + err.message, 9000);
        }
      }
    });

    this.addCommand({
      id: "export-clean-ics",
      name: t(this, "commandExportIcs"),
      callback: async () => {
        await this.exportCleanIcs();
      }
    });

    this.addCommand({
      id: "open-note-template-builder",
      name: t(this, "btnOpenTemplateBuilder"),
      callback: () => {
        new NoteTemplateBuilderModal(this.app, this).open();
      }
    });

    const processCodeBlock = (source, el) => {
      let targetDateKey = formatDateKey(new Date());

      if (source && source.trim()) {
        const lines = source.trim().split("\n");
        for (const line of lines) {
          const match = line.match(/^date\s*:\s*(\S+)/i);
          if (match) {
            const val = match[1].toLowerCase();
            if (["dzisiaj", "today"].includes(val)) {
              targetDateKey = formatDateKey(new Date());
            } else if (["jutro", "tomorrow"].includes(val)) {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              targetDateKey = formatDateKey(d);
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
              targetDateKey = val;
            }
          }
        }
      }

      const container = el.createDiv({ cls: "uni-schedule-embed" });
      this.renderScheduleTimeline(container, targetDateKey, () => {});
    };

    this.registerMarkdownCodeBlockProcessor("uni-schedule", processCodeBlock);
    this.registerMarkdownCodeBlockProcessor("uni-calendar", processCodeBlock);

    this.settingTab = new UniCalendarSettingTab(this.app, this);
    this.addSettingTab(this.settingTab);

    this.app.workspace.onLayoutReady(async () => {
      if (!this.settings.scheduleSources || this.settings.scheduleSources.length === 0) {
        await this.activateView();
      }

      if (this.settings.scheduleSources.length === 0) {
        const localFile = this.app.vault.getAbstractFileByPath(this.settings.localIcsPath || "schedule.ics") ||
                          this.app.vault.getAbstractFileByPath("plan.ics");
        if (localFile instanceof TFile) {
          try {
            const content = await this.app.vault.read(localFile);
            if (content && content.includes("BEGIN:VCALENDAR")) {
              await this.addFileScheduleSource(localFile.name, content);
            }
          } catch (e) {
            console.error("Failed to read local .ics file:", e);
          }
        }
      }

      const hasUnlockedUrlSources = (this.settings.scheduleSources || []).some(s => s.type === "url" && s.url && !s.locked);
      if (this.settings.autoSyncOnStartup && hasUnlockedUrlSources) {
        this.syncCalendar(true).catch(err => {
          console.warn("Could not auto-sync schedules on startup:", err);
        });
      }
    });
  }

  async onunload() {
    clearActiveUniTooltip();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CALENDAR);
  }

  async loadSettings() {
    const rawLoadedData = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, rawLoadedData);
    if (this.settings.hideSupport === true) {
      this.settings.showCoffeeBanner = false;
      this.settings.showCoffeeIcon = false;
    } else {
      this.settings.hideSupport = false;
      this.settings.showCoffeeBanner = true;
      this.settings.showCoffeeIcon = true;
    }
    if (this.settings.showTimelineGaps !== undefined && (!this.settings.timelineGaps || typeof this.settings.timelineGaps !== "object")) {
      this.settings.timelineGaps = {
        enabled: Boolean(this.settings.showTimelineGaps),
        style: "pill",
        icon: "coffee",
        minMinutes: parseInt(this.settings.timelineGapThreshold || "15", 10) || 15,
        maxMinutes: 0,
        calendarOverrides: {}
      };
    }
    if (!this.settings.timelineGaps) {
      this.settings.timelineGaps = Object.assign({}, DEFAULT_SETTINGS.timelineGaps);
    }
    if (!this.settings.timelineGaps.calendarOverrides) {
      this.settings.timelineGaps.calendarOverrides = {};
    }
    // Automatically sanitize and resolve any existing duplicate schedule source names
    if (Array.isArray(this.settings.scheduleSources)) {
      const seenNames = new Set();
      let modifiedDuplicates = false;
      this.settings.scheduleSources.forEach(s => {
        if (!s || !s.name) return;
        const lower = s.name.trim().toLowerCase();
        if (seenNames.has(lower)) {
          const others = this.settings.scheduleSources.filter(o => o !== s);
          s.name = getUniqueScheduleSourceName(others, s.name, null, this);
          modifiedDuplicates = true;
        }
        seenNames.add(s.name.trim().toLowerCase());
      });
      if (modifiedDuplicates) {
        this.saveSettings();
      }
    }
    if (rawLoadedData && rawLoadedData.language) {
      this.settings.language = rawLoadedData.language;
    } else {
      this.settings.language = "auto";
    }
    if (!rawLoadedData || !rawLoadedData.noteTemplate) {
      const curL = getLang(this);
      this.settings.noteTemplate = DEFAULT_NOTE_TEMPLATES[curL] || DEFAULT_NOTE_TEMPLATES.en || DEFAULT_NOTE_TEMPLATES.pl;
    }
    if (!this.settings.firstDayOfWeek) {
      this.settings.firstDayOfWeek = "monday";
    }
    if (!this.settings.timeFormat) {
      this.settings.timeFormat = "24h";
    }
    if (!this.settings.classColors) {
      this.settings.classColors = Object.assign({}, DEFAULT_CLASS_COLORS);
    }
    if (!this.settings.classCustomNames) {
      this.settings.classCustomNames = {};
    }
    if (!this.settings.excludedSubjects) {
      this.settings.excludedSubjects = [];
    }
    if (typeof this.settings.excludedKeywords === "string") {
      this.settings.excludedKeywords = this.settings.excludedKeywords
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
    } else if (!Array.isArray(this.settings.excludedKeywords)) {
      this.settings.excludedKeywords = [];
    }
    if (!this.settings.noteNameFormat) {
      this.settings.noteNameFormat = "{date} - {subject}";
    }
    if (!this.settings.dateFormat) {
      this.settings.dateFormat = "YYYY-MM-DD";
    }
    if (!Array.isArray(this.settings.scheduleSources)) {
      this.settings.scheduleSources = [];
    }

    // Migrate legacy single schedule into scheduleSources list
    if (this.settings.scheduleSources.length === 0 && (this.settings.cachedIcs || this.settings.calendarUrl)) {
      const isUrl = Boolean(this.settings.calendarUrl && this.settings.calendarUrl.trim());
      const urlVal = isUrl ? this.settings.calendarUrl.trim() : "";
      this.settings.scheduleSources.push({
        id: "src-migrated-" + Date.now(),
        type: isUrl ? "url" : "file",
        name: isUrl ? deriveSourceLabelFromUrl(urlVal) : (this.settings.localIcsPath || "plan.ics"),
        url: urlVal,
        cachedIcs: this.settings.cachedIcs || "",
        addedAt: Date.now()
      });
      this.settings.calendarUrl = "";
      this.settings.cachedIcs = "";
      await this.saveSettings();
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  openPluginSettings() {
    if (this.app && this.app.setting) {
      this.app.setting.open();
      const tabId = (this.settingTab && this.settingTab.id) || (this.manifest && this.manifest.id);
      if (tabId && typeof this.app.setting.openTabById === "function") {
        this.app.setting.openTabById(tabId);
      }
    }
  }

  getClassColor(category) {
    const colors = this.settings.classColors || DEFAULT_CLASS_COLORS;
    if (colors[category]) return colors[category];
    if (DEFAULT_CLASS_COLORS[category]) return DEFAULT_CLASS_COLORS[category];
    if (category && category.endsWith("_egzamin")) {
      const baseCat = category.replace(/_egzamin$/, "");
      return colors[baseCat] || DEFAULT_CLASS_COLORS[baseCat] || "#ef4444";
    }
    return "#6b7280";
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR)[0];

    if (!leaf) {
      const rightLeaf = workspace.getRightLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({
          type: VIEW_TYPE_CALENDAR,
          active: true
        });
        leaf = rightLeaf;
      }
    }

    if (leaf) {
      workspace.revealLeaf(leaf);
    }

    if (workspace.rightSplit && typeof workspace.rightSplit.expand === "function" && workspace.rightSplit.collapsed) {
      workspace.rightSplit.expand();
    }
  }

  refreshOpenViews() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);
    for (const leaf of leaves) {
      if (leaf.view && typeof leaf.view.render === "function") {
        leaf.view.render();
      }
    }
  }

  isEventExcluded(event) {
    if (!event || !event.summary) return false;
    const rawSummary = event.summary.trim();
    const cleanSummary = this.settings.cleanSubjectNames ? cleanSubjectTitle(rawSummary) : rawSummary;

    const excludedList = this.settings.excludedSubjects || [];
    if (excludedList.includes(rawSummary) || (this.settings.cleanSubjectNames && excludedList.includes(cleanSummary))) {
      return true;
    }

    let keywords = [];
    if (Array.isArray(this.settings.excludedKeywords)) {
      keywords = this.settings.excludedKeywords;
    } else if (typeof this.settings.excludedKeywords === "string") {
      keywords = this.settings.excludedKeywords.split(/[,\n]/).map(k => k.trim()).filter(k => k.length > 0);
    }

    if (keywords.length > 0) {
      const rawSummaryLower = rawSummary.toLowerCase();
      const cleanSummaryLower = cleanSummary.toLowerCase();
      const descLower = (event.description || "").toLowerCase();
      const locLower = (event.location || "").toLowerCase();
      const fullTextToMatch = `${rawSummaryLower} ${cleanSummaryLower} ${descLower} ${locLower}`;

      for (const rawKw of keywords) {
        const rule = normalizeKeywordRule(rawKw);
        if (!rule) continue;
        if (rule.sourceId && rule.sourceId !== "__ALL__") {
          if (event.sourceId && event.sourceId !== rule.sourceId) {
            continue;
          }
        }

        // 1. Conditional subject exclusion: If subject matches condition, check keyword(s)
        if (rule.subjectCondition) {
          const cond = rule.subjectCondition.toLowerCase().trim();
          const subjectMatches = rawSummaryLower.includes(cond) || cleanSummaryLower.includes(cond);
          if (!subjectMatches) {
            continue;
          }

          if (rule.keywordsAll && rule.keywordsAll.length > 0) {
            const allMatch = rule.keywordsAll.every(kw => fullTextToMatch.includes(kw.toLowerCase().trim()));
            if (allMatch) return true;
          } else if (rule.keyword) {
            const cleanKw = rule.keyword.toLowerCase().trim();
            if (cleanKw && fullTextToMatch.includes(cleanKw)) {
              return true;
            }
          }
          continue;
        }

        // 2. Compound keyword rule: all keywords must match in fullTextToMatch
        if (rule.keywordsAll && rule.keywordsAll.length > 0) {
          const allMatch = rule.keywordsAll.every(kw => fullTextToMatch.includes(kw.toLowerCase().trim()));
          if (allMatch) return true;
          continue;
        }

        // 3. Simple keyword rule
        if (rule.keyword) {
          const cleanKw = rule.keyword.toLowerCase().trim();
          if (cleanKw && fullTextToMatch.includes(cleanKw)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getDetectedSubjectsForSource(sourceId) {
    const set = new Set();
    const sourceEvents = (this.allSourcesExpandedEvents || []).filter(ev => ev.sourceId === sourceId);
    for (const ev of sourceEvents) {
      if (ev && ev.summary && ev.summary.trim()) {
        set.add(ev.summary.trim());
      }
    }
    if (set.size === 0) {
      const src = (this.settings.scheduleSources || []).find(s => s.id === sourceId);
      if (src && src.cachedIcs) {
        const raw = parseICS(src.cachedIcs);
        for (const ev of raw) {
          if (ev && ev.summary && ev.summary.trim()) {
            set.add(ev.summary.trim());
          }
        }
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }

  getAllDetectedSubjects() {
    const set = new Set();
    const source = (this.allSourcesExpandedEvents && this.allSourcesExpandedEvents.length > 0)
      ? this.allSourcesExpandedEvents
      : ((this.rawExpandedEvents && this.rawExpandedEvents.length > 0)
        ? this.rawExpandedEvents
        : this.events);

    for (const ev of source) {
      if (ev && ev.summary) {
        set.add(ev.summary.trim());
      }
    }

    if (this.settings.subjectFolderMappings) {
      for (const k of Object.keys(this.settings.subjectFolderMappings)) {
        if (k) set.add(k.trim());
      }
    }

    if (Array.isArray(this.settings.excludedSubjects)) {
      for (const s of this.settings.excludedSubjects) {
        if (s) set.add(s.trim());
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }

  // ------------------------------------------------------------------------
  // Multi-Schedule Sources Management (Add, Refresh, Hide/Show, Remove, Merge)
  // ------------------------------------------------------------------------
  async fetchIcsFromUrl(rawUrl) {
    const url = normalizeCalendarUrl(rawUrl);
    let icsContent = "";

    if (/Plany\/PlanyGrup\/\d+/i.test(url)) {
      icsContent = await this.fetchGroupPortalSchedule(url);
    } else {
      const fetchUrl = url.replace(/^webcal:\/\//i, "https://");
      const isGoogle = /google\.com/i.test(fetchUrl);

      let response;
      try {
        response = await requestUrl({
          url: fetchUrl,
          throw: false,
          headers: {
            "Accept": "text/calendar, text/plain, */*",
            "User-Agent": "Mozilla/5.0 (compatible; Obsidian/UniCalendar; +https://github.com/Cesemess/obsidian-uni-calendar)"
          }
        });
      } catch (reqErr) {
        const msg = String((reqErr && reqErr.message) || reqErr || "");
        if (/\b(401|403)\b/.test(msg)) {
          throw new Error(t(this, isGoogle ? "errHttp401Google" : "errHttp401General"));
        }
        throw reqErr;
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(t(this, isGoogle ? "errHttp401Google" : "errHttp401General"));
      }

      if (response.status < 200 || response.status >= 300) {
        throw new Error(t(this, "errHttpStatus", { status: response.status }));
      }

      icsContent = response.text;

      if (isGoogle && (!icsContent || !icsContent.includes("BEGIN:VCALENDAR"))) {
        throw new Error(t(this, "errHttp401Google"));
      }
    }

    if (!icsContent || !icsContent.includes("BEGIN:VCALENDAR")) {
      throw new Error(t(this, "errInvalidIcsContent"));
    }

    return icsContent;
  }

  async addUrlScheduleSource(url) {
    const cleanUrl = normalizeCalendarUrl(url.trim());
    const icsContent = await this.fetchIcsFromUrl(cleanUrl);

    if (!Array.isArray(this.settings.scheduleSources)) {
      this.settings.scheduleSources = [];
    }

    const existing = this.settings.scheduleSources.find(
      s => s.type === "url" && (s.url === cleanUrl || s.url === url.trim())
    );
    const rawLabel = deriveSourceLabelFromUrl(cleanUrl, icsContent);
    if (existing) {
      existing.url = cleanUrl;
      if (!existing.customName) {
        existing.name = getUniqueScheduleSourceName(
          this.settings.scheduleSources.filter(s => s.id !== existing.id),
          rawLabel,
          null,
          this
        );
      }
      existing.cachedIcs = icsContent;
      existing.lastSync = Date.now();
    } else {
      const uniqueName = getUniqueScheduleSourceName(this.settings.scheduleSources, rawLabel, null, this);
      this.settings.scheduleSources.push({
        id: "src-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        type: "url",
        name: uniqueName,
        customName: false,
        url: cleanUrl,
        cachedIcs: icsContent,
        hidden: false,
        locked: false,
        showNameOnEvent: false,
        addedAt: Date.now(),
        lastSync: Date.now()
      });
    }

    this.settings.lastSyncTimestamp = Date.now();
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
  }

  async addFileScheduleSource(fileName, icsContent) {
    if (!Array.isArray(this.settings.scheduleSources)) {
      this.settings.scheduleSources = [];
    }

    const existing = this.settings.scheduleSources.find(s => s.type === "file" && s.name === fileName);
    if (existing) {
      existing.cachedIcs = icsContent;
      existing.lastSync = Date.now();
    } else {
      const uniqueName = getUniqueScheduleSourceName(this.settings.scheduleSources, fileName || "schedule.ics", null, this);
      this.settings.scheduleSources.push({
        id: "src-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        type: "file",
        name: uniqueName,
        customName: false,
        url: "",
        cachedIcs: icsContent,
        hidden: false,
        locked: false,
        showNameOnEvent: false,
        addedAt: Date.now(),
        lastSync: Date.now()
      });
    }

    this.settings.lastSyncTimestamp = Date.now();
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
  }

  async refreshSingleSource(sourceId) {
    const src = (this.settings.scheduleSources || []).find(s => s.id === sourceId);
    if (!src || src.type !== "url" || !src.url || src.locked) return;

    const normalizedUrl = normalizeCalendarUrl(src.url);
    const icsContent = await this.fetchIcsFromUrl(normalizedUrl);
    src.url = normalizedUrl;
    if (!src.customName) {
      src.name = deriveSourceLabelFromUrl(normalizedUrl, icsContent);
    }
    src.cachedIcs = icsContent;
    src.lastSync = Date.now();
    this.settings.lastSyncTimestamp = Date.now();
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
  }

  async renameScheduleSource(sourceId, newName) {
    const sources = this.settings.scheduleSources || [];
    const src = sources.find(s => s.id === sourceId);
    if (!src || !newName || !newName.trim()) return false;
    const cleanName = newName.trim();

    const isDuplicate = sources.some(
      s => s.id !== sourceId && s.name && s.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicate) return false;

    src.name = cleanName;
    src.customName = true;
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
    return true;
  }

  async toggleScheduleSourceShowName(sourceId) {
    const src = (this.settings.scheduleSources || []).find(s => s.id === sourceId);
    if (!src) return false;
    src.showNameOnEvent = !src.showNameOnEvent;
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
    return Boolean(src.showNameOnEvent);
  }

  async toggleScheduleSourceLock(sourceId) {
    const src = (this.settings.scheduleSources || []).find(s => s.id === sourceId);
    if (!src) return false;
    src.locked = !src.locked;
    await this.saveSettings();
    this.refreshOpenViews();
    return Boolean(src.locked);
  }

  async toggleScheduleSourceVisibility(sourceId) {
    const src = (this.settings.scheduleSources || []).find(s => s.id === sourceId);
    if (!src) return false;
    src.hidden = !src.hidden;
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
    return Boolean(src.hidden);
  }

  async removeScheduleSource(sourceId) {
    if (!Array.isArray(this.settings.scheduleSources)) return;
    this.settings.scheduleSources = this.settings.scheduleSources.filter(s => s.id !== sourceId);
    await this.saveSettings();
    this.parseAndCacheAllSources();
    this.refreshOpenViews();
  }

  async syncCalendar(isAutoStartup = false) {
    const sources = this.settings.scheduleSources || [];
    if (sources.length === 0) {
      throw new Error(t(this, "errNoScheduleSource"));
    }

    const unlockedUrlSources = sources.filter(src => src.type === "url" && src.url && !src.locked);
    const hasAnyLocked = sources.some(src => Boolean(src.locked));

    if (!isAutoStartup && unlockedUrlSources.length === 0 && hasAnyLocked) {
      return { allLocked: true };
    }

    let updatedAny = false;
    for (const src of unlockedUrlSources) {
      const normalizedUrl = normalizeCalendarUrl(src.url);
      const icsContent = await this.fetchIcsFromUrl(normalizedUrl);
      src.url = normalizedUrl;
      if (!src.customName) {
        src.name = deriveSourceLabelFromUrl(normalizedUrl, icsContent);
      }
      src.cachedIcs = icsContent;
      src.lastSync = Date.now();
      updatedAny = true;
    }

    if (updatedAny) {
      this.settings.lastSyncTimestamp = Date.now();
      await this.saveSettings();
    }

    this.parseAndCacheAllSources();
    this.refreshOpenViews();
    return { allLocked: false, updatedAny };
  }

  /**
   * Academic Timetable Portal Adapter:
   * Supports public university timetables hosted on popular DevExpress/ASP.NET academic portals
   * (matching `/Plany/PlanyGrup/{groupId}`).
   *
   * These academic web portals render student group timetables dynamically and export clean iCal feeds
   * via an internal callback endpoint (`gridViewPlanyGrup`). This method negotiates the public session,
   * retrieves active academic term parameters, and securely fetches the complete schedule in standard
   * iCalendar (.ics) format.
   *
   * @param {string} targetUrl The public university timetable portal URL.
   * @returns {Promise<string>} Standard iCalendar (.ics) format string.
   */
  async fetchGroupPortalSchedule(targetUrl) {
    const match = targetUrl.match(/^(https?:\/\/[^\/]+)\/Plany\/PlanyGrup\/(\d+)/i);
    if (!match) {
      throw new Error(t(this, "errInvalidIcsContent"));
    }

    const baseUrl = match[1];
    const groupId = match[2];

    const resp1 = await requestUrl({
      url: `${baseUrl}/Plany/PlanyGrup/${groupId}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Obsidian/UniCalendar; +https://github.com/Cesemess/obsidian-uni-calendar)"
      }
    });

    if (resp1.status < 200 || resp1.status >= 300) {
      throw new Error(t(this, "errHttpStatus", { status: resp1.status }));
    }

    let setCookieHeader = resp1.headers["set-cookie"] || resp1.headers["Set-Cookie"] || "";
    if (Array.isArray(setCookieHeader)) {
      setCookieHeader = setCookieHeader.join("; ");
    }
    const sessionMatch = String(setCookieHeader).match(/ASP\.NET_SessionId=([^;]+)/i);
    const sessionCookie = sessionMatch ? `ASP.NET_SessionId=${sessionMatch[1]}` : "";

    let parametry = "";
    const html = resp1.text || "";
    const terminMatch = html.match(/id=["']RadioList_Termin3["'][^>]*value=["']([^"']+)["']/i);
    if (terminMatch) {
      const parts = terminMatch[1].split(/\\/);
      if (parts.length >= 2) {
        const d1 = parts[0].replace(/,/g, "-");
        const d2 = parts[1].replace(/,/g, "-");
        parametry = `${d1};${d2};3;${groupId}`;
      }
    }

    if (!parametry) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (month >= 9) {
        parametry = `${year}-9-1;${year + 1}-2-28;3;${groupId}`;
      } else if (month <= 2) {
        parametry = `${year - 1}-9-1;${year}-2-28;3;${groupId}`;
      } else {
        parametry = `${year}-2-15;${year}-9-30;3;${groupId}`;
      }
    }

    const postBody = `DXCallbackName=gridViewPlanyGrup&__DXCallbackArgument=c0%3ACUSTOMCALLBACK%7C&parametry=${encodeURIComponent(parametry)}&id=${groupId}`;

    const headersStep2 = {
      "User-Agent": "Mozilla/5.0 (compatible; Obsidian/UniCalendar; +https://github.com/Cesemess/obsidian-uni-calendar)",
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded"
    };
    if (sessionCookie) {
      headersStep2["Cookie"] = sessionCookie;
    }

    await requestUrl({
      url: `${baseUrl}/Plany/PlanyGrupGridCustom/${groupId}`,
      method: "POST",
      headers: headersStep2,
      body: postBody
    });

    const headersStep3 = {
      "User-Agent": "Mozilla/5.0 (compatible; Obsidian/UniCalendar; +https://github.com/Cesemess/obsidian-uni-calendar)"
    };
    if (sessionCookie) {
      headersStep3["Cookie"] = sessionCookie;
    }

    const resp3 = await requestUrl({
      url: `${baseUrl}/Plany/WydrukGrupyical/${groupId}`,
      method: "GET",
      headers: headersStep3
    });

    if (resp3.text && resp3.text.includes("BEGIN:VCALENDAR")) {
      return resp3.text;
    }

    throw new Error(t(this, "errInvalidIcsContent"));
  }

  parseAndCacheAllSources() {
    const sources = this.settings.scheduleSources || [];
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth() - 12, 1);
    const windowEnd = new Date(now.getFullYear(), now.getMonth() + 14, 0);

    const visibleExpanded = [];
    const allSourcesExpanded = [];
    const seenVisibleKeys = new Set();
    const seenAllKeys = new Set();
    this.sourceRawEventCounts = new Map();

    for (const src of sources) {
      if (!src.cachedIcs) {
        this.sourceRawEventCounts.set(src.id, 0);
        continue;
      }
      const sourceDisplayName = src.name || (src.type === "url" ? deriveSourceLabelFromUrl(src.url || "", src.cachedIcs) : "schedule.ics");
      const showSourceName = Boolean(src.showNameOnEvent);
      const rawEvents = parseICS(src.cachedIcs);
      this.sourceRawEventCounts.set(src.id, rawEvents.length);
      const expanded = expandRecurringEvents(rawEvents, windowStart, windowEnd);
      for (const ev of expanded) {
        ev.sourceId = src.id;
        ev.sourceName = sourceDisplayName;
        ev.showSourceName = showSourceName;
        const sourceDedupKey = ev.uid
          ? `${src.id}|${ev.uid}|${ev.dtstart ? ev.dtstart.getTime() : ""}`
          : `${src.id}|${ev.summary}|${ev.dtstart ? ev.dtstart.getTime() : ""}|${ev.location || ""}|${ev.description || ""}`;
        if (!seenAllKeys.has(sourceDedupKey)) {
          seenAllKeys.add(sourceDedupKey);
          allSourcesExpanded.push(ev);
        }
        if (!src.hidden && !seenVisibleKeys.has(sourceDedupKey)) {
          seenVisibleKeys.add(sourceDedupKey);
          visibleExpanded.push(ev);
        }
      }
    }

    allSourcesExpanded.sort((a, b) => a.dtstart.getTime() - b.dtstart.getTime());
    visibleExpanded.sort((a, b) => a.dtstart.getTime() - b.dtstart.getTime());
    this.allSourcesExpandedEvents = allSourcesExpanded;
    this.rawExpandedEvents = visibleExpanded;
    this.rebuildEventsMap();
  }

  rebuildEventsMap() {
    this.events = (this.rawExpandedEvents || []).filter(ev => !this.isEventExcluded(ev));

    this.eventsMap = new Map();
    for (const ev of this.events) {
      const k = ev.dateKey;
      if (!this.eventsMap.has(k)) {
        this.eventsMap.set(k, []);
      }
      this.eventsMap.get(k).push(ev);
    }
  }

  getEventsMap() {
    return this.eventsMap;
  }

  getEventsForDate(dateKey) {
    return this.eventsMap.get(dateKey) || [];
  }

  // ------------------------------------------------------------------------
  // Note Path Resolution & Folder Matching
  // ------------------------------------------------------------------------
  resolveSubjectFolder(event) {
    const rawSummary = event.summary || t(this, "defaultCourseName");
    const cleanedSummary = cleanSubjectTitle(rawSummary);

    const mappings = this.settings.subjectFolderMappings || {};
    let manualMapping = mappings[rawSummary] || mappings[cleanedSummary];
    if (manualMapping) {
      if (manualMapping === "__NONE__") {
        return null;
      }
      manualMapping = normalizeVaultPath(manualMapping);
      // Strip accidental untitled subfolders like /Bez nazwy, /Bez nazwy 1, /Untitled
      manualMapping = manualMapping.replace(/\/(bez nazwy|untitled)(\s+\d+)?$/gi, "");
      return manualMapping;
    }

    if (this.settings.autoFindFolder) {
      const matched = this.findExistingVaultFolder(cleanedSummary, rawSummary);
      if (matched) {
        let cleanMatched = normalizeVaultPath(matched);
        cleanMatched = cleanMatched.replace(/\/(bez nazwy|untitled)(\s+\d+)?$/gi, "");
        return cleanMatched;
      }
    }

    return null;
  }

  findExistingVaultFolder(cleaned, raw) {
    const allFiles = this.app.vault.getAllLoadedFiles();
    const folders = allFiles.filter(f => f instanceof TFolder);

    const normClean = cleaned.toLowerCase().trim();
    const normRaw = raw.toLowerCase().trim();

    const basePrefix = this.settings.baseFolder ? normalizeVaultPath(this.settings.baseFolder).toLowerCase() : null;

    let bestCandidate = null;
    let bestScore = 0;

    for (const folder of folders) {
      const fPath = normalizeVaultPath(folder.path).toLowerCase();
      const fName = folder.name.toLowerCase().trim();
      if (!fPath) continue;

      // Ignore untitled placeholder folders created accidentally
      if (/^(bez nazwy|untitled)(\s+\d+)?$/i.test(fName)) {
        continue;
      }

      if (basePrefix && !fPath.startsWith(basePrefix)) {
        continue;
      }

      if (fName === normClean || fName === normRaw) {
        return normalizeVaultPath(folder.path);
      }

      // Only match substrings if both subject and folder have at least 3 characters
      if (normClean.length >= 3 && fName.length >= 3) {
        if (fName.includes(normClean) || normClean.includes(fName)) {
          const matchLen = Math.min(fName.length, normClean.length);
          if (matchLen > bestScore) {
            bestScore = matchLen;
            bestCandidate = normalizeVaultPath(folder.path);
          }
        }
      }
    }

    return bestCandidate;
  }

  resolveNotePath(event, dateKey) {
    const folder = this.resolveSubjectFolder(event);
    if (!folder) return null;
    const cleanFolder = normalizeVaultPath(folder);
    const fileName = getNoteFileName(this, event, dateKey);
    return cleanFolder ? `${cleanFolder}/${fileName}` : fileName;
  }

  checkFileExists(path) {
    if (!path) return false;
    const norm = normalizeVaultPath(path);
    const file = this.app.vault.getAbstractFileByPath(norm);
    return file instanceof TFile;
  }

  getSubjectFolderNoteFile(event) {
    const folderPath = this.resolveSubjectFolder(event);
    if (!folderPath) return null;
    const cleanFolder = normalizeVaultPath(folderPath);
    const folderBaseName = cleanFolder.split("/").pop() || "";
    const cleanSummary = cleanSubjectTitle(event.summary || "");

    const candidates = [
      normalizeVaultPath(`${cleanFolder}/${folderBaseName}.md`),
      normalizeVaultPath(`${cleanFolder}/${cleanSummary}.md`),
      normalizeVaultPath(`${cleanFolder}.md`)
    ];

    for (const cand of candidates) {
      const f = this.app.vault.getAbstractFileByPath(cand);
      if (f instanceof TFile) return f;
    }

    const folderObj = this.app.vault.getAbstractFileByPath(cleanFolder);
    if (folderObj instanceof TFolder) {
      const files = folderObj.children.filter(c => c instanceof TFile && c.extension === "md");
      const normBase = folderBaseName.toLowerCase().trim();
      const normSumm = cleanSummary.toLowerCase().trim();
      const found = files.find(f => {
        const b = f.basename.toLowerCase().trim();
        return b === normBase || b === normSumm;
      });
      if (found) return found;
    }

    return null;
  }

  // ------------------------------------------------------------------------
  // Reusable Timeline Renderer (Used by Sidebar & Codeblock)
  // ------------------------------------------------------------------------
  renderScheduleTimeline(container, dateKey, onNoteCreated) {
    const section = container.createDiv({ cls: "uni-schedule-section" });

    const todayDateKey = formatDateKey(new Date());
    const isToday = (dateKey === todayDateKey);
    const now = new Date();

    const parts = dateKey.split("-");
    const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

    const eventsForDay = this.getEventsForDate(dateKey);

    const header = section.createDiv({ cls: "uni-schedule-header" });
    const dateTitle = header.createDiv({ cls: "uni-schedule-date-title" });
    dateTitle.setText(formatLocalizedDateHeader(this, dObj));

    const badge = header.createDiv({ cls: "uni-schedule-badge-count" });
    badge.setText(formatClassesCount(this, eventsForDay.length));

    const sources = this.settings.scheduleSources || [];
    if (sources.length === 0) {
      const emptyBox = section.createDiv({ cls: "uni-empty-schedule uni-no-sources-empty-box" });
      const emptyIcon = emptyBox.createDiv({ cls: "uni-empty-schedule-icon" });
      emptyIcon.setText("📅");
      const emptyTitle = emptyBox.createDiv({ cls: "uni-empty-schedule-title" });
      emptyTitle.setText(t(this, "emptyNoSourcesTitle"));
      const emptyDesc = emptyBox.createDiv({ cls: "uni-empty-schedule-desc" });
      emptyDesc.setText(t(this, "emptyNoSourcesDesc"));
      const addBtn = emptyBox.createEl("button", {
        cls: "uni-keyword-btn uni-action-btn uni-empty-add-btn",
        text: t(this, "btnAddScheduleSettings")
      });
      addBtn.addEventListener("click", () => {
        this.openPluginSettings();
      });
      return;
    }

    if (eventsForDay.length === 0) {
      const emptyBox = section.createDiv({ cls: "uni-empty-schedule" });
      const emptyIcon = emptyBox.createDiv({ cls: "uni-empty-schedule-icon" });
      emptyIcon.setText("🎓");
      const emptyText = emptyBox.createDiv({ cls: "uni-empty-schedule-title uni-empty-schedule-text" });
      emptyText.setText(t(this, "emptyScheduleTitle"));
      const emptySub = emptyBox.createDiv({ cls: "uni-empty-schedule-subtext" });
      emptySub.setText(t(this, "emptyScheduleDesc"));
      return;
    }

    const timeline = section.createDiv({ cls: "uni-timeline" });

    // Strictly sort events chronologically by start time (all-day events at top)
    const sortedEvents = eventsForDay.slice().sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      return (a.dtstart ? a.dtstart.getTime() : 0) - (b.dtstart ? b.dtstart.getTime() : 0);
    });

    let maxPrevEnd = null;
    let lastEvent = null;

    sortedEvents.forEach(event => {
      // Visual timeline break / gap indicator between classes (respects excluded classes & overlaps, ignores all-day events)
      if (!event.isAllDay) {
        if (maxPrevEnd && event.dtstart) {
          const gapMs = event.dtstart.getTime() - maxPrevEnd.getTime();
          if (gapMs > 0) {
            const gapMin = Math.round(gapMs / 60000);
            const breakCfg = getBreakConfigForEvents(this, lastEvent, event);
            if (breakCfg && gapMin >= breakCfg.minMinutes && (breakCfg.maxMinutes === 0 || gapMin <= breakCfg.maxMinutes)) {
              const gapHours = Math.floor(gapMin / 60);
              const remMin = gapMin % 60;
              let gapLabel = "";
              if (gapHours > 0) {
                gapLabel = remMin > 0 ? `${gapHours}h ${remMin}m` : `${gapHours}h`;
              } else {
                gapLabel = `${gapMin}m`;
              }

              if (breakCfg.style === "card") {
                const item = timeline.createDiv({ cls: "uni-timeline-item uni-timeline-break-item" });
                const node = item.createDiv({ cls: "uni-timeline-node uni-timeline-break-node" });
                renderBreakIcon(node, breakCfg.icon);

                const card = item.createDiv({ cls: "uni-event-card uni-break-event-card" });
                const header = card.createDiv({ cls: "uni-event-header" });
                const timeSpan = header.createSpan({ cls: "uni-event-time" });
                timeSpan.setText(`${formatTime(maxPrevEnd, this)} – ${formatTime(event.dtstart, this)}`);

                const durationBadge = header.createSpan({ cls: "uni-break-card-duration-badge" });
                durationBadge.setText(gapLabel);

                const titleRow = card.createDiv({ cls: "uni-event-title-row uni-break-event-title-row" });
                const titleSpan = titleRow.createSpan({ cls: "uni-event-title uni-break-event-title" });
                const cardTitle = t(this, "breakCardDefaultTitle");
                titleSpan.setText(cardTitle);
                attachDelayedTooltip(card, t(this, "timelineBreakTooltip", { time: gapLabel }), 1500);
              } else if (breakCfg.style === "line") {
                const item = timeline.createDiv({ cls: "uni-timeline-item uni-timeline-break-line-item" });
                const node = item.createDiv({ cls: "uni-timeline-node uni-timeline-break-line-node" });
                renderBreakIcon(node, breakCfg.icon);

                const label = item.createDiv({ cls: "uni-timeline-break-line-label" });
                label.createSpan({ cls: "uni-timeline-break-line-text", text: gapLabel });

                attachDelayedTooltip(item, t(this, "timelineBreakTooltip", { time: `${gapLabel} (${formatTime(maxPrevEnd, this)} – ${formatTime(event.dtstart, this)})` }), 1200);
              } else {
                const gapDiv = timeline.createDiv({ cls: `uni-timeline-gap style-${breakCfg.style === "text" ? "text" : "pill"}` });
                const gapPill = gapDiv.createSpan({ cls: "uni-timeline-gap-pill" });
                renderBreakIcon(gapPill, breakCfg.icon);
                gapPill.createSpan({ text: ` ${gapLabel}` });
                attachDelayedTooltip(gapPill, t(this, "timelineBreakTooltip", { time: gapLabel }), 1500);
              }
            }
          }
        }
        if (event.dtend) {
          if (!maxPrevEnd || event.dtend.getTime() > maxPrevEnd.getTime()) {
            maxPrevEnd = event.dtend;
            lastEvent = event;
          }
        }
      }

      const item = timeline.createDiv({ cls: "uni-timeline-item" });
      const node = item.createDiv({ cls: "uni-timeline-node" });

      const card = item.createDiv({ cls: "uni-event-card" });
      const details = parseUniDetails(event.summary, event.description, event.location);
      const color = this.getClassColor(details.category);
      card.style.setProperty("--event-color", color);
      node.style.backgroundColor = color;

      const isOngoing = isToday && (now >= event.dtstart && now < event.dtend);
      if (isOngoing) {
        card.addClass("is-ongoing");
      }

      const cardHeader = card.createDiv({ cls: "uni-event-header" });
      const timeSpan = cardHeader.createDiv({ cls: "uni-event-time" });
      if (event.isAllDay) {
        timeSpan.setText(t(this, "allDay"));
      } else {
        timeSpan.setText(`${formatTime(event.dtstart, this)} – ${formatTime(event.dtend, this)}`);
      }

      if (isOngoing && !event.isAllDay) {
        const remainingMs = event.dtend.getTime() - now.getTime();
        const remainingMinutes = Math.max(1, Math.round(remainingMs / 60000));
        const countdownBadge = cardHeader.createDiv({ cls: "uni-event-countdown" });
        setIcon(countdownBadge, "clock");
        countdownBadge.createSpan({
          text: t(this, "remainingMin", { min: remainingMinutes })
        });
      }

      const typeBadge = cardHeader.createDiv({ cls: "uni-event-type-badge" });
      typeBadge.setText(getLocalizedClassType(this, details.category, details.isExam));

      const titleEl = card.createDiv({ cls: "uni-event-title" });
      titleEl.setText(event.summary);

      const metaEl = card.createDiv({ cls: "uni-event-meta" });
      if (details.room) {
        const locItem = metaEl.createSpan({ cls: "uni-event-meta-item" });
        setIcon(locItem, "map-pin");
        locItem.createSpan({ text: details.room });
      }

      if (details.lecturer) {
        const lecItem = metaEl.createSpan({ cls: "uni-event-meta-item" });
        setIcon(lecItem, "user");
        lecItem.createSpan({ text: details.lecturer });
      }

      const isNoteClickDisabled = Boolean(this.settings.disableNoteClick);
      const targetPath = isNoteClickDisabled ? null : this.resolveNotePath(event, dateKey);
      const rawSummary = event.summary || t(this, "defaultCourseName");
      const cleanedSummary = cleanSubjectTitle(rawSummary);
      const mappings = this.settings.subjectFolderMappings || {};
      const isIgnored = (mappings[rawSummary] === "__NONE__" || mappings[cleanedSummary] === "__NONE__");
      const showCalName = Boolean(event.showSourceName && event.sourceName);

      const statusContainer = card.createDiv({ cls: "uni-note-status" });
      const statusLeft = statusContainer.createDiv({ cls: "uni-note-status-left" });
      const statusRight = statusContainer.createDiv({ cls: "uni-note-status-right" });

      if (isNoteClickDisabled) {
        card.addClass("is-read-only");
      } else if (targetPath) {
        const fileExists = this.checkFileExists(targetPath);
        const statusBadge = statusLeft.createDiv({
          cls: `uni-note-status-badge is-clickable ${fileExists ? "has-note" : "missing-note"}`,
          attr: {
            "title": fileExists ? t(this, "badgeOpenNoteTooltip") : t(this, "badgeCreateNoteTooltip")
          }
        });

        if (fileExists) {
          setIcon(statusBadge, "file-text");
          statusBadge.createSpan({ text: t(this, "noteExists") });
        } else {
          setIcon(statusBadge, "plus");
          statusBadge.createSpan({ text: t(this, "missingNote") });
        }

        statusBadge.addEventListener("click", e => {
          e.stopPropagation();
          this.handleEventClick(event, dateKey, targetPath, () => {
            if (onNoteCreated) onNoteCreated();
          });
        });
      } else if (!isIgnored) {
        const statusBadge = statusLeft.createDiv({
          cls: "uni-note-status-badge is-clickable unmapped-new",
          attr: {
            "title": t(this, "badgeMapFolderTooltip")
          }
        });
        setIcon(statusBadge, "folder-plus");
        statusBadge.createSpan({ text: t(this, "noFolderBadge") });

        statusBadge.addEventListener("click", e => {
          e.stopPropagation();
          new CreateFolderAndNoteModal(this.app, this, {
            event,
            dateKey,
            onConfirm: () => {
              if (onNoteCreated) onNoteCreated();
            }
          }).open();
        });
      }

      if (showCalName) {
        const calLabel = statusRight.createSpan({ cls: "uni-event-calendar-source-label" });
        setIcon(calLabel, "calendar");
        calLabel.createSpan({ text: event.sourceName });
      }

      // Clicking anywhere on the card opens the full Course Schedule Modal
      card.addEventListener("click", () => {
        new CourseScheduleModal(this.app, this, event).open();
      });
    });
  }

  // ------------------------------------------------------------------------
  // Note Creation & Opening
  // ------------------------------------------------------------------------
  async openMarkdownFile(file) {
    if (!file) return;
    let leaf = this.app.workspace.getMostRecentLeaf();
    if (
      !leaf ||
      leaf.getRoot() !== this.app.workspace.rootSplit ||
      (leaf.view && leaf.view.getViewType && leaf.view.getViewType() === VIEW_TYPE_CALENDAR)
    ) {
      leaf = this.app.workspace.getLeaf("tab");
    }
    await leaf.openFile(file, { active: true });

    // Reveal file in Obsidian File Explorer tree if available
    try {
      const fileExplorerLeaves = this.app.workspace.getLeavesOfType("file-explorer");
      if (fileExplorerLeaves && fileExplorerLeaves.length > 0) {
        const fileExplorerView = fileExplorerLeaves[0].view;
        if (fileExplorerView && typeof fileExplorerView.revealInFolder === "function") {
          fileExplorerView.revealInFolder(file);
        }
      }
      if (this.app.commands && typeof this.app.commands.executeCommandById === "function") {
        this.app.commands.executeCommandById("file-explorer:reveal-active-file");
      }
    } catch (e) {
      // Ignore if file-explorer view is unavailable
    }
  }

  async handleEventClick(event, dateKey, targetPath, onComplete) {
    if (!targetPath) return;

    const normPath = normalizeVaultPath(targetPath);
    const existingFile = this.app.vault.getAbstractFileByPath(normPath);

    if (existingFile instanceof TFile) {
      await this.openMarkdownFile(existingFile);
      new Notice(t(this, "noteOpenedNotice", { name: existingFile.basename }));
    } else {
      new CreateNoteModal(this.app, this, {
        event,
        dateKey,
        targetPath: normPath,
        onConfirm: async () => {
          await this.createAndOpenNote(event, dateKey, normPath);
          if (onComplete) onComplete();
        }
      }).open();
    }
  }

  async createAndOpenNote(event, dateKey, targetPath) {
    try {
      const normPath = normalizeVaultPath(targetPath);
      const lastSlash = normPath.lastIndexOf("/");
      if (lastSlash !== -1) {
        const folderPath = normPath.substring(0, lastSlash);
        await this.ensureFolderExists(folderPath);
      }

      const details = parseUniDetails(event.summary, event.description, event.location);
      const localizedType = getLocalizedClassType(this, details.category, details.isExam);

      const rawTemplate = this.settings.noteTemplate;
      let content = "";

      if (rawTemplate !== undefined && rawTemplate !== null && rawTemplate.trim() !== "") {
        const formattedDate = formatCustomDate(dateKey, this.settings.dateFormat || "YYYY-MM-DD", this);
        const timeFormatted = event.isAllDay ? t(this, "allDay") : `${formatTime(event.dtstart, this)} – ${formatTime(event.dtend, this)}`;
        const timeStartFormatted = event.isAllDay ? "" : formatTime(event.dtstart, this);
        const timeEndFormatted = event.isAllDay ? "" : formatTime(event.dtend, this);

        const isYaml = rawTemplate.trimStart().startsWith("---");
        const yamlMatch = isYaml ? rawTemplate.match(/^(\s*---[\s\S]*?\n---)([\s\S]*)$/) : null;
        const escapeYaml = str => (str ? String(str).replace(/\\"/g, '"').replace(/"/g, '\\"') : "");

        const replacements = [
          { regex: /\{subject\}|\{przedmiot\}|\{title\}|\{nazwa\}/gi, raw: event.summary || t(this, "defaultCourseName") },
          { regex: /\{date\}|\{data\}/gi, raw: formattedDate },
          { regex: /\{time\}|\{godzina\}/gi, raw: timeFormatted },
          { regex: /\{time_start\}|\{godzina_od\}/gi, raw: timeStartFormatted },
          { regex: /\{time_end\}|\{godzina_do\}/gi, raw: timeEndFormatted },
          { regex: /\{room\}|\{sala\}|\{miejsce\}/gi, raw: details.room || t(this, "noInfo") },
          { regex: /\{lecturer\}|\{prowadzacy\}|\{prowadzący\}|\{wykladowca\}|\{wykładowca\}/gi, raw: details.lecturer || t(this, "noInfo") },
          { regex: /\{type\}|\{typ\}/gi, raw: localizedType },
          { regex: /\{description\}|\{opis\}/gi, raw: event.description || "" }
        ];

        if (yamlMatch) {
          let fm = yamlMatch[1];
          let body = yamlMatch[2];
          for (const r of replacements) {
            fm = fm.replace(r.regex, escapeYaml(r.raw));
            body = body.replace(r.regex, r.raw);
          }
          content = fm + body;
        } else {
          content = rawTemplate;
          for (const r of replacements) {
            content = content.replace(r.regex, isYaml ? escapeYaml(r.raw) : r.raw);
          }
        }
      } else {
        content = "";
      }

      const newFile = await this.app.vault.create(normPath, content);
      await this.openMarkdownFile(newFile);
      new Notice(t(this, "noteCreatedNotice", { path: normPath }));
    } catch (err) {
      new Notice(t(this, "errCreateNote", { message: err.message }));
      console.error(err);
    }
  }

  async ensureFolderExists(folderPath) {
    const norm = normalizeVaultPath(folderPath);
    if (!norm) return;
    const parts = norm.split("/").filter(p => p.length > 0);
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      const existing = this.app.vault.getAbstractFileByPath(current);
      if (!existing) {
        try {
          await this.app.vault.createFolder(current);
        } catch (err) {
          // Folder may already exist
        }
      }
    }
  }

  // ------------------------------------------------------------------------
  // Export Clean Calendar (.ics)
  // ------------------------------------------------------------------------
  async exportCleanIcs() {
    if (!this.events || this.events.length === 0) {
      new Notice(t(this, "exportEmptyError"));
      return;
    }

    const pad = n => String(n).padStart(2, "0");
    const formatICSDate = d => {
      const y = d.getUTCFullYear();
      const m = pad(d.getUTCMonth() + 1);
      const day = pad(d.getUTCDate());
      const h = pad(d.getUTCHours());
      const min = pad(d.getUTCMinutes());
      const s = pad(d.getUTCSeconds());
      return `${y}${m}${day}T${h}${min}${s}Z`;
    };

    const formatICSLocalDate = d => {
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      return `${y}${m}${day}`;
    };

    const escapeICS = str => {
      if (!str) return "";
      return String(str)
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n");
    };

    let ics = "BEGIN:VCALENDAR\r\n";
    ics += "VERSION:2.0\r\n";
    ics += "PRODID:-//Cesemess//Obsidian University Calendar//EN\r\n";
    ics += "CALSCALE:GREGORIAN\r\n";
    ics += "METHOD:PUBLISH\r\n";
    ics += "X-WR-CALNAME:University Schedule (Clean)\r\n";

    const nowStamp = formatICSDate(new Date());
    for (let index = 0; index < this.events.length; index++) {
      const ev = this.events[index];
      ics += "BEGIN:VEVENT\r\n";
      ics += `DTSTAMP:${nowStamp}\r\n`;
      const uid = ev.isRecurringInstance
        ? `${ev.uid || "uni"}-${(ev.dateKey || "").replace(/-/g, "")}-${ev.dtstart ? ev.dtstart.getTime() : index}`
        : (ev.uid || `uni-${index}-${Math.random().toString(36).substring(2, 10)}`);
      ics += `UID:${uid}\r\n`;
      ics += `SUMMARY:${escapeICS(ev.summary || t(this, "defaultCourseName"))}\r\n`;
      if (ev.isAllDay) {
        if (ev.dtstart) ics += `DTSTART;VALUE=DATE:${formatICSLocalDate(ev.dtstart)}\r\n`;
        if (ev.dtend) {
          const endD = new Date(ev.dtend.getFullYear(), ev.dtend.getMonth(), ev.dtend.getDate());
          if (ev.dtend.getHours() >= 20) {
            endD.setDate(endD.getDate() + 1);
          }
          ics += `DTEND;VALUE=DATE:${formatICSLocalDate(endD)}\r\n`;
        }
      } else {
        if (ev.dtstart) ics += `DTSTART:${formatICSDate(ev.dtstart)}\r\n`;
        if (ev.dtend) ics += `DTEND:${formatICSDate(ev.dtend)}\r\n`;
      }
      if (ev.location) ics += `LOCATION:${escapeICS(ev.location)}\r\n`;
      if (ev.description) ics += `DESCRIPTION:${escapeICS(ev.description)}\r\n`;
      ics += "END:VEVENT\r\n";
    }

    ics += "END:VCALENDAR\r\n";

    const exportPath = "schedule-export.ics";
    const existing = this.app.vault.getAbstractFileByPath(exportPath);
    if (existing instanceof TFile) {
      await this.app.vault.modify(existing, ics);
    } else {
      await this.app.vault.create(exportPath, ics);
    }

    new Notice(t(this, "exportSuccess", { path: exportPath }));
  }
};
