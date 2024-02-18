import { Solver } from './solver';

const getHash = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(10)).join('');
};

export const getTodaysDate = () => {
  const addDays = 0;
  const secondsPerDay = 60 * 60 * 24 * 1000;
  return Date.now() - (Date.now() % secondsPerDay) + (addDays || 0) * secondsPerDay; // Today, midnight
};

const getTodaysHash = async () => {
  const seed = getTodaysDate();
  const hash = await getHash(seed.toString());
  return hash;
};

const bigguns = [10, 25, 50, 100];

export const getTodaysCandidates = async () => {
  const hash = await getTodaysHash();
  const uniqDigits = [
    ...new Set(
      hash
        .split('')
        .map((n) => parseInt(n, 10))
        .filter((n) => n)
    ),
  ];

  let i = 0;
  const candidates = [bigguns[uniqDigits[i++] % bigguns.length]]; // First biggun

  // Add a second, unique biggun
  while (candidates.length === 1) {
    const biggunCandidate = bigguns[uniqDigits[i++] % bigguns.length];

    if (biggunCandidate !== candidates[0]) {
      candidates.push(biggunCandidate);
    }
  }

  // Add four more smalls
  // eslint-disable-next-line prefer-spread
  candidates.push.apply(candidates, uniqDigits.slice(i, i + 4));

  candidates.sort((a, b) => b - a);

  return candidates;
};

/**
 * Finds the first run of three digits in the hash (right-to-left) that don't start with 0 and are a solvable target with today's candidates
 */
export const getTodaysTarget = async () => {
  const hash = await getTodaysHash();
  const candidates = await getTodaysCandidates();

  const solve = (n: number) => {
    const solveResult = Solver.findSolutions(candidates, n);
    return { value: n, solveResult };
  };

  for (let i = hash.length - 3; i >= 0; i--) {
    const threeDigits = hash.slice(i, i + 3);
    const n = parseInt(threeDigits, 10);

    if (n > 300) {
      const targetCandidate = solve(n);
      if (targetCandidate.solveResult.solutions.length > 0) {
        return targetCandidate;
      }
    }
  }

  // I can't imagine that none of the candidates in the hash is solvable, but just in case...
  for (let i = 999; i > 0; i--) {
    const targetCandidate = solve(i);
    if (targetCandidate.solveResult.solutions.length > 0) {
      return targetCandidate;
    }
  }
};
