/* ============================================
 * ORGCHART PLATFORM — NC A&T State University
 * Demo Instance Data
 * --------------------------------------------
 * Complete organizational hierarchy sourced
 * from publicly available ncat.edu data.
 * Last verified: June 2026
 * ============================================ */

const ORG_DATA = {
  id: 'chancellor',
  title: 'Chancellor',
  department: 'Executive',
  division: 'Office of the Chancellor',
  holder: { name: 'James R. Martin II, Ph.D.', since: '2026', photo: null },
  status: 'filled',
  level: 1,
  metadata: {
    qualifications: [
      'Ph.D. in relevant field',
      'Decades of academic and executive leadership',
      'Experience leading R1/R2 research institutions',
      'Deep understanding of land-grant mission'
    ],
    competencies: [
      'Strategic Vision',
      'Board Governance',
      'Stakeholder Engagement',
      'Legislative Relations',
      'Fund Raising',
      'Crisis Leadership'
    ],
    necessity: 'Sets the long-term vision, manages institutional integrity, represents NC A&T to the UNC System Board of Governors, and drives the strategic direction of the 1890 land-grant mission. The 13th Chancellor of NC A&T.',
    salaryBand: 'Executive Band 1',
    salary: 550000,
    salaryYear: 2025,
    directReports: 11,
    teamSize: 15,
    classification: 'EPA',
    custom: {
      building: 'Dowdy Administration Building',
      phone: '(336) 334-7940'
    }
  },
  children: [

    /* ═══════════════════════════════════════════
     * DIVISION OF ACADEMIC AFFAIRS
     * ═══════════════════════════════════════════ */
    {
      id: 'provost',
      title: 'Provost & Executive Vice Chancellor for Academic Affairs',
      department: 'Academic Affairs',
      division: 'Division of Academic Affairs',
      holder: { name: 'Andrew P. Daire, Ph.D.', since: '2022', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: [
          'Ph.D. in academic discipline',
          'Distinguished tenure and research record',
          'Prior provost or dean experience',
          'Accreditation expertise'
        ],
        competencies: [
          'Curriculum Strategy',
          'Faculty Governance',
          'Academic Excellence',
          'Accreditation Management',
          'Budget Oversight',
          'Interdisciplinary Innovation'
        ],
        necessity: 'Chief academic officer who ensures the core mission of teaching, research, and scholarly production is met across all 9 colleges. Manages deans, academic programs, and faculty affairs.',
        salaryBand: 'Executive Band 2',
        salary: 375000,
        salaryYear: 2025,
        directReports: 12,
        teamSize: 2000,
        classification: 'EPA',
        custom: { building: '315 Dowdy Administration Building' }
      },
      children: [

        /* ─── Vice Provosts & Senior Academic Leadership ─── */
        {
          id: 'aa-sr-vice-provost',
          title: 'Senior Vice Provost for Academic Affairs',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Valerie L. Giddings, Ph.D.', since: '2021', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in academic discipline', 'Senior academic administration experience'],
            competencies: ['Academic Policy', 'Faculty Affairs', 'Program Review', 'Strategic Leadership'],
            necessity: 'Serves as the chief deputy to the Provost, overseeing academic policy, faculty affairs, and program review processes.',
            salaryBand: 'Executive Band 2',
            salary: 210000,
            salaryYear: 2025,
            directReports: 5,
            teamSize: 12,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-vp-undergrad',
          title: 'Vice Provost for Undergraduate Education & Student Success',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Nakeshia Williams, Ph.D.', since: '2022', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Education or related field', 'Undergraduate program leadership'],
            competencies: ['Student Success', 'Retention Strategy', 'First-Year Experience', 'Academic Advising'],
            necessity: 'Drives undergraduate retention, student success initiatives, first-year experience, and academic advising programs.',
            salaryBand: 'Executive Band 3',
            salary: 195000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 15,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-vp-strategic',
          title: 'Vice Provost for Strategic Planning & Institutional Effectiveness',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Alexander Yin, Ph.D.', since: '2021', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in relevant field', 'Institutional research experience', 'SACSCOC accreditation expertise'],
            competencies: ['Strategic Planning', 'Institutional Effectiveness', 'Assessment', 'Accreditation'],
            necessity: 'Leads university strategic planning, institutional effectiveness, assessment, and SACSCOC accreditation compliance.',
            salaryBand: 'Executive Band 3',
            salary: 190000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 10,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-vp-engagement',
          title: 'Vice Provost for Engagement & Outreach',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Rosalind Dale, Ed.D.', since: '2022', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ed.D. or Ph.D. in Education or related field', 'Community engagement leadership'],
            competencies: ['Community Engagement', 'Outreach Programs', 'Partnerships', 'Service-Learning'],
            necessity: 'Oversees community engagement, outreach initiatives, service-learning, and university-community partnerships.',
            salaryBand: 'Executive Band 3',
            salary: 185000,
            salaryYear: 2025,
            directReports: 3,
            teamSize: 10,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-avp-budget',
          title: 'Associate Vice Provost for Academic Budget & Personnel',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Craig Rhodes, Ph.D.', since: '2020', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in relevant field', 'Academic budget management experience'],
            competencies: ['Academic Budgeting', 'Personnel Management', 'Resource Allocation', 'Financial Planning'],
            necessity: 'Manages academic division budgets, faculty and staff personnel processes, and resource allocation across colleges.',
            salaryBand: 'Administrative Band 1',
            salary: 170000,
            salaryYear: 2025,
            directReports: 3,
            teamSize: 8,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-avp-transformation',
          title: 'Associate Vice Provost for Transformation Initiatives',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Jonathan Martin, Ph.D.', since: '2023', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in relevant field', 'Change management experience'],
            competencies: ['Change Management', 'Innovation', 'Academic Transformation', 'Program Development'],
            necessity: 'Leads academic transformation initiatives, innovation projects, and cross-divisional change management efforts.',
            salaryBand: 'Administrative Band 1',
            salary: 165000,
            salaryYear: 2025,
            directReports: 2,
            teamSize: 6,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'aa-special-asst',
          title: 'Special Assistant to the Provost',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Wanda Payton', since: '2022', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Master\'s degree or higher', 'Senior administrative support experience'],
            competencies: ['Executive Support', 'Project Management', 'Communications', 'Calendar Management'],
            necessity: 'Provides high-level executive support to the Provost, manages special projects, and coordinates cabinet operations.',
            salaryBand: 'Administrative Band 2',
            salary: 125000,
            salaryYear: 2025,
            directReports: 2,
            teamSize: 3,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },

        /* ─── Enrollment Management ─── */
        {
          id: 'aa-enrollment',
          title: 'Interim Associate Vice Provost for Enrollment Management',
          department: 'Enrollment Management',
          division: 'Division of Academic Affairs',
          holder: { name: 'Dawn M. Nail, Ph.D.', since: '2024', photo: null },
          status: 'interim',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Higher Education or related field', 'Enrollment management experience'],
            competencies: ['Enrollment Strategy', 'Admissions Management', 'Financial Aid Oversight', 'Data Analytics'],
            necessity: 'Oversees undergraduate admissions, financial aid, and enrollment strategy to meet university enrollment targets.',
            salaryBand: 'Administrative Band 1',
            salary: 160000,
            salaryYear: 2025,
            directReports: 3,
            teamSize: 40,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'aa-enroll-admissions', title: 'Director of Undergraduate Admissions', department: 'Enrollment Management', division: 'Division of Academic Affairs', holder: { name: 'Dominique Harrison', since: '2023', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Master\'s in Higher Education or related field'], competencies: ['Recruitment Strategy', 'Admissions Operations', 'Enrollment Marketing', 'CRM Management'], necessity: 'Manages undergraduate recruitment, application review, and admissions operations for 14,000+ student body.', salaryBand: 'Administrative Band 2', salary: 120000, salaryYear: 2025, directReports: 8, teamSize: 18, classification: 'EPA', custom: {} }, children: [] },
            { id: 'aa-enroll-finaid', title: 'Executive Director, Financial Aid & Scholarships', department: 'Enrollment Management', division: 'Division of Academic Affairs', holder: { name: 'Robert T. Muhammad', since: '2021', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Master\'s degree', 'Federal financial aid compliance expertise'], competencies: ['Federal Aid Administration', 'Scholarship Programs', 'Financial Literacy', 'Title IV Compliance'], necessity: 'Administers $300M+ in financial aid and scholarship programs ensuring access and affordability.', salaryBand: 'Administrative Band 1', salary: 130000, salaryYear: 2025, directReports: 10, teamSize: 20, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── Library ─── */
        {
          id: 'aa-library',
          title: 'Dean of Library Services, F.D. Bluford Library',
          department: 'Library Services',
          division: 'Division of Academic Affairs',
          holder: { name: 'Vicki Coleman', since: '2019', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['MLS/MLIS from ALA-accredited program', 'Academic library leadership experience'],
            competencies: ['Library Administration', 'Digital Resources', 'Information Literacy', 'Archives Management'],
            necessity: 'Leads the F.D. Bluford Library, the university\'s primary academic library, managing collections, digital resources, and information services.',
            salaryBand: 'Academic Band 1',
            salary: 155000,
            salaryYear: 2025,
            directReports: 5,
            teamSize: 25,
            classification: 'EPA',
            custom: { building: 'F.D. Bluford Library' }
          },
          children: []
        },

        /* ─── Faculty Senate ─── */
        {
          id: 'aa-faculty-senate',
          title: 'Faculty Senate Chair',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Scott Harrison, Ph.D.', since: '2024', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. with tenured faculty status', 'Faculty governance experience'],
            competencies: ['Faculty Governance', 'Shared Governance', 'Academic Policy', 'Faculty Advocacy'],
            necessity: 'Elected faculty leader who chairs the Faculty Senate, representing faculty interests in university governance and academic policy.',
            salaryBand: 'Academic Band 2',
            salary: 145000,
            salaryYear: 2025,
            directReports: 0,
            teamSize: 50,
            classification: 'Faculty',
            custom: {}
          },
          children: []
        },

        /* ─── College of Engineering ─── */
        {
          id: 'coe',
          title: 'Dean, College of Engineering',
          department: 'Engineering',
          division: 'Division of Academic Affairs',
          holder: { name: 'Stephanie Luster-Teasley, Ph.D.', since: '2023', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Engineering', 'ABET accreditation experience', 'Active funded research portfolio'],
            competencies: ['STEM Innovation', 'Research Grant Acquisition', 'Industry Partnerships', 'Diversity in STEM'],
            necessity: 'Provides national leadership in engineering education and research, particularly for underrepresented minorities in STEM. Oversees 7 departments and research centers.',
            salaryBand: 'Academic Band 1',
            salary: 285000,
            salaryYear: 2025,
            directReports: 8,
            teamSize: 250,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'coe-assoc-dean', title: 'Associate Dean, College of Engineering', department: 'Engineering', division: 'Division of Academic Affairs', holder: { name: 'Salil Desai', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Engineering', 'Academic administration experience'], competencies: ['Academic Programs', 'Faculty Development', 'Research Coordination', 'ABET Accreditation'], necessity: 'Supports the Dean in managing academic programs, faculty development, and accreditation processes for the College of Engineering.', salaryBand: 'Academic Band 1', salary: 175000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
            {
              id: 'coe-cbbe', title: 'Chair, Chemical, Biological & Bio Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Chemical or Biological Engineering', 'Teaching & research excellence'], competencies: ['Bioprocessing', 'Environmental Engineering', 'Lab Management'], necessity: 'Leads undergraduate and graduate programs in chemical and biological engineering disciplines.', salaryBand: 'Academic Band 2', salary: 185000, salaryYear: 2025, directReports: 15, teamSize: 20, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-caee', title: 'Chair, Civil, Architectural & Environmental Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Civil Engineering', 'PE License preferred'], competencies: ['Structural Design', 'Environmental Systems', 'Infrastructure'], necessity: 'Trains engineers for infrastructure, sustainability, and built-environment challenges.', salaryBand: 'Academic Band 2', salary: 178000, salaryYear: 2025, directReports: 12, teamSize: 18, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-cs', title: 'Chair, Computer Science',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Computer Science', 'Strong publication record'], competencies: ['Software Engineering', 'AI/ML', 'Cybersecurity', 'Data Science'], necessity: 'Drives the largest engineering enrollment and prepares students for the tech industry.', salaryBand: 'Academic Band 2', salary: 195000, salaryYear: 2025, directReports: 20, teamSize: 30, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-cdse', title: 'Chair, Computational Data Science & Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Data Science or related field'], competencies: ['Big Data Analytics', 'Machine Learning', 'High-Performance Computing'], necessity: 'Emerging discipline bridging data science with engineering applications.', salaryBand: 'Academic Band 2', salary: 188000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-ece', title: 'Chair, Electrical & Computer Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Electrical Engineering', 'ABET experience'], competencies: ['Circuit Design', 'Embedded Systems', 'Signal Processing', 'Power Systems'], necessity: 'Produces engineers for electronics, power, and telecommunications industries.', salaryBand: 'Academic Band 2', salary: 182000, salaryYear: 2025, directReports: 15, teamSize: 22, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-ise', title: 'Chair, Industrial & Systems Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Industrial Engineering'], competencies: ['Systems Optimization', 'Operations Research', 'Supply Chain Engineering'], necessity: 'Integrates human factors, manufacturing, and systems thinking into engineering solutions.', salaryBand: 'Academic Band 2', salary: 175000, salaryYear: 2025, directReports: 10, teamSize: 15, classification: 'Faculty', custom: {} },
              children: []
            },
            {
              id: 'coe-meen', title: 'Chair, Mechanical Engineering',
              department: 'Engineering', division: 'Division of Academic Affairs',
              holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4,
              metadata: { qualifications: ['Ph.D. in Mechanical Engineering', 'Active research lab'], competencies: ['Thermodynamics', 'Materials Science', 'Robotics', 'Manufacturing'], necessity: 'Core engineering discipline preparing students for aerospace, automotive, and energy industries.', salaryBand: 'Academic Band 2', salary: 180000, salaryYear: 2025, directReports: 15, teamSize: 20, classification: 'Faculty', custom: {} },
              children: []
            }
          ]
        },

        /* ─── College of Science & Technology ─── */
        {
          id: 'cost',
          title: 'Dean, College of Science & Technology',
          department: 'Science & Technology',
          division: 'Division of Academic Affairs',
          holder: { name: 'Abdellah Ahmidouch, Ph.D.', since: '2020', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in STEM discipline', 'Research leadership', 'Enrollment management experience'],
            competencies: ['STEM Education', 'Research Development', 'Applied Technology', 'Student Success'],
            necessity: 'Combines pure sciences (Biology, Chemistry, Physics, Math) with applied technology programs. Largest college by enrollment.',
            salaryBand: 'Academic Band 1',
            salary: 265000,
            salaryYear: 2025,
            directReports: 8,
            teamSize: 300,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'cost-assoc-dean', title: 'Interim Associate Dean, College of Science & Technology', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Alesia Ferguson', since: '2024', photo: null }, status: 'interim', level: 4, metadata: { qualifications: ['Ph.D. in STEM discipline', 'Academic administration experience'], competencies: ['Academic Programs', 'Student Success', 'Faculty Development', 'Research Coordination'], necessity: 'Supports the Dean in overseeing academic programs, student success initiatives, and faculty affairs for the College of Science & Technology.', salaryBand: 'Academic Band 1', salary: 155000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
            { id: 'cost-bio', title: 'Chair, Biology', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Biological Sciences'], competencies: ['Molecular Biology', 'Ecology', 'Pre-Med Advising'], necessity: 'Foundation for pre-med, pre-dental, and life science career paths.', salaryBand: 'Academic Band 2', salary: 168000, salaryYear: 2025, directReports: 18, teamSize: 25, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-chem', title: 'Chair, Chemistry', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Chemistry'], competencies: ['Analytical Chemistry', 'Organic Chemistry', 'Research Mentoring'], necessity: 'Core science department supporting STEM pipeline and pharmaceutical research.', salaryBand: 'Academic Band 2', salary: 165000, salaryYear: 2025, directReports: 14, teamSize: 20, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-math', title: 'Chair, Mathematics & Statistics', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Mathematics'], competencies: ['Applied Mathematics', 'Statistics', 'Data Analytics'], necessity: 'Provides mathematical foundation for all STEM programs and quantitative research.', salaryBand: 'Academic Band 2', salary: 158000, salaryYear: 2025, directReports: 16, teamSize: 22, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-phys', title: 'Chair, Physics', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Physics'], competencies: ['Experimental Physics', 'Theoretical Physics', 'Nanotechnology'], necessity: 'Advances fundamental and applied physics research; feeds JSNN pipeline.', salaryBand: 'Academic Band 2', salary: 162000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-aet', title: 'Chair, Applied Engineering Technology', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. or Ed.D. in Technology Education'], competencies: ['Industrial Technology', 'Manufacturing Systems', 'Technical Training'], necessity: 'Bridges academic engineering with applied technical workforce development.', salaryBand: 'Academic Band 2', salary: 148000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-be', title: 'Chair, Built Environment', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Terminal degree in Architecture, Construction, or related'], competencies: ['Construction Management', 'Architecture', 'Sustainability'], necessity: 'Prepares professionals for construction, architecture, and environmental design fields.', salaryBand: 'Academic Band 2', salary: 145000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cost-cst', title: 'Chair, Computer Systems Technology', department: 'Science & Technology', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Information Technology or related'], competencies: ['Network Administration', 'IT Security', 'Systems Administration'], necessity: 'Produces IT professionals with hands-on systems and network management skills.', salaryBand: 'Academic Band 2', salary: 152000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] }
          ]
        },

        /* ─── College of Agriculture & Environmental Sciences ─── */
        {
          id: 'caes',
          title: 'Interim Dean, College of Agriculture & Environmental Sciences',
          department: 'Agriculture & Environmental Sciences',
          division: 'Division of Academic Affairs',
          holder: { name: 'Radiah Corn Minor, Ph.D.', since: '2025', photo: null },
          status: 'interim',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Agricultural Science or related field', 'Land-grant extension experience', '1890 institution leadership'],
            competencies: ['Agricultural Research', 'Extension Services', 'Environmental Stewardship', 'Rural Development'],
            necessity: 'Central to NC A&T\'s 1890 land-grant mission. Manages Cooperative Extension, university farm operations, and research stations serving North Carolina communities.',
            salaryBand: 'Academic Band 1',
            salary: 255000,
            salaryYear: 2025,
            directReports: 6,
            teamSize: 200,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'caes-ad-research', title: 'Associate Dean, Agricultural Research Program', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Gregory Goins', since: '2021', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Agricultural Science or related field', 'Research administration experience'], competencies: ['Agricultural Research', 'Grant Management', 'Research Program Development', 'Faculty Mentoring'], necessity: 'Leads the agricultural research program, managing grant portfolios and faculty research initiatives for the 1890 land-grant mission.', salaryBand: 'Academic Band 1', salary: 165000, salaryYear: 2025, directReports: 5, teamSize: 30, classification: 'EPA', custom: {} }, children: [] },
            { id: 'caes-ad-academics', title: 'Associate Dean, Academic Studies', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Antoine J. Alston', since: '2020', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Agricultural Education or related field'], competencies: ['Academic Programs', 'Curriculum Development', 'Student Recruitment', 'Accreditation'], necessity: 'Oversees academic programs, curriculum development, and student recruitment for the College of Agriculture.', salaryBand: 'Academic Band 1', salary: 160000, salaryYear: 2025, directReports: 4, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
            { id: 'caes-ad-extension', title: 'Associate Dean & Administrator, Cooperative Extension', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'M. Ray McKinnie', since: '2018', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Agriculture or Extension Education', 'Extension program leadership'], competencies: ['Extension Administration', 'Community Development', 'Small Farm Support', '4-H Youth Programs'], necessity: 'Oversees statewide Cooperative Extension programs, managing county agents and community outreach for the 1890 land-grant mission.', salaryBand: 'Academic Band 1', salary: 168000, salaryYear: 2025, directReports: 20, teamSize: 80, classification: 'EPA', custom: {} }, children: [] },
            { id: 'caes-abaee', title: 'Chair, Agribusiness, Applied Economics & Agriscience Education', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Agricultural Economics'], competencies: ['Agribusiness Management', 'Agricultural Policy', 'Farm Economics'], necessity: 'Develops agribusiness leaders and ag educators for rural communities.', salaryBand: 'Academic Band 2', salary: 145000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'caes-ansc', title: 'Chair, Animal Sciences', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Animal Science'], competencies: ['Animal Nutrition', 'Livestock Management', 'Veterinary Science'], necessity: 'Supports livestock industry and pre-veterinary pathways for students.', salaryBand: 'Academic Band 2', salary: 142000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'caes-fcs', title: 'Chair, Family & Consumer Sciences', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Family Sciences or related'], competencies: ['Child Development', 'Nutrition', 'Family Studies'], necessity: 'Addresses family wellness, nutrition, and consumer education needs.', salaryBand: 'Academic Band 2', salary: 138000, salaryYear: 2025, directReports: 6, teamSize: 10, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'caes-nred', title: 'Chair, Natural Resources & Environmental Design', department: 'Agriculture & Environmental Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Environmental Science or Landscape Architecture'], competencies: ['Environmental Management', 'Landscape Architecture', 'GIS/Remote Sensing', 'Sustainability'], necessity: 'Trains environmental scientists and landscape architects for sustainable land management.', salaryBand: 'Academic Band 2', salary: 148000, salaryYear: 2025, directReports: 8, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'caes-ext', title: 'Director, Cooperative Extension', department: 'Cooperative Extension', division: 'Division of Academic Affairs', holder: { name: 'Extension Director', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Agriculture or Extension Education', 'Extension program management'], competencies: ['Community Outreach', 'Small Farm Support', '4-H Youth Development', 'Food & Nutrition Education'], necessity: 'Fulfills the 1890 land-grant mission by delivering research-based knowledge to NC communities through county-level extension agents.', salaryBand: 'Administrative Band 2', salary: 155000, salaryYear: 2025, directReports: 20, teamSize: 80, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── Willie A. Deese College of Business & Economics ─── */
        {
          id: 'cobe',
          title: 'Dean, Willie A. Deese College of Business & Economics',
          department: 'Business & Economics',
          division: 'Division of Academic Affairs',
          holder: { name: 'Kecia Williams Smith, Ph.D., CPA', since: '2026', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Business discipline', 'CPA or equivalent professional credential', 'AACSB accreditation experience'],
            competencies: ['Business Education', 'Corporate Partnerships', 'Entrepreneurship', 'Accreditation Leadership'],
            necessity: 'Leads a dual AACSB-accredited business school (institution and accounting) preparing students for corporate leadership and entrepreneurship.',
            salaryBand: 'Academic Band 1',
            salary: 275000,
            salaryYear: 2025,
            directReports: 6,
            teamSize: 120,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'cobe-assoc-dean', title: 'Interim Associate Dean, College of Business & Economics', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Shona Morgan', since: '2024', photo: null }, status: 'interim', level: 4, metadata: { qualifications: ['Ph.D. in Business discipline', 'AACSB accreditation experience'], competencies: ['Academic Programs', 'Faculty Affairs', 'Accreditation', 'Student Success'], necessity: 'Supports the Dean in managing academic programs, AACSB accreditation, and faculty affairs for the College of Business & Economics.', salaryBand: 'Academic Band 1', salary: 160000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
            { id: 'cobe-af', title: 'Chair, Accounting & Finance', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Accounting or Finance', 'CPA preferred'], competencies: ['Financial Reporting', 'Auditing', 'Corporate Finance'], necessity: 'AACSB-accredited accounting program preparing CPAs and financial professionals.', salaryBand: 'Academic Band 2', salary: 172000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cobe-mscm', title: 'Chair, Marketing & Supply Chain Management', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Marketing or Supply Chain'], competencies: ['Digital Marketing', 'Logistics', 'Consumer Behavior'], necessity: 'Develops marketing strategists and supply chain professionals.', salaryBand: 'Academic Band 2', salary: 165000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cobe-econ', title: 'Chair, Economics', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Economics'], competencies: ['Econometrics', 'Public Policy', 'Economic Analysis'], necessity: 'Provides economic analysis foundation for business and policy programs.', salaryBand: 'Academic Band 2', salary: 158000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cobe-bisa', title: 'Chair, Business Information Systems & Analytics', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Information Systems'], competencies: ['Business Analytics', 'Enterprise Systems', 'Data Management'], necessity: 'Bridges business strategy with information technology and data-driven decision making.', salaryBand: 'Academic Band 2', salary: 168000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cobe-mgmt', title: 'Chair, Management', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Management or Organizational Behavior'], competencies: ['Strategic Management', 'Organizational Leadership', 'HR Management'], necessity: 'Develops organizational leaders and managers for diverse industries.', salaryBand: 'Academic Band 2', salary: 162000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cobe-ti', title: 'Director, Transportation Institute', department: 'Business & Economics', division: 'Division of Academic Affairs', holder: { name: 'Institute Director', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Transportation or related field'], competencies: ['Transportation Policy', 'Urban Mobility', 'Research Administration'], necessity: 'Established 1970. Leading research center for transportation policy and urban mobility studies.', salaryBand: 'Administrative Band 2', salary: 145000, salaryYear: 2025, directReports: 6, teamSize: 15, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── College of Arts, Humanities & Social Sciences ─── */
        {
          id: 'cahss',
          title: 'Dean, College of Arts, Humanities & Social Sciences',
          department: 'Arts, Humanities & Social Sciences',
          division: 'Division of Academic Affairs',
          holder: { name: 'Shannon B. Campbell, Ph.D.', since: '2022', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Humanities or Social Sciences', 'Arts administration experience'],
            competencies: ['Liberal Arts Advocacy', 'Community Engagement', 'Cultural Programming', 'Interdisciplinary Studies'],
            necessity: 'Cultivates critical thinking, cultural awareness, civic responsibility, and creative expression. Essential complement to STEM-focused programs.',
            salaryBand: 'Academic Band 1',
            salary: 245000,
            salaryYear: 2025,
            directReports: 7,
            teamSize: 150,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'cahss-assoc-dean', title: 'Associate Dean, College of Arts, Humanities & Social Sciences', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Sonya Ricks', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Humanities or Social Sciences', 'Academic administration experience'], competencies: ['Academic Programs', 'Faculty Development', 'Student Affairs', 'Curriculum'], necessity: 'Supports the Dean in managing academic programs, faculty development, and student affairs for the College.', salaryBand: 'Academic Band 1', salary: 155000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
            { id: 'cahss-assoc-dean-undergrad', title: 'Interim Associate Dean for Undergraduate Student Affairs', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'James J. Davis', since: '2024', photo: null }, status: 'interim', level: 4, metadata: { qualifications: ['Ph.D. in relevant field', 'Student affairs experience'], competencies: ['Student Affairs', 'Academic Advising', 'Retention', 'Student Success'], necessity: 'Oversees undergraduate student affairs, academic advising, and retention initiatives for the College.', salaryBand: 'Academic Band 1', salary: 148000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] },
            { id: 'cahss-cj', title: 'Chair, Criminal Justice', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Criminal Justice or Criminology'], competencies: ['Law Enforcement', 'Corrections', 'Forensic Science', 'Policy Analysis'], necessity: 'Prepares professionals for law enforcement, corrections, and criminal justice policy.', salaryBand: 'Academic Band 2', salary: 148000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cahss-eng', title: 'Chair, English', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in English or Literature'], competencies: ['Composition', 'Literary Analysis', 'Writing Programs'], necessity: 'Provides foundational writing and communication skills across the university.', salaryBand: 'Academic Band 2', salary: 135000, salaryYear: 2025, directReports: 12, teamSize: 16, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cahss-hps', title: 'Chair, History & Political Science', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in History or Political Science'], competencies: ['Historical Research', 'Political Analysis', 'Pre-Law Preparation'], necessity: 'Develops informed citizens and pre-law scholars grounded in historical context.', salaryBand: 'Academic Band 2', salary: 138000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cahss-jmc', title: 'Chair, Journalism & Mass Communication', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Mass Communication or Journalism'], competencies: ['Media Production', 'Public Relations', 'Digital Journalism'], necessity: 'Trains media professionals in journalism, broadcasting, and strategic communication.', salaryBand: 'Academic Band 2', salary: 142000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cahss-ls', title: 'Chair, Liberal Studies', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in interdisciplinary liberal arts field'], competencies: ['Interdisciplinary Curriculum', 'General Education', 'Critical Thinking'], necessity: 'Provides flexible interdisciplinary degree pathways and general education courses.', salaryBand: 'Academic Band 2', salary: 132000, salaryYear: 2025, directReports: 6, teamSize: 10, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'cahss-vpa', title: 'Chair, Visual & Performing Arts', department: 'Arts, Humanities & Social Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['MFA or Ph.D. in Fine Arts, Music, or Theatre'], competencies: ['Music Performance', 'Theatre Production', 'Visual Design', 'Dance'], necessity: 'Encompasses music, theatre, dance, and visual arts — nurturing creative talent and cultural expression.', salaryBand: 'Academic Band 2', salary: 140000, salaryYear: 2025, directReports: 15, teamSize: 25, classification: 'Faculty', custom: {} }, children: [] }
          ]
        },

        /* ─── College of Education ─── */
        {
          id: 'coed',
          title: 'Dean, College of Education',
          department: 'Education',
          division: 'Division of Academic Affairs',
          holder: { name: 'Paula Groves Price, Ph.D.', since: '2021', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Education', 'CAEP accreditation experience', 'K-12 educator preparation expertise'],
            competencies: ['Educator Preparation', 'Educational Research', 'Community Schools', 'Diversity in Education'],
            necessity: 'Prepares the next generation of teachers, counselors, and educational leaders for NC public schools and beyond.',
            salaryBand: 'Academic Band 1',
            salary: 240000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 80,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'coed-assoc-dean', title: 'Associate Dean, College of Education', department: 'Education', division: 'Division of Academic Affairs', holder: { name: 'Geleana Alston', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. or Ed.D. in Education', 'Academic administration experience'], competencies: ['Academic Programs', 'Accreditation', 'Faculty Development', 'Student Success'], necessity: 'Supports the Dean in overseeing academic programs, CAEP accreditation processes, and faculty affairs for the College of Education.', salaryBand: 'Academic Band 1', salary: 155000, salaryYear: 2025, directReports: 3, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
            { id: 'coed-ep', title: 'Chair, Educator Preparation', department: 'Education', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Curriculum & Instruction'], competencies: ['Teacher Training', 'Practicum Coordination', 'Licensure Programs'], necessity: 'Produces licensed K-12 teachers ready for diverse classrooms.', salaryBand: 'Academic Band 2', salary: 145000, salaryYear: 2025, directReports: 12, teamSize: 18, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'coed-coun', title: 'Chair, Counseling', department: 'Education', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Counseling or Counselor Education', 'Licensed Professional Counselor'], competencies: ['Clinical Counseling', 'School Counseling', 'Mental Health'], necessity: 'Trains licensed counselors for schools, community agencies, and clinical settings.', salaryBand: 'Academic Band 2', salary: 142000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'coed-lsae', title: 'Chair, Leadership Studies & Adult Education', department: 'Education', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. or Ed.D. in Educational Leadership'], competencies: ['Educational Administration', 'Adult Learning', 'Organizational Development'], necessity: 'Develops school principals, superintendents, and higher education administrators.', salaryBand: 'Academic Band 2', salary: 140000, salaryYear: 2025, directReports: 8, teamSize: 12, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'coed-ceeer', title: 'Director, Center for Educational Engagement & Research (CEEER)', department: 'Education', division: 'Division of Academic Affairs', holder: { name: 'Center Director', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Education Research'], competencies: ['Community Engagement', 'Educational Research', 'Program Evaluation'], necessity: 'Center of Excellence driving research-practice partnerships with NC schools and communities.', salaryBand: 'Administrative Band 2', salary: 118000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── Hairston College of Health & Human Sciences ─── */
        {
          id: 'chhs',
          title: 'Dean, John R. & Kathy R. Hairston College of Health & Human Sciences',
          department: 'Health & Human Sciences',
          division: 'Division of Academic Affairs',
          holder: { name: 'Elimelda Moige Ongeri, Ph.D.', since: '2023', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Health Sciences or related field', 'Healthcare accreditation experience', 'Interdisciplinary health leadership'],
            competencies: ['Health Professions Education', 'Clinical Program Accreditation', 'Public Health', 'Interprofessional Education'],
            necessity: 'Oversees nursing, kinesiology, psychology, social work, physician assistant, and population health programs. Critical for addressing healthcare workforce shortages.',
            salaryBand: 'Academic Band 1',
            salary: 250000,
            salaryYear: 2025,
            directReports: 8,
            teamSize: 180,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'chhs-assoc-dean', title: 'Associate Dean of Research & Innovation, College of Health & Human Sciences', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Cynthia Crawford', since: '2023', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Health Sciences or related field', 'Research administration experience'], competencies: ['Research Development', 'Innovation', 'Grant Management', 'Faculty Research Mentoring'], necessity: 'Leads research and innovation initiatives, manages grant portfolios, and mentors faculty researchers across the College.', salaryBand: 'Academic Band 1', salary: 158000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
            { id: 'chhs-nurs', title: 'Director, School of Nursing', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Tiffany Morris, DNP', since: '2023', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['DNP or Ph.D. in Nursing', 'Active RN license'], competencies: ['Nursing Education', 'Clinical Practice', 'Healthcare Leadership'], necessity: 'Produces registered nurses and advanced practice nurses for NC healthcare systems.', salaryBand: 'Academic Band 2', salary: 168000, salaryYear: 2025, directReports: 12, teamSize: 20, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-kin', title: 'Chair, Kinesiology', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Kinesiology or Exercise Science'], competencies: ['Exercise Science', 'Sports Medicine', 'Physical Therapy prep'], necessity: 'Advances movement science, sports medicine, and physical rehabilitation education.', salaryBand: 'Academic Band 2', salary: 148000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-psych', title: 'Chair, Psychology', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Psychology'], competencies: ['Clinical Psychology', 'Research Methods', 'Behavioral Science'], necessity: 'One of the largest departments; serves pre-med, pre-law, and mental health career paths.', salaryBand: 'Academic Band 2', salary: 155000, salaryYear: 2025, directReports: 15, teamSize: 22, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-swas', title: 'Chair, Social Work & Sociology', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'David Kondrat, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Social Work or Sociology', 'CSWE accreditation experience'], competencies: ['Clinical Social Work', 'Community Practice', 'Social Policy'], necessity: 'Trains licensed social workers and sociologists for community health and social services.', salaryBand: 'Academic Band 2', salary: 145000, salaryYear: 2025, directReports: 10, teamSize: 14, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-csd', title: 'Chair, Communication Sciences & Disorders', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Speech-Language Pathology or Audiology'], competencies: ['Speech Pathology', 'Audiology', 'Clinical Practicum'], necessity: 'Prepares speech-language pathologists and audiologists for clinical practice.', salaryBand: 'Academic Band 2', salary: 152000, salaryYear: 2025, directReports: 6, teamSize: 10, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-pa', title: 'Director, Physician Assistant Studies', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Program Director', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['MPAS or DMSc', 'PA-C certification', 'ARC-PA accreditation experience'], competencies: ['Clinical Medicine', 'Healthcare Education', 'Program Accreditation'], necessity: 'Produces physician assistants addressing primary care shortages in underserved communities.', salaryBand: 'Academic Band 2', salary: 165000, salaryYear: 2025, directReports: 6, teamSize: 10, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'chhs-phmp', title: 'Chair, Population Health Management & Policy', department: 'Health & Human Sciences', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. or DrPH in Public Health'], competencies: ['Epidemiology', 'Health Policy', 'Population Health Analytics'], necessity: 'Addresses systemic health disparities through policy research and population-level interventions.', salaryBand: 'Academic Band 2', salary: 158000, salaryYear: 2025, directReports: 6, teamSize: 10, classification: 'Faculty', custom: {} }, children: [] }
          ]
        },

        /* ─── Joint School of Nanoscience & Nanoengineering ─── */
        {
          id: 'jsnn',
          title: 'Dean, Joint School of Nanoscience & Nanoengineering',
          department: 'Nanoscience & Nanoengineering',
          division: 'Division of Academic Affairs',
          holder: { name: 'Masud H. Chowdhury, Ph.D.', since: '2025', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in Nanotechnology, Physics, or Engineering', 'Track record in sponsored research', 'Collaborative leadership across institutions'],
            competencies: ['Nanotechnology Research', 'Cross-Institutional Management', 'Research Commercialization', 'Graduate Education'],
            necessity: 'Joint venture with UNC Greensboro at Gateway University Research Park. Premier facility for nanobioscience, nanomaterials, computational nanotechnology, and nanoenergy research.',
            salaryBand: 'Academic Band 1',
            salary: 295000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 60,
            classification: 'EPA',
            custom: { building: 'Gateway University Research Park' }
          },
          children: [
            { id: 'jsnn-ns', title: 'Chair, Nanoscience', department: 'Nanoscience & Nanoengineering', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Nanoscience or related'], competencies: ['Nanobioscience', 'Nanomaterials Characterization', 'Nanometrology'], necessity: 'Advances fundamental nanoscale science research and graduate education.', salaryBand: 'Academic Band 2', salary: 175000, salaryYear: 2025, directReports: 8, teamSize: 15, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'jsnn-ne', title: 'Chair, Nanoengineering', department: 'Nanoscience & Nanoengineering', division: 'Division of Academic Affairs', holder: { name: 'Department Chair', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in Nanoengineering or related'], competencies: ['Nanofabrication', 'Nanoenergy', 'Computational Nanotechnology'], necessity: 'Develops engineering applications of nanotechnology for energy, healthcare, and manufacturing.', salaryBand: 'Academic Band 2', salary: 178000, salaryYear: 2025, directReports: 8, teamSize: 15, classification: 'Faculty', custom: {} }, children: [] },
            { id: 'jsnn-jsirt', title: 'Director, Institute for Research Technologies (JSIRT)', department: 'Nanoscience & Nanoengineering', division: 'Division of Academic Affairs', holder: { name: 'Institute Director', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. with instrumentation expertise'], competencies: ['Research Infrastructure', 'Core Facilities Management', 'Instrumentation'], necessity: 'Manages shared research instrumentation and core facilities for JSNN and partner institutions.', salaryBand: 'Administrative Band 2', salary: 145000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── The Graduate College ─── */
        {
          id: 'grad',
          title: 'Dean, The Graduate College',
          department: 'Graduate College',
          division: 'Division of Academic Affairs',
          holder: { name: 'Clay S. Gloster, Ph.D.', since: '2020', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in academic discipline', 'Graduate program development experience', 'Enrollment management'],
            competencies: ['Graduate Education', 'Thesis/Dissertation Oversight', 'Fellowship Administration', 'Graduate Student Support'],
            necessity: 'Oversees all M.S., Ph.D., and graduate certificate programs university-wide. Manages graduate admissions, assistantships, and the Council of Associate Deans.',
            salaryBand: 'Academic Band 1',
            salary: 235000,
            salaryYear: 2025,
            directReports: 3,
            teamSize: 15,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'grad-assoc', title: 'Associate Dean, Graduate College', department: 'Graduate College', division: 'Division of Academic Affairs', holder: { name: 'Matthew McCullough', since: '', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in academic discipline'], competencies: ['Graduate Student Affairs', 'Program Coordination', 'Academic Support'], necessity: 'Supports graduate operations, student services, and program assessment.', salaryBand: 'Academic Band 2', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── Honors College ─── */
        {
          id: 'honors',
          title: 'Dean, Honors College',
          department: 'Honors College',
          division: 'Division of Academic Affairs',
          holder: { name: 'Margaret I. Kanipes, Ph.D.', since: '2020', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Ph.D. in academic discipline', 'Honors program administration', 'Fellowship advising experience'],
            competencies: ['Honors Curriculum', 'Fellowship Advising', 'Living-Learning Communities', 'Undergraduate Research'],
            necessity: 'Leads the Honors College providing enriched academic experiences, priority registration, prestigious fellowship support, and living-learning community for high-achieving students.',
            salaryBand: 'Academic Band 1',
            salary: 195000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 12,
            classification: 'EPA',
            custom: {}
          },
          children: [
            { id: 'honors-ad-research', title: 'Associate Dean, Research & Innovation', department: 'Honors College', division: 'Division of Academic Affairs', holder: { name: 'Gerard G. Dumancas, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in STEM or related field', 'Undergraduate research mentoring'], competencies: ['Research Mentoring', 'Undergraduate Research', 'Innovation Programs', 'Grant Writing'], necessity: 'Drives undergraduate research opportunities and innovation programs within the Honors College.', salaryBand: 'Academic Band 2', salary: 150000, salaryYear: 2025, directReports: 2, teamSize: 5, classification: 'EPA', custom: {} }, children: [] },
            { id: 'honors-ad-academics', title: 'Associate Dean, Academics', department: 'Honors College', division: 'Division of Academic Affairs', holder: { name: 'Buffie Longmire-Avital, Ph.D.', since: '2023', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Ph.D. in academic discipline', 'Honors curriculum experience'], competencies: ['Honors Curriculum', 'Academic Advising', 'Student Development', 'Program Assessment'], necessity: 'Manages honors curriculum, academic advising, and student development programs within the Honors College.', salaryBand: 'Academic Band 2', salary: 148000, salaryYear: 2025, directReports: 2, teamSize: 4, classification: 'EPA', custom: {} }, children: [] },
            { id: 'honors-scholarships', title: 'Director of Scholarship Programs', department: 'Honors College', division: 'Division of Academic Affairs', holder: { name: 'Brittany R. Franklin', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Master\'s degree', 'Scholarship administration experience'], competencies: ['Scholarship Administration', 'Student Recruitment', 'Financial Aid Coordination', 'Event Planning'], necessity: 'Administers competitive scholarship programs and coordinates recruitment of high-achieving students to the Honors College.', salaryBand: 'Administrative Band 2', salary: 95000, salaryYear: 2025, directReports: 2, teamSize: 3, classification: 'EPA', custom: {} }, children: [] }
          ]
        },

        /* ─── Registrar ─── */
        {
          id: 'registrar',
          title: 'University Registrar',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'University Registrar', since: '', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Master\'s degree or higher', 'Student information systems expertise'],
            competencies: ['Records Management', 'Enrollment Processing', 'Academic Policy', 'Degree Audit'],
            necessity: 'Manages academic records, course scheduling, degree audits, and graduation processing for all students.',
            salaryBand: 'Administrative Band 2',
            salary: 135000,
            salaryYear: 2025,
            directReports: 8,
            teamSize: 20,
            classification: 'EPA',
            custom: { building: '107 Dowdy Administration Building' }
          },
          children: []
        },

        /* ─── ROTC Programs ─── */
        {
          id: 'rotc-army',
          title: 'Commander, Army ROTC (Aggie Battalion)',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Battalion Commander', since: '', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Active-duty Army officer', 'Advanced military education'],
            competencies: ['Military Science', 'Leadership Development', 'Cadet Training'],
            necessity: 'Commissions Army officers through university military science program. Long tradition of HBCU military leadership.',
            salaryBand: 'Military',
            salary: 125000,
            salaryYear: 2025,
            directReports: 4,
            teamSize: 8,
            classification: 'EPA',
            custom: {}
          },
          children: []
        },
        {
          id: 'rotc-af',
          title: 'Commander, Air Force ROTC (Detachment 605)',
          department: 'Academic Affairs',
          division: 'Division of Academic Affairs',
          holder: { name: 'Detachment Commander', since: '', photo: null },
          status: 'filled',
          level: 3,
          metadata: {
            qualifications: ['Active-duty Air Force officer', 'Advanced aerospace education'],
            competencies: ['Aerospace Studies', 'Officer Development', 'Flight Training Pipeline'],
            necessity: 'Commissions Air Force and Space Force officers through university aerospace studies program.',
            salaryBand: 'Military',
            salary: 122000,
            salaryYear: 2025,
            directReports: 3,
            teamSize: 6,
            classification: 'EPA',
            custom: {}
          },
          children: []
        }
      ]
    },

    /* ═══════════════════════════════════════════
     * CHIEF OF STAFF / ADMINISTRATION
     * ═══════════════════════════════════════════ */
    {
      id: 'chief-staff',
      title: 'Vice Chancellor & Chief of Staff',
      department: 'Executive',
      division: 'Office of the Chancellor',
      holder: { name: 'TaJuan R. Wilson, Ed.D.', since: '2026', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Ed.D. or Ph.D. in Higher Education Administration', 'Senior executive experience'],
        competencies: ['Executive Operations', 'Strategic Planning', 'Cabinet Coordination', 'Institutional Effectiveness'],
        necessity: 'Coordinates Chancellor\'s Cabinet operations, manages strategic initiatives, and ensures institutional alignment across all divisions.',
        salaryBand: 'Executive Band 2',
        salary: 195000,
        salaryYear: 2025,
        directReports: 4,
        teamSize: 12,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'avc-admin', title: 'Associate Vice Chancellor, Administration & Strategic Operations', department: 'Executive', division: 'Office of the Chancellor', holder: { name: 'Shannon Trapp', since: '2023', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'Administrative operations experience'], competencies: ['Operations Management', 'Strategic Planning', 'Process Improvement'], necessity: 'Oversees day-to-day administrative operations and strategic project implementation.', salaryBand: 'Administrative Band 1', salary: 165000, salaryYear: 2025, directReports: 5, teamSize: 10, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * DIVISION OF STUDENT AFFAIRS
     * ═══════════════════════════════════════════ */
    {
      id: 'student-affairs',
      title: 'Vice Chancellor for Student Affairs',
      department: 'Student Affairs',
      division: 'Division of Student Affairs',
      holder: { name: 'Christopher C. Catching, Ed.D.', since: '2021', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Ed.D. or Ph.D. in Higher Education / Student Affairs', 'Extensive student services experience'],
        competencies: ['Student Retention', 'Crisis Management', 'Student Development', 'Enrollment Strategy'],
        necessity: 'Supports the holistic wellbeing, housing, enrollment, financial aid, and engagement of the entire student body.',
        salaryBand: 'Executive Band 2',
        salary: 265000,
        salaryYear: 2025,
        directReports: 6,
        teamSize: 150,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'sa-dos', title: 'Dean of Students', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Search In Progress', since: '', photo: null }, status: 'vacant', level: 3, metadata: { qualifications: ['Ed.D. or Ph.D. in Student Affairs', 'Student conduct experience'], competencies: ['Student Advocacy', 'Crisis Intervention', 'Conduct Administration'], necessity: 'Primary advocate for students. Oversees student conduct, conflict resolution, and the Behavioral Intervention Team.', salaryBand: 'Administrative Band 1', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 12, classification: 'EPA', custom: {} },
          children: [
            { id: 'sa-conduct', title: 'Associate Dean / Director of Student Conduct', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Zachary K. Cammack', since: '2022', photo: null }, status: 'filled', level: 4, metadata: { qualifications: ['Master\'s in Student Affairs'], competencies: ['Student Conduct', 'Conflict Resolution', 'Behavioral Intervention'], necessity: 'Manages student conduct processes, academic integrity, and the BIT team.', salaryBand: 'Administrative Band 2', salary: 108000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] }
          ]
        },
        { id: 'sa-enroll', title: 'Director, Enrollment Management', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Higher Education', 'Enrollment analytics experience'], competencies: ['Recruitment Strategy', 'Admissions', 'Enrollment Marketing', 'Data Analytics'], necessity: 'Drives undergraduate recruitment, admissions, orientation, and enrollment yield strategies.', salaryBand: 'Administrative Band 1', salary: 120000, salaryYear: 2025, directReports: 6, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-finaid', title: 'Director, Financial Aid & Scholarships', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'Federal financial aid compliance expertise'], competencies: ['Federal Aid Administration', 'Scholarship Programs', 'Financial Literacy'], necessity: 'Administers $300M+ in financial aid ensuring access and affordability for all students.', salaryBand: 'Administrative Band 1', salary: 125000, salaryYear: 2025, directReports: 10, teamSize: 25, classification: 'EPA', custom: { building: 'Dowdy Building, Suite 100' } }, children: [] },
        { id: 'sa-housing', title: 'Director, Housing & Residence Life', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Student Affairs or Higher Education'], competencies: ['Residential Programs', 'Facility Management', 'Community Development'], necessity: 'Manages on-campus housing for 5,000+ residents. Creates living-learning communities.', salaryBand: 'Administrative Band 1', salary: 115000, salaryYear: 2025, directReports: 8, teamSize: 40, classification: 'EPA', custom: { building: 'Aggie Village Building 2' } }, children: [] },
        { id: 'sa-avc-engagement', title: 'Asst. Vice Chancellor, Student Engagement', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Dawn F. Murphy, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Higher Education or Student Affairs'], competencies: ['Student Engagement', 'Programming', 'Leadership Development', 'Student Organizations'], necessity: 'Leads student engagement initiatives, programming, leadership development, and student organization oversight.', salaryBand: 'Administrative Band 1', salary: 155000, salaryYear: 2025, directReports: 4, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-avc-wellness', title: 'Asst. Vice Chancellor, Health & Wellness', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Padonda Webb, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Public Health or Counseling'], competencies: ['Student Health', 'Wellness Programs', 'Mental Health', 'Health Promotion'], necessity: 'Oversees student health services, counseling, wellness programming, and health promotion initiatives.', salaryBand: 'Administrative Band 1', salary: 152000, salaryYear: 2025, directReports: 4, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-ed-housing', title: 'Executive Director, Housing & Residence Life', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'John Lowney, Ph.D.', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Higher Education or Student Affairs'], competencies: ['Residential Life', 'Housing Operations', 'Living-Learning Communities', 'Facility Planning'], necessity: 'Provides executive leadership for on-campus housing operations, residential programming, and living-learning community development.', salaryBand: 'Administrative Band 2', salary: 135000, salaryYear: 2025, directReports: 6, teamSize: 35, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-ed-admin', title: 'Executive Director for Administration', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Patrick Krueger', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Business Administration or related field'], competencies: ['Budget Management', 'Administrative Operations', 'Strategic Planning', 'Process Improvement'], necessity: 'Manages administrative operations, budgets, and strategic planning for the Division of Student Affairs.', salaryBand: 'Administrative Band 2', salary: 130000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-ed-activities', title: 'Exec. Director, Student Activities & Campus Involvement', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Rashanda L. Lowery', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Student Affairs or Higher Education'], competencies: ['Student Activities', 'Campus Programming', 'Student Organizations', 'Greek Life'], necessity: 'Leads student activities, campus involvement programs, Greek life, and student organization management.', salaryBand: 'Director Band', salary: 115000, salaryYear: 2025, directReports: 5, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-ed-centers', title: 'Exec. Director, Student Centers & University Events', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Robert L. McNair', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Student Affairs or Hospitality'], competencies: ['Facility Management', 'Event Planning', 'Student Union Operations', 'Conference Services'], necessity: 'Manages student center operations, university event planning, and conference services.', salaryBand: 'Director Band', salary: 118000, salaryYear: 2025, directReports: 5, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-counseling', title: 'Director of Counseling Services', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Jeffery Haynes, Ph.D.', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Counseling Psychology or Clinical Psychology', 'Licensed Psychologist'], competencies: ['Clinical Counseling', 'Crisis Intervention', 'Mental Health Services', 'Group Therapy'], necessity: 'Provides mental health counseling, crisis intervention, and psychological services to the student body.', salaryBand: 'Director Band', salary: 125000, salaryYear: 2025, directReports: 6, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-health', title: 'Medical Director, Health Services', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Eboni Ellis Farabee, M.D.', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['M.D. from accredited medical school', 'Board Certified Physician', 'Student health experience'], competencies: ['Primary Care', 'Student Health', 'Public Health', 'Clinical Operations'], necessity: 'Provides medical oversight for student health services, clinical operations, and campus public health initiatives.', salaryBand: 'Administrative Band 1', salary: 185000, salaryYear: 2025, directReports: 5, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-career', title: 'Executive Director, Career Services', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Nomiki Davis, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Higher Education or Counseling'], competencies: ['Career Development', 'Employer Relations', 'Internship Programs', 'Professional Development'], necessity: 'Leads career counseling, employer engagement, internship programs, and job placement services for students and alumni.', salaryBand: 'Director Band', salary: 120000, salaryYear: 2025, directReports: 5, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-recreation', title: 'Campus Recreation Center Director', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Jonathan Childress', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Recreation Management or Kinesiology'], competencies: ['Recreation Programming', 'Fitness Operations', 'Intramural Sports', 'Facility Management'], necessity: 'Manages campus recreation facilities, fitness programs, intramural sports, and outdoor recreation.', salaryBand: 'Director Band', salary: 98000, salaryYear: 2025, directReports: 4, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sa-assessment', title: 'Director, Student Affairs Assessment', department: 'Student Affairs', division: 'Division of Student Affairs', holder: { name: 'Dana L. Dalton', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Higher Education or Assessment'], competencies: ['Assessment', 'Data Analytics', 'Program Evaluation', 'Institutional Effectiveness'], necessity: 'Leads assessment, program evaluation, and data analytics for the Division of Student Affairs.', salaryBand: 'Director Band', salary: 105000, salaryYear: 2025, directReports: 2, teamSize: 4, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * DIVISION OF RESEARCH
     * ═══════════════════════════════════════════ */
    {
      id: 'research',
      title: 'Vice Chancellor for Research',
      department: 'Research',
      division: 'Division of Research',
      holder: { name: 'Lisa M. Clough, Ph.D.', since: '2022', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Ph.D. with extensive research background', 'Federal grants management experience', 'Research compliance expertise'],
        competencies: ['Grant Compliance', 'Innovation Transfer', 'Interdisciplinary Research', 'Commercialization'],
        necessity: 'Drives NC A&T\'s status as the #1 HBCU in research expenditures (~$260M). Manages sponsored programs, IP, compliance, and research centers.',
        salaryBand: 'Executive Band 2',
        salary: 310000,
        salaryYear: 2025,
        directReports: 8,
        teamSize: 60,
        classification: 'EPA',
        custom: { building: 'Fort Interdisciplinary Research Center (IRC), 4th Floor' }
      },
      children: [
        { id: 'res-osp', title: 'Director, Office of Sponsored Programs', department: 'Research', division: 'Division of Research', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'Pre/post-award management'], competencies: ['Grant Writing Support', 'Pre-Award Management', 'Federal Compliance'], necessity: 'Processes all grant applications and manages pre-award compliance for $260M+ research portfolio.', salaryBand: 'Administrative Band 1', salary: 142000, salaryYear: 2025, directReports: 8, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-ip', title: 'Director, Intellectual Property & Commercialization', department: 'Research', division: 'Division of Research', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['J.D. or advanced degree', 'IP law and tech transfer'], competencies: ['Patent Portfolio', 'Technology Licensing', 'Startup Support'], necessity: 'Protects university intellectual property and drives commercialization of research innovations.', salaryBand: 'Administrative Band 1', salary: 148000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-compliance', title: 'Director, Research Compliance & Ethics', department: 'Research', division: 'Division of Research', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Advanced degree', 'IRB/IACUC expertise'], competencies: ['IRB Management', 'Export Control', 'Research Ethics'], necessity: 'Ensures all research meets federal compliance standards (IRB, IACUC, export control).', salaryBand: 'Administrative Band 1', salary: 135000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-catm', title: 'Director, Center for Advanced Transportation Mobility (CATM)', department: 'Research', division: 'Division of Research', holder: { name: 'Center Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Transportation or Engineering'], competencies: ['Autonomous Vehicles', 'Smart Infrastructure', 'DOT Partnerships'], necessity: 'DOT-funded consortium (with Virginia Tech, Embry-Riddle) advancing connected/autonomous vehicle technologies.', salaryBand: 'Administrative Band 1', salary: 168000, salaryYear: 2025, directReports: 4, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-cta', title: 'Director, Center for Trustworthy AI', department: 'Research', division: 'Division of Research', holder: { name: 'Center Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Computer Science or AI'], competencies: ['AI Ethics', 'Machine Learning Safety', 'Responsible AI'], necessity: 'Researches ethical, fair, and transparent AI systems. Growing national priority area.', salaryBand: 'Administrative Band 1', salary: 162000, salaryYear: 2025, directReports: 3, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-cyber', title: 'Director, Center for Cyber Defense', department: 'Research', division: 'Division of Research', holder: { name: 'Center Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Cybersecurity or Computer Science', 'NSA/DHS CAE designation experience'], competencies: ['Cybersecurity Research', 'National Security', 'Cyber Workforce Development'], necessity: 'NSA/DHS designated National Center of Academic Excellence in Cyber Defense. Critical national security research.', salaryBand: 'Administrative Band 1', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-cert', title: 'Director, Center for Energy Research & Technology (CERT)', department: 'Research', division: 'Division of Research', holder: { name: 'Center Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Energy or Environmental Engineering'], competencies: ['Renewable Energy', 'Sustainability Research', 'Clean Technology'], necessity: 'Advances renewable energy and sustainability research. Key to NC A&T\'s clean energy portfolio.', salaryBand: 'Administrative Band 1', salary: 155000, salaryYear: 2025, directReports: 3, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-iset', title: 'Director, NOAA ISET Center', department: 'Research', division: 'Division of Research', holder: { name: 'Solomon Bililign, Ph.D.', since: '2018', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Atmospheric Science or related field'], competencies: ['Atmospheric Research', 'NOAA Partnerships', 'Environmental Modeling', 'Climate Science'], necessity: 'Directs the NOAA Interdisciplinary Science for Ecosystem \'Tipping Points\' (ISET) Center, advancing atmospheric and environmental research.', salaryBand: 'Director Band', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-cepdam', title: 'Interim Director, CEPDAM', department: 'Research', division: 'Division of Research', holder: { name: 'Chang S. Nam, Ph.D.', since: '2024', photo: null }, status: 'interim', level: 3, metadata: { qualifications: ['Ph.D. in Engineering or related field'], competencies: ['Advanced Manufacturing', 'Defense Research', 'Materials Science', 'DoD Partnerships'], necessity: 'Leads the Center for Excellence in Product Design \'And\' Advanced Manufacturing (CEPDAM) for defense and advanced manufacturing research.', salaryBand: 'Director Band', salary: 155000, salaryYear: 2025, directReports: 3, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-creo', title: 'Interim Director, CREO (Cybersecurity)', department: 'Research', division: 'Division of Research', holder: { name: 'Ahmad Patooghy, Ph.D.', since: '2024', photo: null }, status: 'interim', level: 3, metadata: { qualifications: ['Ph.D. in Computer Science or Cybersecurity'], competencies: ['Cybersecurity Research', 'Network Security', 'Critical Infrastructure', 'Cyber Defense'], necessity: 'Leads the Cybersecurity Research, Education \'And\' Outreach (CREO) center advancing cybersecurity research and workforce development.', salaryBand: 'Director Band', salary: 150000, salaryYear: 2025, directReports: 3, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-coaach', title: 'Director, COAACH (Alzheimer\'s/Aging)', department: 'Research', division: 'Division of Research', holder: { name: 'Raymond E. Samuel, Ph.D.', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Gerontology, Public Health, or related field'], competencies: ['Aging Research', 'Alzheimer\'s Disease', 'Health Disparities', 'Community-Based Research'], necessity: 'Directs the Center of Excellence for African Americans\' Aging and Community Health (COAACH), addressing Alzheimer\'s and aging disparities.', salaryBand: 'Director Band', salary: 148000, salaryYear: 2025, directReports: 3, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'res-cr2c2', title: 'Director, CR2C2 (Connected Communities)', department: 'Research', division: 'Division of Research', holder: { name: 'Ali Karimoddini, Ph.D.', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Engineering or Computer Science'], competencies: ['Autonomous Systems', 'IoT/Smart Cities', 'Connected Infrastructure', 'Robotics'], necessity: 'Leads the Center for Resilient, Connected, and Cybersafe Communities (CR2C2), advancing smart infrastructure and connected systems research.', salaryBand: 'Director Band', salary: 155000, salaryYear: 2025, directReports: 4, teamSize: 12, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * DIVISION OF BUSINESS AND FINANCE
     * ═══════════════════════════════════════════ */
    {
      id: 'finance',
      title: 'Vice Chancellor for Business & Finance',
      department: 'Business & Finance',
      division: 'Division of Business & Finance',
      holder: { name: 'Virginia Teachey, MBA', since: '2020', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['MBA or CPA', 'Financial audit expertise', 'State government finance experience'],
        competencies: ['Fiscal Management', 'Operational Risk', 'Budget Planning', 'Facilities Oversight'],
        necessity: 'Provides the operational infrastructure, financial stability, HR services, and campus safety needed to support all academic activities.',
        salaryBand: 'Executive Band 2',
        salary: 295000,
        salaryYear: 2025,
        directReports: 5,
        teamSize: 400,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'fin-hr', title: 'Director, Human Resources', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in HR Management or MBA', 'SHRM-SCP preferred'], competencies: ['Talent Acquisition', 'Benefits Administration', 'Employee Relations', 'Compliance'], necessity: 'Manages 3,000+ employees. Handles recruitment, benefits, classification, and employee development.', salaryBand: 'Administrative Band 1', salary: 145000, salaryYear: 2025, directReports: 8, teamSize: 25, classification: 'EPA', custom: { building: '1806 East Market Street' } }, children: [] },
        { id: 'fin-facilities', title: 'Director, Facilities', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Engineering or Facilities Management'], competencies: ['Campus Operations', 'Construction Management', 'Sustainability', 'Space Planning'], necessity: 'Maintains 120+ buildings across 600 acres. Manages capital projects, maintenance, and campus master plan.', salaryBand: 'Administrative Band 1', salary: 138000, salaryYear: 2025, directReports: 10, teamSize: 200, classification: 'EPA', custom: { building: 'DeHuguley Physical Plant, 1601 East Market Street' } }, children: [] },
        { id: 'fin-police', title: 'Chief of Police / Director of Public Safety', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Chief of Police', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'NC Law Enforcement Certification', 'Advanced law enforcement training'], competencies: ['Campus Safety', 'Emergency Management', 'Community Policing', 'Clery Act Compliance'], necessity: 'Sworn law enforcement providing 24/7 campus safety for 13,000+ students and staff.', salaryBand: 'Administrative Band 1', salary: 132000, salaryYear: 2025, directReports: 6, teamSize: 45, classification: 'SPA', custom: { building: '406 Laurel Street, Ward Hall' } }, children: [] },
        { id: 'fin-sr-avc', title: 'Senior Associate VC & Deputy CFO', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Lisa McClinton', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['MBA or CPA', 'Senior financial management experience'], competencies: ['Financial Strategy', 'Budget Oversight', 'Audit Management', 'Risk Assessment'], necessity: 'Serves as deputy to the VC for Business & Finance, overseeing financial strategy, budget execution, and fiscal risk management.', salaryBand: 'Executive Band 3', salary: 195000, salaryYear: 2025, directReports: 5, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-avc-hr', title: 'Associate VC for Human Resources (CHRO)', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Darryl D. Wright-Greene, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in HR or Organizational Development', 'SHRM-SCP or SPHR certification'], competencies: ['Strategic HR Leadership', 'Talent Management', 'Employee Relations', 'Organizational Development'], necessity: 'Chief Human Resources Officer leading all HR functions including talent acquisition, employee relations, and workforce planning for 3,000+ employees.', salaryBand: 'Executive Band 3', salary: 185000, salaryYear: 2025, directReports: 6, teamSize: 30, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-avc-facilities', title: 'Associate VC of Facilities', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'William Barlow Jr.', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s or Master\'s in Engineering or Facilities Management'], competencies: ['Capital Projects', 'Campus Master Planning', 'Building Operations', 'Sustainability'], necessity: 'Executive leadership for all campus facilities operations, capital construction, maintenance, and master planning across 600+ acres.', salaryBand: 'Administrative Band 1', salary: 175000, salaryYear: 2025, directReports: 8, teamSize: 180, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-controller', title: 'Assistant VC & Controller', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Catherine Clark', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['CPA required', 'Master\'s in Accounting or MBA'], competencies: ['Financial Reporting', 'General Ledger', 'Accounts Payable/Receivable', 'Audit Compliance'], necessity: 'Oversees university accounting operations, financial reporting, accounts payable/receivable, and audit compliance.', salaryBand: 'Administrative Band 1', salary: 165000, salaryYear: 2025, directReports: 6, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-budget', title: 'Assistant VC for Budget & Planning', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Lavelle Hayes', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Finance or Public Administration'], competencies: ['Budget Development', 'Financial Planning', 'Resource Allocation', 'Forecasting'], necessity: 'Leads university budget development, financial planning, resource allocation, and multi-year fiscal forecasting.', salaryBand: 'Administrative Band 1', salary: 155000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-talent', title: 'Assistant VC for Talent Management', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Allison R. Chisholm', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in HR or Organizational Development'], competencies: ['Talent Acquisition', 'Professional Development', 'Performance Management', 'Succession Planning'], necessity: 'Drives talent acquisition, professional development, performance management, and succession planning university-wide.', salaryBand: 'Administrative Band 1', salary: 145000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-hr-ops', title: 'Assistant VC for HR Operations', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Orielle Hope', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in HR Management or Business Administration'], competencies: ['HR Operations', 'Benefits Administration', 'Classification & Compensation', 'HRIS'], necessity: 'Manages HR operational functions including benefits, classification, compensation, and HR information systems.', salaryBand: 'Administrative Band 2', salary: 140000, salaryYear: 2025, directReports: 5, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-ehs', title: 'Director, Environmental Health & Safety', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Louisa Newman', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Environmental Health or related field', 'CSP or CIH certification preferred'], competencies: ['OSHA Compliance', 'Hazardous Materials', 'Lab Safety', 'Emergency Preparedness'], necessity: 'Ensures campus compliance with environmental, health, and safety regulations including OSHA, EPA, and lab safety protocols.', salaryBand: 'Director Band', salary: 108000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-procurement', title: 'Interim Director, Procurement Services', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Stephen Pass', since: '2024', photo: null }, status: 'interim', level: 3, metadata: { qualifications: ['Bachelor\'s in Business or Supply Chain Management'], competencies: ['Procurement Management', 'Contract Administration', 'Vendor Relations', 'P-Card Administration'], necessity: 'Manages university purchasing, contracts, vendor relations, and procurement compliance.', salaryBand: 'Director Band', salary: 105000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'fin-treasurer', title: 'University Treasurer / Bursar', department: 'Business & Finance', division: 'Division of Business & Finance', holder: { name: 'Linda Bowman', since: '2019', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Accounting or Finance', 'CPA preferred'], competencies: ['Treasury Management', 'Student Billing', 'Cash Management', 'Investment Oversight'], necessity: 'Manages university treasury, student billing operations, cash management, and financial collections.', salaryBand: 'Administrative Band 2', salary: 125000, salaryYear: 2025, directReports: 5, teamSize: 12, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * DIVISION OF INFORMATION TECHNOLOGY
     * ═══════════════════════════════════════════ */
    {
      id: 'it',
      title: 'Vice Chancellor for Information Technology Services / CIO',
      department: 'Information Technology',
      division: 'Division of Information Technology',
      holder: { name: 'Maurice A. Ferrell, Ph.D.', since: '2021', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Ph.D. in Information Technology or related field', 'Enterprise IT leadership', 'CISO/CIO experience'],
        competencies: ['Digital Transformation', 'Cybersecurity', 'IT Governance', 'Cloud Infrastructure', 'Data Governance'],
        necessity: 'Manages all technology infrastructure, cybersecurity, learning technologies, and data governance for the university.',
        salaryBand: 'Executive Band 2',
        salary: 255000,
        salaryYear: 2025,
        directReports: 5,
        teamSize: 80,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'it-cts', title: 'Director, Client Technology Services', department: 'Information Technology', division: 'Division of Information Technology', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in IT', 'ITIL certification preferred'], competencies: ['Help Desk Operations', 'Desktop Support', 'Customer Service'], necessity: 'Provides faculty, staff, and student technical support through helpdesk and desktop services.', salaryBand: 'Administrative Band 2', salary: 112000, salaryYear: 2025, directReports: 5, teamSize: 15, classification: 'SPA', custom: {} }, children: [] },
        { id: 'it-infra', title: 'Director, Core Infrastructure & Cybersecurity', department: 'Information Technology', division: 'Division of Information Technology', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in CS or IT', 'CISSP or equivalent'], competencies: ['Network Engineering', 'Cloud Computing', 'Cybersecurity Operations', 'Disaster Recovery'], necessity: 'Manages campus network, cloud infrastructure, data centers, and endpoint management.', salaryBand: 'Administrative Band 1', salary: 142000, salaryYear: 2025, directReports: 6, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'it-data', title: 'Director, Data Governance & Business Intelligence', department: 'Information Technology', division: 'Division of Information Technology', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Data Science or MIS'], competencies: ['Data Analytics', 'Institutional Research', 'Business Intelligence', 'Data Warehousing'], necessity: 'Ensures data quality, reporting, and analytics capabilities across all divisions.', salaryBand: 'Administrative Band 1', salary: 135000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'it-learn', title: 'Director, Learning Technologies', department: 'Information Technology', division: 'Division of Information Technology', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Instructional Technology'], competencies: ['LMS Administration', 'Online Learning', 'Instructional Design', 'EdTech'], necessity: 'Supports Canvas LMS, classroom technology, and online/hybrid instruction for 14,000+ students.', salaryBand: 'Administrative Band 2', salary: 118000, salaryYear: 2025, directReports: 5, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'it-deputy-cio', title: 'Associate VC for IT / Deputy CIO', department: 'Information Technology', division: 'Division of Information Technology', holder: { name: 'Lizbeth Johnson', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in IT or related field', 'Enterprise IT leadership experience'], competencies: ['IT Strategy', 'Enterprise Architecture', 'Digital Services', 'Vendor Management'], necessity: 'Serves as deputy to the CIO, overseeing IT strategy, enterprise architecture, and digital service delivery.', salaryBand: 'Administrative Band 1', salary: 175000, salaryYear: 2025, directReports: 5, teamSize: 25, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * DIVISION OF UNIVERSITY ADVANCEMENT
     * ═══════════════════════════════════════════ */
    {
      id: 'advancement',
      title: 'Vice Chancellor for University Advancement',
      department: 'University Advancement',
      division: 'Division of University Advancement',
      holder: { name: 'Tamara Michel Josserand, M.Ed., MBA', since: '2023', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['MBA and/or M.Ed.', 'Major gifts and campaign experience', 'Higher ed fundraising leadership'],
        competencies: ['Major Gift Fundraising', 'Alumni Engagement', 'Campaign Management', 'Corporate Partnerships'],
        necessity: 'Drives philanthropy, alumni engagement, and development operations supporting the university\'s growth and endowment.',
        salaryBand: 'Executive Band 2',
        salary: 275000,
        salaryYear: 2025,
        directReports: 4,
        teamSize: 35,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'adv-alumni', title: 'Associate Vice Chancellor, Alumni Relations', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Crystal W. Boyce', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'Alumni programming experience'], competencies: ['Alumni Engagement', 'Event Management', 'Chapter Development', 'Homecoming'], necessity: 'Connects 80,000+ living alumni to the university through events, chapters, and giving programs.', salaryBand: 'Administrative Band 1', salary: 135000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: { building: 'Alumni Foundation Event Center, 200 N. Benbow Rd.' } }, children: [] },
        { id: 'adv-dev', title: 'Director, Development', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree minimum', 'CFRE preferred'], competencies: ['Annual Giving', 'Corporate Relations', 'Gift Planning', 'Prospect Research'], necessity: 'Manages major gift pipeline, annual fund, corporate/foundation engagement, and gift planning.', salaryBand: 'Administrative Band 1', salary: 128000, salaryYear: 2025, directReports: 6, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'adv-ops', title: 'Director, Advancement Operations', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Business or IT'], competencies: ['CRM Administration', 'Gift Processing', 'Data Analytics', 'Reporting'], necessity: 'Manages donor database, gift processing, reporting, and advancement technology systems.', salaryBand: 'Administrative Band 2', salary: 108000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: { building: 'Dowdy Building, Suite 400' } }, children: [] },
        { id: 'adv-annual', title: 'Executive Director, Annual & Leadership Giving', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Bridgett Herring-Williams', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Annual giving program experience'], competencies: ['Annual Fund Strategy', 'Leadership Giving', 'Direct Mail', 'Phonathon'], necessity: 'Drives annual fund campaigns and leadership giving programs to build a broad base of donor support.', salaryBand: 'Director Band', salary: 115000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'adv-gift-planning', title: 'Director, Gift Planning', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Diane Frost Hill', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['J.D. or CFP preferred', 'Planned giving expertise'], competencies: ['Planned Giving', 'Estate Planning', 'Donor Cultivation', 'Endowment Building'], necessity: 'Manages planned giving, bequests, and deferred gift strategies to grow the university endowment.', salaryBand: 'Director Band', salary: 108000, salaryYear: 2025, directReports: 2, teamSize: 4, classification: 'EPA', custom: {} }, children: [] },
        { id: 'adv-corp-found', title: 'Executive Director, Corporate & Foundation Engagement', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Kimberly Davis', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Corporate/foundation fundraising experience'], competencies: ['Corporate Relations', 'Foundation Grants', 'Partnership Development', 'Proposal Writing'], necessity: 'Cultivates corporate and foundation partnerships to secure major gifts and sponsored program support.', salaryBand: 'Director Band', salary: 118000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] },
        { id: 'adv-donor-relations', title: 'Director of Donor Relations & Stewardship', department: 'University Advancement', division: 'Division of University Advancement', holder: { name: 'Anika Madden', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Donor stewardship experience'], competencies: ['Donor Stewardship', 'Impact Reporting', 'Recognition Programs', 'Donor Retention'], necessity: 'Manages donor relations, stewardship programs, impact reporting, and recognition to retain and grow donor engagement.', salaryBand: 'Director Band', salary: 95000, salaryYear: 2025, directReports: 2, teamSize: 4, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * STRATEGIC PARTNERSHIPS & ECONOMIC DEVELOPMENT
     * ═══════════════════════════════════════════ */
    {
      id: 'strategic',
      title: 'Vice Chancellor for Strategic Partnerships & Economic Development',
      department: 'Strategic Partnerships',
      division: 'Division of Strategic Partnerships',
      holder: { name: 'Heidi Norman, M.S.', since: '2022', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['M.S. or MBA', 'Economic development and industry partnership experience'],
        competencies: ['Industry Partnerships', 'Economic Development', 'Strategic Marketing', 'Campus Enterprises'],
        necessity: 'Builds strategic industry partnerships, manages marketing/communications, and drives economic development initiatives for the Triad region.',
        salaryBand: 'Executive Band 2',
        salary: 235000,
        salaryYear: 2025,
        directReports: 3,
        teamSize: 25,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'sp-marcom', title: 'Director, Strategic Marketing & Communications', department: 'Strategic Partnerships', division: 'Division of Strategic Partnerships', holder: { name: 'Alana V. Allen', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Marketing or Communications'], competencies: ['Brand Management', 'Digital Marketing', 'Media Relations', 'Content Strategy'], necessity: 'Manages university brand, digital presence, media relations, and marketing campaigns.', salaryBand: 'Administrative Band 1', salary: 128000, salaryYear: 2025, directReports: 6, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sp-enterprises', title: 'Director, Campus Enterprises', department: 'Strategic Partnerships', division: 'Division of Strategic Partnerships', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Business Administration'], competencies: ['Auxiliary Services', 'Retail Operations', 'Dining Services', 'Revenue Generation'], necessity: 'Manages bookstore, dining, parking, and other revenue-generating campus enterprises.', salaryBand: 'Administrative Band 1', salary: 118000, salaryYear: 2025, directReports: 5, teamSize: 50, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sp-comms', title: 'Director, University Communications', department: 'University Relations', division: 'Division of Strategic Partnerships', holder: { name: 'Jamesia Harrison', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Communications or Journalism'], competencies: ['Internal Communications', 'Executive Communications', 'Publications', 'Photography'], necessity: 'Manages internal and executive communications, publications, graphic design, and photography.', salaryBand: 'Administrative Band 1', salary: 115000, salaryYear: 2025, directReports: 5, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sp-avc-relations', title: 'Associate VC for University Relations', department: 'Strategic Partnerships', division: 'Division of Strategic Partnerships', holder: { name: 'Todd Simmons', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s in Communications or Public Relations'], competencies: ['University Relations', 'Government Affairs', 'External Communications', 'Stakeholder Engagement'], necessity: 'Leads university relations, government affairs, and external stakeholder engagement initiatives.', salaryBand: 'Administrative Band 1', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 10, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sp-media', title: 'Director of Media Relations', department: 'Strategic Partnerships', division: 'Division of Strategic Partnerships', holder: { name: 'Jackie Torok', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Communications or Journalism'], competencies: ['Media Relations', 'Press Strategy', 'Crisis Communications', 'Spokesperson'], necessity: 'Manages media relations, press inquiries, crisis communications, and serves as university spokesperson.', salaryBand: 'Director Band', salary: 105000, salaryYear: 2025, directReports: 2, teamSize: 4, classification: 'EPA', custom: {} }, children: [] },
        { id: 'sp-digital', title: 'Director of Digital Content', department: 'Strategic Partnerships', division: 'Division of Strategic Partnerships', holder: { name: 'Tonya D. Dixon', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Digital Media or Communications'], competencies: ['Digital Content Strategy', 'Social Media', 'Web Content', 'Video Production'], necessity: 'Leads digital content strategy, social media presence, web content, and multimedia production.', salaryBand: 'Director Band', salary: 98000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * LEGAL, RISK & COMPLIANCE
     * ═══════════════════════════════════════════ */
    {
      id: 'legal',
      title: 'Interim Vice Chancellor, Legal, Risk & Compliance / General Counsel',
      department: 'Legal & Compliance',
      division: 'Division of Legal Affairs',
      holder: { name: 'Sheena J. Cobrand, J.D.', since: '2024', photo: null },
      status: 'interim',
      level: 2,
      metadata: {
        qualifications: ['J.D. from accredited law school', 'NC State Bar membership', 'Higher education law expertise'],
        competencies: ['Higher Education Law', 'Risk Management', 'Contract Negotiation', 'Title IX', 'Compliance'],
        necessity: 'Provides legal counsel to Chancellor, Board of Trustees, and all divisions. Manages institutional risk, compliance, and regulatory affairs.',
        salaryBand: 'Executive Band 2',
        salary: 245000,
        salaryYear: 2025,
        directReports: 4,
        teamSize: 12,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'legal-title-ix', title: 'Title IX Compliance Director', department: 'Legal & Compliance', division: 'Division of Legal Affairs', holder: { name: 'Breona M. Hayes, Ph.D.', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. or J.D.', 'Title IX investigation and compliance experience'], competencies: ['Title IX Compliance', 'Civil Rights', 'Investigation Management', 'Training & Prevention'], necessity: 'Ensures university compliance with Title IX regulations, manages investigations, and leads prevention and training programs.', salaryBand: 'Director Band', salary: 115000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] }
      ]
    },

    /* ═══════════════════════════════════════════
     * ASSOCIATE VC — EXTERNAL AFFAIRS (Chancellor's Office)
     * ═══════════════════════════════════════════ */
    {
      id: 'chanc-external',
      title: 'Associate VC for External Affairs',
      department: 'Executive',
      division: 'Office of the Chancellor',
      holder: { name: 'Oliver M. Thomas, Ph.D.', since: '2022', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Ph.D. in relevant field', 'Government relations experience'],
        competencies: ['Government Relations', 'Legislative Affairs', 'External Partnerships', 'Community Engagement'],
        necessity: 'Leads government relations, legislative affairs, and external partnerships on behalf of the Chancellor and the university.',
        salaryBand: 'Executive Band 3',
        salary: 175000,
        salaryYear: 2025,
        directReports: 3,
        teamSize: 6,
        classification: 'EPA',
        custom: {}
      },
      children: []
    },

    /* ═══════════════════════════════════════════
     * INTERCOLLEGIATE ATHLETICS
     * ═══════════════════════════════════════════ */
    {
      id: 'athletics',
      title: 'Director of Athletics',
      department: 'Athletics',
      division: 'Intercollegiate Athletics',
      holder: { name: 'Earl M. Hilton III', since: '2018', photo: null },
      status: 'filled',
      level: 2,
      metadata: {
        qualifications: ['Master\'s degree preferred', 'NCAA D-I athletics administration', 'Revenue sport management'],
        competencies: ['NCAA Compliance', 'Revenue Generation', 'Student-Athlete Welfare', 'Conference Relations'],
        necessity: 'Oversees 17 NCAA Division I varsity sports in the Coastal Athletic Association (CAA). Manages Aggie Stadium, Corbett Sports Center, and athletic facilities. Stepping down summer 2026; national search underway.',
        salaryBand: 'Executive Band 2',
        salary: 350000,
        salaryYear: 2025,
        directReports: 8,
        teamSize: 120,
        classification: 'EPA',
        custom: {}
      },
      children: [
        { id: 'ath-compliance', title: 'Director, Athletics Compliance', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Director', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'NCAA rules expertise'], competencies: ['NCAA Compliance', 'NIL Policy', 'Eligibility', 'Rules Education'], necessity: 'Ensures compliance with NCAA, CAA, and institutional rules across all sports programs.', salaryBand: 'Administrative Band 2', salary: 105000, salaryYear: 2025, directReports: 3, teamSize: 5, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-swa', title: 'Senior Woman Administrator', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'SWA', since: '', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'Athletics administration experience'], competencies: ['Title IX', 'Gender Equity', 'Athletic Administration', 'Student-Athlete Development'], necessity: 'NCAA-required position ensuring gender equity and representing women in athletics leadership.', salaryBand: 'Administrative Band 1', salary: 125000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-aad-health', title: 'Assoc. AD, Student-Athlete Health & Sports Performance', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Janah Fletcher, Ph.D.', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Ph.D. in Sports Medicine or Kinesiology'], competencies: ['Sports Medicine', 'Athletic Training', 'Performance Science', 'Student-Athlete Wellness'], necessity: 'Oversees student-athlete health, sports medicine, athletic training, and sports performance programs.', salaryBand: 'Athletics Band', salary: 135000, salaryYear: 2025, directReports: 6, teamSize: 15, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-aad-facilities', title: 'Assoc. AD, Facilities & Game Day Operations', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Billy Edringston', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Athletic facilities management experience'], competencies: ['Facility Management', 'Game Day Operations', 'Event Management', 'Capital Projects'], necessity: 'Manages athletic facilities, game day operations, and event management for all sports venues.', salaryBand: 'Athletics Band', salary: 125000, salaryYear: 2025, directReports: 5, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-aad-compliance', title: 'Assoc. AD, Compliance', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Cory Lima', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Master\'s degree', 'NCAA compliance expertise'], competencies: ['NCAA Rules', 'NIL Compliance', 'Eligibility Certification', 'Monitoring'], necessity: 'Leads athletics compliance operations ensuring adherence to NCAA, CAA, and institutional regulations.', salaryBand: 'Athletics Band', salary: 118000, salaryYear: 2025, directReports: 3, teamSize: 6, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-aad-comms', title: 'Assoc. AD, Communications', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Brian Holloway', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s in Communications or Journalism'], competencies: ['Sports Information', 'Media Relations', 'Digital Content', 'Broadcasting'], necessity: 'Manages athletics communications, sports information, media relations, and digital content across all sports.', salaryBand: 'Athletics Band', salary: 112000, salaryYear: 2025, directReports: 4, teamSize: 8, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-football', title: 'Head Football Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Shawn Gibbs', since: '2024', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'D-I coaching experience'], competencies: ['Football Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the Aggies football program, the university\'s highest-profile revenue sport and fan engagement driver.', salaryBand: 'Athletics Band', salary: 450000, salaryYear: 2025, directReports: 12, teamSize: 120, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-mbb', title: 'Head Men\'s Basketball Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Monté Ross', since: '2024', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'D-I coaching experience'], competencies: ['Basketball Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the men\'s basketball program, a key revenue and visibility sport for the university.', salaryBand: 'Athletics Band', salary: 375000, salaryYear: 2025, directReports: 6, teamSize: 20, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-wbb', title: 'Head Women\'s Basketball Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Tarrell Robinson', since: '2022', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'D-I coaching experience'], competencies: ['Basketball Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the women\'s basketball program, driving athletic excellence and Title IX equity.', salaryBand: 'Athletics Band', salary: 285000, salaryYear: 2025, directReports: 5, teamSize: 18, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-track', title: 'Director of Track & Field Programs', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Allen Johnson', since: '2019', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Elite track & field coaching experience', 'Olympic-level athlete/coach preferred'], competencies: ['Track & Field Coaching', 'Sprint/Hurdles', 'Recruiting', 'Olympic Development'], necessity: 'Olympic gold medalist leading the Aggies\' storied track & field program with national championship pedigree.', salaryBand: 'Athletics Band', salary: 165000, salaryYear: 2025, directReports: 4, teamSize: 60, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-baseball', title: 'Head Baseball Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Ben Hall', since: '2020', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Collegiate baseball coaching experience'], competencies: ['Baseball Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the Aggies baseball program competing in the CAA conference.', salaryBand: 'Athletics Band', salary: 125000, salaryYear: 2025, directReports: 3, teamSize: 40, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-softball', title: 'Head Softball Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Jose Gonzalez Jr.', since: '2021', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Collegiate softball coaching experience'], competencies: ['Softball Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the Aggies softball program, building competitive excellence in the CAA.', salaryBand: 'Athletics Band', salary: 115000, salaryYear: 2025, directReports: 3, teamSize: 25, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-volleyball', title: 'Head Volleyball Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Hal Clifton', since: '2018', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Collegiate volleyball coaching experience'], competencies: ['Volleyball Program Leadership', 'Recruiting', 'Player Development', 'Game Strategy'], necessity: 'Leads the Aggies volleyball program competing in the CAA conference.', salaryBand: 'Athletics Band', salary: 105000, salaryYear: 2025, directReports: 2, teamSize: 18, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-bowling', title: 'Head Bowling Coach', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Kim Terrell-Kearney', since: '2019', photo: null }, status: 'filled', level: 3, metadata: { qualifications: ['Bachelor\'s degree', 'Competitive bowling coaching experience'], competencies: ['Bowling Program Leadership', 'Recruiting', 'Player Development', 'Tournament Strategy'], necessity: 'Leads the nationally competitive Aggies bowling program.', salaryBand: 'Athletics Band', salary: 92000, salaryYear: 2025, directReports: 1, teamSize: 12, classification: 'EPA', custom: {} }, children: [] },
        { id: 'ath-bands', title: 'Interim Director of Bands', department: 'Athletics', division: 'Intercollegiate Athletics', holder: { name: 'Aaron J. Campbell', since: '2024', photo: null }, status: 'interim', level: 3, metadata: { qualifications: ['Master\'s in Music Education or Performance'], competencies: ['Marching Band Direction', 'Music Performance', 'Show Design', 'Student Development'], necessity: 'Directs the Blue & Gold Marching Machine, one of the most iconic HBCU marching bands in the nation.', salaryBand: 'Athletics Band', salary: 110000, salaryYear: 2025, directReports: 4, teamSize: 300, classification: 'EPA', custom: {} }, children: [] }
      ]
    }
  ]
};
