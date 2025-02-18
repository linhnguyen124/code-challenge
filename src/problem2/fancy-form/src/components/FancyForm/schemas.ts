import { z } from 'zod';

export const formSchema = z.object({
  sellingAmount: z
    .number({
      required_error: 'Must be a valid number',
      invalid_type_error: 'Must be a valid number'
    })
    .min(0.000001, 'Value too small')
    .max(1000000, 'Value too large'),
  sellingToken: z.string({
    required_error: 'Token is unavailable'
  }),
  buyingAmount: z
    .number({
      required_error: 'Must be a valid number',
      invalid_type_error: 'Must be a valid number'
    })
    .min(0.000001, 'Value too small')
    .max(1000000, 'Value too large'),
  buyingToken: z.string({
    required_error: 'Token is unavailable'
  })
});
