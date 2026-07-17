import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signInSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const createSubscriptionSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    currency: z.enum(['USD', 'EUR', 'GBP']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    category: z.enum(['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other']),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    startDate: z.string().datetime('Please provide a valid date'),
    status: z.enum(['active', 'cancelled', 'expired']).optional(),
});