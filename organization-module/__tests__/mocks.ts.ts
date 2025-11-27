export const mockCompany = {
  _id: 'company123',
  name: 'Test Company',
  slug: 'test-company',
  contact_email: 'test@company.com',
  status: 'active' as const,
  created_by: 'user123',
  created_at: new Date(),
  updated_at: new Date()
};

export const mockUser = {
  user_id: 'user123',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  companies: [{
    company_id: 'company123',
    company_name: 'Test Company',
    roles: ['admin' as const],
    status: 'active'
  }]
};

export const mockRole = {
  _id: 'role123',
  name: 'admin' as const,
  description: 'Administrator',
  permissions: ['user:manage'],
  hierarchy_level: 80
};