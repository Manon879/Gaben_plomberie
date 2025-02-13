import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

interface Admin {
  id: number;
  email: string;
  password: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  picture: string;
}

class AdminRepository {
  async create(admin: Omit<Admin, "id">) {
    const [result] = await databaseClient.execute<Result>(
      `INSERT INTO admin (email, password)
      VALUES (?, ?)`,
      [admin.email, admin.password],
    );

    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM admin
      WHERE id = ?`,
      [id],
    );

    return rows[0] as Admin;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT id, email
      FROM admin `,
    );

    return rows as Admin[];
  }

  async update(admin: Admin) {
    const [rows] = await databaseClient.execute<Result>(
      `UPDATE admin
      SET email = ?, password = ? 
      WHERE id = ?`,
      [admin.email, admin.password, admin.id],
    );
    return rows.affectedRows > 0;
  }

  async delete(adminId: number) {
    const [result] = await databaseClient.execute<Result>(
      `DELETE FROM admin
      WHERE id = ?`,
      [adminId],
    );
    return result.affectedRows;
  }

  async createService(service: Omit<Service, "id">) {
    const [result] = await databaseClient.execute<Result>(
      `INSERT INTO service (title, description, picture)
      VALUES (?, ?, ?)`,
      [service.title, service.description, service.picture],
    );
    return result.insertId;
  }
  async getServiceById(serviceId: number) {
    const [rows] = await databaseClient.execute<Rows>(
      `SELECT * 
      FROM service 
      WHERE id = ?`,
      [serviceId],
    );
    return rows[0] as Service;
  }

  async getAllServices() {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * 
      FROM service`,
    );
    return rows as Service[];
  }
  async updateService(
    serviceId: number,
    service: Partial<Omit<Service, "id">>,
  ) {
    const existingService = await this.getServiceById(serviceId);
    if (!existingService) {
      throw new Error("Service non trouvé");
    }

    const updatedService = {
      title: service.title ?? existingService.title,
      description: service.description ?? existingService.description,
      picture: service.picture ?? existingService.picture,
    };

    const [result] = await databaseClient.execute<Result>(
      `UPDATE service 
      SET title = ?, description = ?, picture = ?
      WHERE id = ?`,
      [
        updatedService.title,
        updatedService.description,
        updatedService.picture,
        serviceId,
      ],
    );

    return result.affectedRows > 0;
  }
  async deleteService(serviceId: number): Promise<boolean> {
    const [result] = await databaseClient.execute<Result>(
      `DELETE FROM service
       WHERE id = ?`,
      [serviceId],
    );

    return result.affectedRows > 0;
  }

  async updateServicePicture(serviceId: number, picture: string) {
    const [result] = await databaseClient.execute<Result>(
      `UPDATE service 
      SET picture = ?
      WHERE id = ?`,
      [picture, serviceId],
    );

    return result.affectedRows > 0;
  }
}

export default new AdminRepository();
