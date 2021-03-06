import React from 'react';

import { EnterprisePage } from '../enterprise-page';
import { Layout } from '../layout';
import { UserSubsidy } from '../enterprise-user-subsidy';
import { EnterpriseBanner } from '../enterprise-banner';
import Dashboard from './Dashboard';

export default function DashboardPage() {
  return (
    <EnterprisePage>
      <Layout>
        <EnterpriseBanner />
        <UserSubsidy>
          <Dashboard />
        </UserSubsidy>
      </Layout>
    </EnterprisePage>
  );
}
