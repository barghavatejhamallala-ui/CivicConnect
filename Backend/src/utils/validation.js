import { z } from 'zod';

export const idSchema = z.string().trim().min(1).max(100);
export const emailSchema = z.string().trim().email().max(160).transform((v) => v.toLowerCase());
export const phoneSchema = z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/);
export const passwordSchema = z.string().min(8).max(128);

export const loginSchema = z.object({ identifier: z.string().trim().min(1).max(160), password: z.string().min(1).max(128) });
export const citizenRegisterSchema = z.object({ name: z.string().trim().min(2).max(100), mobile: phoneSchema.optional(), email: emailSchema.optional(), password: passwordSchema }).refine((v) => v.mobile || v.email, { message: 'Mobile or email is required.', path: ['identifier'] });
export const workerRegisterSchema = z.object({ name: z.string().trim().min(2).max(100), username: z.string().trim().min(3).max(50), email: emailSchema, phone: phoneSchema, area: z.string().trim().min(2).max(100), password: passwordSchema });
export const authorityRegisterSchema = z.object({ name: z.string().trim().min(2).max(100), employeeId: z.string().trim().min(2).max(50), email: emailSchema.optional(), phone: phoneSchema.optional(), password: passwordSchema });
export const deleteAccountSchema = z.object({ password: z.string().min(1), reason: z.string().max(500).optional() });

export const complaintSchema = z.object({
  category: z.enum(['road', 'light', 'garbage', 'water', 'other']),
  description: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(2).max(300),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

export const assignSchema = z.object({ workerId: z.string().trim().min(1), priority: z.enum(['Low', 'Medium', 'High']).optional(), note: z.string().trim().max(1000).optional() });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(100).optional(), email: emailSchema.optional(), phone: phoneSchema.optional(), area: z.string().trim().min(2).max(100).optional() }).refine((v) => Object.keys(v).length > 0, 'At least one field is required.');
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: passwordSchema });
export const photoCaptionSchema = z.object({ caption: z.string().trim().max(80).optional() });
