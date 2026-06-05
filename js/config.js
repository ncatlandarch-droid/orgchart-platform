/* ============================================
 * ORGCHART PLATFORM — Configuration
 * --------------------------------------------
 * Edit this file to deploy for ANY organization.
 * All branding, features, and field definitions
 * are controlled from here.
 * ============================================ */

const CONFIG = {

  /* ── Organization Identity ──────────────── */
  organization: {
    name: 'North Carolina A&T State University',
    shortName: 'NC A&T',
    tagline: 'Organizational Ecosystem & Position Intelligence',
    logo: null,                   // URL or path to logo image
    website: 'https://www.ncat.edu',
    type: 'university',           // university | corporation | nonprofit | government
    motto: 'Serving the community since 1891'
  },

  /* ── Theme / Branding ───────────────────── */
  theme: {
    primaryColor:   '#004684',    // Official Aggie Blue (PMS 288)
    primaryLight:   '#0061b3',
    primaryDark:    '#003366',
    accentColor:    '#FDB927',    // Official Aggie Gold (PMS 123)
    accentDark:     '#E6A521',
    surfaceBase:    '#0a1628',
    surfaceElevated:'#111d33',
    surfaceCard:    '#162a46',
    textPrimary:    '#f0f4f8',
    textSecondary:  '#8899aa',
    borderColor:    'rgba(253, 185, 39, 0.12)',
    successColor:   '#22c55e',
    warningColor:   '#f59e0b',
    errorColor:     '#ef4444',
    mode: 'dark',                 // dark | light
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headingFontFamily: "'Playfair Display', 'Georgia', serif",
    glassBlur: '20px',
    borderRadius: '16px',
    transitionSpeed: '300ms'
  },

  /* ── Feature Toggles ────────────────────── */
  features: {
    salaryBands:      true,
    vacancyTracking:  true,
    adminEditing:     true,
    importExport:     true,
    search:           true,
    chartView:        true,
    treeView:         true,
    multiLanguage:    false,
    customFields:     true,
    darkModeToggle:   true,
    statsBar:         true,
    minimap:          false,
    printView:        true,
    departmentFilter: true,
    analysis:         true
  },

  /* ── Custom Metadata Fields ─────────────── */
  // Organizations can define additional per-position fields beyond the defaults.
  customFields: [
    { key: 'classification', label: 'Classification', type: 'select', options: ['EPA', 'SPA', 'Faculty', 'Administrative'] },
    { key: 'fte',            label: 'FTE',            type: 'number' },
    { key: 'building',       label: 'Building',       type: 'text' },
    { key: 'phone',          label: 'Phone',          type: 'text' },
    { key: 'email',          label: 'Email',          type: 'email' }
  ],

  /* ── Department Color Coding ────────────── */
  departmentColors: {
    'Executive':                     '#6366f1',
    'Academic Affairs':              '#3b82f6',
    'Engineering':                   '#06b6d4',
    'Science & Technology':          '#0ea5e9',
    'Agriculture & Environmental Sciences': '#84cc16',
    'Business & Economics':          '#22c55e',
    'Arts, Humanities & Social Sciences':   '#a855f7',
    'Education':                     '#f97316',
    'Health & Human Sciences':       '#ec4899',
    'Nanoscience & Nanoengineering': '#14b8a6',
    'Graduate College':              '#8b5cf6',
    'Student Affairs':               '#f59e0b',
    'Research':                      '#06b6d4',
    'Business & Finance':            '#64748b',
    'University Advancement':        '#e11d48',
    'Strategic Partnerships':        '#d946ef',
    'Information Technology':        '#0284c7',
    'Legal & Compliance':            '#78716c',
    'Athletics':                     '#ef4444',
    'University Relations':          '#f472b6',
    'Cooperative Extension':         '#65a30d',
    'default':                       '#64748b'
  },

  /* ── College / Department Icons ──────────── */
  departmentIcons: {
    'Engineering':                     'assets/college-icons/icon-engineering-color.svg',
    'Science & Technology':            'assets/college-icons/icon-science-color.svg',
    'Agriculture & Environmental Sciences': 'assets/college-icons/icon-agriculture-color.svg',
    'Business & Economics':            'assets/college-icons/icon-business-color.svg',
    'Arts, Humanities & Social Sciences':   'assets/college-icons/icon-arts-color.svg',
    'Education':                       'assets/college-icons/icon-education-color.svg',
    'Health & Human Sciences':         'assets/college-icons/icon-health-color.svg',
    'Nanoscience & Nanoengineering':   'assets/college-icons/icon-nano-color.svg',
    'Graduate College':                'assets/college-icons/icon-graduate-color.svg'
  },

  /* ── Internationalization ───────────────── */
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    strings: {
      en: {
        appTitle:           'Organizational Ecosystem',
        searchPlaceholder:  'Search positions, people, departments...',
        treeViewLabel:      'Hierarchy',
        chartViewLabel:     'Org Chart',
        statsPositions:     'Positions',
        statsFilled:        'Filled',
        statsVacant:        'Vacant',
        statsInterim:       'Interim',
        statsDepartments:   'Departments',
        tabOverview:        'Overview',
        tabQualifications:  'Qualifications',
        tabReporting:       'Reporting Chain',
        labelLeader:        'Current Holder',
        labelSalary:        'Salary Band',
        labelClassification:'Classification',
        labelNecessity:     'Role Necessity',
        labelCompetencies:  'Core Competencies',
        labelQualifications:'Required Qualifications',
        labelDirectReports: 'Direct Reports',
        labelStatus:        'Status',
        statusFilled:       'Filled',
        statusVacant:       'Vacant',
        statusInterim:      'Interim',
        adminMode:          'Admin Mode',
        exportPDF:          'Export PDF',
        importData:         'Import Data',
        noSelection:        'Select a position to view details'
      },
      es: {
        appTitle:           'Ecosistema Organizacional',
        searchPlaceholder:  'Buscar posiciones, personas, departamentos...',
        treeViewLabel:      'Jerarquía',
        chartViewLabel:     'Organigrama',
        statsPositions:     'Posiciones',
        statsFilled:        'Ocupado',
        statsVacant:        'Vacante',
        statsInterim:       'Interino',
        statsDepartments:   'Departamentos',
        tabOverview:        'Resumen',
        tabQualifications:  'Calificaciones',
        tabReporting:       'Cadena de Mando',
        labelLeader:        'Titular Actual',
        labelSalary:        'Banda Salarial',
        labelClassification:'Clasificación',
        labelNecessity:     'Necesidad del Rol',
        labelCompetencies:  'Competencias Clave',
        labelQualifications:'Calificaciones Requeridas',
        labelDirectReports: 'Reportes Directos',
        labelStatus:        'Estado',
        statusFilled:       'Ocupado',
        statusVacant:       'Vacante',
        statusInterim:      'Interino',
        adminMode:          'Modo Administrador',
        exportPDF:          'Exportar PDF',
        importData:         'Importar Datos',
        noSelection:        'Seleccione una posición para ver detalles'
      }
    }
  },

  /* ── Layout Defaults ────────────────────── */
  layout: {
    chartNodeWidth:    220,
    chartNodeHeight:   90,
    chartLevelGap:     100,
    chartSiblingGap:   30,
    chartPadding:      60,
    treeIndent:        24,
    sidebarWidth:      380,
    detailPanelWidth:  420,
    animationDuration: 300
  }
};
