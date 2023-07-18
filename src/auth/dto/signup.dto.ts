import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'The first name of the user', example: 'Jane' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'janedoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '07012345678',
  })
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  phone: string;

  @ApiProperty({
    description: 'The second phone number of the user',
    example: '07012345678',
  })
  @MinLength(11)
  @MaxLength(11)
  secondPhone: string;

  @ApiProperty({
    description: 'The gender of the user',
    example: Gender.Female,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'The date of birth of the user',
    example: '2000-04-17T11:48:24.830Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '221B Baker Street',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The department of the user',
    example: 'Computer Science and Engineering',
  })
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'The level of the user', example: 100 })
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    description: 'The next of kin of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  nextOfKinName: string;

  @ApiProperty({
    description: 'The next of kin phone number of the user',
    example: '07012345678',
  })
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  nextOfKinPhone: string;

  @ApiProperty({
    description: 'The next of kin relationship with the user',
    example: 'Brother',
  })
  @IsNotEmpty()
  nextOfKinRelationship: string;

  @ApiProperty({ description: 'The password of the user', example: 'password' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
