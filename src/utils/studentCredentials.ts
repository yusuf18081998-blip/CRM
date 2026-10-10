import { Student } from '../types';

/**
 * Uzbek Latin text sanitization for clean usernames & passwords
 * Removes apostrophes (o', g'), accents, spaces, and special symbols
 */
export function cleanUzbekText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/o['‘’`]/g, 'o')
    .replace(/g['‘’`]/g, 'g')
    .replace(/sh/g, 'sh')
    .replace(/ch/g, 'ch')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['‘’`]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Generates a unique, non-colliding login (username) based on student's full name.
 * Example:
 * "Jasur To'xtayev" -> "jasur_toxtayev"
 * "Jasur To'xtayev" (2nd student) -> "jasur_toxtayev2"
 */
export function generateUniqueUsername(
  fullName: string,
  existingStudents: Student[],
  currentStudentId?: string
): string {
  const cleaned = cleanUzbekText(fullName);
  const parts = cleaned.split(/\s+/).filter(Boolean);

  let baseLogin = 'oqvchi';
  if (parts.length >= 2) {
    baseLogin = `${parts[0]}_${parts[1]}`;
  } else if (parts.length === 1) {
    baseLogin = parts[0];
  }

  baseLogin = baseLogin.slice(0, 24);

  const isUsernameTaken = (candidate: string) =>
    existingStudents.some(
      (s) => s.id !== currentStudentId && s.username.toLowerCase() === candidate.toLowerCase()
    );

  if (!isUsernameTaken(baseLogin)) {
    return baseLogin;
  }

  let counter = 2;
  while (isUsernameTaken(`${baseLogin}${counter}`)) {
    counter++;
  }
  return `${baseLogin}${counter}`;
}

/**
 * Generates a unique, non-colliding password based on student's full name.
 * Default pattern uses the student's name + 2013 (user's preferred year).
 * Example:
 * "Jasur To'xtayev" -> "jasur2013"
 * "Jasur Karimov" (if jasur2013 is taken) -> "toxtayev2013" or "jasur2013_2"
 */
export function generateUniquePassword(
  fullName: string,
  existingStudents: Student[],
  currentStudentId?: string
): string {
  const cleaned = cleanUzbekText(fullName);
  const parts = cleaned.split(/\s+/).filter(Boolean);

  const firstName = parts[0] || 'talaba';
  const lastName = parts[1] || '';

  const isPasswordTaken = (candidate: string) =>
    existingStudents.some((s) => s.id !== currentStudentId && s.password === candidate);

  // Candidate 1: ism2013 (e.g. jasur2013)
  const candidate1 = `${firstName}2013`;
  if (!isPasswordTaken(candidate1)) {
    return candidate1;
  }

  // Candidate 2: familiya2013 (e.g. toxtayev2013)
  if (lastName) {
    const candidate2 = `${lastName}2013`;
    if (!isPasswordTaken(candidate2)) {
      return candidate2;
    }
  }

  // Candidate 3: ism_familiya bosh harfi + 2013 (e.g. jasur_t2013)
  if (lastName) {
    const candidate3 = `${firstName}_${lastName.charAt(0)}2013`;
    if (!isPasswordTaken(candidate3)) {
      return candidate3;
    }
  }

  // Suffix increment if needed
  let counter = 2;
  while (isPasswordTaken(`${firstName}2013_${counter}`)) {
    counter++;
  }
  return `${firstName}2013_${counter}`;
}
