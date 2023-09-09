import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Profile } from 'src/typeorm/entities/Profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {
    // ---
  }

  findUsers() {
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser); // asyncronance method
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new HttpException(
        "User Not Found! Can't Delete Profile. ",
        HttpStatus.BAD_REQUEST,
      );

    return this.userRepository.delete({ id });
  }

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user)
      throw new HttpException(
        "User Not Found! Can't Create Profile. ",
        HttpStatus.BAD_REQUEST,
      );

    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);

    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
