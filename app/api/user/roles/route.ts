// app/api/user/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    console.log('Fetching roles for user:', user.id);

    // Buscar empleados asociados a este usuario
    const employees = await db.collection('employees')
      .find({ user_id: user.id })
      .toArray();

    console.log('Found employees:', employees.length);

    if (employees.length === 0) {
      return NextResponse.json({ 
        user_id: user.id,
        companies: [] 
      });
    }

    // Obtener información de empresas y roles
    const companiesWithRoles = await Promise.all(
      employees.map(async (employee) => {
        try {
          const company = await db.collection('companies')
            .findOne({ _id: new ObjectId(employee.company_id) });

          if (!company) {
            console.log('Company not found for ID:', employee.company_id);
            return null;
          }

          // Obtener roles específicos
          const roleObjectIds = employee.role_ids.map((id: string) => {
            try {
              return new ObjectId(id);
            } catch (error) {
              console.error('Invalid ObjectId:', id);
              return null;
            }
          }).filter(Boolean);

          const roles = await db.collection('roles')
            .find({ 
              _id: { $in: roleObjectIds } 
            })
            .toArray();

          return {
            company_id: employee.company_id,
            company_name: company.name,
            roles: roles.map(role => role.name),
            status: employee.status
          };
        } catch (error) {
          console.error('Error processing employee:', error);
          return null;
        }
      })
    );

    const validCompanies = companiesWithRoles.filter(Boolean);

    console.log('Valid companies:', validCompanies.length);

    const userWithRoles = {
      user_id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      first_name: user.firstName || '',
      last_name: user.lastName || '',
      companies: validCompanies
    };

    return NextResponse.json(userWithRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}