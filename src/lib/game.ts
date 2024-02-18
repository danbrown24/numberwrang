import { Operator } from './miscellaneous';

export interface NumberObject {
  id: number;
  value: number;
  isCandidate?: boolean;
  isUsed?: boolean;
  isStatic?: boolean;
}

export interface Step {
  lhsNumberId: number;
  operator?: Operator;
  rhsNumberId?: number;
  resultNumberId?: number;
}

const stepToJson = (step: Step, numbers: NumberObject[]) => {
  return [numbers.find((n) => n.id === step.lhsNumberId)?.value, step.operator, numbers.find((n) => n.id === step.rhsNumberId)?.value] as [
    number,
    Operator,
    number
  ];
};

export const stepsToJson = (steps: Step[], numbers: NumberObject[]) => {
  return steps.map((step) => stepToJson(step, numbers));
};

export const operation = (lhs: number, operator: Operator, rhs: number) => {
  const result = ((op) => {
    switch (op) {
      case '*':
        return lhs * rhs;
      case '/':
        return lhs / rhs;
      case '+':
        return lhs + rhs;
      case '-':
        return lhs - rhs;
    }
  })(operator);

  return {
    result: result,
    valid: Math.round(result) === result && result > 0 && result < 9999, // Disallow numbers below zero and above 9999
  };
};
