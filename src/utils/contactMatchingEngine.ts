// Utility to clean phone numbers down to 10 standard digits
export function cleanPhoneNumber(raw: string | number | null | undefined): string {
  if (!raw) return '';
  const str = String(raw).trim();
  // Remove non-numeric characters
  const digits = str.replace(/\D/g, '');
  // If starts with 91 and has 12 digits, strip 91
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If starts with 0 and has 11 digits, strip 0
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  // Return last 10 digits if longer
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

// Extract multiple possible phone numbers from a messy string (e.g. "9106465869---9327115508")
export function extractAllPhoneNumbers(raw: string | number | null | undefined): string[] {
  if (!raw) return [];
  const str = String(raw).trim();
  const tokens = str.split(/[\s,;/\\-]+/);
  const found: string[] = [];

  for (const token of tokens) {
    const cleaned = cleanPhoneNumber(token);
    if (cleaned.length === 10 && !found.includes(cleaned)) {
      found.push(cleaned);
    }
  }

  // Also check if entire string cleaned is 10 digits
  const entireCleaned = cleanPhoneNumber(str);
  if (entireCleaned.length === 10 && !found.includes(entireCleaned)) {
    found.push(entireCleaned);
  }

  return found;
}

// Normalize student names for comparison
export function normalizeName(name: string | null | undefined): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(mr|ms|mrs|miss|master|dr|enq)\b\.?/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type MatchTier =
  | 'Self Mobile Match'
  | 'Parent 1 Mobile Match'
  | 'Parent 2 Mobile Match'
  | 'Normalized Name Match'
  | 'No Match (Open Lead)';

export interface InterconnectionResult {
  enquiryId: string;
  enquiryTimestamp: string;
  enquiryName: string;
  enquiryStudentMobile: string;
  enquiryParent1Mobile: string;
  enquiryParent2Mobile: string;
  inquiredCourse: string;
  marketingSource: string;
  counsellor: string;
  preferredBranch: string;
  // Match results
  isConverted: boolean;
  matchTier: MatchTier;
  matchedStudentId?: string;
  matchedStudentName?: string;
  matchedCourseEnrolled?: string;
  matchedBranch?: string;
  matchedAdmissionDate?: string;
  totalFeesPaid?: number;
  feeStatus?: string;
  conversionDaysLag?: number;
}

export interface InterconnectionSummary {
  totalEnquiries: number;
  totalAdmissions: number;
  totalMatchedConversions: number;
  overallConversionRatePct: number;
  matchesByTier: {
    selfMobile: number;
    parent1Mobile: number;
    parent2Mobile: number;
    name: number;
  };
  sourceBreakdown: { source: string; total: number; converted: number; ratePct: number }[];
  counsellorBreakdown: { counsellor: string; total: number; converted: number; ratePct: number }[];
  branchBreakdown: { branch: string; totalEnquiries: number; totalAdmitted: number }[];
  averageConversionDays: number;
}

export function matchEnquiriesWithStudents(
  enquiries: Record<string, any>[],
  students: Record<string, any>[]
): {
  results: InterconnectionResult[];
  summary: InterconnectionSummary;
} {
  // 1. Build lookup tables from students
  const studentByMobile = new Map<string, Record<string, any>>();
  const studentByName = new Map<string, Record<string, any>>();

  for (const s of students) {
    const studentMobile = cleanPhoneNumber(
      s.Mobile_Number || s.mobile || s.Mobile || s.student_mobile || s.contact_number
    );
    if (studentMobile && studentMobile.length === 10) {
      studentByMobile.set(studentMobile, s);
    }

    const parentMobile = cleanPhoneNumber(
      s.Parent_Mobile || s.parent_mobile || s.guardian_mobile || s.mobile_parent
    );
    if (parentMobile && parentMobile.length === 10) {
      studentByMobile.set(parentMobile, s);
    }

    const normName = normalizeName(s.Student_Name || s.name || s.student_name);
    if (normName.length > 2) {
      studentByName.set(normName, s);
    }
  }

  // 2. Iterate through enquiries and match
  const results: InterconnectionResult[] = [];
  let selfMobileMatches = 0;
  let parent1Matches = 0;
  let parent2Matches = 0;
  let nameMatches = 0;
  let totalConversionLagDays = 0;
  let lagCount = 0;

  const sourceCounts: Record<string, { total: number; converted: number }> = {};
  const counsellorCounts: Record<string, { total: number; converted: number }> = {};
  const branchCounts: Record<string, { total: number; admitted: number }> = {};

  enquiries.forEach((enq, index) => {
    const enqTimestamp = enq.Timestamp || enq.enquiry_timestamp || '';
    const enqName = enq.Name || enq.name || enq.student_name || `Lead #${index + 1}`;
    const enqSelfMobile = cleanPhoneNumber(
      enq['Mobile No (Student)'] || enq.mobile || enq.Mobile || enq.student_mobile
    );
    const enqParent1Mobile = cleanPhoneNumber(
      enq['Mobile No (Parent / guardian 1)'] || enq.parent1_mobile || enq.parent_mobile
    );
    const enqParent2Mobile = cleanPhoneNumber(
      enq['Mobile No (Parent / guardian 2)'] || enq.parent2_mobile
    );
    const inquiredCourse = enq['Which Course do you want to Learn ?'] || enq.course || enq.Course || 'General';
    const rawSource = (enq['From Where Do You Know About Us ? (Google, Social Media, Friends, Old students, etc...)'] ||
      enq.source ||
      enq['From Where Do You Know About Us ?'] ||
      'Google / Direct').trim();
    const source = rawSource.split(',')[0].trim() || 'Google / Direct';
    const counsellor = (enq['Counsellor Name'] || enq.counsellor || enq.Faculty || enq.faculty || 'Admissions Desk').trim();
    const preferredBranch = (enq['Preferred Branch '] || enq.Preferred_Branch || enq.branch || 'Vesu').trim();

    // Track counts
    if (!sourceCounts[source]) sourceCounts[source] = { total: 0, converted: 0 };
    sourceCounts[source].total++;

    if (!counsellorCounts[counsellor]) counsellorCounts[counsellor] = { total: 0, converted: 0 };
    counsellorCounts[counsellor].total++;

    if (!branchCounts[preferredBranch]) branchCounts[preferredBranch] = { total: 0, admitted: 0 };
    branchCounts[preferredBranch].total++;

    // Cascade matching
    let matchedStudent: Record<string, any> | undefined;
    let matchTier: MatchTier = 'No Match (Open Lead)';

    // Step A: Self mobile match
    if (enqSelfMobile && studentByMobile.has(enqSelfMobile)) {
      matchedStudent = studentByMobile.get(enqSelfMobile);
      matchTier = 'Self Mobile Match';
      selfMobileMatches++;
    }
    // Step B: Parent 1 mobile match
    else if (enqParent1Mobile && studentByMobile.has(enqParent1Mobile)) {
      matchedStudent = studentByMobile.get(enqParent1Mobile);
      matchTier = 'Parent 1 Mobile Match';
      parent1Matches++;
    }
    // Step C: Parent 2 mobile match
    else if (enqParent2Mobile && studentByMobile.has(enqParent2Mobile)) {
      matchedStudent = studentByMobile.get(enqParent2Mobile);
      matchTier = 'Parent 2 Mobile Match';
      parent2Matches++;
    }
    // Step D: Normalized name match
    else {
      const normEnqName = normalizeName(enqName);
      if (normEnqName && studentByName.has(normEnqName)) {
        matchedStudent = studentByName.get(normEnqName);
        matchTier = 'Normalized Name Match';
        nameMatches++;
      } else {
        // Partial name token search
        for (const [key, s] of studentByName.entries()) {
          if (normEnqName.length > 4 && (key.includes(normEnqName) || normEnqName.includes(key))) {
            matchedStudent = s;
            matchTier = 'Normalized Name Match';
            nameMatches++;
            break;
          }
        }
      }
    }

    const isConverted = !!matchedStudent;

    if (isConverted) {
      sourceCounts[source].converted++;
      counsellorCounts[counsellor].converted++;
      const enrolledBranch = matchedStudent.Branch || matchedStudent.branch || preferredBranch;
      if (branchCounts[enrolledBranch]) {
        branchCounts[enrolledBranch].admitted++;
      }
    }

    // Calculate lag in days
    let conversionDaysLag: number | undefined;
    if (isConverted && matchedStudent.Admission_Date && enqTimestamp) {
      const enqDate = new Date(enqTimestamp);
      const admDate = new Date(matchedStudent.Admission_Date);
      if (!isNaN(enqDate.getTime()) && !isNaN(admDate.getTime())) {
        const diffMs = admDate.getTime() - enqDate.getTime();
        const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
        conversionDaysLag = Math.max(0, days);
        totalConversionLagDays += conversionDaysLag;
        lagCount++;
      }
    }

    results.push({
      enquiryId: `ENQ-${String(index + 1).padStart(4, '0')}`,
      enquiryTimestamp: enqTimestamp,
      enquiryName: enqName,
      enquiryStudentMobile: enqSelfMobile,
      enquiryParent1Mobile: enqParent1Mobile,
      enquiryParent2Mobile: enqParent2Mobile,
      inquiredCourse,
      marketingSource: source,
      counsellor,
      preferredBranch,
      isConverted,
      matchTier,
      matchedStudentId: matchedStudent ? String(matchedStudent.Student_ID || matchedStudent.student_id || matchedStudent.id) : undefined,
      matchedStudentName: matchedStudent ? String(matchedStudent.Student_Name || matchedStudent.name) : undefined,
      matchedCourseEnrolled: matchedStudent ? String(matchedStudent.Course_Name || matchedStudent.course) : undefined,
      matchedBranch: matchedStudent ? String(matchedStudent.Branch || matchedStudent.branch) : undefined,
      matchedAdmissionDate: matchedStudent ? String(matchedStudent.Admission_Date || matchedStudent.admission_date) : undefined,
      totalFeesPaid: matchedStudent ? Number(matchedStudent.Total_Fees_Paid || matchedStudent.paidAmt || matchedStudent.total_fees || 0) : undefined,
      feeStatus: matchedStudent ? String(matchedStudent.Fee_Status || matchedStudent.status || matchedStudent.fee_status) : undefined,
      conversionDaysLag,
    });
  });

  const totalMatchedConversions = selfMobileMatches + parent1Matches + parent2Matches + nameMatches;
  const overallConversionRatePct = enquiries.length > 0
    ? Number(((totalMatchedConversions / enquiries.length) * 100).toFixed(1))
    : 0;

  const sourceBreakdown = Object.entries(sourceCounts).map(([source, stats]) => ({
    source: source || 'Direct / Walk-in',
    total: stats.total,
    converted: stats.converted,
    ratePct: stats.total > 0 ? Number(((stats.converted / stats.total) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.total - a.total);

  const counsellorBreakdown = Object.entries(counsellorCounts).map(([counsellor, stats]) => ({
    counsellor: counsellor || 'General Desk',
    total: stats.total,
    converted: stats.converted,
    ratePct: stats.total > 0 ? Number(((stats.converted / stats.total) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.converted - a.converted);

  const branchBreakdown = Object.entries(branchCounts).map(([branch, stats]) => ({
    branch: branch || 'Vesu',
    totalEnquiries: stats.total,
    totalAdmitted: stats.admitted,
  }));

  const averageConversionDays = lagCount > 0 ? Math.round(totalConversionLagDays / lagCount) : 14;

  return {
    results,
    summary: {
      totalEnquiries: enquiries.length,
      totalAdmissions: students.length,
      totalMatchedConversions,
      overallConversionRatePct,
      matchesByTier: {
        selfMobile: selfMobileMatches,
        parent1Mobile: parent1Matches,
        parent2Mobile: parent2Matches,
        name: nameMatches,
      },
      sourceBreakdown,
      counsellorBreakdown,
      branchBreakdown,
      averageConversionDays,
    },
  };
}
