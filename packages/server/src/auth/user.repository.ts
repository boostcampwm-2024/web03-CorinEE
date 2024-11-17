import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { AccountRepository } from 'src/account/account.repository';

@Injectable()
export class UserRepository extends Repository<User>{
    constructor(
      private dataSource: DataSource,
      private accountRepository: AccountRepository
    ){
      super(User, dataSource.createEntityManager());
    }
    async createAdminUser() {
      const adminUser = new User();
      adminUser.username = 'admin';
      await this.save(adminUser);
      console.log('Admin user created successfully.');

      await this.accountRepository.createAccountForAdmin(adminUser);
    }
    async getUser(userId){
      return await this.findOne({
        where: { id: userId },
      });
    }
}