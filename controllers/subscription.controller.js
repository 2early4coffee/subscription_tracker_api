import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL, NODE_ENV } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        if (NODE_ENV === 'production') {
            await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription._id,
                },
            });
        }

        res.status(201).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const total = await Subscription.countDocuments({ user: req.params.id });
        const subscriptions = await Subscription.find({ user: req.params.id })
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: subscriptions,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (e) {
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const total = await Subscription.countDocuments();
        const subscriptions = await Subscription.find()
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: subscriptions,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (e) {
        next(e);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription');
            error.statusCode = 401;
            throw error;
        }

        const updated = await Subscription.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updated });
    } catch (e) {
        next(e);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription');
            error.statusCode = 401;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (e) {
        next(e);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription');
            error.statusCode = 401;
            throw error;
        }

        if (subscription.status === 'cancelled') {
            const error = new Error('Subscription is already cancelled');
            error.statusCode = 400;
            throw error;
        }

        const cancelled = await Subscription.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        res.status(200).json({ success: true, data: cancelled });
    } catch (e) {
        next(e);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        const subscriptions = await Subscription.find({
            user: req.user.id,
            status: 'active',
            renewalDate: { $gte: today, $lte: next30Days },
        }).sort({ renewalDate: 1 });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}