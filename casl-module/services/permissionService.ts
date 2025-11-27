import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export interface UserPermissions {
  [subject: string]: string[];
}

export const permissionService = {
  async getUserPermissions(userId: string, empresaId: string): Promise<UserPermissions> {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      const permissions = await db.collection('empresa_permissions').findOne({
        user_id: userId,
        empresa_id: new ObjectId(empresaId)
      });

      return permissions?.permissions || {};
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return {};
    }
  },

  async updateUserPermissions(
    userId: string, 
    empresaId: string, 
    permissions: UserPermissions
  ): Promise<boolean> {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      await db.collection('empresa_permissions').updateOne(
        {
          user_id: userId,
          empresa_id: new ObjectId(empresaId)
        },
        {
          $set: { 
            permissions,
            updated_at: new Date()
          }
        },
        { upsert: true }
      );

      return true;
    } catch (error) {
      console.error('Error updating permissions:', error);
      return false;
    }
  },

  async getUsersByEmpresa(empresaId: string): Promise<any[]> {
    try {
      const client = await clientPromise;
      const db = client.db();
      
      const users = await db.collection('empresa_permissions')
        .find({ empresa_id: new ObjectId(empresaId) })
        .toArray();

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};