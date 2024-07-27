import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOneField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          return Object.keys(object).some(
            (key) =>
              object[key] !== undefined &&
              object[key] !== null &&
              object[key] !== '',
          );
        },
        defaultMessage(args: ValidationArguments) {
          return 'At least one field must be provided';
        },
      },
    });
  };
}
