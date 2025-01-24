import { HttpStatus } from '@nestjs/common';
import { ErrorDto } from './error.dto';


export class MenuItemIdNotFoundException extends ErrorDto {
  constructor(menuItemId: string) {
    super(HttpStatus.NOT_FOUND, 'MenuItem not found', `"${menuItemId}" is not a valid menu item Id`);
  }
}
