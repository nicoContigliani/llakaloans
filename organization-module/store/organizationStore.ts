// organization-module/store/organizationStore.ts
import { create } from 'zustand';
import { Company, UserWithRoles, Role } from '../types/organization';

interface OrganizationState {
  // Estado
  companies: Company[];
  users: UserWithRoles[];
  roles: Role[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  
  // Acciones
  setCompanies: (companies: Company[]) => void;
  setUsers: (users: UserWithRoles[]) => void;
  setRoles: (roles: Role[]) => void;
  setSelectedCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Acciones compuestas
  addCompany: (company: Company) => void;
  updateCompany: (companyId: string, updateData: Partial<Company>) => void;
  removeCompany: (companyId: string) => void;
  addUser: (user: UserWithRoles) => void;
  updateUserStatus: (userId: string, companyId: string, status: 'active' | 'suspended') => void;
  removeUser: (userId: string, companyId: string) => void;
  clearError: () => void;
  reset: () => void;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  // Estado inicial
  companies: [],
  users: [],
  roles: [],
  selectedCompany: null,
  loading: false,
  error: null,

  // Acciones básicas
  setCompanies: (companies) => set({ companies }),
  setUsers: (users) => set({ users }),
  setRoles: (roles) => set({ roles }),
  setSelectedCompany: (selectedCompany) => set({ selectedCompany }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Acciones compuestas
  addCompany: (company) => {
    const { companies } = get();
    set({ companies: [...companies, company] });
  },

  updateCompany: (companyId, updateData) => {
    const { companies } = get();
    set({
      companies: companies.map(company =>
        company._id === companyId ? { ...company, ...updateData } : company
      )
    });
  },

  removeCompany: (companyId) => {
    const { companies, selectedCompany } = get();
    const updatedCompanies = companies.filter(company => company._id !== companyId);
    
    set({ 
      companies: updatedCompanies,
      selectedCompany: selectedCompany?._id === companyId ? null : selectedCompany
    });
  },

  addUser: (user) => {
    const { users } = get();
    if (!users.find(u => u.user_id === user.user_id)) {
      set({ users: [...users, user] });
    }
  },

  updateUserStatus: (userId, companyId, status) => {
    const { users } = get();
    set({
      users: users.map(user => {
        if (user.user_id === userId) {
          return {
            ...user,
            companies: user.companies.map(company => 
              company.company_id === companyId 
                ? { ...company, status }
                : company
            )
          };
        }
        return user;
      })
    });
  },

  removeUser: (userId, companyId) => {
    const { users } = get();
    set({
      users: users.map(user => ({
        ...user,
        companies: user.companies.filter(comp => 
          !(comp.company_id === companyId && user.user_id === userId)
        )
      })).filter(user => user.companies.length > 0)
    });
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    companies: [],
    users: [],
    roles: [],
    selectedCompany: null,
    loading: false,
    error: null
  })
}));