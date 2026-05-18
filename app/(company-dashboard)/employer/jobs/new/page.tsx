import { Suspense } from 'react';
import EmployerJobWizard from './employer-job-wizard';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployerJobWizard />
    </Suspense>
  );
}