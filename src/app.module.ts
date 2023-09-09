import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'todouser',
      password: 'todouser123',
      database: 'todo_dash',
      entities: [User, Profile],
      synchronize: true, // auto update the database when modifying
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // ----
}

// takes the types of class and
// mapping it with the corresponding
// tables with corresponding column
// based on what you defined in that class

// Controllers is using for handling upcoming requests
// Services is using for impleminting the logic
